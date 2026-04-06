<?php

namespace Database\Seeders;

use App\Models\PortionConfig;
use Illuminate\Database\Seeder;

class PortionConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $standards = [
            [
                'name' => 'Porsi Besar',
                'multiplier' => 1.37,
                'meal_energy' => 644.5,
                'meal_protein' => 18.3,
                'meal_fat' => 21.3,
                'meal_carbs' => 95.3,
            ],
            [
                'name' => 'Porsi Kecil',
                'multiplier' => 1.00,
                'meal_energy' => 469.9,
                'meal_protein' => 10.5,
                'meal_fat' => 16.0,
                'meal_carbs' => 72.0,
            ],
        ];

        foreach ($standards as $standard) {
            PortionConfig::updateOrCreate(['name' => $standard['name']], $standard);
        }
    }
}
