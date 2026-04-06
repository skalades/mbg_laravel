<?php

namespace App\Http\Controllers;

use App\Models\MasterMenu;
use App\Models\DailyMenu;
use App\Models\FoodItem;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MenuController extends Controller
{
    public function index()
    {
        // Global scope BelongsToKitchen automatically filters these for non-admins
        $masterMenus = MasterMenu::with(['items.foodItem', 'creator'])->orderBy('menu_name')->get();
        
        $dailyMenus = DailyMenu::with(['school', 'masterMenu'])
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
        $foodItems = FoodItem::orderBy('name')->get();
        $schools = School::orderBy('school_name')->get();
        
        return Inertia::render('Menus/Create', [
            'foodItems' => $foodItems,
            'schools' => $schools
        ]);
    }

    public function edit(MasterMenu $menu)
    {
        $menu->load('items.foodItem');
        $foodItems = FoodItem::orderBy('name')->get();
        $schools = School::orderBy('school_name')->get();

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
            'target_group' => 'required|array',
            'target_group.*' => 'string|in:SD,SMP,SMA',
            'cooking_instructions' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.food_item_id' => 'required|exists:food_items,id',
            'items.*.portion_name' => 'required|string',
            'items.*.weight_small' => 'required|numeric|min:0',
            'items.*.weight_large' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // kitchen_id is automatically assigned by BelongsToKitchen trait
            $menu = MasterMenu::create([
                'menu_name' => $validated['menu_name'],
                'target_group' => $validated['target_group'],
                'cooking_instructions' => $validated['cooking_instructions'],
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
            'target_group' => 'required|array',
            'target_group.*' => 'string|in:SD,SMP,SMA',
            'cooking_instructions' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.food_item_id' => 'required|exists:food_items,id',
            'items.*.portion_name' => 'required|string',
            'items.*.weight_small' => 'required|numeric|min:0',
            'items.*.weight_large' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $menu) {
            $menu->update([
                'menu_name' => $validated['menu_name'],
                'target_group' => $validated['target_group'],
                'cooking_instructions' => $validated['cooking_instructions'],
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
