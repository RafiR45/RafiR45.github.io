# Preview 5 — Maximalist Playful (Muhammad Rafi)

Website jasa pembuatan website untuk **UMKM Indonesia**: satu landing page plus
tiga halaman kategori karya. Statis penuh, tidak ada framework, build step,
maupun server. Semua halaman memakai **satu `style.css` dan satu `main.js`** yang
sama, jadi setelah halaman pertama dibuka keduanya sudah ada di cache dan halaman
berikutnya ringan. Bisa langsung ditaruh di GitHub Pages atau hosting statis.

Buka lewat `http://localhost/my-module/portfolio/preview-5-playful/`.
Dibuka lewat `file://` juga jalan, hanya saja font-nya gagal dimuat kalau offline.

## Berkas

| Berkas | Isi |
|---|---|
| `index.html` | Landing page. |
| `company-profile.html` | Halaman kategori. Isinya cuma judul, deskripsi, dan wadah kosong. |
| `event-organizer.html` | Sama, kategori Event Organizer. |
| `web-app.html` | Sama, kategori Web app. |
| `style.css` | **Dipakai semua halaman.** Seluruh gaya, termasuk halaman kategori. |
| `main.js` | **Dipakai semua halaman.** Terjemahan EN, data proyek, drawer, reveal. |
| `README.md` | Berkas ini. |

`<head>` tiap halaman boleh berbeda — judul dan deskripsinya memang beda — tapi
`style.css` dan `main.js` yang dimuat selalu sama. Markup yang identik di semua
halaman (panel detail proyek) **tidak** disalin ke tiap file: `main.js` yang
membuatnya, karena tanpa JavaScript panel itu memang tidak berfungsi.

Ikon semuanya inline SVG (tidak ada file ikon), dan gambar hero adalah SVG
gambar tangan yang ditulis langsung di markup.

## Urutan halaman

Urutannya dipilih untuk pengunjung UMKM yang sering **belum yakin butuh
website**, jadi manfaatnya dijelaskan lebih dulu. **Kenalan** sempat diletakkan
di bawah dekat kontak (2026-09-22), lalu dipindah pemiliknya ke bawah nama di
hero pada 2026-10-02 — perkenalan dulu, baru alasannya. Navigasi mengikuti
urutan ini, di landing page maupun di ketiga halaman kategori.

1. **Hero** — nama, satu kalimat penjelas, dua tombol, dan baris "pernah bantu…".
2. **Kenalan dulu, yuk** (`#about`) — perkenalan singkat, blok tinta tepat di
   bawah nama.
3. **Untung punya website!** (`#benefits`) — empat kartu warna solid ala stiker
   (buka 24 jam, gampang ditemukan, lebih terpercaya, pesanan lebih rapi).
   Sengaja tanpa statistik.
4. **Yang bisa saya bantu** (`#services`) — satu panel penawaran berisi tiga
   layanan (website usaha, katalog + pesan WhatsApp, aplikasi kasir & stok),
   masing-masing dengan poin "Yang Anda dapat", estimasi waktu, dan tautan
   WhatsApp khusus layanan itu. Ditutup strip janji: dibantu sampai online,
   bisa diubah sendiri, garansi perbaikan 30 hari.
5. **Berapa biayanya?** (`#pricing`) — daftar harga, lihat tabel di bawah.
6. **Show-off project** (`#showcase`) — tiga kategori beserta jumlah proyeknya:
   Company profile, Event Organizer, dan Web app. Masing-masing membuka halaman
   sendiri. Lihat bagian di bawah.
7. **Yuk, ngobrol** (`#contact`) — WhatsApp lebih dulu, lalu email, GitHub,
   LinkedIn.

## Harga

| Paket | Harga | Batas |
|---|---|---|
| Landing page | Rp 150.000 | 1 halaman |
| Company profile | Rp 250.000 | Maks 5 halaman, tanpa halaman admin |
| Company profile + blog | Rp 500.000 | Halaman bebas + admin untuk artikel |
| Aplikasi web custom | Mulai Rp 5 juta | Harga akhir tergantung fitur |
| Maintenance | Rp 125.000 / bulan | Update, backup, perbaikan kecil |

Ketiga paket website sudah termasuk **domain .my.id dan hosting untuk bulan
pertama**; tiap kartu menuliskannya sebagai dua poin, lalu satu baris kecil
("Nama domain lain kena biaya tambahan") di atas tombolnya. Baris penutup
section mengatakan hal yang sama, jadi kalau salah satunya berubah, ubah
keduanya — sebelumnya baris itu masih berbunyi "belum termasuk domain dan
hosting" dan bertentangan dengan kartunya.
Tiap tombol membuka WhatsApp dengan pesan yang sudah menyebut nama paketnya.

## Fitur

- **Dua bahasa, default Indonesia.** Teks Indonesia ada di HTML.
  `captureIndonesian()` membacanya kembali dari setiap `[data-i18n]` /
  `[data-i18n-aria]` (termasuk `<title>` dan meta description), sehingga di
  `main.js` hanya ada kamus Inggris (`EN`). Pilihan bahasa disimpan di
  localStorage `rafi-lang`, `<html lang>` ikut berubah, dan tombol
  `[data-lang]` memakai `aria-pressed`.
- **Pesan WhatsApp ikut diterjemahkan.** Tautan `a[data-i18n-wa="kunci"]`
  menyimpan pesan Indonesia di `data-wa-text` dan punya `href` statis yang sudah
  ter-encode, jadi tetap jalan tanpa JavaScript. Saat bahasa berganti, `href`
  disusun ulang dari `WA_BASE + encodeURIComponent(...)`.
- **Drawer detail proyek.** `<dialog>` asli yang dibuka dengan `showModal()`,
  jadi fokus terkunci, Esc bekerja, dan halaman di belakangnya non-aktif.
  Markup-nya dibuat oleh `main.js` (`buildDrawer()`), bukan disalin ke tiap file
  HTML, dan isinya diambil dari kategori yang sedang dibuka memakai
  `createElement`/`textContent`. Ada tombol sebelumnya/berikutnya (memutar) plus
  tombol panah kiri/kanan.
- **Halaman kategori** adalah file HTML tersendiri: `company-profile.html`,
  `event-organizer.html`, `web-app.html`. Isi filenya sengaja tipis — header,
  tombol Kembali, judul, deskripsi, dan `<ul id="categoryGrid">` yang kosong.
  `main.js` membaca `data-category` di `<body>`, lalu mengisi jumlah proyek dan
  kartunya dari `SHOWCASE`. Klik kartunya membuka drawer yang sama, dengan
  screenshot website aslinya (`image`) di bagian atas — atau, untuk proyek
  `confidential`, blok "Sistem internal" sebagai gantinya.
- **Muncul saat digulir.** Hanya elemen yang posisinya di bawah lipatan yang
  disembunyikan, jadi tidak ada kedipan. Tanpa JavaScript atau dengan
  `prefers-reduced-motion`, semuanya tampil langsung.

## Desain

- Warna: coral `#ff6f59`, butter `#ffcf4a`, teal `#2bb3a3` di atas kertas
  `#fff8ec`, dijangkar tinta `#231f2e`. **Teks di atas warna aksen selalu tinta,
  tidak pernah putih.**
- Huruf: **Unbounded** untuk judul dan tombol, **DM Sans** untuk teks.
- Bentuk: garis tinta 3px, sudut membulat, dan bayangan keras tanpa blur
  (`box-shadow: 8px 8px 0`). Tombol "bisa ditekan": bayangan 5px yang mengecil
  saat `:active`.
- Semua gerakan dimatikan di bawah `prefers-reduced-motion`.

## Isi proyek

Data proyek ada di array `SHOWCASE` (`main.js`), dikelompokkan per kategori.
Isi per 2026-10-02: 12 company profile, 11 event organizer, dan 9 web app.
Jumlah di kartu kategori dihitung otomatis dari panjang array, jadi menambah
entri sudah cukup.

- **Company profile dan Event organizer** diurutkan **menurut abjad**, dan
  ringkasannya diambil dari website kliennya masing-masing.
- **Web app** mengikuti **urutan yang diberikan pemiliknya**, bukan abjad.
  Kesembilannya sistem internal klien, jadi tiap entri memakai
  `confidential: true` dengan `image: ''`, `live: null`, dan `code: null`:
  tidak ada screenshot dan tidak ada demo publik. Di tempat screenshot, panel
  detailnya menampilkan blok tinta "Sistem internal" beserta alasannya, dan
  halaman kategorinya menyebutkan hal itu sekali di atas (`.category-note`,
  kunci `webapp.note`). Yang diceritakan hanya apa yang dikerjakan sistemnya:
  `summary`, `solution`, dan `features` — tanpa angka hasil, karena tidak ada
  yang bisa diverifikasi.

**Tim yang mengerjakan** (field `team`) sama untuk semua proyek, dan sejak
2026-10-02 berisi orang sungguhan: M. Rafi Rifki Aldi (Frontend Web Developer),
Fandi Febrianto (Backend Web Developer), Mustaqim Afif (QC/QA/Pentester), dan
Yupi Sugianto (Technical Director). Nama dan sebutan posisinya sama persis di
`id` maupun `en`.

**UI/UX Designer** ditulis per proyek, karena studionya berbeda-beda, dan
diletakkan **paling atas** (desain lebih dulu, baru dibangun):

| Proyek | UI/UX Designer |
|---|---|
| Dandelion | Dandelion Team |
| Genco Energi Nusantara, GPIB Immanuel Jakarta, Kailimang + Ponto, Suka Studio | Suka Studio Team |
| HighScope Indonesia, Redea Institute | Vasco Journal Team |
| KRATON by Auguste Soesastro | Otro Design |

Proyek lain belum punya baris ini, dan daftarnya tetap berisi empat developer.

Nama dan deskripsi kategorinya sendiri bukan data — ada di HTML
(`showcase.1.name`, `showcase.1.blurb`, dst) dengan terjemahan EN di `main.js`.

## Yang perlu diganti sebelum dipakai

- **Nomor WhatsApp** `6281200000000` — ada di `WA_BASE` (`main.js`) **dan** di
  setiap `href` statis pada `index.html`. Dua-duanya harus diubah.
- `hello@muhammadrafi.dev`, `github.com/muhammadrafi`,
  `linkedin.com/in/muhammadrafi` — ketiganya masih **placeholder**, hanya
  namanya yang disamakan saat nama situs diganti (2026-10-02).

**Nama** dipakai dalam tiga bentuk, sengaja: **Muhammad Rafi** untuk identitas
situs (hero, logo, judul tab, footer), **Rafi** untuk sapaan (paragraf Kenalan
dan semua pesan WhatsApp yang dikirim pengunjung), dan **M. Rafi Rifki Aldi**
untuk bentuk lengkapnya — disebut sekali di paragraf Kenalan, dan di daftar
`team` tiap proyek. Ukuran nama di hero
(`.hero h1`, `clamp(2.8rem, 6.4vw, 6rem)`) dipilih mengikuti baris terpanjang
"Muhammad"; dengan ukuran lama namanya menabrak gambar di sebelahnya.
- Baris "pernah bantu…" di hero.
- **Screenshot** ada di `img/company-profile/` dan `img/event-organizer/`, satu
  file per website, dan path-nya ditulis di field `image`. Gambarnya ditampilkan
  **utuh** (tidak dipotong): tinggi slotnya mengikuti rasio gambar, dengan batas
  `max-height: 70vh` untuk tangkapan layar yang memanjang ke bawah. Kalau `image` kosong
  atau path-nya salah, panel menampilkan kotak putus-putus "Screenshot belum
  ada" — bukan gambar rusak. Itu beda dengan `confidential: true`, yang memang
  **tidak akan pernah** punya screenshot dan tampil sebagai blok tinta.
  Satu file punya spasi di namanya
  (`gereja immanuel jakarta.jpg`), jadi path-nya ditulis dengan `%20`.
- **Cerita tiap proyek**: untuk company profile dan event organizer, `problem`,
  `solution`, `features`, dan `result` masih kosong, begitu juga `year`,
  `duration`, dan `tags`; yang sudah terisi hanya nama, bidang usaha
  (`client`), ringkasan, screenshot, dan tautan websitenya. Entri web app sudah
  punya `solution` dan `features`, tetapi `problem` dan `result` sengaja
  dikosongkan — keduanya butuh angka atau klaim yang hanya pemiliknya yang bisa
  memastikan. Panel detail melewati bagian yang kosong, jadi isi saja yang sudah
  siap.
- **UI/UX Designer untuk proyek selain yang delapan di atas** — tambahkan satu
  baris `{ name, role: 'UI/UX Designer' }` paling atas pada `team`, di `id`
  **dan** `en`. Daftar kosong berarti bagian "Tim yang mengerjakan" tidak muncul
  sama sekali.
- **Teknologi tiap web app** (`tags`) masih kosong — kalau diisi (mis. PHP,
  MySQL), panel detailnya langsung menampilkan bagian "Teknologi".
- Estimasi durasi tiap layanan dan garansi 30 hari di section Layanan.

## Kalau mau mengedit

- **Tidak ada JavaScript inline**, termasuk `onclick` dan `style=""`. Semua
  perilaku diikat dengan `addEventListener` di `main.js`, supaya CSP bisa
  membuang `'unsafe-inline'`.
- **Tautan ke luar selalu `target="_blank"` + `rel="noopener noreferrer"`**
  (WhatsApp, GitHub, LinkedIn, dan tombol Lihat website di panel detail), supaya
  halaman ini tidak ikut berpindah. Tautan di dalam situs sendiri tidak.
- Teks baru harus punya `data-i18n` **dan** terjemahan EN di `main.js`, kalau
  tidak teks itu akan bertahan berbahasa Indonesia saat pengguna memilih EN.
- **Satu CSS dan satu JS untuk semua halaman.** Jangan menyalin gaya atau skrip
  ke halaman kategori; tambahkan saja ke `style.css`/`main.js`. Kalau sebuah
  halaman butuh sesuatu yang khusus, bedakan lewat `data-page`/`data-category`
  di `<body>`, bukan dengan file baru.
- Markup yang sama persis di tiap halaman sebaiknya dibuat oleh `main.js`
  (seperti drawer), supaya tidak ada tiga salinan yang harus diubah bersamaan.
- Teks yang ditulis oleh JavaScript tidak boleh memakai `t()`: `t()` membaca
  bahasa Indonesia dari DOM halaman yang sedang dibuka, jadi kalau teksnya tidak
  ada di HTML hasilnya kosong. Pakai `ui()` (kamus ID+EN di `main.js`).
- Section yang sekaligus `.wrap` harus memakai `padding-block`, bukan singkatan
  `padding: X 0` — singkatan itu menghapus jarak kiri-kanan.
- Kartu yang punya `transition` sendiri menimpa transisi reveal. Kalau menambah
  kartu baru, sebutkan `opacity` di transisinya, lalu kecualikan kelasnya pada
  aturan `[data-reveal]:not(...)`.

## Pengujian

Skrip uji memakai headless Chrome lewat CDP (WebSocket bawaan Node 24, tanpa
paket tambahan) dan disimpan di folder scratchpad sesi, bukan di dalam proyek:

- `p5-test.mjs` — 12 pemeriksaan untuk landing page: bahasa, aria-label, dan
  pesan WhatsApp.
- `p5-price-test.mjs` — 14 pemeriksaan khusus section harga.
- `p5-pages-test.mjs` — 49 pemeriksaan untuk pemisahan halaman: section Karya
  benar-benar hilang, tiap halaman hanya memuat satu CSS + satu JS dan tidak
  punya blok `<style>`, kartu kategori menuju file HTML-nya, judul tab dan meta
  description per halaman, kartu dan totalnya, seluruh perilaku drawer (modal,
  kunci scroll, backdrop, tombol ×, klik di area tag, putar balik, slot
  screenshot), serta bahasa yang ikut berpindah halaman.
- `p5-view.mjs` — memotret satu elemen dengan menggulirnya ke atas viewport.
  Memakai `clip` untuk bagian yang jauh di bawah halaman menghasilkan gambar
  kosong, jadi jangan dipakai.
