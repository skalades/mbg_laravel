# 🥗 Nutrizi: Modul Ahli Gizi (Nutritionist Dashboard)

## 📌 Deskripsi Modul
Modul ini adalah pusat kendali utama untuk memastikan program **Makan Bergizi Gratis (MBG)** memenuhi standar kesehatan nasional. Ahli Gizi memiliki otoritas penuh untuk menyusun menu, melakukan konversi takaran praktis, dan memantau status gizi penerima manfaat secara manual tanpa intervensi AI otomatis.

---

## 🎨 Standar Visual & Desain UI/UX

Untuk memastikan sistem Nutrizi terasa **premium, konsisten, dan mudah dipelajari**, berikut adalah standar desain yang diterapkan:

### 1. Palet Warna Semantik
*   **Primary (Emerald 700):** Digunakan untuk aksi utama dan indikator sukses/loyang.
*   **Warning (Amber 600):** Untuk status "Draft" atau gizi yang mendekati target.
*   **Danger (Rose 600):** Untuk peringatan Alergi atau kesalahan gizi fatal.
*   **Base (Slate 900):** Tipografi utama untuk keterbacaan tinggi pada latar putih (Card-based UI).

### 2. Tipografi & Konsistensi
*   **Font Family:** Menggunakan **Inter** atau **Outfit** (Sans-serif modern) untuk kenyamanan membaca data numerik.
*   **Atomic Design:** Semua tombol, input, dan modal mengikuti skema komponen tunggal yang seragam di setiap dashboard.
*   **Responsive Layout:** Sidebar navigation tetap konsisten di laptop/tablet (perangkat utama Ahli Gizi).

### 3. Interaktivitas Premium
*   **Micro-Animations:** Transisi halus 0.2s pada hover state dan pergerakan progress bar gizi.
*   **Shadow System:** Menggunakan *Soft Diffusion Shadow* untuk memberikan dimensi pada kartu informasi (*Elevated UI*).

---

## 🛠 Spesifikasi Teknis & Logika Sistem

### 1. Integrasi Database Komposisi Pangan (DKP)
Sistem menggunakan referensi dari **Tabel Komposisi Pangan Indonesia (TKPI)**.
- **Data Dasar:** Energi (kkal), Protein (g), Lemak (g), Karbohidrat (g), Serat (g), serta Mikronutrien (Zat Besi, Zinc, Vit A).
- **Rumus Perhitungan:** $$Total\_Nutrisi = \sum \left( \frac{Berat\_Bersih\ (g) \times Nutrient\_Loss\_Factor}{100} \times Kandungan\_Gizi\_Bahan \right)$$
- **Faktor Konversi Mentah-Matang (Yield Factor):** Logika otomatis untuk menghitung kebutuhan bahan mentah (misal: Beras) berdasarkan porsi matang (misal: Nasi) menggunakan koefisien standar penyerapan air/pengusutan.
- **Faktor Kehilangan Nutrisi (Nutrient Loss):** Penyesuaian otomatis kandungan mikronutrien berdasarkan metode masak (Kukus: 5-10% loss, Goreng: 20-30% loss).

---

## 🏛️ Arsitektur & Spesifikasi Sistem

### 1. Teknologi (Tech Stack)
*   **Frontend:** React (Next.js/Vite) + TailwindCSS (Premium UI).
*   **Backend:** Node.js (Express/NestJS) dengan pola *Service-Repository*.
*   **Database:** MySQL (Relational) + Redis (Caching data gizi/TKPI).
*   **DevOps:** Dockerize (Containerization) untuk kemudahan *scaling*.

### 2. Skalabilitas (Scalability)
*   **Horizontal Scaling:** Mendukung penambahan *node* server saat trafik tinggi.
*   **Database Indexing:** Optimasi pada tabel bahan makanan dan log harian untuk pencarian cepat.
*   **Caching Strategy:** Redis menyimpan data gizi yang sering dipanggil agar beban DB rendah.

### 3. Keandalan (Reliability)
*   **High Availability:** Backup database otomatis harian dan redundansi server.
*   **Error Monitoring:** Implementasi Sentry/Winston untuk pelacakan *bug* real-time.
*   **Auto-Recovery:** Server akan restart otomatis jika terjadi kegagalan sistem.

### 4. Keamanan (Security)
*   **Role-Based Access Control (RBAC):** Pemisahan hak akses ketat (Admin > Ahli Gizi > Staf Dapur).
*   **Data Protection:** Enkripsi data sensitif siswa (PII) dan sanitasi input (XSS/SQLi Prevention).
*   **Auth:** JWT (JSON Web Token) via HTTPS untuk sesi yang aman.

### 2. Sistem Konversi Satuan Rumah Tangga (SRT)
Fitur ini memungkinkan Ahli Gizi menginput menu dalam takaran praktis yang dipahami oleh staf dapur lapangan.

**Tabel Referensi Konversi (Standarisasi Berat):**
*Sistem menggunakan **Berat Standar** untuk perhitungan gizi dan **Rentang Toleransi** untuk panduan dapur.*

| Bahan Makanan | Satuan Rumah Tangga (SRT) | Berat Standar (Gizi) | Rentang Dapur (Toleransi) |
| :--- | :--- | :--- | :--- |
| Nasi Putih | 1 Centong (Rice Cooker) | 100g | 95g - 105g |
| Ayam Goreng | 1 Potong Sedang | 45g | 40g - 50g |
| Telur Ayam | 1 Butir | 50g | 45g - 55g |
| Tempe | 1 Potong Sedang | 25g | 20g - 30g |
| Sayuran Berkuah | 1 Sendok Sayur | 50g | 45g - 55g |
| Minyak Goreng | 1 Sendok Makan (sdm) | 10g | 8g - 12g |

---

## 📋 Fitur Utama Dashboard

### A. Meal Planner (Penyusun Menu)
* **Input Takaran:** Ahli Gizi dapat memilih antara input **Gramasi Langsung** atau **SRT**.
* **Portion Sizing (Rasio Porsi):** Pengaturan porsi **Besar (Extra)** untuk remaja/atlet dan porsi **Kecil (Standard)** untuk kelompok umur lebih muda dalam satu hari yang sama.
* **Real-time Nutrition Indicator:** Progress bar yang menunjukkan apakah total kalori harian sudah mencapai target (misal: 450 - 550 kkal untuk SD).
* **Siklus Menu:** Pengaturan menu untuk siklus 10 hari guna variasi rasa dan nutrisi.
* **Master Menu Library (Templating):** Perpustakaan berisi kumpulan menu yang sudah "Approved" (misal: "Menu Ayam Bakar Kecap", "Menu Ikan Goreng Tepung"). Ahli Gizi tinggal memilih dari library untuk dimasukkan ke jadwal mingguan tanpa input ulang bahan satu per satu.

### B. Standardized Recipe (Resep Baku)
* **Instruksi Teknis:** Penulisan metode masak (Kukus/Rebus/Tumis) untuk meminimalisir kehilangan zat gizi (*nutrient loss*).
* **Bahan Mentah vs Matang:** Logika otomatis untuk menghitung kebutuhan bahan mentah berdasarkan porsi matang yang ditentukan.

### C. Antropometri & Monitoring (Manual Tracking)
* **Pencatatan Fisik:** Input manual Berat Badan (BB) dan Tinggi Badan (TB) siswa secara berkala.
* **Health & Allergy Profile:** Database catatan alergi per siswa (misal: Alergi Telur/Kacang) yang akan memberikan peringatan otomatis pada penyusun menu.
* **Analisis Status Gizi:** Penentuan status gizi (Normal/Stunting/Wasting) berdasarkan standar WHO.
* **Visualisasi Sisa Makanan (Plate Waste Analytic):** Grafik persentase sisa makanan sebagai indikator kepuasan rasa & daya terima siswa.

### E. Manajemen Satuan Pendidikan (School Profile)
* **Metadata Sekolah:** Nama sekolah, alamat, dan kontak penanggung jawab lapangan.
* **Logistik Penerima Manfaat:** 
    * **Jumlah Siswa:** Data resmi penerima manfaat.
    * **Manual Buffer Input:** Input jumlah porsi tambahan cadangan (misal: +15 porsi untuk tamu/kerusakan).
    * **Porsi Sampling (Organoleptik):** Input jumlah porsi untuk uji rasa/QC (biasanya 1-2 porsi per menu).
    * **Total Produksi:** Kalkulasi otomatis (`Siswa + Buffer + Sampling`) untuk penentuan total belanja bahan baku.
* **Uji Organoleptik (Food Quality Control):**
    * **Parameter Uji:** Checklist penilaian harian untuk Rasa, Aroma, Warna, dan Tekstur. Ditambah pencatatan suhu kuantitatif aktual dengan *Food Thermometer* (Suhu Pemasakan & Suhu Holding).
    * **Approval Status:** Menu hanya bisa "Published" jika hasil uji organoleptik memenuhi standar.
* **Akuntabilitas & Audit Digital (Digital Evidence):**
    * **Food Photography:** Fitur wajib unggah foto menu matang harian sebagai bukti fisik porsi dan tampilan.
    * **Digital Signature:** Tanda tangan digital dari Ahli Gizi atau Kepala Dapur sebagai bukti verifikasi hasil uji organoleptik dan kelayakan menu.
* **Smart Substitution:** Rekomendasi otomatis bahan pengganti jika target gizi mikro/makro belum tercapai.
* **Cost Efficiency Tip:** Saran optimasi bahan pangan lokal dengan kandungan gizi serupa namun harga lebih terjangkau.

### F. Master Menu Management
* **Menu Categorization:** Pengelompokan menu berdasarkan biaya (Budget), kesukaan siswa (Rating), atau kemudahan masak.
* **Nutritional Validation:** Setiap master menu memiliki ringkasan gizi total yang menetap.

---

## 🗄️ Struktur Database (Schema)

### 1. Tabel `food_items` (Data Nutrisi)
- `id` (PK)
- `name` (Nama bahan pangan)
- `energy`, `protein`, `fat`, `carbs` (per 100g)
- `category` (Karbo/Protein/Sayur/Buah)

### 2. Tabel `food_conversions` (Data SRT)
- `id` (PK)
- `food_item_id` (FK)
- `unit_name` (Contoh: "Centong", "Sdm", "Butir")
- `weight_gram_standard` (Berat untuk hitungan gizi)
- `weight_gram_min` & `weight_gram_max` (Range untuk dapur)
- `yield_factor` (Koefisien Mentah ke Matang)

### 3. Tabel `schools`
- `id` (PK)
- `school_name`
- `total_beneficiaries` (Jumlah siswa)
- `location`

### 4. Tabel `daily_menus`
- `id` (PK)
- `school_id` (FK)
- `menu_date`
- `target_group` (PAUD/SD/SMP/SMA)
- `portion_type` (Small / Large)
- `total_beneficiaries` (Siswa aktif pada hari tersebut)
- `buffer_portions` (Porsi cadangan)
- `organoleptic_portions` (Porsi untuk sampling QC)
- `total_production` (Siswa + Buffer + Organoleptic)
- `organoleptic_status` (Pass / Fail)
- `suhu_pemasakan` (Decimal)
- `suhu_distribusi` (Decimal)
- `menu_photo_url` (Link bukti foto menu)
- `verified_by_signature` (Data/ID tanda tangan digital)
- `total_calories`
- `status` (Draft / Approved)

### 6. Tabel `master_menus`
- `id` (PK)
- `menu_name` (Contoh: "Paket A: Nasi Ayam")
- `total_calories`
- `created_by` (Ahli Gizi ID)

### 7. Tabel `master_menu_items` (Bahan dari Master Menu)
- `id` (PK)
- `master_menu_id` (FK)
- `food_item_id` (FK)
- `quantity` (Gram/SRT)

---

## 🚀 Alur Kerja (Workflow)

1.  **Pengaturan Parameter:** Ahli Gizi menetapkan target gizi per sekolah dan kelompok umur.
2.  **Identifikasi Alergi:** Sistem menampilkan daftar siswa dengan alergi sebagai batasan bahan baku.
3.  **Penyusunan Menu:**
    *   **Opsi A:** Menyusun dari nol (Manual).
    *   **Opsi B:** Mengambil dari **Master Menu Library** (Template).
4.  **Penyesuaian (Fine-tuning):** Memilih tipe porsi, serta alokasi Buffer dan Sampling Organoleptik.
5.  **Validasi:** Sistem menghitung total gizi dan mengalikan dengan `Total Produksi` (Siswa + Buffer + Organoleptic) untuk menghasilkan daftar belanja bahan baku.
5.  **Publikasi:** Menu dikirim ke Dashboard Produksi/Dapur Umum dalam format takaran praktis (SRT).
6.  **QC & Audit:** Pengunggahan foto makanan dan penandatanganan hasil uji organoleptik secara digital.
7.  **Ekspor Operasional:** Cetak dokumen instruksi dapur (PDF) dan fitur "Share to WhatsApp Group" untuk staf lapangan.
7.  **Audit Gizi:** Ahli Gizi meninjau laporan kesehatan siswa dan analitik *Plate Waste* secara berkala.

---
*Dokumen ini dibuat untuk pengembangan sistem Nutrizi oleh **NADIR Web & AI Development**.*

---

## 🚀 Roadmap Pengembangan (5 Phases)

### Phase 1: Foundation & Master Data (Reliability Focus)
*   **Database Setup:** Membangun skema RDBMS (MySQL) yang tangguh sesuai rancangan.
*   **Data Seeding:** Injeksi data gizi TKPI nasional dan pemetaan konversi SRT awal.
*   **Auth Foundation:** Implementasi sistem login dengan RBAC (Role-Based Access Control).

### Phase 2: Meal Planner Core (Core Business Logic)
*   **Nutrition Calculator:** Membangun mesin penghitung gizi real-time (Energi, Protein, dll).
*   **Yield & Loss Logic:** Implementasi otomatisasi konversi mentah-matang dan penyusutan gizi.
*   **School Management:** Modul pengelolaan data sekolah, kelompok umur, dan jumlah siswa.

### Phase 3: Logistics & Safety (Scalability & Security Focus)
*   **Master Menu Library:** Fitur *templating* menu untuk penggunaan ulang lintas siklus.
*   **Safety Filter:** Implementasi integrasi catatan alergi siswa pada proses penyusunan menu.
*   **Logistics Module:** Kalkulasi otomatis Buffer Porsi, Sampling Organoleptik, dan Total Produksi.
*   **Caching Layer:** Implementasi Redis untuk kecepatan akses data gizi masif.

### Phase 4: Operations & Digital Audit (Accountability Focus)
*   **QC Dashboard:** Modul input uji organoleptik (Rasa, Aroma, Warna, Tekstur).
*   **Digital Evidence:** Fitur unggah foto menu matang harian dan tanda tangan digital penanggung jawab.
*   **Export Module:** Fitur otomatisasi dokumen instruksi dapur (PDF) dan integrasi WhatsApp.

### Phase 5: Analytics & Intelligence (Advanced Features)
*   **Health Monitoring:** Pelacakan antropometri siswa (BB/TB) dan status gizi (Normal/Stunting).
*   **Plate Waste Analytics:** Dashboard sisa makanan untuk evaluasi kepuasan siswa.
*   **AI Smart Suggester:** Asisten AI untuk optimasi gizi, substitusi bahan, dan efisiensi biaya.