import { School, TransparencyStats } from '../types/school';

export const mockTransparencyStats: TransparencyStats = {
  totalSchoolsTracked: 1248,
  overduePercentage: 18.4,
  overdueCount: 230,
  totalCitizenReports: 3890,
  verifiedReports: 3215,
  avgAbsorptionRate: 92.6,
  highDiscrepancyCount: 47,
  upcomingVisitationsCount: 14
};

export const mockSchools: School[] = [
  // --- SCENARIO 1: Ideal / High Trust - Green ---
  {
    id: 'sch-001',
    npsn: '20532185',
    name: 'SMAN 5 Surabaya',
    level: 'SMA',
    provinsi: 'Jawa Timur',
    kabupatenKota: 'Kota Surabaya',
    kecamatan: 'Genteng',
    district: 'Genteng',
    city: 'Kota Surabaya',
    address: 'Jl. Kusuma Bangsa No.21, Ketabang, Kec. Genteng, Surabaya',
    accreditationGrade: 'A',
    lastAccreditationYear: 2021,
    currentStageNumber: 4,
    slaStatus: 'on_track',
    slaDaysDifference: -4, // 4 hari lebih cepat dari SLA
    claimedScore: 95.8,
    verifiedScore: 93.4,
    bosBudget: {
      totalReceived: 1850000000,
      absorbed: 1813000000,
      absorptionRate: 98.0,
      reportedAllocations: {
        sarpras: 550000000,
        operasional: 620000000,
        guruHonor: 343000000,
        digitalisasi: 300000000
      }
    },
    aiRiskLevel: 'verified',
    aiAssessorBrief: {
      summary: 'Tingkat kesesuaian antara dokumen evaluasi diri (Sispena) dan laporan lapangan warga mencapai 97.5%. Alokasi dana BOS untuk laboratorium IPA terkonfirmasi dengan bukti inventaris terdigitalisasi.',
      discrepancyRate: 2.5,
      riskBadge: 'Integritas Sangat Baik',
      mandatoryInvestigationFocus: [
        'Uji petik lisensi perangkat lunak di Lab Komputer 2 (memastikan kesesuaian faktur pengadaan)',
        'Konfirmasi kecukupan debit air bersih pada fasilitas sanitasi lantai 3 sayap barat',
        'Validasi rekapitulasi pelatihan pedagogik guru honorer tahun anggaran 2025/2026'
      ],
      flags: ['Dokumen Lengkap Tervalidasi', 'Audit BOS Publik Terbuka', 'Feedback Warga Positif (96%)'],
      generatedAt: '2026-10-28 09:15 WIB'
    },
    stageDetails: [
      {
        stageNumber: 1,
        name: 'Submit Berkas Sispena',
        status: 'completed',
        daysSpent: 7,
        maxSlaDays: 14,
        completedAt: '2026-09-12',
        responsibleOfficer: 'Operator Sekolah / Kepala Sekolah',
        notes: 'Seluruh 8 standar instrumen BAN-PDM diunggah lengkap berserta lampiran video portofolio.'
      },
      {
        stageNumber: 2,
        name: 'Verifikasi Berkas Provinsi',
        status: 'completed',
        daysSpent: 6,
        maxSlaDays: 10,
        completedAt: '2026-09-18',
        responsibleOfficer: 'Tim Verifikator BAN-PDM Jatim',
        notes: 'Lolos verifikasi kelayakan dokumen tanpa perbaikan mayor.'
      },
      {
        stageNumber: 3,
        name: 'Penugasan Tim Asesor',
        status: 'completed',
        daysSpent: 8,
        maxSlaDays: 14,
        completedAt: '2026-09-26',
        responsibleOfficer: 'Sekretariat BAN-PDM',
        notes: 'Dua orang asesor independen terakreditasi nasional telah ditunjuk.'
      },
      {
        stageNumber: 4,
        name: 'Visitasi Lapangan',
        status: 'in_progress',
        daysSpent: 5,
        maxSlaDays: 10,
        startedAt: '2026-10-26',
        responsibleOfficer: 'Dr. Suyatno, M.Pd & Dra. Hj. Ratna W., M.Si',
        notes: 'Jadwal observasi fisik dan wawancara komite terjadwal pada 3 November 2026.'
      },
      {
        stageNumber: 5,
        name: 'Pleno & Terbit Sertifikat SK',
        status: 'pending',
        daysSpent: 0,
        maxSlaDays: 14,
        notes: 'Menunggu hasil berita acara visitasi dan validasi majelis pertimbangan BAN.'
      }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 98, verifiedScore: 96, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 96, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 97, verifiedScore: 95, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 95, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 94, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 96, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 95, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 95, verifiedScore: 91, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-001',
        author: 'Dewi Kartika',
        authorRole: 'Wali Murid',
        date: '2026-10-25',
        facilityTag: 'Lab Komputer',
        text: 'Lab Komputer A & B sangat representatif. 40 unit PC terbaru terinstalasi lengkap, AC menyala dingin, dan koneksi internet stabil saat anak saya simulasi TKA.',
        upvotes: 42,
        status: 'verified',
        followUpStatus: 'resolved',
        officialResponse: {
          responderName: 'Drs. H. Sukirin Wikdjojo, M.Pd',
          responderRole: 'Kepala SMAN 5 Surabaya',
          text: 'Terima kasih atas apresiasi Ibu Dewi. Peremajaan 40 PC dan instalasi jaringan serat optik Lab A & B telah diselesaikan menggunakan Dana BOS Kinerja 2026 dan diaudit bersama Komite Sekolah.',
          respondedAt: '2026-10-26 10:15 WIB'
        },
        satisfactionVotes: { satisfied: 39, unsatisfied: 1 },
        publicComments: [
          {
            id: 'cmt-001',
            author: 'Ir. Hendra Wijaya',
            role: 'Komite Sekolah',
            text: 'Kami telah meninjau langsung berita acara serah terima barang (BASTB) pengadaan PC dan seluruh nomor seri sesuai fisik.',
            date: '2026-10-27'
          }
        ]
      },
      {
        id: 'rep-002',
        author: 'Rahmat Hidayat',
        authorRole: 'Komite Sekolah',
        date: '2026-10-20',
        facilityTag: 'Transparansi Dana',
        text: 'Laporan realisasi dana BOS dipajang transparan di papan pengumuman lobi utama dan diunggah di situs web sekolah setiap triwulan.',
        upvotes: 38,
        status: 'verified',
        followUpStatus: 'resolved',
        officialResponse: {
          responderName: 'Tim Manajemen BOS SMAN 5 Surabaya',
          responderRole: 'Bendahara & Humas Sekolah',
          text: 'Terima kasih Bapak Rahmat. Publikasi RKAS dan LPJ BOS Triwulan III 2026 juga dapat diunduh langsung melalui QR Code di lobi sekolah.',
          respondedAt: '2026-10-21 14:00 WIB'
        },
        satisfactionVotes: { satisfied: 35, unsatisfied: 0 }
      },
      {
        id: 'rep-003',
        author: 'Bagas Aditya',
        authorRole: 'Siswa',
        date: '2026-10-15',
        facilityTag: 'Sanitasi',
        text: 'Toilet siswa bersih, selalu tersedia sabun cair dan air mengalir deras. Tidak ada bau menyengat.',
        upvotes: 29,
        status: 'verified',
        followUpStatus: 'resolved',
        officialResponse: {
          responderName: 'Waka Sarana & Prasarana',
          responderRole: 'Manajemen Sekolah',
          text: 'Terima kasih masukannya. Petugas kebersihan melakukan inspeksi sanitasi setiap 2 jam sekali sesuai SOP Sekolah Sehat.',
          respondedAt: '2026-10-16 09:00 WIB'
        },
        satisfactionVotes: { satisfied: 28, unsatisfied: 1 }
      }
    ],
    scheduledVisitationDate: '2026-11-03',
    assessorTeam: {
      lead: 'Dr. Suyatno, M.Pd',
      members: ['Dra. Hj. Ratna Wahyuni, M.Si']
    }
  },
  {
    id: 'sch-002',
    npsn: '20532189',
    name: 'SMKN 2 Surabaya',
    level: 'SMK',
    district: 'Wonokromo',
    city: 'Kota Surabaya',
    address: 'Jl. Tentara Genie Pelajar No.26, Sawahan, Surabaya',
    accreditationGrade: 'A',
    lastAccreditationYear: 2020,
    currentStageNumber: 5,
    slaStatus: 'on_track',
    slaDaysDifference: -2,
    claimedScore: 94.2,
    verifiedScore: 92.1,
    bosBudget: {
      totalReceived: 2100000000,
      absorbed: 2045000000,
      absorptionRate: 97.3,
      reportedAllocations: {
        sarpras: 890000000,
        operasional: 580000000,
        guruHonor: 315000000,
        digitalisasi: 260000000
      }
    },
    aiRiskLevel: 'verified',
    aiAssessorBrief: {
      summary: 'Standar bengkel kejuruan mesin CNC dan otomotif memiliki sertifikasi industri (Vokasi Unggulan). Penyerapan BOS Sarpras selaras dengan realitas mesin praktek.',
      discrepancyRate: 2.2,
      riskBadge: 'Integritas Sangat Baik',
      mandatoryInvestigationFocus: [
        'Pemeriksaan kepatuhan K3 di bengkel Teknik Pemesinan',
        'Validasi kemitraan teaching factory dengan industri lokal ring 1',
        'Verifikasi serapan lulusan di dunia usaha & dunia kerja (DUDI)'
      ],
      flags: ['Teaching Factory Aktif', 'Laporan Keuangan Rapi', 'Sertifikasi K3 Valid'],
      generatedAt: '2026-10-25 14:20 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 9, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 7, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'completed', daysSpent: 11, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'completed', daysSpent: 9, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'in_progress', daysSpent: 4, maxSlaDays: 14, startedAt: '2026-10-27', notes: 'Menunggu penandatanganan digital sertifikat akreditasi di portal Kemendikdasmen.' }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 96, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 93, verifiedScore: 91, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 95, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 94, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 93, verifiedScore: 90, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 97, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 92, verifiedScore: 91, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 94, verifiedScore: 92, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-004',
        author: 'Hendro Gunawan',
        authorRole: 'Alumni',
        date: '2026-10-18',
        facilityTag: 'Lab Komputer',
        text: 'Mesin praktek bubut dan CNC sangat prima. Pengadaan perkakas baru tahun lalu sangat membantu kami lulus uji kompetensi BNSP.',
        upvotes: 31,
        status: 'verified'
      }
    ]
  },
  {
    id: 'sch-003',
    npsn: '20532551',
    name: 'SMPN 1 Surabaya',
    level: 'SMP',
    district: 'Genteng',
    city: 'Kota Surabaya',
    address: 'Jl. Pacar No.4-6, Ketabang, Kec. Genteng, Surabaya',
    accreditationGrade: 'A',
    lastAccreditationYear: 2021,
    currentStageNumber: 3,
    slaStatus: 'on_track',
    slaDaysDifference: -3,
    claimedScore: 93.5,
    verifiedScore: 91.8,
    bosBudget: {
      totalReceived: 1420000000,
      absorbed: 1395000000,
      absorptionRate: 98.2,
      reportedAllocations: {
        sarpras: 410000000,
        operasional: 490000000,
        guruHonor: 285000000,
        digitalisasi: 210000000
      }
    },
    aiRiskLevel: 'verified',
    aiAssessorBrief: {
      summary: 'Data perpustakaan ramah anak dan sanitasi terverifikasi oleh 11 ulasan warga dengan bukti geotagging konsisten.',
      discrepancyRate: 1.8,
      riskBadge: 'Integritas Sangat Baik',
      mandatoryInvestigationFocus: [
        'Ketersediaan koleksi buku bacaan fiksi/non-fiksi terkini di perpustakaan',
        'Fasilitas inklusi bagi siswa berkebutuhan khusus'
      ],
      flags: ['Dokumen Sah', 'Audit Publik Aman'],
      generatedAt: '2026-10-27 10:00 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 6, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 5, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'in_progress', daysSpent: 6, maxSlaDays: 14, startedAt: '2026-10-25' },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'pending', daysSpent: 0, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 95, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 94, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 93, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 94, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 92, verifiedScore: 90, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 93, verifiedScore: 90, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 95, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 92, verifiedScore: 90, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-005',
        author: 'Farida Nurul',
        authorRole: 'Wali Murid',
        date: '2026-10-19',
        facilityTag: 'Perpustakaan',
        text: 'Perpustakaan SMPN 1 sangat nyaman, sudah ber-AC dan sistem peminjaman buku sudah digital memakai barcode kartu pelajar.',
        upvotes: 27,
        status: 'verified'
      }
    ]
  },
  {
    id: 'sch-004',
    npsn: '20501712',
    name: 'SMAN 1 Sidoarjo',
    level: 'SMA',
    district: 'Sidoarjo',
    city: 'Kab. Sidoarjo',
    address: 'Jl. Jenderal Ahmad Yani No.39, Sidokumpul, Kec. Sidoarjo',
    accreditationGrade: 'A',
    lastAccreditationYear: 2021,
    currentStageNumber: 4,
    slaStatus: 'on_track',
    slaDaysDifference: -1,
    claimedScore: 94.7,
    verifiedScore: 92.5,
    bosBudget: {
      totalReceived: 1720000000,
      absorbed: 1680000000,
      absorptionRate: 97.6,
      reportedAllocations: {
        sarpras: 510000000,
        operasional: 540000000,
        guruHonor: 330000000,
        digitalisasi: 300000000
      }
    },
    aiRiskLevel: 'verified',
    aiAssessorBrief: {
      summary: 'Kesiapan sarana digital dan laboratorium multimedia sesuai dengan pagu anggaran BOS 2025. Warga mengapresiasi transparansi sekolah.',
      discrepancyRate: 2.3,
      riskBadge: 'Integritas Sangat Baik',
      mandatoryInvestigationFocus: [
        'Observasi pemanfaatan smartboard di kelas X dan XI',
        'Verifikasi dokumen rekapitulasi dana BOS triwulan III'
      ],
      flags: ['Akreditasi Mandiri Siap', 'Transparansi Tinggi'],
      generatedAt: '2026-10-26 11:30 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 8, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 7, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'completed', daysSpent: 10, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'in_progress', daysSpent: 4, maxSlaDays: 10, startedAt: '2026-10-27' },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 97, verifiedScore: 95, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 94, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 95, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 95, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 93, verifiedScore: 91, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 95, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 94, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 95, verifiedScore: 90, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-006',
        author: 'Agus Triyono',
        authorRole: 'Wali Murid',
        date: '2026-10-24',
        facilityTag: 'Lab Komputer',
        text: 'Smartboard interaktif di kelas anak saya berfungsi baik untuk pembelajaran matematika dan fisika.',
        upvotes: 24,
        status: 'verified'
      }
    ],
    scheduledVisitationDate: '2026-11-05'
  },

  // --- SCENARIO 2: Bureaucratic Bottleneck - SLA Red Alert ---
  {
    id: 'sch-005',
    npsn: '20501814',
    name: 'SMPN 14 Sidoarjo',
    level: 'SMP',
    district: 'Candi',
    city: 'Kab. Sidoarjo',
    address: 'Jl. Raya Sepande, Candi, Kec. Candi, Kab. Sidoarjo',
    accreditationGrade: 'B',
    lastAccreditationYear: 2019,
    currentStageNumber: 3,
    slaStatus: 'overdue',
    slaDaysDifference: 34, // Stuck 48 days (limit is 14 days, so 34 days overdue!)
    claimedScore: 89.4,
    verifiedScore: 86.2,
    bosBudget: {
      totalReceived: 980000000,
      absorbed: 940000000,
      absorptionRate: 95.9,
      reportedAllocations: {
        sarpras: 290000000,
        operasional: 380000000,
        guruHonor: 180000000,
        digitalisasi: 90000000
      }
    },
    aiRiskLevel: 'bottleneck',
    aiAssessorBrief: {
      summary: 'DOKUMEN SEKOLAH SUDAH LENGKAP 100%, NAMUN TERKENDALA BIROKRASI. Proses mandek selama 48 hari di tahap "Penugasan Asesor" karena kekosongan kuota asesor regional Sidoarjo. Potensi kerugian status akreditasi siswa tingkat akhir.',
      discrepancyRate: 3.5,
      riskBadge: 'Bottleneck Birokrasi Akut',
      mandatoryInvestigationFocus: [
        'Desak percepatan SK penugasan asesor lintas-kabupaten oleh Koordinator BAN-PDM Jawa Timur',
        'Verifikasi keabsahan data administrasi yang mendekati masa kedaluwarsa 60 hari',
        'Cek kondisi riil sarana toilet yang dilaporkan warga mengalami perbaikan tertunda'
      ],
      flags: ['Overdue SLA > 30 Hari', 'Dokumen Sispena Siap 100%', 'Antrean Asesor Mandek'],
      generatedAt: '2026-10-29 08:30 WIB'
    },
    stageDetails: [
      {
        stageNumber: 1,
        name: 'Submit Berkas Sispena',
        status: 'completed',
        daysSpent: 11,
        maxSlaDays: 14,
        completedAt: '2026-08-15',
        notes: 'Sekolah mengunggah 112 berkas bukti tepat waktu.'
      },
      {
        stageNumber: 2,
        name: 'Verifikasi Berkas Provinsi',
        status: 'completed',
        daysSpent: 9,
        maxSlaDays: 10,
        completedAt: '2026-08-24',
        notes: 'Dinyatakan memenuhi syarat asesmen kecukupan dokumen.'
      },
      {
        stageNumber: 3,
        name: 'Penugasan Tim Asesor',
        status: 'overdue',
        daysSpent: 48,
        maxSlaDays: 14,
        startedAt: '2026-08-25',
        responsibleOfficer: 'Seksi Penjaminan Mutu BAN-PDM Jatim',
        notes: 'PERINGATAN: Melebihi batas toleransi SLA (48 hari dari standar 14 hari). Tertahan pada antrean disposisi penugasan asesor wilayah Candi/Sidoarjo.'
      },
      {
        stageNumber: 4,
        name: 'Visitasi Lapangan',
        status: 'pending',
        daysSpent: 0,
        maxSlaDays: 10,
        notes: 'Belum dapat dijadwalkan karena SK asesor belum terbit.'
      },
      {
        stageNumber: 5,
        name: 'Pleno & Terbit Sertifikat SK',
        status: 'pending',
        daysSpent: 0,
        maxSlaDays: 14
      }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 91, verifiedScore: 88, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 89, verifiedScore: 87, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 90, verifiedScore: 88, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 88, verifiedScore: 86, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 87, verifiedScore: 85, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 88, verifiedScore: 82, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 92, verifiedScore: 89, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 90, verifiedScore: 85, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-pending-02',
        author: 'Rina Kusumawati',
        authorRole: 'Wali Murid',
        date: '2026-10-30',
        facilityTag: 'Ruang Kelas',
        text: 'Plafon ruang kelas VIII-C mulai retak akibat rembesan talang hujan minggu ini. Mohon tim asesor mengecek kelayakan struktur atap saat visitasi turun.',
        photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
        upvotes: 17,
        status: 'investigating'
      },
      {
        id: 'rep-007',
        author: 'Drs. Supriyanto',
        authorRole: 'Komite Sekolah',
        date: '2026-10-12',
        facilityTag: 'Transparansi Dana',
        text: 'Kami dari komite mempertanyakan mengapa proses visitasi akreditasi belum juga turun padahal berkas sudah selesai sejak Agustus. Ini merugikan siswa kami yang mau daftar SMA unggulan.',
        upvotes: 89,
        status: 'verified'
      },
      {
        id: 'rep-008',
        author: 'Nurul Huda',
        authorRole: 'Wali Murid',
        date: '2026-10-08',
        facilityTag: 'Sanitasi',
        text: 'Pembangunan wastafel tambahan di halaman belakang sudah selesai, tapi belum ada peninjauan resmi dari dinas atau asesor.',
        upvotes: 34,
        status: 'verified'
      }
    ]
  },
  {
    id: 'sch-006',
    npsn: '20501902',
    name: 'SMAN 2 Waru',
    level: 'SMA',
    district: 'Waru',
    city: 'Kab. Sidoarjo',
    address: 'Jl. Raya Wadungasri No.12, Waru, Kab. Sidoarjo',
    accreditationGrade: 'B',
    lastAccreditationYear: 2020,
    currentStageNumber: 2,
    slaStatus: 'overdue',
    slaDaysDifference: 28, // 38 days spent at stage 2 (limit 10 days)
    claimedScore: 88.0,
    verifiedScore: 84.5,
    bosBudget: {
      totalReceived: 1250000000,
      absorbed: 1190000000,
      absorptionRate: 95.2,
      reportedAllocations: {
        sarpras: 390000000,
        operasional: 420000000,
        guruHonor: 240000000,
        digitalisasi: 140000000
      }
    },
    aiRiskLevel: 'bottleneck',
    aiAssessorBrief: {
      summary: 'Berkas verifikasi terhenti pada telaah instrumen mutu tingkat provinsi selama 38 hari (melebihi limit 10 hari). Terindikasi kendala antrean validasi data Dapodik provinsi.',
      discrepancyRate: 4.1,
      riskBadge: 'Bottleneck Birokrasi',
      mandatoryInvestigationFocus: [
        'Audit status validasi NUPTK guru honorer yang belum sinkron di Dapodik',
        'Konfirmasi kecukupan kuorum verifikator berkas BAN Jawa Timur'
      ],
      flags: ['Overdue Tahap 2 Provinsi', 'Sinkronisasi Dapodik Pending'],
      generatedAt: '2026-10-28 16:00 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 12, maxSlaDays: 14, completedAt: '2026-09-01' },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'overdue', daysSpent: 38, maxSlaDays: 10, startedAt: '2026-09-02', notes: 'Terhambat proses validasi manual surat keputusan kepala sekolah.' },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'pending', daysSpent: 0, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'pending', daysSpent: 0, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 89, verifiedScore: 86, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 87, verifiedScore: 85, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 88, verifiedScore: 85, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 87, verifiedScore: 84, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 86, verifiedScore: 82, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 89, verifiedScore: 84, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 90, verifiedScore: 86, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 88, verifiedScore: 85, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-009',
        author: 'Wahyu S.',
        authorRole: 'Wali Murid',
        date: '2026-10-14',
        facilityTag: 'Ruang Kelas',
        text: 'Kondisi kelas reguler sudah baik dan dipasang kipas gantung baru, mohon verifikasi berkas di provinsi dipercepat.',
        upvotes: 18,
        status: 'verified'
      }
    ]
  },
  {
    id: 'sch-007',
    npsn: '20532629',
    name: 'SMPN 29 Surabaya',
    level: 'SMP',
    district: 'Tandes',
    city: 'Kota Surabaya',
    address: 'Jl. Raya Tandes Kidul No.5, Surabaya',
    accreditationGrade: 'B',
    lastAccreditationYear: 2019,
    currentStageNumber: 3,
    slaStatus: 'overdue',
    slaDaysDifference: 18,
    claimedScore: 87.5,
    verifiedScore: 85.0,
    bosBudget: {
      totalReceived: 920000000,
      absorbed: 885000000,
      absorptionRate: 96.2,
      reportedAllocations: {
        sarpras: 260000000,
        operasional: 370000000,
        guruHonor: 185000000,
        digitalisasi: 70000000
      }
    },
    aiRiskLevel: 'bottleneck',
    aiAssessorBrief: {
      summary: 'Tahap penugasan asesor tertunda 32 hari (batas SLA 14 hari). Data sarana prasarana sekolah siap diaudit langsung.',
      discrepancyRate: 2.8,
      riskBadge: 'Bottleneck Penugasan Asesor',
      mandatoryInvestigationFocus: [
        'Konfirmasi ketersediaan asesor bidang studi bahasa dan IPA di wilayah Surabaya Barat',
        'Validasi kecukupan alokasi ruang UKS'
      ],
      flags: ['Overdue SLA Asesor', 'Verifikasi Dokumen Lolos'],
      generatedAt: '2026-10-27 15:15 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 10, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 8, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'overdue', daysSpent: 32, maxSlaDays: 14, startedAt: '2026-09-15' },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'pending', daysSpent: 0, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 88, verifiedScore: 86, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 87, verifiedScore: 85, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 88, verifiedScore: 86, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 86, verifiedScore: 84, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 87, verifiedScore: 85, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 86, verifiedScore: 83, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 89, verifiedScore: 87, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 87, verifiedScore: 84, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-010',
        author: 'Sri Mulyani',
        authorRole: 'Wali Murid',
        date: '2026-10-17',
        facilityTag: 'Perpustakaan',
        text: 'Sirkulasi buku berjalan baik, namun anak-anak menanyakan status akreditasi sekolah yang belum ada kepastian tanggal visitasi.',
        upvotes: 22,
        status: 'verified'
      }
    ]
  },
  {
    id: 'sch-008',
    npsn: '20502101',
    name: 'SMKN 1 Driyorejo',
    level: 'SMK',
    district: 'Driyorejo',
    city: 'Kab. Gresik',
    address: 'Jl. Raya Driyorejo No.1, Cangkir, Kab. Gresik',
    accreditationGrade: 'B',
    lastAccreditationYear: 2019,
    currentStageNumber: 4,
    slaStatus: 'overdue',
    slaDaysDifference: 15,
    claimedScore: 90.2,
    verifiedScore: 86.8,
    bosBudget: {
      totalReceived: 1650000000,
      absorbed: 1580000000,
      absorptionRate: 95.8,
      reportedAllocations: {
        sarpras: 610000000,
        operasional: 490000000,
        guruHonor: 280000000,
        digitalisasi: 200000000
      }
    },
    aiRiskLevel: 'bottleneck',
    aiAssessorBrief: {
      summary: 'Tahap visitasi lapangan tertunda lebih dari 25 hari dari jadwal awal akibat penyesuaian jadwal asesor eksternal permesinan.',
      discrepancyRate: 3.8,
      riskBadge: 'Bottleneck Penjadwalan',
      mandatoryInvestigationFocus: [
        'Audit ketersediaan alat pelindung diri di lab bengkel las',
        'Validasi jadwal re-visitasi bersama dinas pendidikan cabang'
      ],
      flags: ['Keterlambatan Visitasi', 'Verifikasi Vokasi'],
      generatedAt: '2026-10-25 10:45 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 13, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 9, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'completed', daysSpent: 12, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'overdue', daysSpent: 25, maxSlaDays: 10, startedAt: '2026-10-01' },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 91, verifiedScore: 88, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 89, verifiedScore: 87, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 91, verifiedScore: 88, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 90, verifiedScore: 87, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 89, verifiedScore: 86, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 92, verifiedScore: 87, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 90, verifiedScore: 87, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 89, verifiedScore: 85, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-011',
        author: 'Fajar Nugroho',
        authorRole: 'Siswa',
        date: '2026-10-21',
        facilityTag: 'Sarpras Olahraga',
        text: 'Lapangan olahraga dan bengkel kejuruan sudah siap ditinjau sejak bulan lalu, semoga tim asesor segera datang.',
        upvotes: 19,
        status: 'verified'
      }
    ]
  },

  // --- SCENARIO 3: Cosmetic Accreditation / High Discrepancy - AI Red Alert ---
  {
    id: 'sch-009',
    npsn: '20599104',
    name: 'SMAN X Waru',
    level: 'SMA',
    district: 'Waru',
    city: 'Kab. Sidoarjo',
    address: 'Jl. Brigjen Katamso Km.14, Waru, Kab. Sidoarjo',
    accreditationGrade: 'Dalam Proses',
    lastAccreditationYear: 2019,
    currentStageNumber: 4,
    slaStatus: 'warning',
    slaDaysDifference: 2,
    claimedScore: 96.4,
    verifiedScore: 61.2, // DISKREPANSI EKSTREM: 35.2 poin selisih!
    bosBudget: {
      totalReceived: 1450000000,
      absorbed: 1420000000,
      absorptionRate: 97.9,
      reportedAllocations: {
        sarpras: 780000000, // Klaim belanja sarpras 780 juta
        operasional: 340000000,
        guruHonor: 180000000,
        digitalisasi: 120000000
      }
    },
    aiRiskLevel: 'high_discrepancy',
    aiAssessorBrief: {
      summary: 'PERINGATAN ANOMALI TINGKAT TINGGI (41.2% GAP MUTU). Sekolah mengklaim kesiapan laboratorium komputer 95% dan menyerap dana BOS Sarpras Rp 780 Juta untuk 60 unit PC Core-i7. Namun, sistem mengidentifikasi 19 laporan warga terverifikasi dengan bukti foto visual yang menunjukkan 35 monitor rusak/mati, atap lab bocor berjamur, dan toilet siswa mampet parah tanpa air mengalir.',
      discrepancyRate: 41.2,
      riskBadge: 'Bahaya: Kosmetik Akreditasi Terdeteksi',
      mandatoryInvestigationFocus: [
        'INVESTIGASI FISIK FISKAL: Cocokkan nomor seri (serial number) 60 PC faktur BOS 2025 dengan unit riil di Laboratorium Komputer B',
        'INSPEKSI SANITASI LANGSUNG: Uji fungsi air, pintu, dan instalasi septictank di 6 bilik toilet siswa sayap timur',
        'AUDIT PEMBELIAN PERPUSTAKAAN: Validasi fisik buku kurikulum nasional senilai Rp 120 Juta yang dilaporkan dibeli namun tidak ada di rak'
      ],
      flags: [
        'Anomali Fisik vs Faktur BOS',
        '19 Laporan Foto Warga Valid',
        'Skor Sarpras Klaim 96 vs Riil 48',
        'Indikasi Manipulasi Dokumen Sispena'
      ],
      generatedAt: '2026-10-29 18:00 WIB'
    },
    stageDetails: [
      {
        stageNumber: 1,
        name: 'Submit Berkas Sispena',
        status: 'completed',
        daysSpent: 12,
        maxSlaDays: 14,
        completedAt: '2026-09-10',
        notes: 'Sekolah mengklaim nilai sempurna pada 4 instrumen sarpras utama.'
      },
      {
        stageNumber: 2,
        name: 'Verifikasi Berkas Provinsi',
        status: 'completed',
        daysSpent: 8,
        maxSlaDays: 10,
        completedAt: '2026-09-18',
        notes: 'Lolos verifikasi administratif berdasarkan berkas foto formal.'
      },
      {
        stageNumber: 3,
        name: 'Penugasan Tim Asesor',
        status: 'completed',
        daysSpent: 9,
        maxSlaDays: 14,
        completedAt: '2026-09-27',
        notes: 'Tim asesor ditugaskan untuk audit tanggal 6 November 2026.'
      },
      {
        stageNumber: 4,
        name: 'Visitasi Lapangan',
        status: 'in_progress',
        daysSpent: 7,
        maxSlaDays: 10,
        startedAt: '2026-10-24',
        notes: 'STATUS DARURAT AUDIT: Asesor wajib membawa AI Field-Assessor Brief untuk investigasi mendalam.'
      },
      {
        stageNumber: 5,
        name: 'Pleno & Terbit Sertifikat SK',
        status: 'pending',
        daysSpent: 0,
        maxSlaDays: 14
      }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 94, verifiedScore: 78, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 95, verifiedScore: 76, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 96, verifiedScore: 72, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 95, verifiedScore: 74, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 93, verifiedScore: 70, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 98, verifiedScore: 44, fullMark: 100 }, // GAP PARAH: 98 vs 44!
      { subject: 'Standar Pengelolaan', claimedScore: 96, verifiedScore: 62, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 97, verifiedScore: 52, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-pending-01',
        author: 'Arif Wicaksono',
        authorRole: 'Wali Murid',
        date: '2026-10-31',
        facilityTag: 'Lab Komputer',
        text: 'Temuan pagi ini: 12 unit UPS pada rak server Lab Komputer B dalam kondisi mati total dan berdebu tebal, tidak sesuai kuitansi pengadaan BOS tahap II.',
        photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
        upvotes: 28,
        status: 'investigating',
        followUpStatus: 'waiting_response',
        satisfactionVotes: { satisfied: 2, unsatisfied: 24 },
        publicComments: [
          {
            id: 'cmt-waru-01',
            author: 'Doni Kurniawan',
            role: 'Wali Murid Kelas XI',
            text: 'Betul Pak Arif, minggu lalu anak saya praktikum TIK listriknya sempat jeglek karena UPS tidak berfungsi.',
            date: '2026-10-31'
          }
        ]
      },
      {
        id: 'rep-012',
        author: 'Dian Prasetyo',
        authorRole: 'Siswa',
        date: '2026-10-27',
        facilityTag: 'Lab Komputer',
        text: 'Sekolah mengklaim lab komputer modern siap pakai untuk ujian, tapi kenyataannya dari 40 komputer di Lab 2, hanya 8 yang menyala. Keyboard banyak yang tombolnya copot dan atap di pojok kiri bocor emberan setiap hujan deras.',
        photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
        upvotes: 114,
        status: 'verified',
        followUpStatus: 'in_progress_school',
        officialResponse: {
          responderName: 'Plt. Kepala SMAN X Waru',
          responderRole: 'Pihak Manajemen Sekolah',
          text: 'Terima kasih atas laporannya. Saat ini teknisi vendor sedang melakukan klaim garansi terhadap 22 unit PC dan perbaikan talang atap Gedung Lab B telah dijadwalkan pada pencairan BOS Tahap berjalan.',
          respondedAt: '2026-10-29 11:20 WIB'
        },
        satisfactionVotes: { satisfied: 14, unsatisfied: 82 },
        publicComments: [
          {
            id: 'cmt-waru-02',
            author: 'Siti Aminah',
            role: 'Wali Murid',
            text: 'Sampai hari Jumat kemarin atap pojok lab masih ditaruh ember plastik, mohon buktinya sebelum tim asesor datang!',
            date: '2026-10-30'
          }
        ]
      },
      {
        id: 'rep-013',
        author: 'Hj. Endang Sulistyowati',
        authorRole: 'Wali Murid',
        date: '2026-10-24',
        facilityTag: 'Sanitasi',
        text: 'Toilet siswa baunya sampai ke koridor kelas XI. Air kran sering mati sejak bulan Agustus. Anak saya sampai menahan buang air kecil sampai pulang ke rumah karena jijik. Padahal kami dengar dana BOS sarpras ratusan juta diserap.',
        photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        upvotes: 98,
        status: 'verified',
        followUpStatus: 'in_progress_school',
        officialResponse: {
          responderName: 'Waka Sarpras SMAN X Waru',
          responderRole: 'Komite & Sarpras Sekolah',
          text: 'Terima kasih atas laporannya, perbaikan pompa air dan sanitasi Gedung B telah dianggarkan pada pencairan BOS Tahap II minggu ini dan sedang dikerjakan tukang.',
          respondedAt: '2026-10-26 15:40 WIB'
        },
        satisfactionVotes: { satisfied: 19, unsatisfied: 64 }
      },
      {
        id: 'rep-014',
        author: 'Bambang Irawan',
        authorRole: 'Komite Sekolah',
        date: '2026-10-21',
        facilityTag: 'Transparansi Dana',
        text: 'Sebagai perwakilan wali murid kami tidak pernah diajak musyawarah RKAS dan penetapan alokasi BOS sarpras. Tiba-tiba di SPJ tertulis renovasi lab tuntas 100%. Tolong tim asesor BAN-PDM jangan cuma duduk di ruang kepala sekolah!',
        upvotes: 145,
        status: 'verified'
      },
      {
        id: 'rep-015',
        author: 'Satria Maulana',
        authorRole: 'Siswa',
        date: '2026-10-18',
        facilityTag: 'Perpustakaan',
        text: 'Buku-buku baru paket yang katanya datang tahun ini tidak pernah dibagikan ke siswa, hanya dipajang beberapa eksemplar saat ada kunjungan tamu.',
        upvotes: 56,
        status: 'verified'
      }
    ],
    scheduledVisitationDate: '2026-11-06',
    assessorTeam: {
      lead: 'Prof. Dr. Ir. H. Bambang Sudarmono, M.T',
      members: ['Drs. M. Taufik, M.Ed']
    }
  },
  {
    id: 'sch-010',
    npsn: '20539981',
    name: 'SMA Mandiri Surabaya',
    level: 'SMA',
    district: 'Rungkut',
    city: 'Kota Surabaya',
    address: 'Jl. Rungkut Asri Timur No.8, Surabaya',
    accreditationGrade: 'B',
    lastAccreditationYear: 2020,
    currentStageNumber: 4,
    slaStatus: 'warning',
    slaDaysDifference: 1,
    claimedScore: 92.1,
    verifiedScore: 66.8,
    bosBudget: {
      totalReceived: 1100000000,
      absorbed: 1080000000,
      absorptionRate: 98.1,
      reportedAllocations: {
        sarpras: 490000000,
        operasional: 310000000,
        guruHonor: 180000000,
        digitalisasi: 100000000
      }
    },
    aiRiskLevel: 'high_discrepancy',
    aiAssessorBrief: {
      summary: 'Ditemukan selisih 25.3 poin pada standar sarana prasarana dan pembiayaan. Bukti foto menunjukkan laboratorium biologi dipakai sebagai gudang inventaris rusak.',
      discrepancyRate: 27.4,
      riskBadge: 'Diskrepansi Sarpras Tinggi',
      mandatoryInvestigationFocus: [
        'Cek alih fungsi ruang praktikum IPA menjadi gudang',
        'Validasi rekapitulasi honorarium guru tidak tetap'
      ],
      flags: ['12 Laporan Warga', 'Ruang Praktikum Tidak Layak'],
      generatedAt: '2026-10-27 13:40 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 11, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 9, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'completed', daysSpent: 10, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'in_progress', daysSpent: 6, maxSlaDays: 10, startedAt: '2026-10-25' },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 91, verifiedScore: 78, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 92, verifiedScore: 76, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 90, verifiedScore: 74, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 91, verifiedScore: 75, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 89, verifiedScore: 72, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 95, verifiedScore: 51, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 93, verifiedScore: 68, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 94, verifiedScore: 59, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-pending-03',
        author: 'Dimas Pratama',
        authorRole: 'Alumni',
        date: '2026-10-30',
        facilityTag: 'Transparansi Dana',
        text: 'Papan rekapitulasi penggunaan Dana BOS semester ganjil di lobi tata usaha masih menampilkan data tahun 2024 dan belum diperbarui untuk publik.',
        upvotes: 14,
        status: 'investigating'
      },
      {
        id: 'rep-016',
        author: 'Maya Anggraini',
        authorRole: 'Wali Murid',
        date: '2026-10-22',
        facilityTag: 'Lab Komputer',
        text: 'Lab IPA dipenuhi tumpukan meja kursi patah sejak setahun lalu. Anak-anak praktikum hanya lewat video YouTube di ruang kelas biasa.',
        upvotes: 49,
        status: 'verified'
      }
    ]
  },
  {
    id: 'sch-011',
    npsn: '20509932',
    name: 'SMK Teknologi Bakti Sidoarjo',
    level: 'SMK',
    district: 'Taman',
    city: 'Kab. Sidoarjo',
    address: 'Jl. Raya Geluran No.45, Taman, Kab. Sidoarjo',
    accreditationGrade: 'B',
    lastAccreditationYear: 2019,
    currentStageNumber: 4,
    slaStatus: 'warning',
    slaDaysDifference: 3,
    claimedScore: 88.5,
    verifiedScore: 60.4,
    bosBudget: {
      totalReceived: 1380000000,
      absorbed: 1350000000,
      absorptionRate: 97.8,
      reportedAllocations: {
        sarpras: 640000000,
        operasional: 390000000,
        guruHonor: 210000000,
        digitalisasi: 110000000
      }
    },
    aiRiskLevel: 'high_discrepancy',
    aiAssessorBrief: {
      summary: 'Klaim pembaruan 30 unit mesin bubut kejuruan dan bengkel kelistrikan tidak terbukti pada audit visual warga. Hanya ditemukan 4 unit mesin aktif.',
      discrepancyRate: 31.7,
      riskBadge: 'Diskrepansi Vokasi Kritis',
      mandatoryInvestigationFocus: [
        'Audit fisik mesin bubut sesuai kuitansi belanja sarpras BOS Vokasi',
        'Wawancara acak siswa kelas XII jurusan Teknik Pemesinan'
      ],
      flags: ['Mesin Praktek Fiktif Parsial', '8 Laporan Siswa Terverifikasi'],
      generatedAt: '2026-10-26 17:10 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 12, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 8, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'completed', daysSpent: 11, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'in_progress', daysSpent: 7, maxSlaDays: 10, startedAt: '2026-10-24' },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 89, verifiedScore: 71, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 88, verifiedScore: 72, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 89, verifiedScore: 68, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 87, verifiedScore: 70, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 86, verifiedScore: 66, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 92, verifiedScore: 42, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 88, verifiedScore: 61, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 89, verifiedScore: 54, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-017',
        author: 'Budi Santoso',
        authorRole: 'Siswa',
        date: '2026-10-23',
        facilityTag: 'Lab Komputer',
        text: 'Mesin praktek bubut banyak yang rusak dan tidak ada oli pelumas. Kami harus antre 6 orang per mesin saat jam pelajaran bengkel.',
        upvotes: 62,
        status: 'verified'
      }
    ]
  },
  {
    id: 'sch-012',
    npsn: '20538812',
    name: 'SMP Bina Prestasi Surabaya',
    level: 'SMP',
    district: 'Sawahan',
    city: 'Kota Surabaya',
    address: 'Jl. Dukuh Kupang Barat No.22, Sawahan, Surabaya',
    accreditationGrade: 'B',
    lastAccreditationYear: 2019,
    currentStageNumber: 3,
    slaStatus: 'warning',
    slaDaysDifference: 1,
    claimedScore: 89.0,
    verifiedScore: 68.2,
    bosBudget: {
      totalReceived: 820000000,
      absorbed: 795000000,
      absorptionRate: 96.9,
      reportedAllocations: {
        sarpras: 290000000,
        operasional: 315000000,
        guruHonor: 130000000,
        digitalisasi: 60000000
      }
    },
    aiRiskLevel: 'high_discrepancy',
    aiAssessorBrief: {
      summary: 'Klaim sarana sanitasi bersih dan ramah anak bertolak belakang dengan 7 laporan wali murid yang mengeluhkan minimnya toilet fungsional.',
      discrepancyRate: 23.3,
      riskBadge: 'Diskrepansi Sanitasi & Sarpras',
      mandatoryInvestigationFocus: [
        'Uji petik rasio ketersediaan jamban terhadap jumlah siswa perempuan',
        'Validasi laporan LPJ BOS operasional kebersihan'
      ],
      flags: ['Laporan Sanitasi Warga', 'Skor Sarpras Meragukan'],
      generatedAt: '2026-10-28 14:00 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 10, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 7, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'in_progress', daysSpent: 11, maxSlaDays: 14, startedAt: '2026-10-20' },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'pending', daysSpent: 0, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 89, verifiedScore: 78, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 88, verifiedScore: 77, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 89, verifiedScore: 76, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 88, verifiedScore: 75, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 87, verifiedScore: 73, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 92, verifiedScore: 50, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 90, verifiedScore: 70, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 89, verifiedScore: 61, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-018',
        author: 'Ratna Sulistia',
        authorRole: 'Wali Murid',
        date: '2026-10-22',
        facilityTag: 'Sanitasi',
        text: 'Toilet sekolah hanya 2 bilik yang bisa digunakan untuk ratusan siswa. Antrean panjang setiap istirahat.',
        upvotes: 38,
        status: 'verified',
        followUpStatus: 'in_progress_school',
        officialResponse: {
          responderName: 'Kepala SMP Bina Prestasi Surabaya',
          responderRole: 'Kepala Sekolah',
          text: 'Terima kasih Ibu Ratna. Renovasi 4 bilik toilet lantai 1 sedang berlangsung mulai pekan ini dengan estimasi tuntas dalam 10 hari kerja.',
          respondedAt: '2026-10-24 09:30 WIB'
        },
        satisfactionVotes: { satisfied: 24, unsatisfied: 8 }
      }
    ]
  },

  // --- MULTI-PROVINCE & MULTI-CITY GRANULAR DRILL-DOWN SCHOOLS (FINAL SUBMISSION) ---
  {
    id: 'sch-013',
    npsn: '20533660',
    name: 'SMAN 3 Malang',
    level: 'SMA',
    provinsi: 'Jawa Timur',
    kabupatenKota: 'Kota Malang',
    kecamatan: 'Klojen',
    district: 'Klojen',
    city: 'Kota Malang',
    address: 'Jl. Sultan Agung Utara No.7, Klojen, Kec. Klojen, Kota Malang',
    accreditationGrade: 'A',
    lastAccreditationYear: 2021,
    currentStageNumber: 5,
    slaStatus: 'on_track',
    slaDaysDifference: -5,
    claimedScore: 96.2,
    verifiedScore: 94.8,
    bosBudget: {
      totalReceived: 1790000000,
      absorbed: 1758000000,
      absorptionRate: 98.2,
      reportedAllocations: {
        sarpras: 540000000,
        operasional: 590000000,
        guruHonor: 328000000,
        digitalisasi: 300000000
      }
    },
    aiRiskLevel: 'verified',
    aiAssessorBrief: {
      summary: 'Kesesuaian klaim dokumen Sispena dengan audit fisik warga di Kota Malang mencapai 98.5%. Laboratorium riset dan perpustakaan digital terverifikasi penuh.',
      discrepancyRate: 1.5,
      riskBadge: 'Integritas Sangat Baik',
      mandatoryInvestigationFocus: [
        'Verifikasi akhir berita acara pleno penerbitan SK Akreditasi A unggul',
        'Dokumentasi praktik baik (best-practice) keterbukaan papan dana BOS digital'
      ],
      flags: ['Dokumen Sah 100%', 'Transparansi BOS Terbaik Malang'],
      generatedAt: '2026-11-02 10:15 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 6, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 5, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'completed', daysSpent: 8, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'completed', daysSpent: 7, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'in_progress', daysSpent: 3, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 98, verifiedScore: 97, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 96, verifiedScore: 95, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 97, verifiedScore: 95, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 96, verifiedScore: 95, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 95, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 96, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 96, verifiedScore: 95, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 96, verifiedScore: 94, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-019',
        author: 'Dr. Wahyudianto',
        authorRole: 'Komite Sekolah',
        date: '2026-10-29',
        facilityTag: 'Transparansi Dana',
        text: 'Setiap rupiah serapan Dana BOS SMAN 3 Malang dipublikasikan secara real-time di dashboard lobi sekolah dan grup resmi orang tua.',
        upvotes: 52,
        status: 'verified',
        followUpStatus: 'resolved',
        officialResponse: {
          responderName: 'Kepala SMAN 3 Malang',
          responderRole: 'Manajemen Sekolah',
          text: 'Terima kasih atas sinergi Komite Sekolah dan orang tua siswa dalam mengawal akuntabilitas anggaran sekolah.',
          respondedAt: '2026-10-30 08:45 WIB'
        },
        satisfactionVotes: { satisfied: 50, unsatisfied: 0 }
      }
    ]
  },
  {
    id: 'sch-014',
    npsn: '20102568',
    name: 'SMAN 70 Jakarta Selatan',
    level: 'SMA',
    provinsi: 'DKI Jakarta',
    kabupatenKota: 'Jakarta Selatan',
    kecamatan: 'Kebayoran Baru',
    district: 'Kebayoran Baru',
    city: 'Jakarta Selatan',
    address: 'Jl. Bulungan Blok C No.1, Kramat Pela, Kec. Kebayoran Baru, Jakarta Selatan',
    accreditationGrade: 'A',
    lastAccreditationYear: 2021,
    currentStageNumber: 4,
    slaStatus: 'on_track',
    slaDaysDifference: -3,
    claimedScore: 95.4,
    verifiedScore: 92.8,
    bosBudget: {
      totalReceived: 2240000000,
      absorbed: 2195000000,
      absorptionRate: 98.0,
      reportedAllocations: {
        sarpras: 680000000,
        operasional: 740000000,
        guruHonor: 415000000,
        digitalisasi: 360000000
      }
    },
    aiRiskLevel: 'verified',
    aiAssessorBrief: {
      summary: 'Audit fasilitas laboratorium komputer dan perpustakaan di Kebayoran Baru menunjukkan tingkat kepatuhan tinggi terhadap standar BAN-PDM DKI Jakarta.',
      discrepancyRate: 2.6,
      riskBadge: 'Integritas Sangat Baik',
      mandatoryInvestigationFocus: [
        'Uji petik pemeliharaan sarana olahraga indoor dan tribun siswa',
        'Validasi integrasi e-RKAS DKI Jakarta dengan pelaporan BOS pusat'
      ],
      flags: ['Audit Publik Terverifikasi', 'SLA Provinsi DKI Tepat Waktu'],
      generatedAt: '2026-11-03 11:00 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 7, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 6, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'completed', daysSpent: 9, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'in_progress', daysSpent: 4, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 97, verifiedScore: 95, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 96, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 95, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 95, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 94, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 96, verifiedScore: 91, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 95, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 95, verifiedScore: 92, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-020',
        author: 'Rizky Pratama',
        authorRole: 'Wali Murid',
        date: '2026-11-01',
        facilityTag: 'Lab Komputer',
        text: 'Fasilitas laboratorium multimedia dan smart classroom sangat mendukung pembelajaran berbasis proyek.',
        upvotes: 33,
        status: 'verified',
        followUpStatus: 'resolved',
        officialResponse: {
          responderName: 'Kepala SMAN 70 Jakarta',
          responderRole: 'Kepala Sekolah',
          text: 'Terima kasih atas dukungannya. Seluruh perangkat smart classroom diaudit berkala setiap semester.',
          respondedAt: '2026-11-02 09:10 WIB'
        },
        satisfactionVotes: { satisfied: 31, unsatisfied: 1 }
      }
    ]
  },
  {
    id: 'sch-015',
    npsn: '20219271',
    name: 'SMAN 3 Bandung',
    level: 'SMA',
    provinsi: 'Jawa Barat',
    kabupatenKota: 'Kota Bandung',
    kecamatan: 'Coblong',
    district: 'Coblong',
    city: 'Kota Bandung',
    address: 'Jl. Belitung No.8, Merdeka, Kec. Sumur Bandung / Coblong, Kota Bandung',
    accreditationGrade: 'A',
    lastAccreditationYear: 2021,
    currentStageNumber: 3,
    slaStatus: 'overdue',
    slaDaysDifference: 16,
    claimedScore: 94.6,
    verifiedScore: 91.2,
    bosBudget: {
      totalReceived: 1920000000,
      absorbed: 1850000000,
      absorptionRate: 96.4,
      reportedAllocations: {
        sarpras: 610000000,
        operasional: 640000000,
        guruHonor: 340000000,
        digitalisasi: 260000000
      }
    },
    aiRiskLevel: 'bottleneck',
    aiAssessorBrief: {
      summary: 'Kualitas akademik dan fasilitas sekolah sangat baik, namun penjadwalan asesor wilayah Kota Bandung mengalami keterlambatan 16 hari di atas SLA.',
      discrepancyRate: 3.4,
      riskBadge: 'Bottleneck Jadwal Asesor Jabar',
      mandatoryInvestigationFocus: [
        'Percepatan penerbitan surat tugas asesor BAN-PDM Provinsi Jawa Barat',
        'Pemeriksaan pemeliharaan bangunan cagar budaya ruang kelas utama'
      ],
      flags: ['Overdue SLA 16 Hari', 'Mutu Sarpras Terverifikasi'],
      generatedAt: '2026-11-03 14:20 WIB'
    },
    stageDetails: [
      { stageNumber: 1, name: 'Submit Berkas Sispena', status: 'completed', daysSpent: 8, maxSlaDays: 14 },
      { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', status: 'completed', daysSpent: 7, maxSlaDays: 10 },
      { stageNumber: 3, name: 'Penugasan Tim Asesor', status: 'overdue', daysSpent: 30, maxSlaDays: 14 },
      { stageNumber: 4, name: 'Visitasi Lapangan', status: 'pending', daysSpent: 0, maxSlaDays: 10 },
      { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', status: 'pending', daysSpent: 0, maxSlaDays: 14 }
    ],
    radarStandards: [
      { subject: 'Standar Kelulusan', claimedScore: 96, verifiedScore: 94, fullMark: 100 },
      { subject: 'Standar Isi', claimedScore: 95, verifiedScore: 93, fullMark: 100 },
      { subject: 'Standar Proses', claimedScore: 95, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar Penilaian', claimedScore: 94, verifiedScore: 92, fullMark: 100 },
      { subject: 'Standar PTK', claimedScore: 94, verifiedScore: 91, fullMark: 100 },
      { subject: 'Standar Sarpras', claimedScore: 94, verifiedScore: 88, fullMark: 100 },
      { subject: 'Standar Pengelolaan', claimedScore: 95, verifiedScore: 91, fullMark: 100 },
      { subject: 'Standar Pembiayaan', claimedScore: 94, verifiedScore: 90, fullMark: 100 }
    ],
    citizenReports: [
      {
        id: 'rep-021',
        author: 'Kang Dedi Mulyadi',
        authorRole: 'Alumni',
        date: '2026-10-28',
        facilityTag: 'Perpustakaan',
        text: 'Koleksi literasi digital perpustakaan sudah sangat maju, hanya menunggu jadwal visitasi asesor turun.',
        upvotes: 41,
        status: 'verified',
        followUpStatus: 'resolved',
        officialResponse: {
          responderName: 'Wakasek Humas SMAN 3 Bandung',
          responderRole: 'Manajemen Sekolah',
          text: 'Hatur nuhun atas perhatiannya. Kami telah berkoordinasi dengan BAN-PDM Jabar untuk penjadwalan visitasi pekan depan.',
          respondedAt: '2026-10-29 13:00 WIB'
        },
        satisfactionVotes: { satisfied: 38, unsatisfied: 2 }
      }
    ]
  }
];

