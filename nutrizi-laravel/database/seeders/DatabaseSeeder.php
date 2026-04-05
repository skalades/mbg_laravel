<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            KitchenSeeder::class,
            SchoolSeeder::class,
            PortionConfigSeeder::class,
            FoodItemSeeder::class,
        ]);

        $kitchen = \App\Models\Kitchen::first();

        \App\Models\User::updateOrCreate(
            ['username' => 'admin'],
            [
                'full_name' => 'Test Administrator',
                'password' => bcrypt('password'),
                'role' => 'ADMIN',
                'kitchen_id' => $kitchen ? $kitchen->id : null,
            ]
        );
    }
}
