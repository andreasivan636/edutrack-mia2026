import {
  School,
  TransparencyStats,
  CitizenReportItem,
  AuthUser,
  CreateSchoolPayload,
  UpdateSlaPayload,
  SlaStatus,
  AccreditationStageItem,
  FacilityTag,
  FollowUpStatus
} from '../types/school';
import { mockSchools, mockTransparencyStats } from '../data/mockSchools';

const API_BASE = 'http://localhost:8080/api';

const STORAGE_KEYS = {
  SCHOOLS: 'edutrack_schools_v3',
  STATS: 'edutrack_stats_v3',
  AUTH: 'edutrack_auth_v2'
};

export const DEFAULT_SNP_SUBJECTS = [
  'Standar Kelulusan',
  'Standar Isi',
  'Standar Proses',
  'Standar Penilaian',
  'Standar PTK',
  'Standar Sarpras',
  'Standar Pengelolaan',
  'Standar Pembiayaan'
];

export const STAGE_METADATA: { stageNumber: number; name: string; maxSlaDays: number }[] = [
  { stageNumber: 1, name: 'Submit Berkas Sispena', maxSlaDays: 14 },
  { stageNumber: 2, name: 'Verifikasi Berkas Provinsi', maxSlaDays: 10 },
  { stageNumber: 3, name: 'Penugasan Tim Asesor', maxSlaDays: 14 },
  { stageNumber: 4, name: 'Visitasi Lapangan', maxSlaDays: 10 },
  { stageNumber: 5, name: 'Pleno & Terbit Sertifikat SK', maxSlaDays: 14 }
];

function normalizeSchoolData(schools: School[]): School[] {
  return schools.map((s) => {
    const provinsi =
      s.provinsi ||
      (s.city.includes('Jakarta')
        ? 'DKI Jakarta'
        : s.city.includes('Bandung')
        ? 'Jawa Barat'
        : 'Jawa Timur');
    const kabupatenKota = s.kabupatenKota || s.city;
    const kecamatan = s.kecamatan || s.district;

    const citizenReports: CitizenReportItem[] = (s.citizenReports || []).map((r) => {
      const defaultStatus: FollowUpStatus =
        r.followUpStatus ||
        (r.status === 'investigating'
          ? 'waiting_response'
          : s.aiRiskLevel === 'high_discrepancy'
          ? 'in_progress_school'
          : 'resolved');

      const defaultResponse =
        r.officialResponse ||
        (defaultStatus !== 'waiting_response'
          ? {
              responderName: `Kepala ${s.name}`,
              responderRole: 'Pihak Manajemen & Tim BOS Sekolah',
              text:
                defaultStatus === 'resolved'
                  ? `Terima kasih atas laporan dan pengawasan warga pada fasilitas ${r.facilityTag}. Tindak lanjut pemeliharaan telah dituntaskan sesuai RKAS BOS dan diverifikasi bersama Komite Sekolah.`
                  : `Terima kasih atas masukannya terkait ${r.facilityTag}. Pihak sekolah telah menjadwalkan perbaikan fisik pada pencairan Dana BOS tahap berjalan minggu ini.`,
              respondedAt: `${r.date} 14:30 WIB`
            }
          : undefined);

      return {
        ...r,
        followUpStatus: defaultStatus,
        officialResponse: defaultResponse,
        satisfactionVotes: r.satisfactionVotes || {
          satisfied: defaultStatus === 'resolved' ? Math.max(8, Math.round(r.upvotes * 0.82)) : 5,
          unsatisfied: defaultStatus === 'resolved' ? 1 : Math.max(4, Math.round(r.upvotes * 0.45))
        },
        publicComments: r.publicComments || []
      };
    });

    return {
      ...s,
      provinsi,
      kabupatenKota,
      kecamatan,
      citizenReports
    };
  });
}

function cloneDefaultSchools(): School[] {
  return normalizeSchoolData(JSON.parse(JSON.stringify(mockSchools)));
}

function cloneDefaultStats(): TransparencyStats {
  return JSON.parse(JSON.stringify(mockTransparencyStats));
}

function loadPersistedSchools(): School[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeSchoolData(parsed);
      }
    }
  } catch {
    // ignore storage errors
  }
  const initial = cloneDefaultSchools();
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(initial));
  } catch {
    // ignore
  }
  return initial;
}

function loadPersistedStats(): TransparencyStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.totalSchoolsTracked === 'number') {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  const initial = cloneDefaultStats();
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initial));
  } catch {
    // ignore
  }
  return initial;
}

// Persistent state synchronized with localStorage
let localSchools: School[] = loadPersistedSchools();
let localStats: TransparencyStats = loadPersistedStats();

function persistLocalState() {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(localSchools));
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(localStats));
  } catch {
    // ignore storage quota errors
  }
}

function formatWibNow(): string {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0];
  const timePart = now.toTimeString().slice(0, 5);
  return `${datePart} ${timePart} WIB`;
}

function buildStageDetails(currentStageNumber: number, slaStatus: SlaStatus, existing?: AccreditationStageItem[]): AccreditationStageItem[] {
  const today = new Date().toISOString().split('T')[0];
  return STAGE_METADATA.map((meta) => {
    const prev = existing?.find((st) => st.stageNumber === meta.stageNumber);
    if (meta.stageNumber < currentStageNumber) {
      return {
        stageNumber: meta.stageNumber,
        name: meta.name,
        status: 'completed',
        daysSpent: prev && prev.daysSpent > 0 ? prev.daysSpent : Math.max(4, Math.floor(meta.maxSlaDays * 0.65)),
        maxSlaDays: meta.maxSlaDays,
        completedAt: prev?.completedAt || today,
        responsibleOfficer: prev?.responsibleOfficer || 'Sekretariat BAN-PDM Jatim',
        notes: prev?.notes || 'Tahapan telah diverifikasi dan dinyatakan selesai.'
      };
    }
    if (meta.stageNumber === currentStageNumber) {
      const isOverdue = slaStatus === 'overdue';
      return {
        stageNumber: meta.stageNumber,
        name: meta.name,
        status: isOverdue ? 'overdue' : 'in_progress',
        daysSpent: isOverdue
          ? Math.max(meta.maxSlaDays + 12, prev?.daysSpent || meta.maxSlaDays + 12)
          : Math.min(meta.maxSlaDays - 2, Math.max(3, prev?.daysSpent || 5)),
        maxSlaDays: meta.maxSlaDays,
        startedAt: prev?.startedAt || today,
        responsibleOfficer: prev?.responsibleOfficer || 'Dr. Hendra, M.Pd — Tim BAN-PDM Jatim',
        notes: isOverdue
          ? 'PERINGATAN SLA: Melewati batas waktu standar, memerlukan disposisi percepatan BAN-PDM.'
          : 'Sedang dalam proses pengawalan sesuai koridor SLA.'
      };
    }
    return {
      stageNumber: meta.stageNumber,
      name: meta.name,
      status: 'pending',
      daysSpent: 0,
      maxSlaDays: meta.maxSlaDays,
      notes: 'Menunggu penyelesaian tahapan sebelumnya.'
    };
  });
}

// Helper for network requests with 1.8s timeout
async function requestBackend<T>(path: string, options?: RequestInit): Promise<{ ok: boolean; data?: T }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = (await response.json()) as T;
      return { ok: true, data };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

const DAPODIK_SYNC_BATCH_POOL: CreateSchoolPayload[] = [
  {
    name: 'SMAN 15 Surabaya',
    npsn: '20532230',
    level: 'SMA',
    district: 'Gayungan',
    city: 'Kota Surabaya',
    address: 'Jl. Menanggal Selatan No.103, Gayungan, Kota Surabaya',
    bosTotalReceived: 1680000000,
    bosAbsorptionRate: 97.4,
    sourceSystem: 'DAPODIK_SISPENA_SYNC',
    standardsClaimed: [
      { subject: 'Standar Kelulusan', claimedScore: 95 },
      { subject: 'Standar Isi', claimedScore: 94 },
      { subject: 'Standar Proses', claimedScore: 94 },
      { subject: 'Standar Penilaian', claimedScore: 93 },
      { subject: 'Standar PTK', claimedScore: 92 },
      { subject: 'Standar Sarpras', claimedScore: 95 },
      { subject: 'Standar Pengelolaan', claimedScore: 93 },
      { subject: 'Standar Pembiayaan', claimedScore: 94 }
    ]
  },
  {
    name: 'SMKN 1 Buduran Sidoarjo',
    npsn: '20501720',
    level: 'SMK',
    district: 'Buduran',
    city: 'Kab. Sidoarjo',
    address: 'Jl. Jenggolo No.1B, Bedrek, Siwalanpanji, Kec. Buduran, Sidoarjo',
    bosTotalReceived: 1940000000,
    bosAbsorptionRate: 96.8,
    sourceSystem: 'DAPODIK_SISPENA_SYNC',
    standardsClaimed: [
      { subject: 'Standar Kelulusan', claimedScore: 93 },
      { subject: 'Standar Isi', claimedScore: 92 },
      { subject: 'Standar Proses', claimedScore: 94 },
      { subject: 'Standar Penilaian', claimedScore: 92 },
      { subject: 'Standar PTK', claimedScore: 91 },
      { subject: 'Standar Sarpras', claimedScore: 94 },
      { subject: 'Standar Pengelolaan', claimedScore: 92 },
      { subject: 'Standar Pembiayaan', claimedScore: 92 }
    ]
  },
  {
    name: 'SMPN 6 Surabaya',
    npsn: '20532568',
    level: 'SMP',
    district: 'Gubeng',
    city: 'Kota Surabaya',
    address: 'Jl. Jawa No.24, Gubeng, Kec. Gubeng, Kota Surabaya',
    bosTotalReceived: 1320000000,
    bosAbsorptionRate: 98.1,
    sourceSystem: 'DAPODIK_SISPENA_SYNC',
    standardsClaimed: [
      { subject: 'Standar Kelulusan', claimedScore: 94 },
      { subject: 'Standar Isi', claimedScore: 93 },
      { subject: 'Standar Proses', claimedScore: 93 },
      { subject: 'Standar Penilaian', claimedScore: 92 },
      { subject: 'Standar PTK', claimedScore: 91 },
      { subject: 'Standar Sarpras', claimedScore: 93 },
      { subject: 'Standar Pengelolaan', claimedScore: 92 },
      { subject: 'Standar Pembiayaan', claimedScore: 93 }
    ]
  }
];

export const apiService = {
  // ==================== AUTHENTICATION ====================
  getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (raw) {
        return JSON.parse(raw) as AuthUser;
      }
    } catch {
      // ignore
    }
    return null;
  },

  async login(payload: {
    nipOrEmail?: string;
    password?: string;
    isDemoOneClick?: boolean;
  }): Promise<{ data: AuthUser; isFallback: boolean }> {
    const res = await requestBackend<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const fallbackUser: AuthUser = {
      id: 'usr-banpdm-jatim-01',
      nip: payload.nipOrEmail?.trim() || '197804122005011004',
      email: payload.nipOrEmail?.includes('@')
        ? payload.nipOrEmail.trim()
        : 'hendra.asesor@banpdm-jatim.id',
      name: 'Dr. Hendra, M.Pd',
      role: 'asesor',
      roleLabel: 'Asesor BAN-PDM Jatim',
      region: 'Provinsi Jawa Timur',
      token: `edutrack-session-${Date.now()}`
    };

    const finalUser = res.ok && res.data ? res.data : fallbackUser;
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(finalUser));
    } catch {
      // ignore
    }

    return { data: finalUser, isFallback: !res.ok };
  },

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
      // ignore
    }
  },

  // ==================== READ OPERATIONS ====================
  async getSchools(): Promise<{ data: School[]; isFallback: boolean }> {
    const hasLocalCustomizations = Boolean(localStorage.getItem(STORAGE_KEYS.SCHOOLS));
    const res = await requestBackend<School[]>('/schools');

    if (res.ok && res.data && Array.isArray(res.data) && res.data.length > 0) {
      // Merge or sync with backend if backend is active
      if (!hasLocalCustomizations || res.data.length >= localSchools.length) {
        localSchools = res.data;
        persistLocalState();
      }
      return { data: localSchools, isFallback: false };
    }

    return { data: localSchools, isFallback: true };
  },

  async getSchoolById(id: string): Promise<{ data: School | undefined; isFallback: boolean }> {
    const res = await requestBackend<School>(`/schools/${id}`);
    if (res.ok && res.data) {
      return { data: res.data, isFallback: false };
    }
    return {
      data: localSchools.find((s) => s.id === id || s.npsn === id),
      isFallback: true
    };
  },

  async getStats(): Promise<{ data: TransparencyStats; isFallback: boolean }> {
    const res = await requestBackend<TransparencyStats>('/stats');
    if (res.ok && res.data) {
      return { data: localStats, isFallback: false };
    }
    return { data: localStats, isFallback: true };
  },

  // ==================== CITIZEN REPORT & MODERATION ====================
  async submitCitizenReport(
    schoolId: string,
    newReportData: {
      author: string;
      authorRole: 'Wali Murid' | 'Siswa' | 'Alumni' | 'Komite Sekolah' | 'Warga Sekitar';
      facilityTag: FacilityTag;
      text: string;
      photoUrl?: string;
    }
  ): Promise<{ data: CitizenReportItem; isFallback: boolean }> {
    const localReport: CitizenReportItem = {
      id: `rep-${Date.now()}`,
      author: newReportData.author || 'Warga Anonim (Terverifikasi NIK)',
      authorRole: newReportData.authorRole || 'Warga Sekitar',
      date: new Date().toISOString().split('T')[0],
      facilityTag: newReportData.facilityTag,
      text: newReportData.text,
      photoUrl: newReportData.photoUrl,
      upvotes: 1,
      status: 'investigating',
      followUpStatus: 'waiting_response',
      satisfactionVotes: { satisfied: 0, unsatisfied: 0 },
      publicComments: []
    };

    const res = await requestBackend<CitizenReportItem>(`/schools/${schoolId}/reports`, {
      method: 'POST',
      body: JSON.stringify({ ...newReportData, status: 'investigating' })
    });

    const savedReport: CitizenReportItem =
      res.ok && res.data
        ? { ...res.data, status: res.data.status || 'investigating' }
        : localReport;

    localSchools = localSchools.map((s) => {
      if (s.id === schoolId) {
        return {
          ...s,
          citizenReports: [savedReport, ...s.citizenReports]
        };
      }
      return s;
    });

    localStats = {
      ...localStats,
      totalCitizenReports: localStats.totalCitizenReports + 1
    };

    persistLocalState();
    return { data: savedReport, isFallback: !res.ok };
  },

  async verifyCitizenReport(
    reportId: string,
    status: 'verified' | 'countered',
    verifierName = 'Dr. Hendra, M.Pd'
  ): Promise<{
    report: CitizenReportItem | null;
    school: School | null;
    stats: TransparencyStats;
    isFallback: boolean;
  }> {
    const res = await requestBackend<{
      report: CitizenReportItem;
      school?: School;
      stats?: TransparencyStats;
    }>(`/reports/${reportId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status, verifiedBy: verifierName })
    });

    let updatedReport: CitizenReportItem | null = null;
    let updatedSchool: School | null = null;
    let previousStatus: 'verified' | 'investigating' | 'countered' | null = null;

    const nowStamp = formatWibNow();

    localSchools = localSchools.map((school) => {
      const targetReport = school.citizenReports.find((r) => r.id === reportId);
      if (!targetReport) return school;

      previousStatus = targetReport.status;

      const nextReports = school.citizenReports.map((r) => {
        if (r.id === reportId) {
          const modified: CitizenReportItem = {
            ...r,
            status,
            verifiedBy: verifierName,
            verifiedAt: nowStamp
          };
          updatedReport = modified;
          return modified;
        }
        return r;
      });

      // Dynamically recalculate validation score & AI Field-Assessor Brief when verified
      let nextVerifiedScore = school.verifiedScore;
      let nextRadar = [...school.radarStandards];
      let nextBrief = { ...school.aiAssessorBrief };
      let nextRisk = school.aiRiskLevel;

      if (status === 'verified' && previousStatus !== 'verified') {
        const lowerText = targetReport.text.toLowerCase();
        const isNegativeFinding =
          /rusak|mati|bocor|retak|bau|belum|kosong|mampet|fiktif|kotor|antre|patah|kurang|tua/.test(
            lowerText
          );

        const delta = isNegativeFinding ? -1.4 : 0.8;
        nextVerifiedScore = Number(
          Math.min(school.claimedScore, Math.max(38, school.verifiedScore + delta)).toFixed(1)
        );

        const targetStandardSubject =
          targetReport.facilityTag === 'Transparansi Dana'
            ? 'Standar Pembiayaan'
            : 'Standar Sarpras';

        nextRadar = school.radarStandards.map((std) => {
          if (std.subject === targetStandardSubject) {
            const stdDelta = isNegativeFinding ? -4 : 2;
            return {
              ...std,
              verifiedScore: Math.min(std.claimedScore, Math.max(30, std.verifiedScore + stdDelta))
            };
          }
          return std;
        });

        const nextDiscrepancy = Number(
          Math.max(0, school.claimedScore - nextVerifiedScore).toFixed(1)
        );

        const newFocusEntry = `VERIFIKASI AUDIT WARGA (${targetReport.facilityTag}): Tindak lanjuti temuan ${targetReport.author} — "${targetReport.text.slice(0, 90)}${targetReport.text.length > 90 ? '...' : ''}"`;
        const existingFocus = school.aiAssessorBrief.mandatoryInvestigationFocus.filter(
          (f) => f !== newFocusEntry
        );
        const existingFlags = Array.from(
          new Set(['Bukti Warga Terverifikasi Asesor', ...school.aiAssessorBrief.flags])
        );

        if (nextDiscrepancy >= 15) {
          nextRisk = 'high_discrepancy';
        } else if (school.slaStatus === 'overdue') {
          nextRisk = 'bottleneck';
        } else {
          nextRisk = 'verified';
        }

        nextBrief = {
          ...school.aiAssessorBrief,
          discrepancyRate: nextDiscrepancy,
          riskBadge:
            nextDiscrepancy >= 15
              ? 'Anomali Terkonfirmasi Audit Warga'
              : school.aiAssessorBrief.riskBadge,
          mandatoryInvestigationFocus: [newFocusEntry, ...existingFocus].slice(0, 4),
          flags: existingFlags,
          generatedAt: nowStamp
        };
      }

      const nextSchool: School = {
        ...school,
        citizenReports: nextReports,
        verifiedScore: nextVerifiedScore,
        radarStandards: nextRadar,
        aiAssessorBrief: nextBrief,
        aiRiskLevel: nextRisk
      };

      updatedSchool = nextSchool;
      return nextSchool;
    });

    if (previousStatus !== status) {
      if (status === 'verified' && previousStatus !== 'verified') {
        localStats = {
          ...localStats,
          verifiedReports: localStats.verifiedReports + 1
        };
      } else if (status === 'countered' && previousStatus === 'verified') {
        localStats = {
          ...localStats,
          verifiedReports: Math.max(0, localStats.verifiedReports - 1)
        };
      }
    }

    persistLocalState();
    return {
      report: updatedReport,
      school: updatedSchool,
      stats: localStats,
      isFallback: !res.ok
    };
  },

  async upvoteReport(schoolId: string, reportId: string): Promise<boolean> {
    localSchools = localSchools.map((s) => {
      if (s.id === schoolId) {
        return {
          ...s,
          citizenReports: s.citizenReports.map((r) =>
            r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r
          )
        };
      }
      return s;
    });
    persistLocalState();
    return true;
  },

  // ==================== TWO-WAY CITIZEN FEEDBACK LOOP ====================
  async submitOfficialSchoolResponse(
    schoolId: string,
    reportId: string,
    payload: {
      followUpStatus: FollowUpStatus;
      responderName: string;
      responderRole: string;
      text: string;
    }
  ): Promise<{ school: School | null; report: CitizenReportItem | null }> {
    const respondedAt = formatWibNow();
    let updatedSchool: School | null = null;
    let updatedReport: CitizenReportItem | null = null;

    await requestBackend(`/reports/${reportId}/response`, {
      method: 'PUT',
      body: JSON.stringify({ ...payload, schoolId, respondedAt })
    });

    localSchools = localSchools.map((s) => {
      if (s.id !== schoolId && !s.citizenReports.some((r) => r.id === reportId)) {
        return s;
      }
      const nextReports = s.citizenReports.map((r) => {
        if (r.id !== reportId) return r;
        const modified: CitizenReportItem = {
          ...r,
          followUpStatus: payload.followUpStatus,
          officialResponse: {
            responderName: payload.responderName.trim() || `Kepala ${s.name}`,
            responderRole: payload.responderRole.trim() || 'Manajemen Sekolah & Tim BOS',
            text: payload.text.trim(),
            respondedAt
          }
        };
        updatedReport = modified;
        return modified;
      });
      const nextSchool = { ...s, citizenReports: nextReports };
      updatedSchool = nextSchool;
      return nextSchool;
    });

    persistLocalState();
    return { school: updatedSchool, report: updatedReport };
  },

  async voteReportSatisfaction(
    schoolId: string,
    reportId: string,
    voteType: 'satisfied' | 'unsatisfied'
  ): Promise<School | null> {
    let updatedSchool: School | null = null;
    localSchools = localSchools.map((s) => {
      if (s.id !== schoolId) return s;
      const nextReports = s.citizenReports.map((r) => {
        if (r.id !== reportId) return r;
        const prevVotes = r.satisfactionVotes || { satisfied: 0, unsatisfied: 0 };
        return {
          ...r,
          satisfactionVotes: {
            satisfied:
              voteType === 'satisfied' ? prevVotes.satisfied + 1 : prevVotes.satisfied,
            unsatisfied:
              voteType === 'unsatisfied' ? prevVotes.unsatisfied + 1 : prevVotes.unsatisfied
          }
        };
      });
      const nextSchool = { ...s, citizenReports: nextReports };
      updatedSchool = nextSchool;
      return nextSchool;
    });
    persistLocalState();
    return updatedSchool;
  },

  async addReportPublicComment(
    schoolId: string,
    reportId: string,
    payload: { author: string; role: string; text: string }
  ): Promise<School | null> {
    let updatedSchool: School | null = null;
    const newComment = {
      id: `cmt-${Date.now()}`,
      author: payload.author.trim() || 'Wali Murid / Warga Terverifikasi',
      role: payload.role.trim() || 'Wali Murid',
      text: payload.text.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    localSchools = localSchools.map((s) => {
      if (s.id !== schoolId) return s;
      const nextReports = s.citizenReports.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          publicComments: [...(r.publicComments || []), newComment]
        };
      });
      const nextSchool = { ...s, citizenReports: nextReports };
      updatedSchool = nextSchool;
      return nextSchool;
    });

    persistLocalState();
    return updatedSchool;
  },

  // ==================== SLA STAGE UPDATER ====================
  async updateSchoolSla(
    schoolId: string,
    payload: UpdateSlaPayload
  ): Promise<{ school: School | null; stats: TransparencyStats; isFallback: boolean }> {
    const res = await requestBackend<School>(`/schools/${schoolId}/sla`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    let updatedSchool: School | null = null;
    let wasOverdue = false;
    const isNowOverdue = payload.slaStatus === 'overdue';

    localSchools = localSchools.map((school) => {
      if (school.id !== schoolId) return school;

      wasOverdue = school.slaStatus === 'overdue';

      const nextDaysDiff =
        payload.slaDaysDifference !== undefined
          ? payload.slaDaysDifference
          : payload.slaStatus === 'overdue'
          ? Math.max(14, school.slaDaysDifference > 0 ? school.slaDaysDifference : 14)
          : payload.slaStatus === 'warning'
          ? 2
          : -3;

      const nextStages = buildStageDetails(
        payload.currentStageNumber,
        payload.slaStatus,
        school.stageDetails
      );

      const nextRisk =
        school.aiRiskLevel === 'high_discrepancy'
          ? 'high_discrepancy'
          : payload.slaStatus === 'overdue'
          ? 'bottleneck'
          : 'verified';

      const nextGrade =
        payload.currentStageNumber === 5 &&
        payload.slaStatus === 'on_track' &&
        school.accreditationGrade === 'Dalam Proses'
          ? school.verifiedScore >= 91
            ? 'A'
            : 'B'
          : school.accreditationGrade;

      const modified: School = {
        ...school,
        currentStageNumber: payload.currentStageNumber,
        slaStatus: payload.slaStatus,
        slaDaysDifference: nextDaysDiff,
        stageDetails: nextStages,
        aiRiskLevel: nextRisk,
        accreditationGrade: nextGrade,
        scheduledVisitationDate:
          payload.scheduledVisitationDate !== undefined
            ? payload.scheduledVisitationDate || undefined
            : school.scheduledVisitationDate
      };

      updatedSchool = modified;
      return modified;
    });

    if (wasOverdue !== isNowOverdue) {
      const nextOverdueCount = isNowOverdue
        ? localStats.overdueCount + 1
        : Math.max(0, localStats.overdueCount - 1);
      const nextOverduePct = Number(
        ((nextOverdueCount / Math.max(1, localStats.totalSchoolsTracked)) * 100).toFixed(1)
      );
      localStats = {
        ...localStats,
        overdueCount: nextOverdueCount,
        overduePercentage: nextOverduePct
      };
    }

    persistLocalState();
    return {
      school: updatedSchool,
      stats: localStats,
      isFallback: !res.ok
    };
  },

  // ==================== CREATE SCHOOL & DAPODIK SYNC ====================
  async createSchool(
    payload: CreateSchoolPayload
  ): Promise<{ school: School; stats: TransparencyStats; isFallback: boolean }> {
    const standards =
      payload.standardsClaimed && payload.standardsClaimed.length === 8
        ? payload.standardsClaimed
        : DEFAULT_SNP_SUBJECTS.map((subject) => ({ subject, claimedScore: 90 }));

    const avgClaimed = Number(
      (standards.reduce((acc, item) => acc + item.claimedScore, 0) / standards.length).toFixed(1)
    );
    const verifiedInitial = Number(Math.max(60, avgClaimed - 2.0).toFixed(1));
    const absorptionRate = payload.bosAbsorptionRate ?? 96.5;
    const totalReceived = Math.max(100000000, payload.bosTotalReceived || 1200000000);
    const absorbed = Math.round(totalReceived * (absorptionRate / 100));

    const isSynced = payload.sourceSystem === 'DAPODIK_SISPENA_SYNC';
    const initialStage = isSynced ? 2 : 1;

    const newSchool: School = {
      id: `sch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      npsn: payload.npsn.trim(),
      name: payload.name.trim(),
      level: payload.level,
      provinsi:
        payload.provinsi ||
        (payload.city.includes('Jakarta')
          ? 'DKI Jakarta'
          : payload.city.includes('Bandung')
          ? 'Jawa Barat'
          : 'Jawa Timur'),
      kabupatenKota: payload.kabupatenKota || payload.city.trim(),
      kecamatan: payload.kecamatan || payload.district.trim(),
      district: payload.district.trim(),
      city: payload.city.trim(),
      address:
        payload.address?.trim() ||
        `Kec. ${payload.district.trim()}, ${payload.city.trim()}, Jawa Timur`,
      accreditationGrade: 'Dalam Proses',
      lastAccreditationYear: 2021,
      currentStageNumber: initialStage,
      slaStatus: 'on_track',
      slaDaysDifference: -4,
      claimedScore: avgClaimed,
      verifiedScore: verifiedInitial,
      bosBudget: {
        totalReceived,
        absorbed,
        absorptionRate,
        reportedAllocations: {
          sarpras: Math.round(absorbed * 0.34),
          operasional: Math.round(absorbed * 0.36),
          guruHonor: Math.round(absorbed * 0.18),
          digitalisasi: Math.round(absorbed * 0.12)
        }
      },
      aiRiskLevel: 'verified',
      aiAssessorBrief: {
        summary: isSynced
          ? `Data profil satuan pendidikan, 8 Standar Nasional Pendidikan (SNP), dan realisasi ARKAS Dana BOS berhasil ditarik otomatis melalui integrasi API Dapodik Kemendikdasmen & SISPENA BAN-PDM.`
          : `Satuan pendidikan baru diinput oleh Sekretariat BAN-PDM Jatim. Dokumen evaluasi diri 8 SNP dengan rata-rata klaim ${avgClaimed} siap diaudit publik dan diverifikasi asesor.`,
        discrepancyRate: Number((avgClaimed - verifiedInitial).toFixed(1)),
        riskBadge: isSynced ? 'Tersinkronisasi Dapodik & SISPENA' : 'Terdaftar Audit Baru',
        mandatoryInvestigationFocus: [
          'Validasi kesesuaian dokumen evaluasi diri SISPENA pada 8 Standar Nasional Pendidikan',
          'Verifikasi fisik realisasi anggaran Dana BOS komponen Sarana Prasarana & Digitalisasi',
          'Pantau umpan balik awal wali murid dan komite sekolah pada portal transparansi publik'
        ],
        flags: isSynced
          ? ['Sync Otomatis Dapodik', 'SISPENA 8 SNP Lengkap', 'ARKAS BOS Terhubung']
          : ['Input Resmi BAN-PDM', 'Menunggu Audit Publik'],
        generatedAt: formatWibNow()
      },
      stageDetails: buildStageDetails(initialStage, 'on_track'),
      radarStandards: standards.map((s) => ({
        subject: s.subject,
        claimedScore: s.claimedScore,
        verifiedScore: Math.max(55, Math.round(s.claimedScore - 2)),
        fullMark: 100
      })),
      citizenReports: []
    };

    const res = await requestBackend<School>('/schools', {
      method: 'POST',
      body: JSON.stringify(newSchool)
    });

    const savedSchool = res.ok && res.data ? res.data : newSchool;
    localSchools = [savedSchool, ...localSchools];

    const nextTotal = localStats.totalSchoolsTracked + 1;
    const nextOverduePct = Number(
      ((localStats.overdueCount / Math.max(1, nextTotal)) * 100).toFixed(1)
    );

    localStats = {
      ...localStats,
      totalSchoolsTracked: nextTotal,
      overduePercentage: nextOverduePct
    };

    persistLocalState();
    return {
      school: savedSchool,
      stats: localStats,
      isFallback: !res.ok
    };
  },

  async syncDapodikSispena(): Promise<{
    addedSchools: School[];
    stats: TransparencyStats;
    syncedAt: string;
  }> {
    const existingNpsns = new Set(localSchools.map((s) => s.npsn));
    const unsyncedCandidates = DAPODIK_SYNC_BATCH_POOL.filter(
      (candidate) => !existingNpsns.has(candidate.npsn)
    );

    const addedSchools: School[] = [];
    const batchToImport = unsyncedCandidates.slice(0, 1);

    for (const item of batchToImport) {
      const created = await this.createSchool(item);
      addedSchools.push(created.school);
    }

    const syncedAt = formatWibNow();
    if (addedSchools.length === 0) {
      // Refresh sync timestamp on top school so re-syncing remains visually responsive
      localSchools = localSchools.map((s, idx) =>
        idx === 0
          ? {
              ...s,
              aiAssessorBrief: {
                ...s.aiAssessorBrief,
                generatedAt: syncedAt
              }
            }
          : s
      );
      persistLocalState();
    }

    return {
      addedSchools,
      stats: localStats,
      syncedAt
    };
  },

  resetDemoData(): { schools: School[]; stats: TransparencyStats } {
    localSchools = cloneDefaultSchools();
    localStats = cloneDefaultStats();
    persistLocalState();
    return { schools: localSchools, stats: localStats };
  }
};
