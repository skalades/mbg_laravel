<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\PlannerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\PortionController;
use App\Http\Controllers\FoodItemController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Users
    Route::resource('users', UserController::class);
    
    // Food Items (Katalog Bahan Gizi)
    Route::resource('food-items', FoodItemController::class);
    
    // Schools
    Route::get('/schools', [SchoolController::class, 'index'])->name('schools.index');
    Route::get('/schools/create', [SchoolController::class, 'create'])->name('schools.create');
    Route::post('/schools', [SchoolController::class, 'store'])->name('schools.store');
    Route::get('/schools/{school}', [SchoolController::class, 'show'])->name('schools.show');
    Route::get('/schools/{school}/edit', [SchoolController::class, 'edit'])->name('schools.edit');
    Route::patch('/schools/{school}', [SchoolController::class, 'update'])->name('schools.update');
    Route::delete('/schools/{school}', [SchoolController::class, 'destroy'])->name('schools.destroy');
    
    // Planner
    Route::get('/planner', [PlannerController::class, 'index'])->name('planner.index');
    Route::post('/planner', [PlannerController::class, 'store'])->name('planner.store');
    Route::delete('/planner/{dailyMenu}', [PlannerController::class, 'destroy'])->name('planner.destroy');
    
    // Portions
    Route::get('/portions', [PortionController::class, 'index'])->name('portions.index');
    Route::patch('/portions/{portion}', [PortionController::class, 'update'])->name('portions.update');
    
    // Menus (Katalog & Resep)
    Route::resource('menus', MenuController::class);
    
    Route::resource('kitchens', KitchenController::class);

    // Audit & QC
    Route::get('/audit', [AuditController::class, 'index'])->name('audit.index');
    Route::post('/audit', [AuditController::class, 'store'])->name('audit.store');
    Route::get('/audit/export', [AuditController::class, 'exportPdf'])->name('audit.export');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
