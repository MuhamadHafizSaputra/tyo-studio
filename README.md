# Tyo Studio

Tyo Studio adalah platform kesehatan digital yang dirancang untuk membantu para ibu memantau tumbuh kembang anak, mencegah stunting, dan memeriksa kandungan nutrisi makanan menggunakan bantuan kecerdasan buatan (AI).

Aplikasi ini dibangun menggunakan teknologi web modern untuk memastikan performa yang cepat, responsif, dan mudah digunakan.

## Fitur Utama

Berikut adalah fitur-fitur unggulan yang tersedia dalam aplikasi:

- **Cek Si Kecil (Deteksi Stunting)**: Kalkulator tumbuh kembang anak berdasarkan standar WHO (menggunakan data Z-Score) untuk mendeteksi risiko stunting sejak dini.
- **Cek Nutrisi (AI Powered)**: Analisis kandungan nutrisi makanan secara instan menggunakan integrasi GROCK AI.
- **Pelacak Tumbuh Kembang (Tracker)**: Dashboard interaktif untuk mencatat dan melihat riwayat pertumbuhan anak (tinggi badan, berat badan) dari waktu ke waktu.
- **Artikel Edukasi**: Kumpulan artikel kesehatan dan pola asuh (parenting) yang relevan untuk orang tua terkhususnya para ibu.
- **Manajemen Akun**: Sistem autentikasi pengguna yang aman (Login/Register) untuk menyimpan data anak secara privat.

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan susunan teknologi berikut:

- **Frontend Framework**: Next.js (App Router)
- **Bahasa Pemrograman**: TypeScript
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL & Auth)
- **Integrasi AI**: Grock AI (melalui Server Actions)
- **Linting**: ESLint

## Persiapan Instalasi

Sebelum memulai, pastikan perangkat Anda telah terinstal:

- Node.js (Versi LTS disarankan, misalnya v18 atau v20)
- npm atau manajer paket lainnya (yarn/pnpm)

### 1. Clone Repository

Unduh kode sumber proyek ke komputer lokal Anda:

```
git clone https://github.com/MuhamadHafizSaputra/tyo-studio.git
cd tyo-studio/tyostudio-fe
```

### 2. Instal Dependensi

Jalankan perintah berikut untuk menginstal semua pustaka yang dibutuhkan:

```
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root folder `tyostudio-fe` dan tambahkan konfigurasi berikut. Sesuaikan nilai dengan kredensial dari dashboard Supabase dan API Grock AI Anda.

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# GROCK AI API Key
GROCK_API_KEY=your-grock-api-key
```

### 4. Setup Database (Supabase)

Pastikan Anda telah membuat tabel yang diperlukan di Supabase. Anda dapat melihat skema database pada file berikut:

- `supabase_schema.sql`: Skema tabel utama.
- `food_seed.sql`: Data awal untuk referensi makanan.
- `supabase/migrations/`: File migrasi tambahan.

Salin dan jalankan kueri SQL tersebut di SQL Editor pada dashboard Supabase Anda untuk menyiapkan struktur database.

### 5. Jalankan Aplikasi

Untuk menjalankan server pengembangan (development server):

```
npm run dev
```

Buka `http://localhost:3000` di peramban web Anda untuk melihat hasilnya.

## Struktur Proyek

Berikut adalah gambaran singkat struktur folder proyek:

```
tyostudio-fe/
├── public/              # Aset statis (gambar, svg)
├── src/
│   ├── app/             # Next.js App Router (Halaman & API Routes)
│   │   ├── (auth)/      # Halaman Login/Register
│   │   ├── (main)/      # Halaman utama (Dashboard, Artikel, Tools)
│   │   ├── actions/     # Server Actions (termasuk integrasi grock)
│   │   └── ...
│   ├── components/      # Komponen UI React yang dapat digunakan kembali
│   ├── lib/             # Utilitas, fungsi pembantu, dan data statis (WHO Data)
│   ├── utils/           # Konfigurasi Supabase (Client/Server/Middleware)
│   └── ...
├── supabase/            # File migrasi database
├── .env                 # Template environment variables
├── next.config.ts       # Konfigurasi Next.js
└── ...
```

## Lisensi

Proyek ini dilisensikan di bawah MIT License.

Dibuat oleh Tim Tyo Studio.