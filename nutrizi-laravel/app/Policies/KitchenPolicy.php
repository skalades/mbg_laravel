<?php

namespace App\Policies;

use App\Models\Kitchen;
use App\Models\User;

class KitchenPolicy
{
    public function viewAny(User $user)
    {
        return true; // Filtering handled by Global Scope
    }

    public function view(User $user, Kitchen $kitchen)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $kitchen->id;
    }

    public function create(User $user)
    {
        return $user->role === 'ADMIN';
    }

    public function update(User $user, Kitchen $kitchen)
    {
        return $user->role === 'ADMIN';
    }

    public function delete(User $user, Kitchen $kitchen)
    {
        return $user->role === 'ADMIN';
    }
}
