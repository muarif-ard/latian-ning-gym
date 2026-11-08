# Latian Ning Gym

[![Uji](https://github.com/muarif-ard/latian-ning-gym/actions/workflows/test.yml/badge.svg)](https://github.com/muarif-ard/latian-ning-gym/actions/workflows/test.yml)

Aplikasi web progresif (PWA) berbahasa Indonesia untuk program gym 3 bulan: jadwal latihan, pencatat beban dan repetisi, kalender latihan, grafik perkembangan per gerakan, menu makan, larangan harian, progres berat badan, panduan coach, dan pengingat kalender. Bisa dipasang di layar utama HP dan tetap terbuka saat offline. Semua data tersimpan di HP pengguna, tidak di server.

**Buka aplikasi:** https://muarif-ard.github.io/latian-ning-gym/

## Memasang di HP

- **Android (Chrome):** buka link aplikasi, ketuk menu titik tiga, pilih **Instal aplikasi** atau **Tambahkan ke layar utama**.
- **iPhone (Safari):** buka link aplikasi, ketuk tombol **Bagikan**, pilih **Tambahkan ke Layar Utama**.

## Menyimpan dan memindahkan data

Data tersimpan di browser HP masing-masing. Lakukan **Program → Cadangan data → Ekspor data** secara rutin, terutama sebelum ganti HP atau menghapus data browser. File cadangan ikut menyimpan foto progres.

Untuk memulihkan atau memindahkan data (termasuk dari versi aplikasi di Claude): **Program → Cadangan data → Impor data**, pilih file cadangan, lalu pilih **Gabungkan dengan data sekarang** (aman, tidak menghapus apa pun) atau **Ganti semua data sekarang**.

## Struktur proyek

| Lokasi | Isi |
|---|---|
| `index.html` | Kerangka halaman |
| `css/style.css` | Tampilan dan warna |
| `js/` | Logika aplikasi; `js/data.js` berisi gerakan, menu, larangan, dan tips |
| `js/views/` | Satu file per halaman |
| `sw.js`, `manifest.webmanifest`, `icons/` | Mode offline dan pemasangan di HP |
| `tests/` | Uji otomatis |
| `docs/DOKUMENTASI.md` | Dokumentasi teknis lengkap |

Tanpa framework dan tanpa build: file di repo adalah file yang dijalankan browser.

## Pengembangan

Butuh [Node.js](https://nodejs.org) 18+ untuk server lokal dan uji. Aplikasinya sendiri tidak butuh Node.js.

```bash
npm install          # sekali saja, memasang alat uji
npm start            # http://localhost:8000
npm test             # 72 uji di Chrome headless
npm run screenshots  # tangkapan layar semua halaman ke tests/output/
```

`index.html` juga bisa langsung dibuka dengan klik dua kali; hanya mode offline yang tidak aktif.

Setiap kali mengubah aplikasi:
1. Jalankan `npm test`.
2. Naikkan `VERSION` di `sw.js` (misalnya `v6` → `v7`) agar HP pengguna mengambil versi terbaru. File baru juga ditambahkan ke daftar `SHELL` di sana.
3. Catat perubahan di `CHANGELOG.md`.
4. Commit dan push ke `main`. GitHub Pages memperbarui situs dalam 1–2 menit, dan GitHub Actions menjalankan uji otomatis.

Penjelasan arsitektur, model data, dan cara mengubah isi program ada di [docs/DOKUMENTASI.md](docs/DOKUMENTASI.md).

## Catatan penting

Konten latihan dan gizi bersifat panduan umum, bukan pengganti saran dokter, ahli gizi, atau pelatih bersertifikat.

## Lisensi

[MIT](LICENSE) © 2026 Muarif Ardiansyah
