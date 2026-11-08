# Riwayat Perubahan

Semua perubahan penting pada Latian Ning Gym. Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/); nomor versi utama sama dengan `VERSION` di `sw.js`.

## [7.0.0] — 8 November 2026

### Diperbaiki
- Manifest kini punya `id` tetap (`/latian-ning-gym/`) sesuai rekomendasi Chrome, agar Android mengenali aplikasi dengan identitas yang sama saat memasang dan memperbarui.

## [6.0.0] — 8 November 2026

### Diubah
- Struktur proyek mengikuti standar: `index.html` dipecah menjadi `css/style.css` dan 12 file JavaScript di `js/` (data, penyimpanan, perhitungan, tampilan, satu file per halaman). Tetap tanpa build dan tetap bisa dibuka langsung dari file.
- Dokumentasi teknis dipindah ke `docs/DOKUMENTASI.md`; riwayat versi dipindah ke file ini.
- Service worker menyimpan semua file baru untuk mode offline (`VERSION` → `v6`).

### Ditambah
- 72 uji otomatis di `tests/` (`npm test`), termasuk uji baru untuk daftar cache, buka dari file, dan mode offline. Jam uji dikunci agar hasilnya sama di semua komputer.
- GitHub Actions menjalankan uji di setiap push dan pull request.
- `package.json` (`npm start`, `npm test`, `npm run screenshots`), `LICENSE` (MIT), `.gitattributes`, `.editorconfig`.

## [5.0.0] — 8 November 2026

### Ditambah
- Warna pembeda di setiap kotak konten (garis kiri, titik judul, ikon) menurut jenis isi, berlaku di mode terang dan gelap.
- Kotak **Arti warna** di halaman Program.

## [4.0.0] — 8 November 2026

### Ditambah
- Kalender latihan bulanan dengan tanda hari terlewat, ringkasan sesi, dan kepatuhan.
- Grafik perkembangan per gerakan (beban terberat, perkiraan 1RM, beban bantuan pull-up, durasi plank).
- Edit sesi (angka, tanggal, jam, durasi, berat, kardio) dan catat latihan lampau dari kalender atau riwayat.

### Diubah
- Rekor pribadi dihitung ulang setiap kali data sesi berubah.
- Halaman detail berlabel "Detail latihan" saat dibuka dari riwayat atau kalender.
- Teks kartu foto disesuaikan: foto kini ikut ekspor.

## [3.0.0] — 8 November 2026

### Ditambah
- Profil mencakup usia dan jenis kelamin; target kalori dihitung pribadi; ajakan melengkapi profil.
- Ekspor menyertakan foto progres; impor bisa digabung atau mengganti; tanggal cadangan terakhir ditampilkan.
- Validasi dan migrasi data (`clean()`, `SCHEMA = 2`) untuk semua data masuk.
- Meminta penyimpanan permanen ke browser.

### Diubah
- Jadwal mingguan mengikuti hari pengingat.
- Semua `confirm()` diganti dialog sendiri yang berfungsi di WebView/iframe.

### Diperbaiki
- Halaman hasil dan gambar bagikan tidak lagi error karena id gerakan tak dikenal.
- Ukuran ikon tombol "Simpan gambar"; nilai air minum di luar batas dipotong ke 0–10; ikon maskable masuk cache offline; kode tak terpakai dibuang.

## [2.0.0]
- Versi awal yang didokumentasikan.
