# EduTrack — Transparent School Assessment Tracking & Public Audit Dashboard

> **MIA 2026 (WIA) Competition Entry**  
> **Tema Utama:** *Designing Digital Futures — Powering Public Transparency*  
> **Target Platform:** Desktop Web Full (Optimized for 1440px+, Responsive)  
> **Tanggal Pembaruan:** 11 November 2026 (Final Submission — Pasca Evaluasi Mentor FDS)

---

## 1. Judul Projek & Deskripsi Singkat

**Edu Track** adalah platform audit keterbukaan mutu pendidikan dan pemantauan akreditasi sekolah pertama di Indonesia yang mengintegrasikan transparansi SLA proses akreditasi BAN-PDM secara *real-time*, korelasi akuntabilitas penyerapan dana BOS Kemendikdasmen, dan ledger audit partisipatif berbasis warga (*crowdsourced reality check*).

### Masalah Nyata yang Diselesaikan:
1. **"Kosmetik Akreditasi"**: Seringkali sekolah mengklaim kesiapan fasilitas laboratorium, sanitasi, dan rasio guru 95%+ di sistem evaluasi diri (Sispena), namun fakta riil di lapangan menunjukkan fasilitas rusak, komputer tidak memadai, dan toilet mampet.
2. **Bottleneck Birokrasi yang Tertutup**: Berkas sekolah yang sudah 100% lengkap kerap mandek berminggu-minggu di tingkat verifikasi provinsi atau penugasan tim asesor tanpa alasan transparan, merugikan siswa tingkat akhir yang membutuhkan legalitas akreditasi.
3. **Ketertutupan Realisasi Dana BOS**: Wali murid dan komite sekolah kesulitan mengecek apakah pagu anggaran sarpras ratusan juta rupiah benar-benar terwujud dalam bentuk fisik sarana belajar.

Edu Track hadir memecahkan kebuntuan ini dengan pendekatan **Public Transparency & AI-Powered Discrepancy Detection**.

---

## 2. Pemetaan Sub-Tema Lomba MIA 2026 & Inovasi AI

| No | Sub-Tema Kompetisi | Implementasi Solusi dalam Edu Track |
|---|---|---|
| **1** | **Open Data & Transparansi Publik** | Mengintegrasikan data terbuka multi-sumber dari BAN-PDM Jawa Timur, Dapodik Kemendikdasmen, dan RKAS BOS dalam satu dasbor publik yang dapat diakses siapa saja tanpa hambatan login. |
| **2** | **AI-Powered Discrepancy & Anomaly Engine** | Algoritma AI menganalisis kesenjangan antara klaim dokumen Sispena dengan bukti visual foto warga secara otomatis. Menghasilkan *AI Field-Assessor Brief* berisikan **"3 Fokus Investigasi Lapangan Wajib"** untuk memandu tim asesor independen. |
| **3** | **Real-Time SLA Bottleneck Tracking** | Fitur *Live SLA Stepper* (5 tahap akreditasi) yang menampilkan durasi per tahap dengan batas waktu tegas (maks 62 hari). Memberikan penanda visual merah jika terjadi keterlambatan birokrasi lebih dari batas SLA. |
| **4** | **Crowdsourced Citizen Audit Ledger** | Kanal pelaporan partisipatif bagi wali murid, siswa, dan warga sekitar dengan verifikasi geotagging dan timestamp foto, menangkal manipulasi laporan sebelum visitasi asesor berlangsung. |

---

## 3. Tech Stack & Arsitektur Monorepo

```
edu-track-mia2026/
├── frontend/                  # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/        # SlaStepper, RadarStandardsChart, BosCorrelationChart, Modals, Navbar
│   │   ├── pages/             # LandingPage, ExplorePage (Desktop 60/40 Master-Detail Split)
│   │   ├── data/              # mockSchools.ts (12 Sekolah Sintetis Jawa Timur)
│   │   ├── services/          # api.ts (Smart Fallback API Service Layer)
│   │   ├── types/             # school.ts (Data Interface Lengkap)
│   │   └── App.tsx            # State Root & Navigation Controller
│   ├── package.json
│   └── vite.config.ts
├── backend/                   # Go (Golang) + Fiber v2 + GORM + Supabase PostgreSQL
│   ├── models/                # school.go (Skema Data Relasional)
│   ├── handlers/              # school_handler.go, stats_handler.go
│   ├── database/              # db.go, seed.go (Auto Migrasi & Seeder Sintetis)
│   ├── .env.example           # Konfigurasi Koneksi Supabase
│   ├── go.mod
│   └── main.go
└── README.md                  # Dokumentasi Utama Kompetisi
```

### Frontend (`/frontend`):
- **Framework & Tooling:** React 18, Vite 6, TypeScript 5.
- **Styling:** Tailwind CSS dengan estetika *Modern Gov-Tech Dark Mode* (background `#090D16`, glassmorphism `#0F1626`, aksen warna status: Emerald tervalidasi, Cyan brand, Amber warning, Rose alert).
- **Visualisasi & Charts:** `recharts` (Radar Chart untuk 8 Standar Nasional Pendidikan dan Scatter/Matrix Chart Korelasi Dana BOS vs Mutu Riil).
- **Icons:** `lucide-react`.
- **Fitur Khusus (Smart Fallback):** Dilengkapi API Service Layer yang secara otomatis mencoba mengambil data dari Go Fiber backend (`http://localhost:8080/api/...`), namun langsung melakukan *seamless fallback* ke dataset sintetis lokal jika backend dalam keadaan offline. Aplikasi selalu **100% interaktif dan demo-ready**.

### Backend (`/backend`):
- **Bahasa & Framework:** Go 1.22+ menggunakan **Fiber v2** (`github.com/gofiber/fiber/v2`).
- **ORM & Database:** **GORM** terhubung dengan **Supabase PostgreSQL** (`gorm.io/driver/postgres`).
- **API Endpoints:**
  - `GET /api/schools`: Daftar sekolah dengan relasi tahap akreditasi, radar standar, dan bukti warga.
  - `GET /api/schools/:id`: Detail sekolah berdasarkan ID atau NPSN.
  - `POST /api/schools/:id/reports`: Kirim laporan foto audit warga baru.
  - `GET /api/stats`: Agregasi metrik keterbukaan publik (SLA overdue %, total laporan tervalidasi).
- **Auto-Seeding:** Otomatis mengisi data jika basis data kosong saat inisialisasi server.

---

## 4. Tiga Skenario Data Sintetis (Pitch Demo Ready)

Dataset mencakup 12 sekolah realistis di wilayah Surabaya, Sidoarjo, Waru, dan Gresik:

1. **Skenario 1 — Ideal / High Trust (Green):**
   - *Contoh:* **SMAN 5 Surabaya** (NPSN: 20532185) & **SMKN 2 Surabaya** (NPSN: 20532189).
   - *Karakteristik:* Kepatuhan SLA On-Track (4 hari lebih cepat dari batas), penyerapan BOS transparan dipajang di portal sekolah, dan skor klaim sekolah (95.8) selaras dengan skor validasi publik (93.4) dengan selisih sangat kecil (gap 2.5%).
2. **Skenario 2 — Bureaucratic Bottleneck (SLA Red Alert):**
   - *Contoh:* **SMPN 14 Sidoarjo** (NPSN: 20501814) & **SMAN 2 Waru** (NPSN: 20501902).
   - *Karakteristik:* Berkas sekolah sudah diunggah lengkap 100%, namun tertahan selama **48 hari** di tahap "Penugasan Asesor" (melewati batas toleransi SLA 14 hari). AI memberi label *Bottleneck Birokrasi Akut*.
3. **Skenario 3 — Cosmetic Accreditation / High Discrepancy (AI Red Alert):**
   - *Contoh:* **SMAN X Waru** (NPSN: 20599104).
   - *Karakteristik:* Sekolah menyerap dana BOS Sarpras sebesar Rp 780 Juta dan mengklaim kesiapan laboratorium komputer 96%. Namun sistem mencatat **19 laporan warga terverifikasi dengan foto visual** yang menunjukkan 35 monitor rusak/mati, atap lab bocor berjamur, dan toilet mampet. AI mendeteksi anomali gap 41.2% dan menerbitkan **3 Fokus Investigasi Lapangan Wajib** untuk asesor.

---

## 5. Cara Menjalankan Project

### A. Menjalankan Frontend (Langsung Demo Ready)
```bash
# 1. Pindah ke direktori frontend
cd frontend

# 2. Install dependensi (jika belum)
npm install

# 3. Jalankan development server
npm run dev
```
Buka browser pada alamat: **`http://localhost:5173`**

### B. Menjalankan Backend (Go Fiber)
```bash
# 1. Pindah ke direktori backend
cd backend

# 2. Salin dan sesuaikan konfigurasi environment
cp .env.example .env

# 3. Unduh modul Go & jalankan
go mod download
go run main.go
```
Backend API akan aktif pada alamat: **`http://localhost:8080`**

---

## 6. Progress Final Submission (11 November 2026 — Pasca Evaluasi Mentor FDS)

Seluruh fitur inti *First Draft* serta **3 Saran Pengembangan Spesifik dari Mentor Penilai FDS** telah diimplementasikan **100%**:

### A. Implementasi 3 Saran Evaluasi Mentor FDS (100% Selesai)
- [x] **1. Filter Wilayah Bertingkat / Granular Regional Drill-Down (`Nasional` → `Provinsi` → `Kabupaten/Kota` → `Kecamatan` → `Satuan Pendidikan`):**
  - [x] Atribut hierarki wilayah lengkap (`provinsi`, `kabupatenKota`, `kecamatan`) pada dataset sekolah lintas provinsi (Jawa Timur, DKI Jakarta, Jawa Barat — mencakup Kota Surabaya, Kab. Sidoarjo, Kota Malang, Kab. Gresik, Jakarta Selatan, dan Kota Bandung).
  - [x] Komponen **`GranularRegionalDrillDownBar`** dengan *Interactive Breadcrumb Path* (`🇮🇩 Nasional > Provinsi > Kabupaten/Kota > Kecamatan > Satuan Pendidikan`), *Cascading Dropdowns* otomatis, serta agregasi statistik serapan Dana BOS dan kepatuhan SLA per wilayah.
- [x] **2. Unduh Laporan Audit Publik Siap Cetak (`Public Audit Report PDF`):**
  - [x] Tombol aksi **`📄 Unduh Laporan Audit Publik (PDF)`** pada panel detail sekolah dan modal komparasi.
  - [x] Modal Pratinjau Dokumen Resmi Siap Cetak (**`PublicAuditPdfModal`**) dengan fitur 1-klik **`🖨️ Cetak / Simpan sebagai PDF`** (stylesheet `@media print` A4 presisi) berisi Kop Resmi *EduTrack Public Transparency Ledger*, Identitas & Hierarki Wilayah Sekolah, Progres 5 Tahap SLA, Tabel Perbandingan 8 Standar Nasional Pendidikan (Skor Klaim vs Validasi Publik), Rincian Realisasi Dana BOS, 3 Rekomendasi *AI Field-Assessor*, serta Kode QR & Hash SHA-256 Verifikasi Publik.
- [x] **3. Kanal Umpan Balik Publik Dua Arah (`Two-Way Citizen Feedback Loop`):**
  - [x] Seksi **`💬 Kanal Umpan Balik & Tanggapan Resmi (2-Way Feedback Loop)`** pada panel detail sekolah yang menampilkan **Status Tindak Lanjut Sekolah** (`Menunggu Respons Sekolah`, `Sedang Diperbaiki oleh Sekolah`, `Selesai Ditindaklanjuti`) serta **Kotak Balasan Resmi Kepala Sekolah / Komite Sekolah**.
  - [x] Fitur **Voting Kepuasan Tindak Lanjut Warga** (`👍 Respons Memuaskan` / `👎 Belum Terbukti di Lapangan`) dan komentar aspirasi warga secara interaktif yang tersimpan persisten di `localStorage`.
  - [x] Fitur **`Tanggapan Resmi Institusi`** di dalam panel **`🔒 Admin & Moderasi`** bagi Admin/Pihak Sekolah untuk mempublikasikan balasan resmi dan memperbarui status tindak lanjut laporan warga.

### B. Fondasi Sistem & Desain Eksekutif (FINNOVA Editorial Light + Indigo Accent)
- [x] **Monorepo Architecture (`/frontend` & `/backend`)** dengan *Dual Persistence Engine* (`localStorage` + Go Fiber API dengan *automatic local JSON/in-memory store fallback*).
- [x] **Role-Based Authentication & Portal Moderasi BAN-PDM:** Login Asesor/Admin (termasuk tombol *⚡ Demo One-Click Login*), Antrean Verifikasi Laporan Warga, *SLA Stage Updater*, dan Simulasi Sinkronisasi API Dapodik & SISPENA Kemendikdasmen.
- [x] **Analytics & Master-Detail Dashboard:** 4 Kartu KPI Bento, Grafik Tren & Komparasi, *Live 5-Step SLA Stepper*, *AI Field-Assessor Brief*, Radar Chart 8 SNP, dan Komparasi Dua Sekolah (*Parent Decision Support*).


