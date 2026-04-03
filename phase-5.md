# 📊 Phase 5: Analytics & Intelligence
**Fokus Utama:** Data Driving Improvements & AI Assistance

## 1. 📏 Health Monitoring: Antropometri Siswa
Pelacakan kondisi fisik siswa secara berkala (Misal: per 3 bulan).

### A. Tabel `health_logs`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto increment |
| `student_id` | INT (FK) | Relasi ke `student_profiles` |
| `weight_kg` | DECIMAL(5,2) | Berat Badan |
| `height_cm` | DECIMAL(5,2) | Tinggi Badan |
| `bmi` | DECIMAL(5,2) | Kalkulasi otomatis Body Mass Index |
| `status` | VARCHAR(50) | Normal/Wasting/Stunting (WHO Standard) |

---

## 2. 📉 Plate Waste Analytic (Analisa Sisa)
Menilai keberhasilan menu dari piring yang tersisa.

### A. Input Metrik (Dapur/Guru)
*   **Plate Waste %:** Input persentase sisa makanan rata-rata di sekolah (Misal: Sayur sisa 30%, Nasi sisa 5%).
*   **Logic:** Jika menu tertentu selalu memiliki sisa tinggi (> 20%), sistem memberikan peringatan untuk evaluasi resep atau modifikasi rasa.

---

## 3. 🤖 AI-Nutritionist Assistant (Gemini API)
Meningkatkan produktivitas Ahli Gizi dengan bantuan kecerdasan buatan.

### A. Smart Substitution
*   **Logic:** Jika stok bahan tertentu (misal: Ikan) habis di pasar, AI menyarankan bahan pengganti (misal: Telur/Ayam) yang memiliki nilai protein setara tetapi tetap masuk budget.

### B. Menu Optimization Tip
*   **Logic:** AI memberikan saran optimasi biaya: *"Ganti Brokoli dengan Bayam lokal untuk menghemat Rp 2.000 per porsi tanpa mengurangi kandungan gizi."*

---

## 4. 📈 Business Intelligence Dashboard
Laporan visual untuk pengambil kebijakan (Admin Pusat):
*   **Nutritional Compliance:** Persentase sekolah yang berhasil mencapai target kalori harian.
*   **Budgeting Efficiency:** Grafik sisa anggaran per sekolah.
*   **Health Progress:** Grafik penurunan angka *Wasting/Stunting* di sekolah yang dipantau.

---

## 🏁 Definition of Done (Phase 5)
- [ ] Data Antropometri (BB/TB) dapat diinput dan status gizi terhitung sesuai standar WHO.
- [ ] Dashboard analitik menampilkan tren sisa makanan dan gizi secara akurat.
- [ ] Integrasi AI-Nutritionist berhasil memberikan saran substitusi yang masuk akal secara nutrisi.
- [ ] Laporan akhir (PDF/Excel) dapat diekspor untuk kebutuhan audit pusat.
