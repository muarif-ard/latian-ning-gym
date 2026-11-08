# Dokumentasi Teknis — Latian Ning Gym

Dokumen ini menjelaskan cara kerja aplikasi untuk siapa pun yang ingin merawat atau mengubah kodenya. Panduan pemasangan ada di [README.md](../README.md), riwayat versi di [CHANGELOG.md](../CHANGELOG.md).

---

## 1. Ringkasan

**Latian Ning Gym** adalah Progressive Web App (PWA) berbahasa Indonesia untuk menjalankan **program gym 3 bulan (12 minggu, 48 sesi)** dengan tujuan menurunkan berat badan sekitar 0,5 kg/minggu sambil membangun otot.

| Aspek | Keterangan |
|---|---|
| Jenis | Single-page app tanpa framework dan **tanpa build step**: file di repo adalah file yang dijalankan browser |
| Bahasa kode | HTML + CSS + JavaScript murni (vanilla) |
| Penyimpanan | `localStorage` (data utama) dan `IndexedDB` (foto progres) |
| Offline | Ya, lewat service worker (`sw.js`) |
| Server/backend | Tidak ada. Hosting statis (GitHub Pages) sudah cukup |
| Dependensi eksternal | Hanya font Google **Figtree** (opsional, ada fallback font sistem) |
| Target layar | HP, mode potret, lebar maksimal konten 560 px |

---

## 2. Struktur folder

```
latian-ning-gym/
├── index.html               Kerangka halaman; memuat css/ dan js/
├── manifest.webmanifest     Metadata PWA (nama, warna, ikon, mode standalone)
├── sw.js                    Service worker: cache untuk mode offline
├── css/
│   └── style.css            Seluruh gaya tampilan dan warna pembeda
├── js/                      Dimuat berurutan seperti di bawah (lihat 5.1)
│   ├── util.js              $, esc, fmt, dk, dur, yt
│   ├── icons.js             Ikon SVG (I, svg) dan ilustrasi (fig, ill)
│   ├── data.js              Isi program: W, ORDER, PH, MENU, RULES, TIPS
│   ├── store.js             Data: DEF, clean, merge, persist, sinkron akun, foto, ekspor/impor
│   ├── logic.js             Perhitungan: fase, latihan berikutnya, rekor, volume, berat, kalori
│   ├── ui.js                Status tampilan, toast, dialog, render(), timer, .ics, gambar bagikan
│   ├── views/
│   │   ├── latihan.js       Halaman Latihan
│   │   ├── makan.js         Halaman Makan
│   │   ├── progres.js       Halaman Progres, kalender, grafik per gerakan, riwayat
│   │   ├── sesi.js          Detail sesi dan editor sesi
│   │   └── program.js       Halaman Program
│   └── app.js               Event handler dan start aplikasi (dimuat terakhir)
├── icons/                   Ikon 192, 512, maskable 512, apple-touch-icon
├── tests/                   Uji Chrome headless (npm test)
├── docs/DOKUMENTASI.md      Dokumen ini
├── .github/workflows/       Uji otomatis setiap push
├── README.md, CHANGELOG.md, LICENSE
├── package.json             Skrip npm dan dependensi uji (tidak dipakai aplikasi)
└── .gitignore, .gitattributes, .editorconfig
```

---

## 3. Fitur per halaman

Aplikasi punya 4 tab di navigasi bawah.

### 3.1 Latihan (`today`)
- **Banner pengingat**: muncul di hari yang dipilih sebagai hari gym; berubah jadi "Latihan hari ini beres" setelah sesi tersimpan.
- **Kartu hero**: nama latihan hari ini, fase program, progress bar minggu ke-x dari 12, tombol ganti antara 4 jenis latihan.
- **Kata Coach**: satu tips per hari (dirotasi dari 10 tips berdasarkan tanggal).
- **Timbang sebelum & sesudah latihan** (opsional) untuk melihat cairan yang hilang.
- **Checklist pemanasan** 8 menit.
- **Daftar gerakan**: tiap gerakan menampilkan otot target, set × repetisi, catatan sesi terakhir, tips teknik, link pencarian YouTube (Indonesia/Inggris), dan input beban (kg) + repetisi per set.
- **Saran progressive overload**: jika semua set sesi sebelumnya tembus batas atas repetisi, muncul saran naik beban 2,5–5 kg (atau kurangi beban bantuan 5 kg untuk pull-up).
- **Label PR** otomatis saat set yang dicentang melebihi rekor pribadi.
- **Penutup**: kardio sesuai fase, lalu peregangan 6 posisi dengan ilustrasi.
- **Timer istirahat** di bar bawah: mulai otomatis saat set dicentang, durasi mengikuti fase (90/75/60 detik), HP bergetar saat selesai.
- Tombol **Selesai** menyimpan sesi lalu menampilkan halaman hasil.

### 3.2 Makan (`food`)
- **Target kalori pribadi**: BMR Mifflin-St Jeor (berat terkini, tinggi, usia, jenis kelamin) × 1,55 − 500 kkal, dibulatkan ke 50, dengan batas bawah 1.500 (laki-laki) / 1.200 (perempuan). Jika profil belum lengkap, tampil angka umum ± 2.000 kkal dan tombol "Lengkapi profil".
- Protein = 1,8 g × berat badan terkini (dibulatkan ke 5 g).
- Di bawah contoh menu muncul saran tambah/kurangi porsi nasi (100 g ≈ 130 kkal) agar menu sesuai target pribadi.
- **Pelacak air minum** 10 gelas per hari.
- **6 larangan harian** yang dicentang: gorengan, minuman manis, makanan asin/mi instan, makan berat setelah jam 8 malam, tidur < 7 jam, rokok/alkohol.
- **Contoh menu 3 hari** dengan kalori dan protein per waktu makan (menu lokal: nasi, ikan, tempe, tahu, dsb.).
- **Prinsip piring**: ½ sayur/buah, ¼ protein, ¼ karbohidrat.

### 3.3 Progres (`prog`)
- **Berat badan**: berat terkini, BMI + kategori, grafik 12 minggu dengan garis target putus-putus, input berat + lingkar perut.
- **Grafik berat sebelum/sesudah latihan** (12 sesi terakhir) dan rata-rata cairan hilang.
- **Foto progres** (opsional): perbandingan "Sebelum" vs "Sekarang", disimpan di IndexedDB, diperkecil ke maks. 900 px JPEG.
- **Statistik**: sesi minggu ini (x/4), sesi program (x/48), total tonase, minggu beruntun.
- **Kalender latihan bulanan**: hari latihan diwarnai sesuai jenis (oranye = atas, abu = bawah), hari terjadwal yang terlewat diberi garis putus-putus merah, jadwal mendatang garis putus-putus abu, dan titik kecil untuk hari dengan lebih dari satu sesi. Di bawahnya ada ringkasan jumlah sesi, hari terlewat, dan kepatuhan (persentase hari terjadwal yang tidak terlewat). Bisa mundur ke bulan-bulan sebelumnya. Ketuk tanggal yang ada latihannya untuk membuka detail; ketuk hari kosong untuk mencatat latihan pada tanggal itu.
- **Grafik volume** 8 minggu terakhir.
- **Perkembangan per gerakan**: pilih gerakan, lalu tampil grafik 20 sesi terakhir:
  - gerakan berbeban: beban terberat per sesi + perkiraan 1RM (rumus Epley: beban × (1 + rep/30));
  - assisted pull-up: beban bantuan terkecil (makin turun makin kuat);
  - plank: durasi terlama.
  
  Disertai angka terbaru, perubahan sejak awal, nilai terbaik, dan 5 catatan terakhir.
- **Riwayat latihan** (kartu bergaya feed aplikasi olahraga) dengan tombol **+ Catat latihan lampau**.
- **Edit sesi**: dari halaman detail, semua angka, tanggal dan jam, durasi, berat sebelum/sesudah, dan kardio bisa diubah. Set bisa ditambah atau dihapus. Tanggal di masa depan ditolak.
- **Rekor pribadi** untuk semua 24 gerakan.
- **6 lencana pencapaian**: sesi pertama, 4 sesi seminggu, 20 sesi, turun 3 kg, 3 ton sekali latihan, 4 minggu beruntun.

### 3.4 Program (`plan`)
- Penjelasan 3 fase + tombol mulai/hentikan program.
- **Jadwal mingguan dinamis**: dibentuk dari hari yang dipilih di Pengingat. Hari latihan diisi bergiliran Atas A → Bawah A → Atas B → Bawah B; hari lain menjadi istirahat aktif, Minggu istirahat total. Ada catatan jika jumlah hari bukan 4.
- **Pengingat**: pilih hari dan jam, lalu ekspor ke file `.ics` (berulang 12 minggu, alarm 30 menit sebelumnya).
- **Profil & target**: tinggi, berat awal, target, jenis kelamin, usia (semua divalidasi). Setelah disimpan tampil ringkasan: perkiraan minggu ke target, BMI target, dan kkal per hari, plus peringatan jika target di bawah BMI 18,5 atau tidak lebih rendah dari berat awal. Selama profil belum diisi, halaman Latihan menampilkan ajakan "Lengkapi profil Anda".
- **Jadwal hari latihan**: timeline makan/minum/mandi dihitung relatif dari jam latihan.
- **Panduan Coach** (accordion): peregangan, pendinginan, kapan minum, kapan makan, kapan boleh mandi — masing-masing dengan ilustrasi SVG.
- **Cadangan data**: ekspor JSON (termasuk foto progres) dan impor dengan pilihan **Gabungkan** atau **Ganti semua** (yang kedua meminta konfirmasi lagi). Menampilkan tanggal cadangan terakhir dan menyarankan ekspor tiap 2 minggu.
- **Pesan dari Coach**: catatan keselamatan.

---

## 4. Isi program latihan

### 4.1 Fase (konstanta `PH`)

| Minggu | Fase | Set | Istirahat | Penutup kardio |
|---|---|---|---|---|
| 1–4 | Adaptasi | 3 | 90 dtk | 15 menit santai |
| 5–8 | Bentuk Otot | 4 | 75 dtk | 20 menit treadmill incline / sepeda |
| 9–12 | Definisi | 4 | 60 dtk | Interval 10 menit + 5 menit pendinginan |

Fase dihitung otomatis dari tanggal mulai program (`S.prog.start`), per minggu Senin–Minggu.

### 4.2 Split latihan (konstanta `W`, urutan `ORDER`)

| Hari | Kode | Latihan | Gerakan |
|---|---|---|---|
| Senin | `UA` | Atas A | Bench press, lat pulldown, incline DB press, seated cable row, lateral raise, triceps pushdown |
| Selasa | `LA` | Bawah A | Squat/leg press, Romanian deadlift, leg press, leg curl, calf raise, plank |
| Rabu | – | Gowes/jalan santai 30–45 menit | – |
| Kamis | `UB` | Atas B | DB shoulder press, assisted pull-up, chest press, one-arm DB row, face pull, curl |
| Jumat | `LB` | Bawah B | Deadlift, Bulgarian split squat, hip thrust, leg extension, cable crunch, farmer walk |
| Sabtu | – | Gowes jauh (opsional) | – |
| Minggu | – | Istirahat total | – |

Aplikasi tidak terikat hari: latihan berikutnya yang disarankan selalu urutan setelah sesi terakhir (`nextW()`), jadi hari yang terlewat tidak merusak rotasi.

Format satu gerakan:

```js
{ k:"bench",           // id unik, dipakai sebagai kunci data
  n:"Barbell bench press",
  r:"8–12",            // teks rentang repetisi
  lo:8, hi:12,         // batas bawah/atas (untuk placeholder & saran naik beban)
  w:true,              // pakai beban (kg)?
  u:"rep",             // satuan: "rep" atau "detik"
  m:"chest",           // otot: legs|chest|back|shoulder|arms|core
  tip:"..." }
```

---

## 5. Arsitektur kode

### 5.1 Cara file JavaScript dimuat
File di `js/` adalah **script biasa, bukan ES module**. Semuanya dimuat berurutan oleh `index.html` dan berbagi satu lingkup global, sehingga fungsi dan variabel di satu file bisa langsung dipakai file lain tanpa `import`. Pilihan ini disengaja:
- tetap tanpa build dan tanpa bundler;
- `index.html` masih bisa dibuka langsung dari file (`file://`), yang tidak mungkin dengan ES module;
- uji bisa membaca state aplikasi (`S`, `view`, dst.) langsung.

Aturannya:
1. **Urutan di `index.html` penting.** Kode yang dijalankan saat file dimuat (bukan di dalam fungsi) hanya boleh memakai sesuatu dari file sebelumnya. Contoh: `store.js` memanggil `clean()` saat dimuat, yang butuh `W` dan `RULES` dari `data.js`. Pemanggilan di dalam fungsi bebas urutan, karena baru berjalan setelah semua file dimuat.
2. **Nama harus unik di semua file.** Dua `const` atau `let` dengan nama sama di file berbeda akan error.
3. **File baru** harus ditambahkan di dua tempat: tag `<script>` di `index.html` dan daftar `SHELL` di `sw.js`. Uji `tests/offline.test.js` gagal jika salah satunya terlewat.

### 5.2 Alur render
Aplikasi memakai pola **state → string HTML → `innerHTML`**:

1. Semua data ada di satu objek global `S`.
2. `render()` memilih fungsi tampilan sesuai `tab`/`view` (`todayHTML`, `foodHTML`, `progHTML`, `planHTML`, `histHTML`, `resultHTML`) yang mengembalikan string HTML.
3. Interaksi ditangkap dengan **event delegation** pada `#view` (`click`, `change`, `input`) berdasarkan atribut `data-*` (mis. `data-k`, `data-rule`, `data-air`).
4. Setelah state diubah → `persist()` → `render()` lagi.

### 5.3 Peta fungsi penting

| Kelompok | Fungsi | File | Kegunaan |
|---|---|---|---|
| Utilitas | `$`, `esc`, `fmt`, `dk`, `dur`, `yt` | `util.js` | Ambil elemen, escape HTML, format angka id-ID, kunci tanggal `YYYY-MM-DD`, format durasi, link pencarian YouTube |
| Ilustrasi | `I`, `svg()`, `FG`, `fig()`, `ill()` | `icons.js` | Ikon dan ilustrasi SVG inline |
| Data | `DEF`, `clean`, `merge` | `store.js` | Data awal; validasi + migrasi semua data masuk; penggabungan impor |
| Simpan | `persist`, `pushRemote` | `store.js` | Tulis ke localStorage; sinkron ke akun jika berjalan di Claude |
| Foto | `idb`, `loadPhotos`, `addPhoto`, `delPhoto`, `putPhotos` | `store.js` | CRUD foto di IndexedDB `latian-gym-foto` |
| Cadangan | `exportData`, `importData` | `store.js` | Ekspor JSON + foto; impor dengan pilihan gabung/ganti |
| Program | `weekStart`, `prog()`, `phIdx()`, `nextW()`, `phAt()` | `logic.js` | Awal minggu (Senin), minggu & fase, latihan berikutnya, fase pada tanggal tertentu |
| Latihan | `newDraft`, `lastFor`, `best`, `isPR`, `vol` | `logic.js` | Draft sesi baru, catatan terakhir, rekor, cek PR, volume (kg × rep) |
| Tubuh | `curW`, `bmi`, `protein`, `kcal`, `weekStreak` | `logic.js` | Berat terkini, BMI, target protein & kalori, minggu beruntun ≥ 4 sesi |
| Konsistensi | `sortS`, `recalcPRs`, `locDT` | `logic.js` | Urutkan sesi terbaru dulu, hitung ulang rekor, format `datetime-local` |
| Tampilan | `render`, `renderTabs`, `remBanner`, `coachTip`, `heroArt` | `ui.js` | Menggambar ulang halaman sesuai `tab`/`view` |
| Dialog | `toast`, `ask`, `yes` | `ui.js` | Notifikasi dan dialog konfirmasi sendiri (pengganti `confirm()` yang diblokir di sebagian WebView/iframe) |
| Timer | `startTimer`, `stopTimer`, `showT` | `ui.js` | Timer istirahat dengan cincin progres SVG |
| Ekspor | `saveICS`, `shareImage` | `ui.js` | File kalender `.ics`, gambar hasil latihan 1080×1350 PNG |
| Halaman | `todayHTML`, `foodHTML`, `progHTML`, `planHTML` | `views/*.js` | Isi tiap tab |
| Grafik | `weightChart`, `prepostHTML`, `calHTML`, `exProgHTML` | `views/progres.js` | Grafik SVG buatan sendiri, kalender, grafik per gerakan |
| Sesi | `resultHTML`, `edNew`, `edOpen`, `editHTML`, `edSave` | `views/sesi.js` | Detail sesi, catat latihan lampau, edit sesi |

### 5.4 Logika khusus yang perlu diketahui
- **Rekor pribadi**: untuk gerakan berbeban = beban tertinggi; untuk `pullup` dan gerakan tanpa beban/detik = repetisi/detik tertinggi (pull-up pakai beban *bantuan*, jadi beban lebih kecil = lebih berat). PR baru dihitung hanya jika gerakan itu sudah pernah tercatat.
- **Volume** hanya menghitung gerakan berbeban bersatuan repetisi, tanpa `pullup`.
- **Durasi sesi** = sejak set/pemanasan pertama dicentang + 90 detik, maksimal 4 jam.
- **Draft otomatis dibuat ulang** jika fase berganti dan belum ada set yang dicentang (jumlah set menyesuaikan fase baru).
- **Minggu beruntun**: minggu berjalan yang belum mencapai 4 sesi tidak memutus streak.
- **Mengganti jenis latihan** saat draft sudah terisi meminta konfirmasi karena isian akan hilang.
- **Semua data masuk lewat `clean()`**: sesi dengan jenis latihan/tanggal tidak valid dibuang, gerakan dengan id tak dikenal dihapus dari sesi, angka di luar rentang wajar diabaikan, sesi dengan id ganda disatukan. Karena itu tampilan tidak bisa error akibat data rusak.
- **Gabung impor**: sesi ditambahkan berdasarkan `id` (tidak ada duplikat), berat per tanggal yang belum ada ditambahkan, data makan per hari disatukan (air diambil yang terbesar, larangan digabung), program dan profil dari file dipakai hanya jika di perangkat belum ada. Foto ditambahkan berdasarkan `id`.
- **Ganti impor**: seluruh data diganti. Foto diganti hanya jika file berisi foto; file lama tanpa foto tidak menghapus foto di perangkat.
- **`S.sessions` selalu diurutkan dari yang terbaru** (`sortS()`), karena `lastFor()`, `nextW()`, dan riwayat bergantung pada urutan itu. Setelah sesi diedit, ditambah dari tanggal lampau, dihapus, atau diimpor, **rekor pribadi seluruh sesi dihitung ulang** secara kronologis (`recalcPRs()`) dengan aturan yang sama seperti saat menyimpan latihan.
- **Hari terlewat** di kalender: hari yang terjadwal di Pengingat, sudah lewat, tanpa sesi, dan berada pada atau sesudah tanggal mulai program (atau tanggal latihan pertama jika program belum dimulai). Perhitungannya memakai jadwal Pengingat yang berlaku sekarang, jadi kalau hari pengingat diganti, tanda terlewat di bulan-bulan lalu ikut berubah.
- Sesi lampau yang baru dicatat mendapat fase sesuai tanggalnya (`phAt`); sesi yang diedit mempertahankan fasenya.
- Aplikasi meminta `navigator.storage.persist()` agar browser tidak menghapus data saat memori HP menipis.

---

## 6. Model data

Disimpan di `localStorage` dengan kunci **`latian-ning-gym-v1`** sebagai JSON:

```js
S = {
  schema: 2,             // versi struktur data
  sessions: [            // terbaru di depan (unshift)
    { id:"1731050000000", date:"2026-11-08T09:30:00.000Z",
      w:"UA",                          // jenis latihan
      ex:{ bench:[{v:40,r:10}, ...] }, // v = kg ("" jika tanpa beban), r = rep/detik
      dur:3600,                        // detik
      prs:[{n:"Barbell bench press", t:"42,5 kg"}],
      ph:0, fin:true,                  // fase, kardio selesai
      pre:74.2, post:73.6 }            // berat sebelum/sesudah (opsional)
  ],
  draft: { w, sets:{k:[{v,r,done}]}, start, ph, warm, fin, cool, pre, post } | null,
  prog: { start:"ISO date" } | null,
  rem: { days:[1,2,4,5], time:"16:30" },     // 0 = Minggu
  weights: [{ d:"2026-11-08", kg:73.8, waist:88 }],
  food: { "2026-11-08": { air:6, ok:["gorengan","manis"] } },
  prof: { h:168, w0:74, target:68, sex:"m"|"f"|"", age:30|"", set:true }, // set=false: masih angka contoh
  updated: 1731050000000,                    // timestamp untuk sinkronisasi
  lastBackup: 1731050000000                  // waktu ekspor terakhir (0 = belum pernah)
}
```

Foto tidak ada di objek ini; foto disimpan terpisah di IndexedDB (`latian-gym-foto`, store `p`, `{id, date, src: dataURL}`).

File ekspor berisi objek `S` ditambah `app: "latian-ning-gym"`, `exported` (tanggal ISO), dan `photos` (array foto). File ekspor versi lama (tanpa `schema`/`photos`) tetap bisa diimpor; data lama otomatis dimigrasi oleh `clean()`, dan profil lama ditandai belum lengkap agar pengguna melengkapi usia dan jenis kelamin.

---

## 7. Dua mode berjalan

Kode mendeteksi lingkungan lewat `window.claude`:

| | GitHub Pages / browser biasa | Di dalam Claude (Artifact) |
|---|---|---|
| Penyimpanan | localStorage + IndexedDB | Sama, plus sinkron ke database akun (`window.claude.use("db")`, dokumen `data/users/<id>/gym`) |
| Unduh file (ekspor, .ics, gambar) | Lewat link `<a download>` buatan sendiri | Lewat kapabilitas `downloads` dari Claude |
| Service worker | Aktif (hanya di `http/https`) | Tidak relevan |
| Konflik data | – | Data yang `updated`-nya lebih baru yang dipakai |

Inilah alasan README menyebut "memindahkan data dari versi Claude" lewat ekspor/impor.

---

## 8. Service worker (`sw.js`)

- Cache bernama `latian-gym-<VERSION>`; saat install menyimpan semua file di daftar `SHELL` (HTML, CSS, semua JS, manifest, ikon).
- **Halaman (navigasi)**: *network-first* — ambil versi terbaru, jatuh ke cache saat offline.
- **Aset & Google Fonts**: *cache-first* sambil memperbarui cache di belakang (stale-while-revalidate).
- Saat aktivasi, cache versi lama dihapus.
- **Wajib**: setiap mengubah file apa pun di aplikasi (HTML, CSS, JS), naikkan `VERSION` agar HP pengguna mengambil versi terbaru. File baru juga harus ditambahkan ke `SHELL`.

---

## 9. Tampilan & tema

- Semua gaya ada di `css/style.css`. Warna didefinisikan sebagai CSS variable di `:root`. Ada dua lapis: tema dasar di bagian atas, lalu **"Tampilan segar ala aplikasi olahraga"** di bawahnya yang menimpa tema dasar dan menjadi tampilan aktif: aksen oranye `#FC5200`, abu gelap `#2D3142`, font Figtree. Sebagian aturan di tema dasar sudah tidak berpengaruh karena tertimpa; menggabungkan kedua lapis adalah pekerjaan perapian berikutnya (lihat bagian 12).
- **Warna pembeda konten**: setiap kotak diberi kelas `kc` + satu kelas warna, yang menampilkan garis warna di sisi kiri, titik warna di judul, dan ikon berwarna sama. Artinya konsisten di semua halaman dan dijelaskan di kotak **Arti warna** pada halaman Program:

  | Kelas | Warna | Isi |
  |---|---|---|
  | `k-or` | Oranye | Latihan (gerakan, kardio penutup, volume, per gerakan, riwayat) |
  | `k-bl` | Biru | Berat badan dan air minum |
  | `k-gr` | Hijau | Makan dan gizi |
  | `k-rd` | Merah | Larangan dan keselamatan |
  | `k-pu` | Ungu | Jadwal, kalender, pengingat, program |
  | `k-ye` | Kuning | Rekor dan pencapaian |
  | `k-te` | Toska | Pemanasan, pendinginan, kata coach, panduan |
  | `k-pk` | Merah muda | Profil dan foto |
  | `k-gy` | Abu | Data dan pengaturan |

  Token warnanya (`--kc-*`) punya versi terang dan gelap. Kotak baru cukup diberi `class="card kc k-xx"`.
- Mode gelap otomatis mengikuti sistem (`prefers-color-scheme`), atau dipaksa dengan atribut `data-theme="dark"|"light"` di `<html>`.
- Mendukung safe-area iPhone (notch), `prefers-reduced-motion`, label `aria-*` pada tombol dan input.

---

## 10. Cara mengubah hal yang umum

| Ingin mengubah | Lokasi |
|---|---|
| Gerakan latihan | `W` di `js/data.js` |
| Jumlah set / istirahat / kardio per fase | `PH` di `js/data.js` |
| Contoh menu makan | `MENU` di `js/data.js` (`[waktu, isi, kkal, protein]`) |
| Larangan harian | `RULES` di `js/data.js` |
| Tips coach harian | `TIPS` di `js/data.js` |
| Profil contoh / data awal | `DEF()` di `js/store.js` |
| Aturan validasi data | `clean()` di `js/store.js` |
| Rumus target kalori | `kcal()` di `js/logic.js` |
| Lencana | array `B` di `progHTML()`, `js/views/progres.js` |
| Teks hari istirahat di jadwal mingguan | `planHTML()` (variabel `rows`), `js/views/program.js` |
| Warna, jarak, font | `css/style.css` |

Setelah mengubah: jalankan `npm test`, naikkan `VERSION` di `sw.js`, catat di `CHANGELOG.md`, lalu commit dan push.

**Jangan mengganti** nilai `k` gerakan yang sudah dipakai atau kunci `KEY`. Data lama merujuk ke kunci tersebut, dan `clean()` akan membuang gerakan yang id-nya tidak lagi dikenal. Jika struktur `S` diubah, naikkan `SCHEMA` dan tambahkan migrasinya di `clean()`.

---

## 11. Menjalankan secara lokal

Cara tercepat: klik dua kali `index.html`. Aplikasi berjalan penuh, hanya service worker (mode offline) yang tidak aktif.

Untuk menguji mode offline, jalankan server lokal (butuh Node.js 18+):

```bash
npm start            # http://localhost:8000
```

Atau tanpa Node.js: `python -m http.server 8000`.

---

## 12. Batasan & catatan perawatan

- Data hanya ada di perangkat (kecuali versi Claude). Hapus data browser = data hilang; aplikasi mengingatkan bila cadangan terakhir lebih dari 2 minggu lalu.
- File ekspor yang berisi banyak foto bisa berukuran beberapa MB (tiap foto ±100–200 KB).
- Rumus kalori adalah perkiraan populasi umum; angka sebenarnya bisa berbeda ±10–20%. Pantau tren berat 2 minggu dan sesuaikan porsi.
- Konten latihan dan gizi adalah panduan umum, bukan pengganti dokter, ahli gizi, atau pelatih bersertifikat.
- **Perapian berikutnya**: `css/style.css` masih berisi tema dasar lama yang sebagian besar tertimpa tema baru. Menggabungkannya akan memperkecil CSS sekitar sepertiga; lakukan bersama `npm run screenshots` untuk membandingkan tampilan sebelum dan sesudah.

---

## 13. Pengujian

Uji berjalan di Chrome headless lewat `puppeteer-core` (hanya dipakai untuk uji, tidak ikut ke aplikasi).

```bash
npm install          # sekali saja
npm test             # menjalankan semua tests/*.test.js
npm run screenshots  # tangkapan layar 4 halaman, terang & gelap, ke tests/output/
```

- Chrome atau Edge yang terpasang dipakai otomatis; atur `CHROME_PATH` jika lokasinya berbeda.
- Jam di halaman uji dikunci ke **8 November 2026 12.00 WIB** dan zona waktunya Asia/Jakarta, sehingga hasil uji kalender sama di komputer mana pun.
- GitHub Actions (`.github/workflows/test.yml`) menjalankan `npm test` di setiap push dan pull request. Jika gagal, tangkapan layar diunggah sebagai artefak.

| File | Isi |
|---|---|
| `tests/dasar.test.js` | 30 uji: profil, validasi data rusak, jadwal, kalori, ekspor/impor, dialog, alur latihan |
| `tests/fitur.test.js` | 35 uji: kalender, grafik per gerakan, catat latihan lampau, edit sesi, rekor |
| `tests/offline.test.js` | 7 uji: daftar cache service worker lengkap, buka dari file, berjalan tanpa internet |
| `tests/helpers.js` | Server lokal, pencarian Chrome, jam tetap |

Rincian skenario:

1. Pengguna baru: ajakan isi profil dan angka kalori umum tampil.
2. Data lama/rusak di localStorage: sesi tak valid, gerakan tak dikenal, berat, makan, dan hari pengingat tak valid dibersihkan; halaman hasil tetap terbuka.
3. Jadwal mingguan mengikuti hari pengingat, termasuk saat hari ditambah.
4. Validasi profil dan perhitungan kalori (contoh: laki-laki 30 th, 170 cm, 74 kg → kebutuhan 2.550, target 2.050 kkal).
5. Ekspor berisi foto dan `schema`, tanggal cadangan tercatat.
6. Impor gabung (tanpa duplikat jika diulang), impor ganti (dengan konfirmasi kedua), batal, dan file rusak.
7. Dialog hapus sesi: Escape membatalkan, tombol Hapus menghapus.
8. Alur latihan: isi set → centang → Selesai → sesi tersimpan.
9. Tidak ada error JavaScript sepanjang skenario, di mode terang maupun gelap.

10. Kalender: warna per jenis latihan, hari terlewat, hari sebelum program tidak ditandai, hari ini, jadwal mendatang, ringkasan dan kepatuhan, navigasi bulan.
11. Ketuk tanggal membuka detail; ketuk hari terlewat membuka editor dengan tanggal itu dan jam pengingat.
12. Grafik per gerakan: angka terbaru, kenaikan, terbaik, garis 1RM, dan metrik durasi untuk plank.
13. Catat latihan lampau: validasi repetisi kosong, sesi masuk di urutan yang benar, kalender ikut diperbarui.
14. Edit sesi: isi awal benar, tambah/hapus set, rekor dihitung ulang, tanggal masa depan ditolak, Batal tidak mengubah data, mengganti tanggal mengurutkan ulang sesi dan rekor.
15. Hapus sesi menjaga rekor tetap konsisten; data bertahan setelah aplikasi dibuka ulang.

Uji manual singkat setelah mengubah kode: buka aplikasi, isi profil, catat satu set dan simpan, ekspor, lalu impor file itu dengan pilihan Gabungkan.
