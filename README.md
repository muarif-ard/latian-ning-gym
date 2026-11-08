# Latian Ning Gym

Aplikasi web progresif (PWA) untuk program gym 3 bulan: jadwal latihan, pencatat beban dan repetisi, menu makan, larangan harian, progres berat badan, panduan coach, dan pengingat kalender. Bisa dipasang di layar utama HP dan tetap terbuka saat offline.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Seluruh aplikasi (tampilan dan logika) |
| `manifest.webmanifest` | Nama, warna, dan ikon saat dipasang di HP |
| `sw.js` | Service worker agar aplikasi bisa dibuka tanpa internet |
| `icons/` | Ikon aplikasi untuk Android dan iPhone |

## Cara 1: Upload lewat situs GitHub (tanpa coding)

1. Login ke github.com, klik **New repository**.
2. Beri nama `latian-ning-gym`, pilih **Public**, lalu **Create repository**.
3. Klik **uploading an existing file**, lalu seret semua isi folder ini (termasuk folder `icons`). Klik **Commit changes**.
4. Buka **Settings → Pages**. Di bagian **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
5. Tunggu 1–2 menit. Aplikasi bisa dibuka di `https://USERNAME-ANDA.github.io/latian-ning-gym/`

## Cara 2: Lewat Claude Code atau terminal

```bash
cd latian-ning-gym
git init
git add .
git commit -m "Latian Ning Gym PWA"
gh repo create latian-ning-gym --public --source=. --push
gh api -X POST repos/{owner}/latian-ning-gym/pages -f "source[branch]=main" -f "source[path]=/"
```

Di Claude Code, Anda juga cukup menulis: "Upload folder ini ke repo GitHub baru bernama latian-ning-gym dan aktifkan GitHub Pages."

## Memasang di HP

- **Android (Chrome):** buka link aplikasi, ketuk menu titik tiga, pilih **Instal aplikasi** atau **Tambahkan ke layar utama**.
- **iPhone (Safari):** buka link aplikasi, ketuk tombol **Bagikan**, pilih **Tambahkan ke Layar Utama**.

## Memindahkan data dari versi Claude

1. Di aplikasi versi Claude, buka **Program → Cadangan data → Ekspor data**.
2. Di versi GitHub, buka **Program → Cadangan data → Impor data**, lalu pilih file tadi.
3. Pilih **Gabungkan dengan data sekarang** (aman, tidak menghapus apa pun) atau **Ganti semua data sekarang**.

File cadangan ikut menyimpan foto progres.

Dokumentasi teknis untuk pengembang ada di [DOKUMENTASI.md](DOKUMENTASI.md).

## Catatan penting

- Data tersimpan di browser HP masing-masing, tidak di server. Lakukan **Ekspor data** secara rutin sebagai cadangan, terutama sebelum ganti HP atau menghapus data browser.
- Setiap kali mengubah `index.html`, naikkan angka `VERSION` di `sw.js` (misalnya `v1` menjadi `v2`) agar HP mengambil versi terbaru.
- Konten latihan dan gizi bersifat panduan umum, bukan pengganti saran dokter, ahli gizi, atau pelatih bersertifikat.
