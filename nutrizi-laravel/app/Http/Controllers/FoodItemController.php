<?php

namespace App\Http\Controllers;

use App\Models\FoodItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FoodItemController extends Controller
{
    public function index(Request $request)
    {
        $query = FoodItem::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('category', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $foodItems = $query->latest()->paginate(100)->withQueryString();

        return Inertia::render('FoodItems/Index', [
            'foodItems' => $foodItems,
            'filters' => $request->only(['search', 'category']),
            'categories' => FoodItem::select('category')->distinct()->pluck('category')->filter()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'base_unit' => 'required|string|max:50',
            'base_quantity' => 'required|numeric|min:0',
            'urt_unit' => 'nullable|string|max:50',
            'urt_weight' => 'nullable|numeric|min:0',
            'energy_kcal' => 'required|numeric|min:0',
            'protein_g' => 'required|numeric|min:0',
            'fat_g' => 'required|numeric|min:0',
            'carbs_g' => 'required|numeric|min:0',
            'yield_factor' => 'required|numeric|min:0',
            'image_url' => 'nullable|url'
        ]);

        FoodItem::create($validated);

        return redirect()->back()->with('success', 'Bahan gizi berhasil ditambahkan.');
    }

    public function update(Request $request, FoodItem $foodItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'base_unit' => 'required|string|max:50',
            'base_quantity' => 'required|numeric|min:0',
            'urt_unit' => 'nullable|string|max:50',
            'urt_weight' => 'nullable|numeric|min:0',
            'energy_kcal' => 'required|numeric|min:0',
            'protein_g' => 'required|numeric|min:0',
            'fat_g' => 'required|numeric|min:0',
            'carbs_g' => 'required|numeric|min:0',
            'yield_factor' => 'required|numeric|min:0',
            'image_url' => 'nullable|url'
        ]);

        $foodItem->update($validated);

        return redirect()->back()->with('success', 'Data bahan gizi berhasil diperbarui.');
    }

    public function destroy(FoodItem $foodItem)
    {
        $foodItem->delete();

        return redirect()->back()->with('success', 'Bahan gizi berhasil dihapus.');
    }
}
