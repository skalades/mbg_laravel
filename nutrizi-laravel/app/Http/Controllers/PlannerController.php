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
        // Global Scopes from BelongsToKitchen trait will automatically handle 
        // the filtering for non-admins based on their kitchen_id.
        $schools = School::orderBy('school_name')->get();
        $masterMenus = MasterMenu::orderBy('menu_name')->get();
        $dailyMenus = DailyMenu::with(['school', 'masterMenu'])
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
            'school_ids' => 'required|array',
            'school_ids.*' => 'exists:schools,id',
            'master_menu_id' => 'required|exists:master_menus,id',
            'menu_date' => 'required|date',
            'status' => 'nullable|string'
        ]);

        $status = $validated['status'] ?? 'TERPUBLIKASI';
        $createdBy = Auth::id();

        // Get manual overrides from request if exist
        $manualBuffer = $request->input('buffer_portions');
        $manualSample = $request->input('organoleptic_portions');

        DB::transaction(function () use ($validated, $status, $createdBy, $manualBuffer, $manualSample) {
            $masterMenu = MasterMenu::with('items')->find($validated['master_menu_id']);
            
            foreach ($validated['school_ids'] as $schoolId) {
                $school = School::with('kitchen')->find($schoolId);

                // Hierarchy: Manual -> School -> Kitchen
                $buffer = $manualBuffer ?? ($school->buffer_count ?: ($school->kitchen?->default_buffer_count ?? 0));
                $sample = $manualSample ?? ($school->sample_count ?: ($school->kitchen?->default_sample_count ?? 0));

                $dailyMenu = DailyMenu::create([
                    'school_id' => $schoolId,
                    'master_menu_id' => $validated['master_menu_id'],
                    'menu_date' => $validated['menu_date'],
                    'status' => $status,
                    'buffer_portions' => $buffer,
                    'organoleptic_portions' => $sample,
                    'created_by' => $createdBy,
                ]);
                
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
            }
        });

        return redirect()->back()->with('success', count($validated['school_ids']) . ' rencana menu berhasil dibuat.');
    }

    public function destroy(DailyMenu $dailyMenu)
    {
        $dailyMenu->delete();
        return redirect()->back()->with('success', 'Rencana menu berhasil dihapus.');
    }
}
