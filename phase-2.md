# 🍎 Phase 2: Meal Planner Core
**Fokus Utama:** Business Logic & UI Reactivity

## 1. ⚙️ Engine Kalkulator Gizi (Logic)
Mesin ini menghitung total gizi harian setiap kali ada input bahan di frontend.

### A. Algoritma Kalkulasi
1.  **Input:** Bahan (ID), Satuan (SRT/Gram), Jumlah.
2.  **Konversi Gram:** Jika SRT, ambil `weight_gram_standard` dari `food_conversions`.
3.  **Proses Yield Factor:** `Berat_Mentah = Berat_Masak / yield_factor`.
4.  **Proses Nutrient Loss:** `Nutrisi_Akhir = (Berat_Masak / 100) * Gizi_Bahan * Nutrient_Loss_Factor`.
5.  **Output:** Total Kalori, Protein, Lemak, Karbohidrat untuk menu hari tersebut.

---

## 2. 🧱 Komponen Dashboard Meal Planner (Frontend)
Menggunakan **React & TailwindCSS** untuk antarmuka yang dinamis:
*   **Searchable Food List:** Menggunakan `debounce` (300ms) untuk mencari bahan makanan di database.
*   **SRT Toggle:** Tombol ganti satuan (Centong <-> Gram) yang mengubah input field secara otomatis.
*   **Real-time Progress Bar:** Bar dinamis yang berubah warna (Merah -> Kuning -> Hijau) saat kalori mendekati target sekolah.
*   **Macro-nutrients Breakdown:** Grafik donat (Pie Chart) untuk proporsi Karbo/Protein/Lemak dalam "Isi Piringku".

---

## 3. 🏫 Manajemen Satuan Pendidikan (School Profile)
### A. Tabel `schools`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto increment |
| `school_name` | VARCHAR(100) | Nama sekolah |
| `target_group` | ENUM | 'PAUD', 'SD', 'SMP', 'SMA' |
| `total_beneficiaries`| INT | Jumlah resmi siswa |
| `calorie_target_min` | INT | Batas bawah kalori harian |
| `calorie_target_max` | INT | Batas atas kalori harian |

---

## 4. 🍽️ Pengaturan Porsi (Portion Sizing)
*   **Standard Ratio:** Porsi untuk kelompok umur standar (Misal: SD).
*   **Extra Ratio:** Pengali (Multiplier) otomatis untuk porsi besar (Misal: SMP/SMA). Ahli Gizi bisa mengatur rasio (Contoh: 1.2x) untuk mempercepat penyusunan menu di jenjang yang berbeda dalam satu sekolah.

---

## 🏁 Definition of Done (Phase 2)
- [ ] User dapat mencari bahan makanan dan menambahkannya ke list menu.
- [ ] Kalkulasi gizi otomatis berjalan di sisi client & server dengan akurasi 99%.
- [ ] UI Progress Bar berubah secara dinamis sesuai input.
- [ ] Data Sekolah berhasil disimpan dan target gizi sekolah terbaca oleh Meal Planner.
