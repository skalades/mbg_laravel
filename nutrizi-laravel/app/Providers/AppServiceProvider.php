<?php

namespace App\Providers;

use App\Models\Kitchen;
use App\Models\User;
use App\Models\School;
use App\Models\MasterMenu;
use App\Models\DailyMenu;
use App\Policies\KitchenPolicy;
use App\Policies\UserPolicy;
use App\Policies\SchoolPolicy;
use App\Policies\MasterMenuPolicy;
use App\Policies\DailyMenuPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(Kitchen::class, KitchenPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(School::class, SchoolPolicy::class);
        Gate::policy(MasterMenu::class, MasterMenuPolicy::class);
        Gate::policy(DailyMenu::class, DailyMenuPolicy::class);
    }
}
