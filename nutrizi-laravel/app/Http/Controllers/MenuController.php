<?php

namespace App\Http\Controllers;

use App\Models\MasterMenu;
use App\Models\DailyMenu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $masterMenus = MasterMenu::orderBy('menu_name')->get();
        $dailyMenus = DailyMenu::with('school')
            ->whereHas('school', fn($q) => $q->where('kitchen_id', $user->kitchen_id))
            ->orderBy('menu_date', 'desc')
            ->get();

        return Inertia::render('Menus/Index', [
            'masterMenus' => $masterMenus,
            'dailyMenus' => $dailyMenus
        ]);
    }
}
