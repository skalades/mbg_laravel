<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\Kitchen;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kitchen = Kitchen::first();
        $kitchenId = $kitchen ? $kitchen->id : null;

        $schools = [
            [
                'school_name' => 'SDN Harapan Indah 01',
                'target_group' => 'SD',
                'location_address' => 'Jl. Mawar No. 10, Jakarta',
                'total_beneficiaries' => 150,
                'small_portion_count' => 150,
                'kitchen_id' => $kitchenId,
                'siswa_laki_laki' => 70,
                'siswa_perempuan' => 80,
            ],
            [
                'school_name' => 'SMP Negeri 5 Jakarta',
                'target_group' => 'SMP',
                'location_address' => 'Jl. Melati No. 5, Jakarta',
                'total_beneficiaries' => 200,
                'large_portion_count' => 200,
                'kitchen_id' => $kitchenId,
                'siswa_laki_laki' => 95,
                'siswa_perempuan' => 105,
            ],
            [
                'school_name' => 'SMA Kebangsaan 02',
                'target_group' => 'SMA',
                'location_address' => 'Jl. Teratai No. 22, Bekasi',
                'total_beneficiaries' => 250,
                'large_portion_count' => 250,
                'kitchen_id' => Kitchen::skip(1)->first()?->id ?? $kitchenId,
                'siswa_laki_laki' => 120,
                'siswa_perempuan' => 130,
            ],
        ];

        foreach ($schools as $school) {
            School::updateOrCreate(['school_name' => $school['school_name']], $school);
        }
    }
}
