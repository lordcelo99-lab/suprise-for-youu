# 🎉 Birthday Adventure — Unlock the Wishes

Website ucapan ulang tahun interaktif bertema "perjalanan kecil sebelum sampai ke ucapan".
Dibuat murni dengan **HTML + CSS + JavaScript**, tanpa framework dan tanpa backend.

```
birthday-web/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── birthday-song.mp3   ← taruh lagu kamu di sini
│   ├── sfx-click.mp3       ← opsional, efek klik
│   ├── sfx-success.mp3     ← opsional, efek level selesai
│   ├── sfx-gift.mp3        ← opsional, efek kotak hadiah dibuka
│   └── photos/             ← opsional, taruh foto di sini
└── README.md
```

---

## 1. Cara menjalankan website

1. Buka folder `birthday-web` di **VS Code**.
2. Install extension **Live Server** (jika belum ada).
3. Klik kanan pada `index.html` → **Open with Live Server**.
4. Website akan terbuka otomatis di browser.

Tidak perlu `npm install`, tidak perlu server tambahan — semua berjalan di browser.

> Bisa juga dibuka langsung dengan cara klik dua kali `index.html`, tapi beberapa fitur
> (misalnya musik) bekerja lebih stabil lewat Live Server / http server lokal.

---

## 2. Cara mengganti nama penerima

Buka `script.js`, cari bagian paling atas:

```js
const birthdayConfig = {
  name: "Nama Penerima",   // ganti ini
  ...
};
```

Cukup ganti nilai `name`. Nama ini otomatis muncul di:
- Halaman utama ucapan
- Placeholder kolom "Tulis ucapanmu sendiri"
- Pesan kejutan terakhir (final surprise)

---

## 3. Cara mengganti kode rahasia game (Level 1)

Masih di `birthdayConfig`, ubah:

```js
secretCode: "2026",  // ganti dengan 4 angka sesuai keinginanmu
```

Contoh: tanggal lahir (`"1408"`), tahun spesial, dll. Harus tetap 4 digit angka
karena tampilan kotak input dibuat untuk 4 digit.

---

## 4. Cara memasukkan lagu

1. Siapkan file musik format `.mp3` milik kamu sendiri (jangan file berhak cipta
   yang tidak kamu miliki izinnya).
2. Taruh file-nya di dalam folder `assets/`.
3. Daftarkan di `script.js`, di bagian `songs`:

```js
songs: [
  "assets/birthday-song.mp3"
],
```

Selesai — website otomatis memutar lagu ini saat tombol **START THE ADVENTURE**
ditekan (atau lewat tombol musik 🎵 di pojok kanan bawah jika browser
memblokir autoplay).

### Mau lebih dari satu lagu (ganti otomatis setelah lagu pertama selesai)?

Tinggal tambahkan lagu lain ke dalam array `songs`, urut sesuai keinginan:

```js
songs: [
  "assets/birthday-song.mp3",
  "assets/birthday-song-2.mp3",
  "assets/birthday-song-3.mp3"
],
```

Begitu satu lagu selesai diputar, website otomatis lanjut ke lagu berikutnya
dalam daftar. Setelah lagu terakhir selesai, otomatis kembali ke lagu pertama
(muter terus seperti playlist). Kalau cuma diisi 1 lagu, lagu itu akan diulang
terus-menerus seperti biasa.

Jika file musik tidak ditemukan, website **tidak akan error** — hanya menampilkan
notifikasi kecil bahwa musik belum tersedia.

---

## 5. Cara mengganti teks ucapan

Semua teks ucapan juga ada di `birthdayConfig` dalam `script.js`:

**Kalimat efek mengetik di halaman utama:**
```js
typingLines: [
  "Semoga di usia yang baru ini,",
  "semakin banyak hal baik yang datang,",
  ...
]
```
Setiap baris dalam array akan diketik satu per satu.

**Isi 3 kartu ucapan:**
```js
wishCards: {
  1: { icon: "🌟", title: "MY WISH FOR YOU", text: "..." },
  2: { icon: "🤍", title: "A LITTLE PRAYER", text: "..." },
  3: { icon: "🌙", title: "FOR YOUR FUTURE", text: "..." }
}
```
Ubah `text` sesuai kata-kata yang ingin kamu sampaikan.

**Usia otomatis (opsional):**
```js
birthYear: 2000,     // usia dihitung dari tahun ini
ageOverride: null,   // atau isi angka langsung, misal: 25
```

---

## 6. Cara menambahkan foto

Folder `assets/photos/` sudah disediakan untuk menyimpan foto.

**Foto di setiap Chapter (timeline) — sudah otomatis tersedia:**
Setiap chapter di bagian "🌙 A New Chapter" sudah punya slot foto bawaan.
Kamu tinggal taruh file foto dengan nama berikut ke `assets/photos/`:

```
assets/photos/chapter-1.jpg   → foto untuk Chapter 01
assets/photos/chapter-2.jpg   → foto untuk Chapter 02
assets/photos/chapter-3.jpg   → foto untuk Chapter 03
assets/photos/chapter-4.jpg   → foto untuk Chapter 04
```

Tidak perlu edit kode apa pun — begitu file dengan nama itu ada di folder,
foto langsung muncul di chapter yang sesuai. Kalau file belum ada,
slot fotonya otomatis tersembunyi (tidak akan tampil ikon rusak/error).

> Format lain (`.png`, `.webp`) bisa dipakai juga, tinggal ubah ekstensi
> di atribut `src` pada `index.html`, contoh:
> `src="assets/photos/chapter-1.png"`

**Foto di bagian lain (opsional):**
Untuk menambahkan foto di tempat lain (misalnya di kartu ucapan atau hero),
tambahkan tag `<img>` sendiri di `index.html`, contoh:

```html
<img src="assets/photos/nama-file.jpg" alt="Deskripsi foto" style="width:100%; border-radius:16px;" />
```

---

## Catatan teknis

- Ucapan yang ditulis pengguna di bagian "Tulis ucapanmu sendiri" disimpan di
  `localStorage` browser, jadi tidak hilang saat halaman di-refresh (tapi hanya
  tersimpan di browser & perangkat yang sama).
- Semua efek suara (`sfx-click.mp3`, dll) bersifat opsional — jika file tidak ada,
  website tetap berjalan normal tanpa suara maupun error.
- Website sudah responsif untuk HP, tablet, laptop, dan desktop.
- Tidak ada library eksternal yang digunakan selain Google Fonts (Fraunces & Sora).

Selamat merayakan! 🎈
