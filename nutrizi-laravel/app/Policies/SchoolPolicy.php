<?php

namespace App\Policies;

use App\Models\School;
use App\Models\User;

class SchoolPolicy
{
    public function viewAny(User $user)
    {
        return true; // Filtering handled by Global Scope
    }

    public function view(User $user, School $school)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $school->kitchen_id;
    }

    public function create(User $user)
    {
        return true; // Any user can create (will be assigned to their kitchen or manually by admin)
    }

    public function update(User $user, School $school)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $school->kitchen_id;
    }

    public function delete(User $user, School $school)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $school->kitchen_id;
    }
}
