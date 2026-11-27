# Panduan Setup Database Google Spreadsheet & Apps Script

Panduan ini memandu Anda menghubungkan website **The Daily Knead** ke **Google Spreadsheet** sebagai database utama menggunakan **Google Apps Script**.

---

## Arsitektur Alur Data
```
Browser Pengguna -> Server Next.js (API Route) -> Google Apps Script Web App -> Google Spreadsheet
```
> **Mengapa ada lapisan server Next.js?**  
> Supaya Google Spreadsheet Anda aman dan tidak dapat dibaca atau dimodifikasi langsung oleh sembarang orang dari browser luar. Hanya server Next.js Anda yang memegang kunci rahasia (*token*) untuk mengakses database.

---

## Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Drive](https://drive.google.com) dan masuk ke akun Google Anda.
2. Buat spreadsheet baru: Klik **Baru (+) > Google Spreadsheet (Kosong)**.
3. Beri nama file spreadsheet, misalnya: `The Daily Knead - Database`.

---

## Langkah 2: Buka Editor Apps Script
1. Di dalam spreadsheet tersebut, klik menu atas: **Ekstensi (Extensions) > Apps Script**.
2. Anda akan diarahkan ke halaman editor kode Google Apps Script.
3. Ubah nama proyek di pojok kiri atas menjadi: `The Daily Knead DB API`.

---

## Langkah 3: Salin File `code.gs` dan `setup.gs`
Di proyek website ini, sudah tersedia dua file di root folder:

### 1. Salin `code.gs`
- Buka file `code.gs` di editor Anda (di root project).
- Salin seluruh isinya.
- Di editor Apps Script, ganti kode yang ada di file `Code.gs` dengan kode yang baru Anda salin.

### 2. Buat dan Salin `setup.gs`
- Di editor Apps Script, klik ikon **(+) Tambah File > Script**.
- Beri nama file: `setup.gs`.
- Buka file `setup.gs` di root project Anda, salin seluruh isinya, dan tempelkan ke file `setup.gs` di editor Apps Script.
- Klik ikon **Simpan (Disket / Ctrl+S)**.

---

## Langkah 4: Jalankan Inisiasi Tabel Otomatis (`initTables`)
1. Di bagian atas editor Apps Script, pilih fungsi **`initTables`** pada dropdown fungsi (di sebelah tombol Jalankan).
2. Klik tombol **Jalankan (Run)**.
3. Google akan meminta izin otorisasi akses spreadsheet:
   - Klik **Tinjau Izin (Review Permissions)**.
   - Pilih akun Google Anda.
   - Jika muncul peringatan "Google belum memverifikasi aplikasi ini", klik **Lanjutan (Advanced) > Buka The Daily Knead DB API (tidak aman)**.
   - Klik **Izinkan (Allow)**.
4. Kembali ke tab Google Spreadsheet Anda: Anda akan melihat 3 sheet otomatis dibuat dengan rapi:
   - `Roles` (dengan data awal `admin` & `user`)
   - `Users` (dengan akun admin bawaan `admin@gmail.com`)
   - `News` (dengan 3 artikel awal dari Step 1)

> *Fungsi `initTables()` bersifat idempoten (aman dijalankan berulang kali tanpa membuat data ganda).*

---

## Langkah 5: Atur Script Properties (Kunci Rahasia)
1. Di editor Apps Script, klik menu samping kiri: **Ikon Gerigi (Setelan Proyek / Project Settings)**.
2. Gulir ke bawah hingga bagian **Properti Skrip (Script Properties)**.
3. Klik **Tambahkan properti skrip (Add script property)**:
   - **Properti:** `APPS_SCRIPT_SECRET`
   - **Nilai:** Buat token rahasia acak Anda (contoh: `knead_artisan_secret_token_991823`).
4. Klik **Simpan properti skrip**.

---

## Langkah 6: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru: **Terapkan (Deploy) > Penerapan baru (New deployment)**.
2. Klik ikon gerigi di samping *Pilih jenis* dan pilih **Aplikasi Web (Web app)**.
3. Isi konfigurasi berikut:
   - **Deskripsi:** `The Daily Knead Production DB`
   - **Jalankan sebagai (Execute as):** `Saya (email Anda)`
   - **Yang memiliki akses (Who has access):** `Siapa saja (Anyone)` *(Tenang, akses tetap terlindungi oleh APPS_SCRIPT_SECRET di langkah 5)*.
4. Klik **Terapkan (Deploy)**.
5. Salin **URL Aplikasi Web** yang diberikan (formatnya: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Langkah 7: Pasang ke `.env.local` Website
1. Di folder proyek website Anda di komputer, buat file `.env.local` (atau duplikasi dari `.env.example`).
2. Masukkan URL dan Secret yang Anda dapatkan:
   ```env
   APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   APPS_SCRIPT_SECRET=knead_artisan_secret_token_991823
   JWT_SECRET=rahasia_jwt_session_minimal_32_karakter_acak_bebas
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. Simpan file `.env.local`. Sekarang website Anda telah tersambung langsung ke Google Spreadsheet!

---

## Cara Memperbarui Deployment Saat Kode Berubah
Jika di kemudian hari ada penambahan fungsi di Apps Script:
1. Simpan perubahan di editor Apps Script.
2. Klik **Terapkan (Deploy) > Kelola penerapan (Manage deployments)**.
3. Klik ikon **Pensil (Edit)** pada deployment aktif.
4. Pada dropdown *Versi*, pilih **Versi baru (New version)**.
5. Klik **Terapkan (Deploy)**.

---

## Catatan Penting Media (Penyimpanan Lokal vs Vercel)
- Saat ini thumbnail berita tersimpan di folder lokal `public/uploads/`.
- Cara ini berfungsi sempurna di komputer lokal (development).
- Namun saat website di-deploy ke Vercel (production), penyimpanan file lokal bersifat sementara karena server Vercel bersifat *serverless*.
- Pada Step 4 nanti, kita akan menyediakan opsi migrasi media ke penyimpanan awan permanen (*Cloud Storage* seperti Cloudinary atau Vercel Blob) dengan sangat mudah melalui modul `src/lib/storage.ts`.
