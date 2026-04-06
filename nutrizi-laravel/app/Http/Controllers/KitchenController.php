<?php

namespace App\Http\Controllers;

use App\Models\Kitchen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\StoreKitchenRequest;

class KitchenController extends Controller
{
    public function index()
    {
        // Global scope BelongsToKitchen automatically filters this for non-admins
        $kitchens = Kitchen::orderBy('kitchen_name')->get();

        return Inertia::render('Kitchens/Index', [
            'kitchens' => $kitchens
        ]);
    }

    public function store(StoreKitchenRequest $request)
    {
        Kitchen::create($request->validated());

        return redirect()->back()->with('success', 'Unit kitchen berhasil dibuat.');
    }

    public function update(StoreKitchenRequest $request, Kitchen $kitchen)
    {
        $kitchen->update($request->validated());

        return redirect()->back()->with('success', 'Pengaturan kitchen berhasil diperbarui.');
    }

    public function destroy(Kitchen $kitchen)
    {
        Gate::authorize('delete', $kitchen);

        if ($kitchen->schools()->count() > 0) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus kitchen yang masih memiliki sekolah terdaftar.');
        }

        if ($kitchen->users()->count() > 0) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus kitchen yang masih memiliki pengguna terdaftar.');
        }

        $kitchen->delete();

        return redirect()->back()->with('success', 'Unit kitchen berhasil dihapus.');
    }
}
