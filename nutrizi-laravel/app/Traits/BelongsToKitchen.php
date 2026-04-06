<?php

namespace App\Traits;

use App\Models\Kitchen;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToKitchen
{
    protected static function bootBelongsToKitchen()
    {
        static::creating(function ($model) {
            if (Auth::hasUser() && Auth::user()->role !== 'ADMIN' && empty($model->kitchen_id) && !$model instanceof Kitchen) {
                $model->kitchen_id = Auth::user()->kitchen_id;
            }
        });

        static::addGlobalScope('kitchen', function (Builder $builder) {
            // Using Auth::hasUser() prevents recursion during initial authentication.
            // When Auth is first resolving the user, hasUser() is false.
            if (Auth::hasUser()) {
                $user = Auth::user();
                if ($user->role !== 'ADMIN') {
                    if (static::class === Kitchen::class) {
                        $builder->where($builder->getQuery()->from . '.id', $user->kitchen_id);
                    } else {
                        $builder->where($builder->getQuery()->from . '.kitchen_id', $user->kitchen_id);
                    }
                }
            }
        });
    }
}
