# 🛡️ Phase 3: Logistics & Safety
**Fokus Utama:** Efisiensi Kerja & Keamanan Siswa

## 1. 📚 Master Menu Library (Templating)
Membuat sistem penyimpanan "Paket Menu" yang dapat digunakan berulang kali.

### A. Tabel `master_menus` & `master_menu_items`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto increment |
| `menu_name` | VARCHAR(100) | Judul Paket (Misal: "Ayam Bakar Madu") |
| `is_approved` | BOOLEAN | Status verifikasi oleh Senior Ahli Gizi |
| `created_by` | INT (FK) | ID Ahli Gizi pembuat |

*   **Logic:** Ahli Gizi dapat memilih paket Master Menu, lalu sistem otomatis mengisinya ke `daily_menus` dengan menyesuaikan volume porsi sesuai jumlah siswa di sekolah target.

---

## 2. ⚠️ Safety Filter: Allergy Watcher (Security)
Melindungi siswa dengan profil alergi spesifik.

### A. Tabel `student_profiles`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto increment |
| `school_id` | INT (FK) | Relasi ke `schools` |
| `student_name` | VARCHAR(100) | Nama lengkap siswa |
| `allergy_notes` | TEXT | List alergi (Kacang, Telur, Seafood, dll) |

*   **Logic:** Saat penyusunan menu, jika bahan makanan mengandung "Telur", sistem melakukan *lookup* ke `student_profiles` sekolah terkait. Jika ada kecocokan, munculkan **Peringatan Merah** dengan daftar nama siswa yang terancam.

---

## 3. 📦 Logistics & Production Calculation
Merekam data porsi riil yang harus diproduksi oleh dapur.

### A. Tabel `daily_menus` (Update Field)
*   `total_beneficiaries` (INT): Diambil otomatis dari profil sekolah.
*   `buffer_portions` (INT): Input manual oleh Ahli Gizi (Porsi Cadangan).
*   `organoleptic_portions` (INT): Porsi sampling untuk uji QC rasa (Default 2 porsi).
*   **Formula `Total Produksi`:** `Siswa + Buffer + Sampling`.

---

## 4. 🚀 Scalability: Redis Caching
Mengoptimalkan sistem saat diakses oleh banyak sekolah sekaligus.
*   **Target Cache:** Data gizi dasar (TKPI) dan Master Menu yang sering dibuka.
*   **TTL (Time-To-Live):** Data gizi di-cache selama 24 jam untuk mengurangi beban database MySQL secara drastis saat jam sibuk penyusunan menu nasional.

---

## 🏁 Definition of Done (Phase 3)
- [ ] Ahli Gizi dapat mengambil menu dari Master Library ke jadwal harian.
- [ ] Sistem menampilkan peringatan alergi yang akurat saat bahan berbahaya dipilih.
- [ ] Total produksi porsi dihitung otomatis sesuai rumus logistik.
- [ ] Integrasi Redis Caching berjalan (Dibuktikan dengan respon API < 100ms).
