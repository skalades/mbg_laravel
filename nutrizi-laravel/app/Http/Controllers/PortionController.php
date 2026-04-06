<?php

namespace App\Http\Controllers;

use App\Models\PortionConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortionController extends Controller
{
    /**
     * Display the nutritional standards for portions.
     */
    public function index()
    {
        // Fetch only Porsi Besar and Porsi Kecil
        $portions = PortionConfig::whereIn('name', ['Porsi Besar', 'Porsi Kecil'])
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Portions/Index', [
            'portions' => $portions
        ]);
    }

    /**
     * Update the specified portion configuration.
     */
    public function update(Request $request, PortionConfig $portion)
    {
        $validated = $request->validate([
            'meal_energy' => 'required|numeric|min:0',
            'meal_protein' => 'required|numeric|min:0',
            'meal_fat' => 'required|numeric|min:0',
            'meal_carbs' => 'required|numeric|min:0',
            'multiplier' => 'required|numeric|min:1',
        ]);

        $portion->update($validated);

        return redirect()->back();
    }
}
