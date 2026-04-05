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
            FoodItemSeeder::class,
        ]);

        User::updateOrCreate(
            ['username' => 'admin'],
            ['full_name' => 'Test Administrator', 'password' => bcrypt('password'), 'role' => 'ADMIN']
        );
    }
}
