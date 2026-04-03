# 📸 Phase 4: Operations & Audit
**Fokus Utama:** Akuntabilitas & Quality Control (QC)

## 1. 👅 Dashboard QC: Uji Organoleptik
Pengawasan mutu makanan sebelum didistribusikan ke siswa.

### A. Parameter Penilaian (Checklist)
*   **Warna (Appearance):** Menarik & Sesuai Standar.
*   **Aroma (Smell):** Segar & Menggugah Selera.
*   **Tekstur (Texture):** Tingkat kematangan pas (Tidak benyek/keras).
*   **Rasa (Taste):** Enak & Sesuai Bumbu.
*   **Suhu Kuantitatif (Food Thermometer):** Pencatatan suhu aktual. Wajib >75°C untuk suhu pemasakan internal dan >60°C untuk suhu distribusi.

---

## 2. ✍️ Digital Evidence: Foto & Tanda Tangan
Bukti fisik autentik untuk mencegah laporan fiktif.

### A. Fitur Food Photography
*   **Input:** Kamera Smartphone (Browser Camera API).
*   **Logic:** Foto piring makanan yang sudah matang wajib diunggah sebelum menu dinyatakan "Approved".
*   **Storage:** Optimasi gambar (Compressed JPEG) agar hemat penyimpanan cloud.

### B. Canvas Signature Pad (Tanda Tangan Digital)
*   **Input:** Touchscreen/Mouse Signature.
*   **Output:** Base64 Image atau SVG yang disimpan sebagai bukti verifikasi Ahli Gizi/Kepala Dapur.

---

## 3. 📄 Export Module: Instruksi Dapur & Laporan
Penyampaian rencana ke staf lapangan secara efisien.

### A. PDF Generator (Instruksi Masak)
*   **Output:** Dokumen PDF yang berisi:
    *   Target Gizi Lokal.
    *   List Bahan Makanan (SRT & Gram).
    *   Metode Masak (Kukus/Rebus) untuk menjaga nutrisi.
    *   Catatan Alergi Siswa.

### B. WhatsApp Integration (Share Link)
*   **Logic:** Memberikan link cepat ke Dashboard Dapur via WhatsApp agar koki bisa melihat instruksi langsung dari ponsel tanpa mencetak kertas.

---

## 🏁 Definition of Done (Phase 4)
- [ ] Checklist Organoleptik berfungsi dan datanya tersimpan dalam database.
- [ ] Foto menu berhasil diunggah dan tertampil di Dashboard Audit.
- [ ] Tanda tangan digital terekam dengan jelas sebagai bukti verifikasi.
- [ ] Dokumen PDF berhasil di-generate dan dapat di-share melalui WhatsApp.
