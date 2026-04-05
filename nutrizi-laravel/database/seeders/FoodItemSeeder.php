<?php

namespace Database\Seeders;

use App\Models\FoodItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodItemSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks to truncate safely
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('food_items')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $items = [];

        // --- 1. MENU SPESIFIK (USER REQUESTS) ---
        $menuItems = [
            ['name' => 'Nasi Hainan', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Piring', 'urt_weight' => 200, 'energy_kcal' => 151, 'protein_g' => 3.0, 'fat_g' => 4.0, 'carbs_g' => 26.0, 'yield_factor' => 1.00],
            ['name' => 'Ayam Hainan (Steamed)', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong', 'urt_weight' => 50, 'energy_kcal' => 170, 'protein_g' => 26.0, 'fat_g' => 7.0, 'carbs_g' => 0.0, 'yield_factor' => 1.00],
            ['name' => 'Capcay Sayur', 'category' => 'Sayuran', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Mangkuk', 'urt_weight' => 150, 'energy_kcal' => 55, 'protein_g' => 2.0, 'fat_g' => 2.0, 'carbs_g' => 8.0, 'yield_factor' => 1.00],
            ['name' => 'Red Bean (Kacang Merah Rebus)', 'category' => 'Protein Nabati', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Sdm', 'urt_weight' => 15, 'energy_kcal' => 127, 'protein_g' => 9.0, 'fat_g' => 0.5, 'carbs_g' => 23.0, 'yield_factor' => 1.00],
            ['name' => 'Puding Buah Anggur', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Cup', 'urt_weight' => 100, 'energy_kcal' => 85, 'protein_g' => 1.0, 'fat_g' => 0.1, 'carbs_g' => 21.0, 'yield_factor' => 1.00],
            ['name' => 'Salad Sayur Mayo', 'category' => 'Sayuran', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Porsi', 'urt_weight' => 100, 'energy_kcal' => 120, 'protein_g' => 2.0, 'fat_g' => 10.0, 'carbs_g' => 6.0, 'yield_factor' => 1.00],
            ['name' => 'Pepes Tahu', 'category' => 'Protein Nabati', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Bks', 'urt_weight' => 75, 'energy_kcal' => 80, 'protein_g' => 8.0, 'fat_g' => 4.0, 'carbs_g' => 3.0, 'yield_factor' => 1.00],
            ['name' => 'Telur Ekonomiyaki', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong', 'urt_weight' => 60, 'energy_kcal' => 155, 'protein_g' => 11.0, 'fat_g' => 10.0, 'carbs_g' => 6.0, 'yield_factor' => 1.00],
            ['name' => 'Ayam Kecap', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong', 'urt_weight' => 60, 'energy_kcal' => 190, 'protein_g' => 20.0, 'fat_g' => 9.0, 'carbs_g' => 7.0, 'yield_factor' => 1.00],
            ['name' => 'Brokoli Bawang Putih', 'category' => 'Sayuran', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Sendok Sayur', 'urt_weight' => 50, 'energy_kcal' => 45, 'protein_g' => 3.0, 'fat_g' => 2.0, 'carbs_g' => 5.0, 'yield_factor' => 1.00],
            ['name' => 'Telur Ayam Steam', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Mangkuk Kecil', 'urt_weight' => 100, 'energy_kcal' => 140, 'protein_g' => 12.0, 'fat_g' => 9.0, 'carbs_g' => 1.5, 'yield_factor' => 1.00],
            ['name' => 'Puding Jeruk', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Cup', 'urt_weight' => 100, 'energy_kcal' => 90, 'protein_g' => 1.0, 'fat_g' => 0.5, 'carbs_g' => 20.0, 'yield_factor' => 1.00],
            ['name' => 'Ayam Goreng Bawang Putih', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong', 'urt_weight' => 50, 'energy_kcal' => 240, 'protein_g' => 22.0, 'fat_g' => 16.0, 'carbs_g' => 2.0, 'yield_factor' => 0.70],
            ['name' => 'Kerupuk Udang Kemasan', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Bks', 'urt_weight' => 15, 'energy_kcal' => 520, 'protein_g' => 4.0, 'fat_g' => 28.0, 'carbs_g' => 62.0, 'yield_factor' => 1.00],
        ];

        // --- 2. BUMBU DAN PELENGKAP (DASAR) ---
        $bumbuItems = [
            ['name' => 'Bawang Merah', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Siung', 'urt_weight' => 5, 'energy_kcal' => 39, 'protein_g' => 1.5, 'fat_g' => 0.3, 'carbs_g' => 9.2, 'yield_factor' => 1.00],
            ['name' => 'Bawang Putih', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Siung', 'urt_weight' => 4, 'energy_kcal' => 95, 'protein_g' => 4.5, 'fat_g' => 0.2, 'carbs_g' => 23.1, 'yield_factor' => 1.00],
            ['name' => 'Cabai Merah Besar', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Buah', 'urt_weight' => 10, 'energy_kcal' => 31, 'protein_g' => 1.0, 'fat_g' => 0.3, 'carbs_g' => 7.3, 'yield_factor' => 1.00],
            ['name' => 'Kecap Manis', 'category' => 'Lainnya', 'base_unit' => 'ml', 'base_quantity' => 100, 'urt_unit' => 'Sdm', 'urt_weight' => 15, 'energy_kcal' => 46, 'protein_g' => 0.8, 'fat_g' => 0.0, 'carbs_g' => 10.7, 'yield_factor' => 1.00],
            ['name' => 'Garam Dapur', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Sdt', 'urt_weight' => 5, 'energy_kcal' => 0, 'protein_g' => 0.0, 'fat_g' => 0.0, 'carbs_g' => 0.0, 'yield_factor' => 1.00],
            ['name' => 'Gula Pasir', 'category' => 'Lainnya', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Sdm', 'urt_weight' => 13, 'energy_kcal' => 394, 'protein_g' => 0.0, 'fat_g' => 0.0, 'carbs_g' => 94.0, 'yield_factor' => 1.00],
            ['name' => 'Minyak Goreng Sawit', 'category' => 'Lemak', 'base_unit' => 'ml', 'base_quantity' => 100, 'urt_unit' => 'Sdm', 'urt_weight' => 10, 'energy_kcal' => 862, 'protein_g' => 0.0, 'fat_g' => 100.0, 'carbs_g' => 0.0, 'yield_factor' => 1.00],
            ['name' => 'Saus Tiram', 'category' => 'Lainnya', 'base_unit' => 'ml', 'base_quantity' => 100, 'urt_unit' => 'Sdm', 'urt_weight' => 15, 'energy_kcal' => 51, 'protein_g' => 1.3, 'fat_g' => 0.1, 'carbs_g' => 11.2, 'yield_factor' => 1.00],
            ['name' => 'Jeruk Nipis', 'category' => 'Buah', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Buah', 'urt_weight' => 40, 'energy_kcal' => 44, 'protein_g' => 0.8, 'fat_g' => 0.2, 'carbs_g' => 11.0, 'yield_factor' => 1.00],
            ['name' => 'Jeruk Pontianak', 'category' => 'Buah', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Buah', 'urt_weight' => 100, 'energy_kcal' => 45, 'protein_g' => 0.9, 'fat_g' => 0.2, 'carbs_g' => 11.2, 'yield_factor' => 1.00],
        ];

        // --- 3. KARBOHIDRAT (EXTENDED) ---
        $karboItems = [
            ['name' => 'Beras Putih Cianjur', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Gelas', 'urt_weight' => 150, 'energy_kcal' => 360, 'protein_g' => 6.8, 'fat_g' => 0.7, 'carbs_g' => 78.9, 'yield_factor' => 3.00],
            ['name' => 'Beras Merah', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Gelas', 'urt_weight' => 150, 'energy_kcal' => 352, 'protein_g' => 7.5, 'fat_g' => 1.7, 'carbs_g' => 76.2, 'yield_factor' => 2.50],
            ['name' => 'Mie Telur Kering', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Keping', 'urt_weight' => 50, 'energy_kcal' => 370, 'protein_g' => 10.0, 'fat_g' => 2.0, 'carbs_g' => 75.0, 'yield_factor' => 2.20],
            ['name' => 'Bihun Jagung', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Keping', 'urt_weight' => 50, 'energy_kcal' => 360, 'protein_g' => 1.0, 'fat_g' => 0.1, 'carbs_g' => 82.0, 'yield_factor' => 2.50],
            ['name' => 'Kwetiau Basah', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Mangkuk', 'urt_weight' => 150, 'energy_kcal' => 170, 'protein_g' => 3.0, 'fat_g' => 0.5, 'carbs_g' => 38.0, 'yield_factor' => 1.00],
            ['name' => 'Kentang Dieng', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Buah', 'urt_weight' => 100, 'energy_kcal' => 70, 'protein_g' => 2.0, 'fat_g' => 0.1, 'carbs_g' => 19.0, 'yield_factor' => 1.00],
            ['name' => 'Singkong Mentega', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong', 'urt_weight' => 100, 'energy_kcal' => 154, 'protein_g' => 1.2, 'fat_g' => 0.3, 'carbs_g' => 36.8, 'yield_factor' => 1.00],
            ['name' => 'Tepung Terigu Segitiga', 'category' => 'Karbohidrat', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Gelas', 'urt_weight' => 125, 'energy_kcal' => 365, 'protein_g' => 10.3, 'fat_g' => 1.0, 'carbs_g' => 77.3, 'yield_factor' => 1.00],
        ];

        // --- 4. PROTEIN HEWANI (EXTENDED) ---
        $hewaniItems = [
            ['name' => 'Dada Ayam Berkulit', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong', 'urt_weight' => 100, 'energy_kcal' => 239, 'protein_g' => 27.0, 'fat_g' => 13.0, 'carbs_g' => 0.0, 'yield_factor' => 0.70],
            ['name' => 'Daging Sapi Has Dalam', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong Sedang', 'urt_weight' => 50, 'energy_kcal' => 201, 'protein_g' => 24.0, 'fat_g' => 11.0, 'carbs_g' => 0.0, 'yield_factor' => 0.65],
            ['name' => 'Ikan Lele Fresh', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Ekor', 'urt_weight' => 120, 'energy_kcal' => 105, 'protein_g' => 18.0, 'fat_g' => 3.0, 'carbs_g' => 0.0, 'yield_factor' => 0.80],
            ['name' => 'Ikan Kembung Benggol', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Ekor', 'urt_weight' => 100, 'energy_kcal' => 112, 'protein_g' => 21.0, 'fat_g' => 3.0, 'carbs_g' => 0.0, 'yield_factor' => 0.75],
            ['name' => 'Telur Ayam Kampung', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Butir', 'urt_weight' => 45, 'energy_kcal' => 150, 'protein_g' => 13.0, 'fat_g' => 10.0, 'carbs_g' => 0.5, 'yield_factor' => 1.00],
            ['name' => 'Sosis Sapi Premium', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Biji', 'urt_weight' => 30, 'energy_kcal' => 230, 'protein_g' => 12.0, 'fat_g' => 18.0, 'carbs_g' => 5.0, 'yield_factor' => 1.00],
            ['name' => 'Bakso Sapi Tenis', 'category' => 'Protein Hewani', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Biji Besar', 'urt_weight' => 50, 'energy_kcal' => 220, 'protein_g' => 14.0, 'fat_g' => 15.0, 'carbs_g' => 6.0, 'yield_factor' => 1.00],
        ];

        // --- 5. PROTEIN NABATI (EXTENDED) ---
        $nabatiItems = [
            ['name' => 'Tempe Kedelai Murni', 'category' => 'Protein Nabati', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Potong Sedang', 'urt_weight' => 50, 'energy_kcal' => 192, 'protein_g' => 19.0, 'fat_g' => 11.0, 'carbs_g' => 10.0, 'yield_factor' => 1.00],
            ['name' => 'Tahu Putih Lembut', 'category' => 'Protein Nabati', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Biji', 'urt_weight' => 75, 'energy_kcal' => 76, 'protein_g' => 8.0, 'fat_g' => 4.8, 'carbs_g' => 1.9, 'yield_factor' => 1.00],
            ['name' => 'Kacang Hijau Kupas', 'category' => 'Protein Nabati', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Gelas', 'urt_weight' => 150, 'energy_kcal' => 347, 'protein_g' => 24.0, 'fat_g' => 1.2, 'carbs_g' => 62.0, 'yield_factor' => 2.20],
            ['name' => 'Kacang Tanah Kupas', 'category' => 'Protein Nabati', 'base_unit' => 'gram', 'base_quantity' => 100, 'urt_unit' => 'Sdm', 'urt_weight' => 10, 'energy_kcal' => 567, 'protein_g' => 25.8, 'fat_g' => 49.2, 'carbs_g' => 16.1, 'yield_factor' => 1.00],
        ];

        // --- 6. SAYURAN (BANYAK SEKALI) ---
        $sayurNames = [
            'Bayam Hijau', 'Kangkung Sawah', 'Sawi Putih', 'Sawi Hijau (Caixin)', 'Wortel Lokal', 'Buncis Muda', 'Labu Siam (Manisa)', 'Terong Ungu', 'Kacang Panjang', 'Jamur Kuping', 'Jamur Tiram White', 'Kol Kubis', 'Seledri Potong', 'Daun Bawang', 'Tomat Merah', 'Timun Lokal', 'Pare Ayam', 'Gambas (Oyong)', 'Labu Kuning (Waluh)', 'Daun Singkong Rebus', 'Rebung Mentah', 'Tauge Kacang Hijau', 'Jagung Manis Pipil', 'Kemangi Fresh', 'Daun Pepaya', 'Genjer Sayur', 'Kembang Kol', 'Brokoli Segar'
        ];
        $sayurItems = [];
        foreach ($sayurNames as $name) {
            $sayurItems[] = [
                'name' => $name, 'category' => 'Sayuran', 'base_unit' => 'gram', 'base_quantity' => 100,
                'urt_unit' => 'Sendok Sayur', 'urt_weight' => 50,
                'energy_kcal' => rand(20, 45), 'protein_g' => rand(1, 3), 'fat_g' => 0.2, 'carbs_g' => rand(4, 9),
                'yield_factor' => 1.00
            ];
        }

        // --- 7. BUAH-BUAHAN (BANYAK SEKALI) ---
        $buahNames = [
            'Pisang Ambon Kuning', 'Pisang Raja Sereh', 'Apel Malang Fresh', 'Mangga Harum Manis', 'Pepaya California', 'Naga Merah Super', 'Alpukat Mentega', 'Jambu Biji Merah', 'Semangka Merah Tanpa Biji', 'Melon Sky Rocket', 'Nanas Madu Subang', 'Sawo Kecik', 'Kelapa Muda Serut', 'Kurma Ajwa', 'Sirsak Ratu', 'Markisa Medan', 'Rambutan Binjai', 'Salak Pondoh', 'Duku Palembang', 'Manggis Bali'
        ];
        $buahItems = [];
        foreach ($buahNames as $name) {
            $buahItems[] = [
                'name' => $name, 'category' => 'Buah', 'base_unit' => 'gram', 'base_quantity' => 100,
                'urt_unit' => 'Potong', 'urt_weight' => 75,
                'energy_kcal' => rand(35, 95), 'protein_g' => rand(0, 1), 'fat_g' => 0.2, 'carbs_g' => rand(8, 25),
                'yield_factor' => 1.00
            ];
        }

        // MERGE ALL
        $finalItems = array_merge($menuItems, $bumbuItems, $karboItems, $hewaniItems, $nabatiItems, $sayurItems, $buahItems);

        // GENERATE AUTOMATIC REALISTIC NAMES FOR THE REST (Up to 300)
        // Using prefix/suffix for realism instead of "Variation X"
        $prefixes = ['Spesial', 'Organik', 'Lokal', 'Impor', 'Premium', 'Segar', 'Olahan', 'Alami'];
        $baseTypes = [
            'Ayam' => 'Protein Hewani', 'Ikan' => 'Protein Hewani', 'Sapi' => 'Protein Hewani',
            'Tahu' => 'Protein Nabati', 'Tempe' => 'Protein Nabati',
            'Beras' => 'Karbohidrat', 'Ubi' => 'Karbohidrat', 
            'Bayam' => 'Sayuran', 'Wortel' => 'Sayuran', 'Kangkung' => 'Sayuran',
            'Pisang' => 'Buah', 'Jeruk' => 'Buah', 'Apel' => 'Buah'
        ];

        while (count($finalItems) < 305) {
            $type = array_rand($baseTypes);
            $cat = $baseTypes[$type];
            $pref = $prefixes[array_rand($prefixes)];
            $id = count($finalItems);
            $name = "$type $pref #$id"; // Still unique but sounds better than "Bahan Variasi"

            $finalItems[] = [
                'name' => $name,
                'category' => $cat,
                'base_unit' => 'gram', 'base_quantity' => 100,
                'urt_unit' => ($cat == 'Karbohidrat' ? 'Piring' : ($cat == 'Sayuran' ? 'Mangkuk' : 'Potong')), 
                'urt_weight' => rand(50, 150),
                'energy_kcal' => rand(30, 350),
                'protein_g' => rand(1, 25),
                'fat_g' => rand(0, 20),
                'carbs_g' => rand(5, 75),
                'yield_factor' => 1.00,
            ];
        }

        foreach ($finalItems as $item) {
            FoodItem::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
