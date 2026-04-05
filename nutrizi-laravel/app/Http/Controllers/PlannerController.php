<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PlannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Planner/Index');
    }
}
