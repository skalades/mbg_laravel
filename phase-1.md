# 🚀 Phase 1: Foundation & Master Data
**Fokus Utama:** Reliability & Data Integrity

## 1. 🏗️ Arsitektur Database (MySQL Schema)
Fase ini fokus pada pembangunan tabel master yang akan menjadi referensi seluruh sistem.

### A. Tabel `users` (Authentication & RBAC)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto increment |
| `username` | VARCHAR(50) | Unique |
| `password_hash` | TEXT | Argon2 atau BCrypt |
| `role` | ENUM | 'ADMIN', 'NUTRITIONIST', 'CHEF' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### B. Tabel `food_items` (Bank Data Gizi)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto increment |
| `name` | VARCHAR(100) | Nama bahan makanan |
| `category` | ENUM | 'KARBOHIDRAT', 'PROTEIN_HEWANI', 'PROTEIN_NABATI', 'SAYURAN', 'BUAH', 'BUMBU' |
| `energy_kcal` | DECIMAL(10,2) | Kalori per 100g |
| `protein_g` | DECIMAL(10,2) | Protein per 100g |
| `fat_g` | DECIMAL(10,2) | Lemak per 100g |
| `carbs_g` | DECIMAL(10,2) | Karbohidrat per 100g |
| `iron_mg` | DECIMAL(10,2) | Zat Besi (Mikronutrien) |

### C. Tabel `food_conversions` (Standarisasi SRT)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto increment |
| `food_item_id` | INT (FK) | Relasi ke `food_items` |
| `unit_name` | VARCHAR(50) | Contoh: 'Centong', 'Butir', 'Potong' |
| `weight_gram_standard` | DECIMAL(10,2) | Berat rata-rata untuk hitungan gizi |
| `weight_gram_min` | DECIMAL(10,2) | Toleransi bawah untuk dapur |
| `weight_gram_max` | DECIMAL(10,2) | Toleransi atas untuk dapur |
| `yield_factor` | DECIMAL(5,2) | Koefisien Mentah ke Matang (Default 1.0) |

---

## 2. 🔐 Keamanan & Autentikasi (Security)
*   **JWT Implementation:** Penggunaan *Access Token* dan *Refresh Token* melalui HTTP-Only Cookies (mencegah XSS).
*   **Middleware RBAC:** 
    *   `verifyRole(['NUTRITIONIST'])` untuk akses Meal Planner.
    *   `verifyRole(['CHEF'])` untuk akses Dashboard Produksi & QC.
*   **Password Policy:** Minimal 8 karakter, kombinasi huruf & angka, hashing menggunakan BCrypt dengan *Salt* tinggi.

---

## 3. 🧪 Master Data Seeding (Reliability)
*   **TKPI Data Import:** Injeksi minimal 50 bahan makanan pokok Indonesia awal (Beras, Ayam, Telur, Lele, Tempe, Bayam, dll).
*   **Unit Mapping:** Penentuan SRT default untuk setiap bahan yang di-seed agar Ahli Gizi langsung bisa bekerja.

---

## 🏁 Definition of Done (Phase 1)
- [ ] Database MySQL berhasil dibuat dengan relasi antar tabel (FK) yang benar.
- [ ] Script seeding berhasil berjalan tanpa error.
- [ ] API Login & Register menghasilkan JWT Token yang valid.
- [ ] Filter Role (Admin/Gizi/Chef) berfungsi saat memanggil API terproteksi.
