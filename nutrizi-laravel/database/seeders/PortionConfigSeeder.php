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
                'multiplier' => 1.34,
                'meal_energy' => 850,
                'meal_protein' => 30.0,
                'meal_fat' => 24.0,
                'meal_carbs' => 128.0,
            ],
            [
                'name' => 'Porsi Kecil',
                'multiplier' => 1.00,
                'meal_energy' => 635,
                'meal_protein' => 22.0,
                'meal_fat' => 18.0,
                'meal_carbs' => 96.0,
            ],
        ];

        foreach ($standards as $standard) {
            PortionConfig::updateOrCreate(['name' => $standard['name']], $standard);
        }
    }
}
