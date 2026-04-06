<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user)
    {
        return true; // Filtering handled by Global Scope
    }

    public function view(User $user, User $model)
    {
        return $user->role === 'ADMIN' || $user->kitchen_id === $model->kitchen_id;
    }

    public function create(User $user)
    {
        return $user->role === 'ADMIN';
    }

    public function update(User $user, User $model)
    {
        return $user->role === 'ADMIN' || $user->id === $model->id;
    }

    public function delete(User $user, User $model)
    {
        return $user->role === 'ADMIN';
    }
}
