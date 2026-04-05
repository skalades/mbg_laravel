<?php

namespace App\Http\Controllers;

use App\Models\DailyMenu;
use App\Models\MasterMenu;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PlannerController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $schools = School::when($user->kitchen_id, fn($q) => $q->where('kitchen_id', $user->kitchen_id))
            ->orderBy('school_name')
            ->get();
            
        $masterMenus = MasterMenu::orderBy('menu_name')->get();
        
        $dailyMenus = DailyMenu::with(['school', 'masterMenu'])
            ->whereHas('school', fn($q) => $q->where('kitchen_id', $user->kitchen_id))
            ->orderBy('menu_date', 'desc')
            ->get();

        return Inertia::render('Planner/Index', [
            'schools' => $schools,
            'masterMenus' => $masterMenus,
            'dailyMenus' => $dailyMenus
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'master_menu_id' => 'required|exists:master_menus,id',
            'menu_date' => 'required|date',
            'status' => 'nullable|string'
        ]);

        $validated['created_by'] = Auth::id();
        $validated['status'] = $validated['status'] ?? 'TERPUBLIKASI';

        DB::transaction(function () use ($validated) {
            $dailyMenu = DailyMenu::create($validated);
            
            // Copy items from MasterMenu to DailyMenu
            $masterMenu = MasterMenu::with('items')->find($validated['master_menu_id']);
            
            foreach ($masterMenu->items as $item) {
                $dailyMenu->items()->create([
                    'food_item_id' => $item->food_item_id,
                    'portion_name' => $item->portion_name,
                    'weight_small' => $item->weight_small,
                    'weight_large' => $item->weight_large,
                    'unit_name' => $item->unit_name,
                    'unit_quantity' => $item->unit_quantity,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Rencana menu berhasil dibuat.');
    }

    public function destroy(DailyMenu $dailyMenu)
    {
        $dailyMenu->delete();
        return redirect()->back()->with('success', 'Rencana menu berhasil dihapus.');
    }
}
