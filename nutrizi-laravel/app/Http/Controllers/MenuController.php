<?php

namespace App\Http\Controllers;

use App\Models\MasterMenu;
use App\Models\DailyMenu;
use App\Models\FoodItem;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $masterMenus = MasterMenu::with(['items.foodItem', 'creator'])->orderBy('menu_name')->get();
        
        $dailyMenus = DailyMenu::with(['school', 'masterMenu'])
            ->whereHas('school', fn($q) => $q->where('kitchen_id', $user->kitchen_id))
            ->orderBy('menu_date', 'desc')
            ->get();

        $foodItems = FoodItem::orderBy('name')->get();

        return Inertia::render('Menus/Index', [
            'masterMenus' => $masterMenus,
            'dailyMenus' => $dailyMenus,
            'foodItems' => $foodItems
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $foodItems = FoodItem::orderBy('name')->get();
        $schools = School::where('kitchen_id', $user->kitchen_id)->orderBy('school_name')->get();
        
        return Inertia::render('Menus/Create', [
            'foodItems' => $foodItems,
            'schools' => $schools
        ]);
    }

    public function edit(MasterMenu $menu)
    {
        $user = Auth::user();
        $menu->load('items.foodItem');
        $foodItems = FoodItem::orderBy('name')->get();
        $schools = School::where('kitchen_id', $user->kitchen_id)->orderBy('school_name')->get();

        return Inertia::render('Menus/Edit', [
            'menu' => $menu,
            'foodItems' => $foodItems,
            'schools' => $schools
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_name' => 'required|string|max:255',
            'target_group' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.food_item_id' => 'required|exists:food_items,id',
            'items.*.portion_name' => 'required|string',
            'items.*.weight_small' => 'required|numeric|min:0',
            'items.*.weight_large' => 'required|numeric|min:0',
        ]);

        \DB::transaction(function () use ($validated) {
            $menu = MasterMenu::create([
                'menu_name' => $validated['menu_name'],
                'target_group' => $validated['target_group'],
                'created_by' => Auth::id(),
            ]);

            foreach ($validated['items'] as $item) {
                $menu->items()->create($item);
            }
        });

        return redirect()->back()->with('success', 'Menu resep berhasil dibuat.');
    }

    public function update(Request $request, MasterMenu $menu)
    {
        $validated = $request->validate([
            'menu_name' => 'required|string|max:255',
            'target_group' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.food_item_id' => 'required|exists:food_items,id',
            'items.*.portion_name' => 'required|string',
            'items.*.weight_small' => 'required|numeric|min:0',
            'items.*.weight_large' => 'required|numeric|min:0',
        ]);

        \DB::transaction(function () use ($validated, $menu) {
            $menu->update([
                'menu_name' => $validated['menu_name'],
                'target_group' => $validated['target_group'],
            ]);

            $menu->items()->delete();
            foreach ($validated['items'] as $item) {
                $menu->items()->create($item);
            }
        });

        return redirect()->back()->with('success', 'Menu resep berhasil diperbarui.');
    }

    public function destroy(MasterMenu $menu)
    {
        $menu->delete();
        return redirect()->back()->with('success', 'Menu resep berhasil dihapus.');
    }
}
