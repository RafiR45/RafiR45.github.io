# Muhammad Rafi — Portofolio & Jasa Pembuatan Website

Website portofolio sekaligus daftar harga jasa pembuatan website untuk **UMKM
Indonesia**: satu landing page plus tiga halaman kategori karya. Statis penuh —
tidak ada framework, build step, dependensi npm, maupun server. Cukup ditaruh di
GitHub Pages atau hosting statis mana pun.

**Live:** https://rafir45.github.io

## Isinya

- **Landing page** — perkenalan, alasan UMKM butuh website, layanan, harga,
  show-off project, dan kontak.
- **Tiga halaman kategori** — Company profile (12 proyek), Event Organizer
  (11 proyek), dan Web app (9 sistem internal). Kartunya dibangun dari data,
  termasuk angka jumlah proyeknya, jadi menambah entri tidak perlu menyentuh
  HTML.
- **Panel detail proyek** — dialog modal dengan screenshot, ringkasan, fitur,
  tim yang mengerjakan, dan tombol ke websitenya. Proyek yang sistemnya dipakai
  internal klien tidak menampilkan screenshot, melainkan panel "Sistem internal"
  beserta alasannya.
- **Dua bahasa** — Indonesia sebagai bawaan, Inggris opsional lewat tombol
  ID/EN. Pilihannya diingat di `localStorage`.
- Responsif sampai lebar ponsel, dan seluruh animasinya mati otomatis kalau
  sistem pengunjung menyalakan `prefers-reduced-motion`.

## Teknologi

HTML, CSS, dan JavaScript biasa — satu IIFE, tanpa modul dan tanpa bundler.
Font dari Google Fonts. Semua ikon inline SVG (tidak ada file ikon), dan
ilustrasi di hero adalah SVG yang digambar langsung di markup.

## Menjalankan di lokal

Karena tidak ada build step, cukup buka `index.html` di browser. Font-nya butuh
koneksi internet; selain itu semuanya jalan dari file lokal.

Kalau ingin lewat server (lebih mirip kondisi aslinya):

```bash
python -m http.server 8000
# lalu buka http://localhost:8000
```

## Struktur berkas

| Berkas | Isi |
|---|---|
| `index.html` | Landing page. |
| `company-profile.html` | Halaman kategori Company profile. |
| `event-organizer.html` | Halaman kategori Event Organizer. |
| `web-app.html` | Halaman kategori Web app. |
| `style.css` | **Dipakai semua halaman.** Seluruh gaya, termasuk halaman kategori. |
| `main.js` | **Dipakai semua halaman.** Terjemahan EN, data proyek, drawer, reveal. |
| `img/` | Screenshot website klien, satu file per situs. |

`<head>` tiap halaman berbeda — judul dan deskripsinya memang beda — tapi
`style.css` dan `main.js` yang dimuat selalu sama, jadi setelah halaman pertama
dibuka keduanya sudah ada di cache. Markup yang identik di semua halaman (panel
detail proyek) **tidak** disalin ke tiap file: `main.js` yang membuatnya, karena
tanpa JavaScript panel itu memang tidak berfungsi.

## Urutan halaman

Urutannya dipilih untuk pengunjung UMKM yang sering belum yakin butuh website,
jadi perkenalan dan manfaatnya dijelaskan lebih dulu, baru layanan dan harga.
Navigasi mengikuti urutan ini, di landing page maupun di halaman kategori.

1. **Hero** — nama, satu kalimat penjelas, dua tombol.
2. **Kenalan dulu, yuk** (`#about`) — perkenalan singkat.
3. **Untung punya website!** (`#benefits`) — empat kartu manfaat, sengaja tanpa
   statistik.
4. **Yang bisa saya bantu** (`#services`) — satu panel penawaran berisi tiga
   layanan, masing-masing dengan poin "Yang Anda dapat" dan tautan email
   dengan subjek khusus layanan itu.
5. **Berapa biayanya?** (`#pricing`) — tabel di bawah.
6. **Show-off project** (`#showcase`) — tiga kategori, masing-masing membuka
   halamannya sendiri.
7. **Yuk, ngobrol** (`#contact`) — tombol email dan GitHub.

## Harga

| Paket | Harga | Batas |
|---|---|---|
| Landing page | Rp 150.000 | 1 halaman |
| Company profile | Rp 250.000 | Maks 5 halaman, tanpa halaman admin |
| Company profile + blog | Rp 500.000 | Halaman bebas + admin untuk artikel |
| Aplikasi web custom | Mulai Rp 5 juta | Harga akhir tergantung fitur |
| Maintenance | Rp 125.000 / bulan | Update, backup, perbaikan kecil |

Ketiga paket website sudah termasuk **domain .my.id dan hosting untuk bulan
pertama**. Tiap kartu menuliskannya sebagai dua poin, lalu satu baris kecil
("Nama domain lain kena biaya tambahan") di atas tombolnya, dan baris penutup
section mengatakan hal yang sama — kalau salah satunya berubah, ubah keduanya.

## Cara kerja singkat

**Dua bahasa.** Teks bahasa Indonesia ditulis langsung di HTML dengan atribut
`data-i18n`; `main.js` membacanya kembali saat halaman dibuka, dan hanya versi
Inggrisnya yang disimpan di kamus `EN` di `main.js`.

**Semua tombol ajakan membuka email**, bukan WhatsApp (diubah 2026-10-03).
Tiap tautan punya `data-i18n-mail` berisi kunci subjeknya, dan `main.js`
menyusun `href`-nya sebagai `MAIL_BASE + subjek` sesuai bahasa yang dipilih —
subjeknya ikut berganti saat pengunjung menekan EN. Subjek bahasa Indonesia juga
ditulis di `data-mail-text` dan di `href` statisnya, jadi tautannya tetap jalan
kalau JavaScript mati. Alamat tujuannya satu tempat saja: `MAIL_BASE` di
`main.js`, plus `href` statis di `index.html`.

**Data proyek.** Semuanya ada di array `SHOWCASE` (`main.js`), dikelompokkan per
kategori. Company profile dan Event organizer diurutkan menurut abjad; Web app
mengikuti urutan yang ditentukan. Jumlah proyek di kartu kategori dihitung
otomatis dari panjang array, jadi menambah entri sudah cukup.

**Tim yang mengerjakan** (field `team`) sama untuk semua proyek: M. Rafi Rifki
Aldi (Frontend Web Developer), Fandi Febrianto (Backend Web Developer), Mustaqim
Afif (QC/QA/Pentester), dan Yupi Sugianto (Technical Director). UI/UX Designer
ditulis per proyek karena studionya berbeda-beda, dan diletakkan paling atas:

| Proyek | UI/UX Designer |
|---|---|
| Dandelion | Dandelion Team |
| Genco Energi Nusantara, GPIB Immanuel Jakarta, Kailimang + Ponto, Suka Studio | Suka Studio Team |
| HighScope Indonesia, Redea Institute | Vasco Journal Team |
| KRATON by Auguste Soesastro | Otro Design |

**Nama** dipakai dalam tiga bentuk, sengaja: **Muhammad Rafi** untuk identitas
situs (hero, logo, judul tab, footer), **Rafi** untuk sapaan (paragraf Kenalan
dan subjek email yang dikirim pengunjung), dan **M. Rafi Rifki Aldi**
untuk bentuk lengkapnya.

## Yang masih placeholder

- **Alamat email** `mrafirafi36@gmail.com` sudah yang asli, tapi kalau diganti:
  ada di `MAIL_BASE` (`main.js`) **dan** di setiap `href` statis pada
  `index.html` — dua-duanya harus diubah.
- Baris "pernah bantu…" di hero.
- Estimasi durasi tiap layanan dan garansi 30 hari di section Layanan.
- **Cerita tiap proyek**: `problem`, `result`, `year`, `duration`, dan `tags`
  masih kosong di sebagian besar entri. Panel detail melewati bagian yang
  kosong, jadi isi saja yang sudah siap.
- **UI/UX Designer** untuk proyek selain yang delapan di atas — tambahkan satu
  baris `{ name, role: 'UI/UX Designer' }` paling atas pada `team`, di `id`
  **dan** `en`.

## Kalau mau mengedit

- **Tidak ada JavaScript inline**, termasuk `onclick` dan `style=""`. Semua
  perilaku diikat dengan `addEventListener` di `main.js`, supaya CSP bisa
  membuang `'unsafe-inline'`.
- **Tautan ke luar selalu `target="_blank"` + `rel="noopener noreferrer"`**.
  Tautan di dalam situs sendiri tidak, begitu juga `mailto:` — tautan email
  membuka aplikasi surat, dan `_blank` cuma meninggalkan tab kosong.
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
- **Nama berkas gambar bersifat case-sensitive** di GitHub Pages, tidak seperti
  di Windows. Kalau sebuah screenshot muncul di lokal tapi hilang setelah
  di-deploy, cek besar-kecil hurufnya di field `image`.

## Catatan

Screenshot di `img/` adalah tampilan website klien, dipajang sebagai contoh
pekerjaan. Sistem di kategori Web app sengaja tanpa screenshot karena datanya
milik klien.
