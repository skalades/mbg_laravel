<?php

namespace App\Http\Controllers;

use App\Models\Kitchen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class KitchenController extends Controller
{
    public function index()
    {
        $kitchens = Kitchen::orderBy('kitchen_name')->get();

        return Inertia::render('Kitchens/Index', [
            'kitchens' => $kitchens
        ]);
    }
}
