<?php

namespace App\Policies;

use App\Models\MasterMenu;
use App\Models\User;

class MasterMenuPolicy
{
    public function viewAny(User $user)
    {
        return true; // Filtering handled by Global Scope
    }

    public function view(User $user, MasterMenu $menu)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $menu->kitchen_id;
    }

    public function create(User $user)
    {
        return true; 
    }

    public function update(User $user, MasterMenu $menu)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $menu->kitchen_id;
    }

    public function delete(User $user, MasterMenu $menu)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $menu->kitchen_id;
    }
}
