<?php

namespace Database\Seeders;

use App\Models\Kitchen;
use Illuminate\Database\Seeder;

class KitchenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kitchens = [
            [
                'kitchen_name' => 'Central Kitchen Jakarta',
                'address' => 'Jl. Raya Bogor No. 123, Jakarta Timur',
            ],
            [
                'kitchen_name' => 'Kitchen Satellite Bekasi',
                'address' => 'Jl. Ahmad Yani No. 45, Bekasi Barat',
            ],
        ];

        foreach ($kitchens as $kitchen) {
            Kitchen::updateOrCreate(['kitchen_name' => $kitchen['kitchen_name']], $kitchen);
        }
    }
}
