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
}
