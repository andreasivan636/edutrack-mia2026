export type SchoolLevel = 'SD' | 'SMP' | 'SMA' | 'SMK';
export type SlaStatus = 'on_track' | 'warning' | 'overdue';
export type AiRiskLevel = 'verified' | 'bottleneck' | 'high_discrepancy';
export type FacilityTag = 'Sanitasi' | 'Lab Komputer' | 'Transparansi Dana' | 'Perpustakaan' | 'Ruang Kelas' | 'Sarpras Olahraga';

export interface AccreditationStageItem {
  stageNumber: number; // 1 to 5
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'overdue';
  daysSpent: number;
  maxSlaDays: number;
  startedAt?: string;
  completedAt?: string;
  responsibleOfficer?: string;
  notes?: string;
}

export interface RadarStandardItem {
  subject: string; // 8 SNP
  claimedScore: number; // 0-100
  verifiedScore: number; // 0-100
  fullMark: number;
}

export type FollowUpStatus = 'waiting_response' | 'in_progress_school' | 'resolved';

export interface OfficialSchoolResponse {
  responderName: string;
  responderRole: string;
  text: string;
  respondedAt: string;
}

export interface PublicFeedbackComment {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
}

export interface CitizenReportItem {
  id: string;
  author: string;
  authorRole: 'Wali Murid' | 'Siswa' | 'Alumni' | 'Komite Sekolah' | 'Warga Sekitar';
  date: string;
  facilityTag: FacilityTag;
  text: string;
  photoUrl?: string;
  upvotes: number;
  status: 'verified' | 'investigating' | 'countered';
  verifiedBy?: string;
  verifiedAt?: string;
  // Two-Way Citizen Feedback Loop (Mentor Final Submission Feature 3)
  followUpStatus?: FollowUpStatus;
  officialResponse?: OfficialSchoolResponse;
  satisfactionVotes?: {
    satisfied: number;
    unsatisfied: number;
  };
  publicComments?: PublicFeedbackComment[];
}

export interface BosBudgetData {
  totalReceived: number; // in IDR
  absorbed: number;
  absorptionRate: number; // percentage (e.g. 98.4)
  reportedAllocations: {
    sarpras: number;
    operasional: number;
    guruHonor: number;
    digitalisasi: number;
  };
}

export interface AiAssessorBrief {
  summary: string;
  discrepancyRate: number; // percentage of mismatch
  riskBadge: string;
  mandatoryInvestigationFocus: string[];
  flags: string[];
  generatedAt: string;
}

export interface School {
  id: string;
  npsn: string;
  name: string;
  level: SchoolLevel;
  // Granular Regional Hierarchy (Nasional -> Provinsi -> Kabupaten/Kota -> Kecamatan -> Sekolah)
  provinsi?: string; // e.g., 'Jawa Timur', 'DKI Jakarta', 'Jawa Barat'
  kabupatenKota?: string; // e.g., 'Kota Surabaya', 'Kab. Sidoarjo', 'Kota Malang', 'Jakarta Selatan', 'Kota Bandung'
  kecamatan?: string; // e.g., 'Genteng', 'Wonokromo', 'Waru', 'Klojen'
  district: string; // e.g., 'Genteng'
  city: string; // e.g., 'Kota Surabaya'
  address: string;
  accreditationGrade: 'A' | 'B' | 'C' | 'Dalam Proses';
  lastAccreditationYear: number;
  currentStageNumber: number; // 1 to 5
  stageDetails: AccreditationStageItem[];
  slaStatus: SlaStatus;
  slaDaysDifference: number; // positive = overdue days, negative/zero = on track days remaining
  claimedScore: number; // overall self-assessment claim
  verifiedScore: number; // verified public/assessor score
  bosBudget: BosBudgetData;
  aiRiskLevel: AiRiskLevel;
  aiAssessorBrief: AiAssessorBrief;
  radarStandards: RadarStandardItem[];
  citizenReports: CitizenReportItem[];
  scheduledVisitationDate?: string; // YYYY-MM-DD if scheduled in near term
  assessorTeam?: {
    lead: string;
    members: string[];
  };
}

export interface TransparencyStats {
  totalSchoolsTracked: number;
  overduePercentage: number;
  overdueCount: number;
  totalCitizenReports: number;
  verifiedReports: number;
  avgAbsorptionRate: number;
  highDiscrepancyCount: number;
  upcomingVisitationsCount: number;
}

export interface AuthUser {
  id: string;
  nip: string;
  email: string;
  name: string;
  role: 'asesor' | 'admin_banpdm';
  roleLabel: string;
  region: string;
  token: string;
}

export interface CreateSchoolPayload {
  name: string;
  npsn: string;
  level: SchoolLevel;
  provinsi?: string;
  kabupatenKota?: string;
  kecamatan?: string;
  district: string;
  city: string;
  address?: string;
  bosTotalReceived: number;
  bosAbsorptionRate?: number;
  standardsClaimed: {
    subject: string;
    claimedScore: number;
  }[];
  sourceSystem?: 'MANUAL_ADMIN' | 'DAPODIK_SISPENA_SYNC';
}

export interface UpdateSlaPayload {
  currentStageNumber: number; // 1 to 5
  slaStatus: SlaStatus;
  slaDaysDifference?: number;
  scheduledVisitationDate?: string;
}

