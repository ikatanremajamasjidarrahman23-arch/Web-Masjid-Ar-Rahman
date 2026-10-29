<div align="center">

# 🕌 Web DKM Ar-Rahman

**Website Resmi Dewan Kemakmuran Masjid Ar-Rahman**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

> Platform digital terpadu untuk informasi, kegiatan, dan manajemen Masjid Ar-Rahman.

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Database](#-struktur-database)
- [Struktur Proyek](#-struktur-proyek)
- [Cara Menjalankan](#-cara-menjalankan)
- [Environment Variables](#-environment-variables)
- [Panduan Deploy](#-panduan-deploy)
- [Kontribusi](#-kontribusi)

---

## 🕌 Tentang Proyek

Website **DKM Ar-Rahman** adalah platform web modern yang dibangun untuk mendukung digitalisasi informasi dan manajemen kegiatan Masjid Ar-Rahman. Website ini memiliki dua sisi utama:

- **Portal Publik** – Halaman informasi untuk jamaah dan masyarakat umum
- **Panel Admin** – Dasbor manajemen konten untuk pengurus DKM

---

## ✨ Fitur Utama

### 🌐 Portal Publik
| Halaman | Keterangan |
|---|---|
| **Beranda** | Hero section, selayang pandang, jadwal kajian, UKM, dan galeri |
| **Profil Masjid** | Visi, misi, sejarah, dan struktur organisasi |
| **Kajian** | Jadwal kajian rutin dengan informasi pembicara |
| **Galeri** | Dokumentasi foto kegiatan masjid |
| **PHBI** | Peringatan Hari Besar Islam beserta media dokumentasi |
| **IRMAS** | Halaman khusus Ikatan Remaja Masjid Ar-Rahman |
| **UKM** | Unit Kegiatan Masjid dan aktivitasnya |
| **Buletin** | Pengumuman dan buletin digital aktif |
| **Donasi** | Informasi rekening dan QRIS donasi |

### 🔐 Panel Admin (`/admin`)
| Fitur | Keterangan |
|---|---|
| **Dashboard** | Ringkasan statistik dan catatan admin |
| **Manajemen Kajian** | CRUD jadwal kajian dan pembicara |
| **Manajemen Galeri** | Upload & kelola foto kegiatan |
| **Manajemen PHBI** | Kelola event PHBI beserta media |
| **Manajemen IRMAS** | Kelola aktivitas dan anggota IRMAS |
| **Manajemen UKM** | CRUD unit kegiatan masjid |
| **Manajemen Buletin** | Kelola pengumuman & buletin digital |
| **Manajemen Keuangan** | Pencatatan kas masuk dan keluar |
| **Pengaturan Website** | Kustomisasi tampilan, logo, warna tema, font, teks berjalan, popup, dll. |
| **Struktur Organisasi** | Manajemen hierarki pengurus DKM |
| **AD/ART** | Kelola Anggaran Dasar dan Anggaran Rumah Tangga |
| **Push Notification** | Kirim notifikasi ke subscribers |

### 🔔 Fitur Teknis Unggulan
- **Push Notification** via Web Push API & Firebase Admin
- **Image Compression** otomatis sebelum upload
- **Running Text** dinamis di header
- **Popup Pengumuman** dengan durasi tayang yang bisa dikonfigurasi
- **Kustomisasi Tema** warna dan font dari panel admin
- **Upload Gambar** via Cloudinary CDN
- **Mobile App** via Capacitor (Android)

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org)** – Framework React dengan App Router
- **[React 19](https://react.dev)** – UI Library
- **[TypeScript](https://www.typescriptlang.org)** – Static Typing
- **[TailwindCSS v4](https://tailwindcss.com)** – Utility-first CSS
- **[Lucide React](https://lucide.dev)** – Icon Library

### Backend & Database
- **[Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)** – Server-side logic
- **[Prisma ORM v7](https://www.prisma.io)** – Database access layer
- **[PostgreSQL](https://www.postgresql.org)** – Database produksi (Neon/Supabase)

### Auth & Security
- **[jose](https://github.com/panva/jose)** – JWT handling
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** – Password hashing

### Layanan Eksternal
- **[Cloudinary](https://cloudinary.com)** – Cloud image storage & CDN
- **[Firebase Admin](https://firebase.google.com/docs/admin/setup)** – Push notification backend
- **[Web Push](https://github.com/web-push-libs/web-push)** – Web Push Protocol

### Mobile
- **[Capacitor v8](https://capacitorjs.com)** – Cross-platform native runtime (Android)

---

## 🗄 Struktur Database

Berikut adalah model-model utama dalam database:

```
Admin               → Akun administrator
Settings            → Konfigurasi global website
PhbiEvent           → Event Peringatan Hari Besar Islam
PhbiMedia           → Media (foto/video) untuk event PHBI
IrmasActivity       → Aktivitas IRMAS
IrmasMemberRegistration → Pendaftaran anggota IRMAS
Finance             → Catatan keuangan (kas masuk/keluar)
StudySchedule       → Jadwal kajian rutin
Gallery             → Galeri foto kegiatan
PushSubscription    → Subscriber notifikasi web
Bulletin            → Buletin/pengumuman aktif
OrganizationMember  → Struktur organisasi pengurus
AdminNote           → Catatan internal admin
Ukm                 → Unit Kegiatan Masjid
```

---

## 📁 Struktur Proyek

```
web-masjid-arrahman/
├── prisma/
│   └── schema.prisma          # Schema database
├── public/                    # Asset statis
├── src/
│   ├── app/
│   │   ├── (halaman publik)   # beranda, profil, kajian, galeri, dll
│   │   ├── admin/             # Panel admin (dashboard + semua modul)
│   │   ├── api/               # API routes (push notification, dll)
│   │   └── actions/           # Server Actions (CRUD operations)
│   ├── components/            # Komponen React yang dapat digunakan ulang
│   ├── lib/                   # Konfigurasi library (Prisma, Auth, dll)
│   └── utils/                 # Fungsi utilitas (image compression, dll)
├── android/                   # Proyek Android (Capacitor)
├── assets/                    # Asset Capacitor
├── next.config.ts             # Konfigurasi Next.js
├── prisma.config.ts           # Konfigurasi Prisma
├── capacitor.config.ts        # Konfigurasi Capacitor
└── package.json
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** v18 atau lebih baru
- **npm** v9+
- **PostgreSQL** database (lokal atau cloud)

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/ikatanremajamasjidarrahman23-arch/Web-Masjid-Ar-Rahman.git
cd Web-Masjid-Ar-Rahman

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env
# Edit .env sesuai konfigurasi Anda

# 4. Migrasi database
npx prisma migrate dev

# 5. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

Panel Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Environment Variables

Buat file `.env` di root proyek dengan variabel berikut:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Cloudinary (Upload Gambar)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Web Push Notification
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
VAPID_SUBJECT="mailto:admin@masjid-arrahman.id"

# Firebase Admin (Push Notification)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account-email"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

> ⚠️ **Jangan pernah commit file `.env` ke repository!** File ini sudah ditambahkan ke `.gitignore`.

---

## 🌐 Panduan Deploy

### Deploy ke Vercel (Direkomendasikan)

1. Push code ke GitHub
2. Import repository di [vercel.com](https://vercel.com)
3. Tambahkan semua environment variables di dashboard Vercel
4. Deploy otomatis!

### Deploy Manual

```bash
# Build production
npm run build

# Jalankan server produksi
npm start
```

---

## 📱 Build Android

```bash
# Sync ke Capacitor
npx cap sync android

# Buka di Android Studio
npx cap open android
```

---

## 🤝 Kontribusi

Proyek ini dikelola oleh tim **DKM Ar-Rahman** dan **IRMAS Ar-Rahman**.

Untuk pertanyaan atau kontribusi, silakan hubungi pengurus melalui website resmi.

---

<div align="center">

**Dibuat dengan ❤️ untuk kemakmuran Masjid Ar-Rahman**

[![GitHub](https://img.shields.io/badge/GitHub-ikatanremajamasjidarrahman23--arch-181717?style=flat&logo=github)](https://github.com/ikatanremajamasjidarrahman23-arch/Web-Masjid-Ar-Rahman)

</div>
