# Log Pemeliharaan & Pengembangan (Maintenance Log) - The Daily Knead

Dokumen ini mencatat riwayat pembaruan, perbaikan bug, dan rencana pengembangan fitur lanjutan untuk website The Daily Knead.

---

## 🚀 Riwayat Perubahan (Change Log)

### [27 November 2026] - Persiapan Rilis & Pembersihan Keamanan
- **Pembersihan Keamanan:** Menghapus kartu sugesti "Akun Administrator Demo" dari halaman login publik (`src/app/(auth)/login/page.tsx`) agar akun admin tidak terekspos ke pelanggan.
- **Optimasi Database Fallback:** Memperbaiki pengetikan status user & artikel di `src/lib/db.ts`.
- **Integrasi Google Spreadsheet:** Menyiapkan `code.gs` dan `setup.gs` serta panduan lengkap di `documentation/SETUP.md`.
- **Inisiasi Dokumen Maintenance:** Membuat file `documentation/MAINTENANCE.md`.

### [19 November 2026] - Penyelesaian Step 2 (User Management & Dashboard)
- Sistem autentikasi pengguna dengan JWT HttpOnly cookie dan enkripsi password `bcryptjs`.
- Panel Dashboard Admin (`/dashboard`):
  - Ringkasan statistik (pengguna, role, artikel published vs draft).
  - Manajemen Pengguna (cari, ubah role, aktifkan/nonaktifkan, hapus dengan proteksi akun admin).
  - Manajemen Role (pengaturan permission, proteksi role bawaan sistem).
  - Manajemen Berita & Artikel (CRUD, upload thumbnail lokal `public/uploads/`, filter status).
  - Profil Admin & Ganti Password.

### [16 November 2026] - Penyelesaian Step 1 (Landing Page)
- Implementasi sistem desain *Warm Artisan Craft* (Next.js App Router + Tailwind CSS).
- Pembangunan section Hero, About, Service, News/Article, Contact, Google Maps embed, Navbar, dan Footer.
- Konfigurasi terpusat di `src/config/site.ts`.

---

## 📌 Backlog Fitur (Rencana Lanjutan)
- [ ] **Migrasi Media Cloud:** Memindahkan penyimpanan upload gambar dari disk lokal ke cloud storage (Vercel Blob / Cloudinary) agar gambar bertahan di serverless production.
- [ ] **Pemberitahuan Otomatis:** Integrasi notifikasi email via Resend atau WhatsApp Gateway resmi untuk pesan masuk dari form kontak.
- [ ] **Sistem Keranjang & Pemesanan Terintegrasi:** Menambahkan katalog belanja dan checkout otomatis jika di masa depan toko ingin melayani transaksi langsung di website.
- [ ] **Domain Kustom:** Menyambungkan domain resmi (contoh: `thedailyknead.id` atau `thedailyknead.com`).

---

## 🐛 Bug & Catatan Teknis Diketahui
*(Belum ada bug aktif yang dilaporkan. Semua alur utama login, dashboard, dan landing page berjalan normal).*

---

## 💡 Alur Penanganan Perubahan Baru
1. Catat kebutuhan di dokumen `MAINTENANCE.md`.
2. Untuk **Bug:** Lampirkan langkah mereproduksi, identifikasi kode, perbaiki, dan uji ulang.
3. Untuk **Fitur Baru:** Buat rencana singkat, kerjakan bertahap, dan uji.
4. **Perhatian Apps Script:** Jika mengubah `code.gs` atau `setup.gs`, kode harus disalin ulang ke editor Google Apps Script dan lakukan **Deploy > Manage deployments > New version** agar perubahan berlaku.
