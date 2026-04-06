<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreSchoolRequest;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Global scope BelongsToKitchen automatically filters this for non-admins
        $schools = School::orderBy('school_name')->get();

        return Inertia::render('Schools/Index', [
            'schools' => $schools,
            'kitchenName' => $user->kitchen?->kitchen_name
        ]);
    }

    public function store(StoreSchoolRequest $request)
    {
        // kitchen_id is automatically assigned by BelongsToKitchen trait
        School::create($request->validated());

        return redirect()->route('schools.index')->with('success', 'Sekolah berhasil ditambahkan.');
    }

    public function show(School $school)
    {
        return Inertia::render('Schools/Show', [
            'school' => $school->load(['studentProfiles', 'dailyMenus'])
        ]);
    }

    public function update(StoreSchoolRequest $request, School $school)
    {
        $school->update($request->validated());

        return redirect()->route('schools.index')->with('success', 'Data sekolah berhasil diperbarui.');
    }

    public function destroy(School $school)
    {
        $school->delete();
        return redirect()->route('schools.index')->with('success', 'Sekolah berhasil dihapus.');
    }
}
