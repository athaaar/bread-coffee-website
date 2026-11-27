# Progres Proyek - The Daily Knead

Terakhir diperbarui: 27 November 2026  
Posisi saat ini: **Step 4 - Deploy ke Vercel & Maintenance**

## Checklist
- [x] Inisiasi (data usaha & sistem desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Hero (Headline, subjudul, dual CTA, visual hero banner, floating status, proof points)
  - [x] About (Kisah perjuangan pemuda & roti Jepang artisan, master baker, 3 kartu keunggulan)
  - [x] Service (6 kartu layanan & menu: Shokupan & Sourdough, Coffee Bar, Breakfast, Catering, Hampers, Masterclass)
  - [x] Berita/Post (3 kartu warta & edukasi, siap dihubungkan ke CRUD di Step 2)
  - [x] Contact + Google Maps (Info kontak terverifikasi, jam operasional, form interaktif, embed Google Maps responsif)
  - [x] Navbar (Logo brand, navigasi deskop, menu mobile drawer aksesibel) & Footer (Brand info, navigasi, copyright)
  - [x] Konfigurasi terpusat di `src/config/site.ts` (mudah diedit tanpa bongkar komponen)
  - [x] Responsif & aksesibilitas (aria-label, alt text, semantic HTML)
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (`code.gs`, `setup.gs`) + inisiasi tabel Google Spreadsheet (`Roles`, `Users`, `News`)
  - [x] Login & register (validasi form, password bcrypt, JWT HttpOnly cookie)
  - [x] Role admin & user (middleware route protection & server-side role guard)
  - [x] Dashboard: Ringkasan statistik, Manajemen User, Manajemen Role, CRUD Berita, Profil & Ubah Password
  - [x] Upload media lokal (`public/uploads/`) melalui modul terpusat `src/lib/storage.ts`
  - [x] Integrasi Landing Page ke database artikel aktual (`/api/news`)
  - [x] Panduan lengkap Google Spreadsheet di `documentation/SETUP.md`
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan (dilewati - pemesanan difokuskan langsung via konsultasi WhatsApp resmi)
  - [x] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Checklist keamanan & QA rilis (.env, .gitignore, build production)
  - [ ] Panduan impor repository GitHub & Deploy Vercel
  - [ ] Konfigurasi Environment Variables di Vercel
  - [ ] Ganti password admin default di production
  - [ ] Inisiasi `documentation/MAINTENANCE.md`
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

---

## Akun Administrator Awal
- **Email:** `admin@gmail.com`
- **Password:** `123456`
> ⚠️ **Peringatan Keamanan Penting:** Password di atas adalah password default awal. Sangat disarankan untuk segera mengganti password akun admin Anda di halaman **/dashboard/profile** sebelum website dipublikasikan ke production.

---

## Daftar Gambar Dummy & Ukuran Ideal

Semua gambar disimpan di folder `public/images/` agar mudah diganti kapan saja:

| Nama File | Peruntukan | Ukuran / Rasio Rekomendasi | Keterangan |
|---|---|---|---|
| `logo.png` | Logo brand di Navbar & Footer | 500 x 500 px (1:1), PNG transparan | Logo The Daily Knead dari pengguna |
| `hero-banner.png` | Banner utama di Hero Section | 1200 x 900 px (4:3) atau 16:9 | Meja artisan bakery, roti & cangkir kopi |
| `about-baker.png` | Foto pembuat roti di Section About | 800 x 1000 px (4:5) | Head baker sedang menguleni adonan |
| `article-1.png` | Thumbnail Artikel 1 (Tips Baking) | 800 x 600 px (4:3) | Detail tekstur remah & kerak sourdough |
| `article-2.png` | Thumbnail Artikel 2 (Kopi Nusantara) | 800 x 600 px (4:3) | Seduhan pour-over kopi specialty |
| `article-3.png` | Thumbnail Artikel 3 (Gaya Hidup) | 800 x 600 px (4:3) | Sarapan sehat roti fermentasi lambat |

---

## Catatan Media & Penyimpanan
- Media thumbnail yang diunggah melalui Dashboard admin tersimpan di folder `public/uploads/` (file path dicatat di kolom `thumbnail_path`).
- Modul `src/lib/storage.ts` membungkus operasi simpan dan hapus file sehingga memudahkan migrasi ke cloud storage (Vercel Blob, Cloudinary) di Step 4.

---

## Cara Menjalankan Secara Lokal

1. **Jalankan Mode Development:**
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

2. **Akses Dashboard Admin:**
   - Kunjungi [http://localhost:3000/login](http://localhost:3000/login).
   - Masukkan email `admin@gmail.com` dan password `123456` (atau klik tombol **Isi Otomatis Akun Admin Demo**).
   - Anda akan diarahkan ke [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
