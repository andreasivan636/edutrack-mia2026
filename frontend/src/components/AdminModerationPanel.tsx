import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  Database,
  Search,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Camera,
  Calendar,
  Building2,
  FileCheck2,
  Save,
  MessageSquare,
  Send
} from 'lucide-react';
import {
  School,
  TransparencyStats,
  AuthUser,
  SlaStatus,
  UpdateSlaPayload,
  CitizenReportItem,
  FollowUpStatus
} from '../types/school';

interface AdminModerationPanelProps {
  authUser: AuthUser;
  schools: School[];
  stats: TransparencyStats;
  isOfflineFallback: boolean;
  onVerifyReport: (reportId: string, status: 'verified' | 'countered') => Promise<void>;
  onSubmitOfficialResponse: (
    schoolId: string,
    reportId: string,
    payload: {
      followUpStatus: FollowUpStatus;
      responderName: string;
      responderRole: string;
      text: string;
    }
  ) => Promise<void>;
  onUpdateSla: (schoolId: string, payload: UpdateSlaPayload) => Promise<void>;
  onOpenAddSchoolModal: () => void;
  onSyncDapodik: () => Promise<{ addedSchools: School[]; syncedAt: string }>;
  onResetDemoData: () => void;
  onNavigateToPublicSchool: (school: School) => void;
}

interface EnrichedReport extends CitizenReportItem {
  schoolId: string;
  schoolName: string;
  schoolNpsn: string;
  schoolCity: string;
  schoolClaimedScore: number;
  schoolVerifiedScore: number;
}

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({
  authUser,
  schools,
  stats,
  isOfflineFallback,
  onVerifyReport,
  onSubmitOfficialResponse,
  onUpdateSla,
  onOpenAddSchoolModal,
  onSyncDapodik,
  onResetDemoData,
  onNavigateToPublicSchool
}) => {
  // Sub-Module 1 State (Report Moderation Inbox & Two-Way Official Response)
  const [reportFilter, setReportFilter] = useState<'all' | 'investigating' | 'verified' | 'countered'>('all');
  const [processingReportId, setProcessingReportId] = useState<string | null>(null);
  const [replyingReportId, setReplyingReportId] = useState<string | null>(null);
  const [replyFollowUpStatus, setReplyFollowUpStatus] = useState<FollowUpStatus>('in_progress_school');
  const [replyResponderName, setReplyResponderName] = useState('');
  const [replyResponderRole, setReplyResponderRole] = useState('Kepala Sekolah & Tim BOS');
  const [replyText, setReplyText] = useState('');

  // Sub-Module 2 State (SLA Stage Updater)
  const [slaSearch, setSlaSearch] = useState('');
  const [slaEdits, setSlaEdits] = useState<
    Record<
      string,
      {
        currentStageNumber: number;
        slaStatus: SlaStatus;
        scheduledVisitationDate: string;
      }
    >
  >({});
  const [savingSchoolId, setSavingSchoolId] = useState<string | null>(null);
  const [savedSchoolId, setSavedSchoolId] = useState<string | null>(null);

  // Sub-Module 3 State (Dapodik & SISPENA Sync Simulation)
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<number>(0);
  const [lastSyncResult, setLastSyncResult] = useState<{
    syncedAt: string;
    addedNames: string[];
  } | null>(null);

  // Aggregate & sort all citizen reports across schools (pending 'investigating' always first)
  const allReports = useMemo<EnrichedReport[]>(() => {
    const list: EnrichedReport[] = [];
    for (const s of schools) {
      for (const r of s.citizenReports) {
        list.push({
          ...r,
          schoolId: s.id,
          schoolName: s.name,
          schoolNpsn: s.npsn,
          schoolCity: s.city,
          schoolClaimedScore: s.claimedScore,
          schoolVerifiedScore: s.verifiedScore
        });
      }
    }
    return list.sort((a, b) => {
      const priority = (status: string) =>
        status === 'investigating' ? 0 : status === 'verified' ? 1 : 2;
      if (priority(a.status) !== priority(b.status)) {
        return priority(a.status) - priority(b.status);
      }
      return b.date.localeCompare(a.date);
    });
  }, [schools]);

  const pendingCount = useMemo(
    () => allReports.filter((r) => r.status === 'investigating').length,
    [allReports]
  );
  const verifiedCount = useMemo(
    () => allReports.filter((r) => r.status === 'verified').length,
    [allReports]
  );
  const counteredCount = useMemo(
    () => allReports.filter((r) => r.status === 'countered').length,
    [allReports]
  );

  const filteredReports = useMemo(() => {
    if (reportFilter === 'all') return allReports;
    return allReports.filter((r) => r.status === reportFilter);
  }, [allReports, reportFilter]);

  // Filtered schools for SLA table
  const filteredSlaSchools = useMemo(() => {
    const q = slaSearch.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.npsn.includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q)
    );
  }, [schools, slaSearch]);

  const getDraftForSchool = (school: School) => {
    return (
      slaEdits[school.id] || {
        currentStageNumber: school.currentStageNumber,
        slaStatus: school.slaStatus === 'overdue' ? 'overdue' : 'on_track',
        scheduledVisitationDate: school.scheduledVisitationDate || ''
      }
    );
  };

  const handleSlaFieldChange = (
    school: School,
    field: 'currentStageNumber' | 'slaStatus' | 'scheduledVisitationDate',
    value: number | string
  ) => {
    const current = getDraftForSchool(school);
    setSlaEdits((prev) => ({
      ...prev,
      [school.id]: {
        ...current,
        [field]: value
      }
    }));
  };

  const handleSaveSchoolSla = async (school: School) => {
    const draft = getDraftForSchool(school);
    setSavingSchoolId(school.id);
    try {
      await onUpdateSla(school.id, {
        currentStageNumber: Number(draft.currentStageNumber),
        slaStatus: draft.slaStatus,
        scheduledVisitationDate: draft.scheduledVisitationDate
      });
      setSavedSchoolId(school.id);
      setTimeout(() => {
        setSavedSchoolId((prev) => (prev === school.id ? null : prev));
      }, 2200);
    } finally {
      setSavingSchoolId(null);
    }
  };

  const handleModerationClick = async (reportId: string, status: 'verified' | 'countered') => {
    setProcessingReportId(reportId);
    try {
      await onVerifyReport(reportId, status);
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleRunSyncSimulation = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStep(1);

    await new Promise((r) => setTimeout(r, 450));
    setSyncStep(2);
    await new Promise((r) => setTimeout(r, 500));
    setSyncStep(3);
    await new Promise((r) => setTimeout(r, 450));
    setSyncStep(4);

    const res = await onSyncDapodik();
    await new Promise((r) => setTimeout(r, 350));

    setLastSyncResult({
      syncedAt: res.syncedAt,
      addedNames: res.addedSchools.map((s) => `${s.name} (NPSN ${s.npsn})`)
    });
    setIsSyncing(false);
    setSyncStep(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ================= TOP ADMIN EXECUTIVE BANNER & HULU-KE-HILIR LIFECYCLE ================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#14151A] text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ruang Kerja Resmi Asesor & Sekretariat BAN-PDM
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-[#5E5CE6] border border-indigo-200/80">
                {authUser.name} — {authUser.roleLabel} (NIP {authUser.nip})
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5">
                <Database className="w-3 h-3" />
                {isOfflineFallback
                  ? 'Persisten Aktif (LocalStorage + Auto-Sync Ready)'
                  : 'Tersambung ke Go Fiber API + LocalStorage'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
              Panel Admin, Moderasi Audit Warga & Kontrol SLA Akreditasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Kelola siklus data akreditasi dari <strong>hulu</strong> (sinkronisasi Dapodik, SISPENA & ARKAS BOS) hingga <strong>hilir</strong> (verifikasi bukti lapangan warga ke AI Brief dan pembaruan tahapan SLA). Seluruh perubahan tersimpan persisten dan langsung memperbarui Dashboard Publik.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={onResetDemoData}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200/90 transition-colors flex items-center gap-1.5"
              title="Kembalikan data demo ke kondisi awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>

            <button
              onClick={() => {
                if (schools[0]) onNavigateToPublicSchool(schools[0]);
              }}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#14151A] hover:bg-slate-800 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <span>Lihat Dashboard Publik</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A5B4FC]" />
            </button>
          </div>
        </div>

        {/* Visual Alur Data Hulu ke Hilir (4-Step Data Pipeline) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E5CE6] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/70">
                1. Hulu Data Pemerintah
              </span>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                {stats.totalSchoolsTracked.toLocaleString('id-ID')} Sekolah
              </span>
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 pt-1">
              Sync Dapodik, SISPENA & ARKAS
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Profil sekolah, klaim mandiri 8 SNP, dan realisasi Dana BOS ditarik dari API Kemendikdasmen atau diinput Sekretariat BAN-PDM.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/70">
                2. Partisipasi Publik
              </span>
              <span className="text-xs font-bold text-amber-600 tabular-nums">
                {pendingCount} Antrean Baru
              </span>
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 pt-1">
              Crowdsourced Reality Check
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Wali murid, siswa, dan komite mengirim bukti foto kondisi fasilitas riil sebagai pembanding klaim dokumen sekolah.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-[#5E5CE6] px-2.5 py-0.5 rounded-full">
                3. Moderasi & AI Brief
              </span>
              <span className="text-xs font-bold text-[#5E5CE6] tabular-nums">
                {stats.verifiedReports.toLocaleString('id-ID')} Valid
              </span>
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 pt-1">
              Verifikasi Asesor & Koreksi Skor
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Laporan yang diverifikasi valid otomatis mengoreksi Skor Validasi Publik dan masuk ke fokus investigasi AI Brief Asesor.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                4. Hilir SLA & SK
              </span>
              <span className="text-xs font-bold text-rose-600 tabular-nums">
                {stats.overdueCount} Overdue
              </span>
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 pt-1">
              Kontrol 5 Tahap SLA & Pleno SK
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Admin BAN-PDM memperbarui tahapan berkas, jadwal visitasi lapangan, dan mencegah kemacetan birokrasi (Overdue SLA).
            </p>
          </div>
        </div>
      </div>

      {/* ================= SUB-MODUL 3: INPUT & SINKRONISASI DATA SEKOLAH (HULU) ================= */}
      <section className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-[#5E5CE6] flex items-center justify-center font-extrabold text-xs">
                01
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Input & Sinkronisasi Data Sekolah (Integrasi Dapodik & SISPENA)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Sumber data awal berasal dari penarikan berkala API pemerintah (Dapodik, SISPENA BAN-PDM, dan ARKAS BOS) atau registrasi manual Sekretariat Provinsi.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleRunSyncSimulation}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#14151A] hover:bg-slate-800 text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>🔄 Simulasi Sync API Dapodik & SISPENA Kemendikdasmen</span>
            </button>

            <button
              onClick={onOpenAddSchoolModal}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#5E5CE6] hover:bg-[#4B49C8] text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Input Data Sekolah Baru</span>
            </button>
          </div>
        </div>

        {/* Interactive Sync Pipeline Progress / Status Strip */}
        {(isSyncing || lastSyncResult) && (
          <div className="p-5 rounded-2xl bg-[#16171D] text-white space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#A5B4FC]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Pipeline Integrasi Data Nasional Kemendikdasmen → EduTrack Jatim
                </span>
              </div>
              {lastSyncResult && !isSyncing && (
                <span className="text-[11px] font-semibold text-emerald-400 tabular-nums">
                  ✓ Sinkronisasi Terakhir: {lastSyncResult.syncedAt}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {[
                { step: 1, title: 'OAuth2 Pusdatin', desc: 'Koneksi endpoint Dapodik Provinsi Jatim' },
                { step: 2, title: 'SISPENA BAN-PDM', desc: 'Tarik evaluasi diri 8 Standar Nasional' },
                { step: 3, title: 'ARKAS Dana BOS', desc: 'Rekonsiliasi pagu & serapan sarpras' },
                { step: 4, title: 'AI Audit Ledger', desc: 'Publikasi ke antrean pantau publik' }
              ].map((item) => {
                const isDone = !isSyncing || syncStep > item.step;
                const isActive = isSyncing && syncStep === item.step;
                return (
                  <div
                    key={item.step}
                    className={`p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-[#5E5CE6] border-indigo-400 text-white'
                        : isDone
                        ? 'bg-[#1F2028] border-emerald-500/40 text-slate-200'
                        : 'bg-[#1F2028]/60 border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>
                        {item.step}. {item.title}
                      </span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {isActive && <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />}
                    </div>
                    <p className="text-[11px] opacity-80">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {!isSyncing && lastSyncResult && (
              <div className="px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between flex-wrap gap-2">
                <span>
                  {lastSyncResult.addedNames.length > 0 ? (
                    <>
                      Berhasil menarik & menambahkan sekolah baru dari server SISPENA/Dapodik:{' '}
                      <strong className="text-white">{lastSyncResult.addedNames.join(', ')}</strong>
                    </>
                  ) : (
                    <>
                      Seluruh data sekolah sampel pada kluster Dapodik & SISPENA Jawa Timur telah mutakhir (100% tersinkronisasi).
                    </>
                  )}
                </span>
                <span className="text-[11px] font-bold text-white bg-white/10 px-3 py-1 rounded-full tabular-nums">
                  Total Database: {schools.length} Sampel Detail ({stats.totalSchoolsTracked.toLocaleString('id-ID')} Regional)
                </span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ================= SUB-MODUL 1: ANTREAN VERIFIKASI LAPORAN WARGA ================= */}
      <section className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-[#5E5CE6] flex items-center justify-center font-extrabold text-xs">
                02
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Antrean Verifikasi Laporan Warga (Crowdsourced Report Inbox)
              </h2>
              {pendingCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 tabular-nums">
                  {pendingCount} Menunggu Moderasi
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Validasi bukti lapangan yang dikirim warga. Laporan berstatus <strong>Terverifikasi Valid</strong> langsung memperbarui Skor Validasi Publik, jumlah bukti di KPI Dashboard, dan <strong>AI Field-Assessor Brief</strong>.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full self-start">
            {[
              { id: 'all', label: `Semua (${allReports.length})` },
              { id: 'investigating', label: `Menunggu (${pendingCount})` },
              { id: 'verified', label: `Valid (${verifiedCount})` },
              { id: 'countered', label: `Ditolak (${counteredCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tabular-nums transition-all ${
                  reportFilter === tab.id
                    ? 'bg-[#14151A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Inbox Cards */}
        <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredReports.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <FileCheck2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Tidak ada laporan warga pada kategori filter ini.
              </p>
              <p className="text-xs text-slate-500">
                Anda dapat menguji alur baru melalui tombol <strong>+ Lapor Kondisi Sekolah</strong> di kanan atas Navbar.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isPending = report.status === 'investigating';
              const isVerified = report.status === 'verified';
              const isCountered = report.status === 'countered';
              const isBusy = processingReportId === report.id;

              return (
                <div
                  key={report.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-200 shadow-sm'
                      : isVerified
                      ? 'bg-white border-slate-200/80 hover:border-slate-300'
                      : 'bg-slate-50/70 border-slate-200/60 opacity-80'
                  }`}
                >
                  {/* Left & Middle Content */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {report.photoUrl ? (
                      <img
                        src={report.photoUrl}
                        alt={report.facilityTag}
                        className="w-24 h-20 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                      />
                    ) : (
                      <div className="w-24 h-20 rounded-xl bg-slate-100 border border-slate-200 shrink-0 hidden sm:flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-5 h-5" />
                        <span className="text-[10px] font-semibold mt-1">Teks Audit</span>
                      </div>
                    )}

                    <div className="space-y-2 flex-1 min-w-0">
                      {/* School Context & Status Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            const found = schools.find((s) => s.id === report.schoolId);
                            if (found) onNavigateToPublicSchool(found);
                          }}
                          className="text-xs font-extrabold text-[#5E5CE6] hover:underline flex items-center gap-1"
                          title="Klik untuk inspeksi sekolah ini di Master-Detail Tracker"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{report.schoolName}</span>
                        </button>
                        <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                          (NPSN {report.schoolNpsn} • Skor Validasi: {report.schoolVerifiedScore} vs Klaim {report.schoolClaimedScore})
                        </span>

                        {isPending && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                            ⏳ Menunggu Verifikasi Asesor
                          </span>
                        )}
                        {isVerified && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✅ Terverifikasi Valid (Masuk AI Brief)
                          </span>
                        )}
                        {isCountered && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                            ❌ Ditolak / Indikasi Hoaks
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        "{report.text}"
                      </p>

                      {/* Existing Official School Response Preview */}
                      {report.officialResponse && (
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs space-y-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="font-extrabold text-[#5E5CE6] flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>
                                Tanggapan Resmi Institusi ({report.officialResponse.responderName}):
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-indigo-200">
                              {report.followUpStatus === 'resolved'
                                ? '✓ Selesai Ditindaklanjuti'
                                : report.followUpStatus === 'in_progress_school'
                                ? '🔧 Sedang Diperbaiki oleh Sekolah'
                                : '⏳ Menunggu Respons Sekolah'}
                            </span>
                          </div>
                          <p className="text-slate-700 italic">"{report.officialResponse.text}"</p>
                        </div>
                      )}

                      {/* Reporter Metadata */}
                      <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700">{report.author}</span>
                        <span>• {report.authorRole}</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[#5E5CE6] font-bold">
                          Fasilitas: {report.facilityTag}
                        </span>
                        <span className="tabular-nums">• Tanggal: {report.date}</span>
                        <span className="tabular-nums">• {report.upvotes} Dukungan Publik</span>
                        {report.verifiedBy && (
                          <span className="text-emerald-700 font-semibold">
                            • Dimoderasi oleh {report.verifiedBy}
                          </span>
                        )}
                      </div>

                      {/* Inline Official Institution Response Editor */}
                      {replyingReportId === report.id && (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!replyText.trim()) return;
                            await onSubmitOfficialResponse(report.schoolId, report.id, {
                              followUpStatus: replyFollowUpStatus,
                              responderName:
                                replyResponderName.trim() || `Kepala ${report.schoolName}`,
                              responderRole: replyResponderRole.trim() || 'Kepala Sekolah & Tim BOS',
                              text: replyText.trim()
                            });
                            setReplyingReportId(null);
                            setReplyText('');
                          }}
                          className="mt-3 p-4 rounded-2xl bg-slate-50 border border-indigo-200 space-y-3"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-[#5E5CE6]" />
                              <span>Tulis Tanggapan Resmi Institusi (2-Way Feedback Loop)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyFollowUpStatus('in_progress_school');
                                setReplyResponderName(`Kepala ${report.schoolName}`);
                                setReplyResponderRole('Kepala Sekolah & Komite BOS');
                                setReplyText(
                                  `Terima kasih atas laporannya, perbaikan fasilitas ${report.facilityTag} pada ${report.schoolName} telah dianggarkan pada pencairan Dana BOS Tahap II minggu ini dan sedang dalam pengerjaan teknis.`
                                );
                              }}
                              className="text-[11px] font-bold text-[#5E5CE6] hover:underline cursor-pointer"
                            >
                              ⚡ Gunakan Template Tanggapan Cepat
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Status Tindak Lanjut Sekolah
                              </label>
                              <select
                                value={replyFollowUpStatus}
                                onChange={(e) =>
                                  setReplyFollowUpStatus(e.target.value as FollowUpStatus)
                                }
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                              >
                                <option value="waiting_response">Menunggu Respons Sekolah</option>
                                <option value="in_progress_school">
                                  Sedang Diperbaiki oleh Sekolah
                                </option>
                                <option value="resolved">Selesai Ditindaklanjuti</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Pejabat Penanggap
                              </label>
                              <input
                                type="text"
                                value={replyResponderName}
                                onChange={(e) => setReplyResponderName(e.target.value)}
                                placeholder={`Kepala ${report.schoolName}`}
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Jabatan / Unit
                              </label>
                              <input
                                type="text"
                                value={replyResponderRole}
                                onChange={(e) => setReplyResponderRole(e.target.value)}
                                placeholder="Kepala Sekolah / Komite BOS"
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                              />
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Tulis tanggapan resmi dan langkah tindak lanjut pihak sekolah..."
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#5E5CE6]"
                          />

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setReplyingReportId(null)}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#5E5CE6] hover:bg-[#4B49C8] text-white flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Publikasikan Tanggapan Resmi</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Right Moderation Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (replyingReportId === report.id) {
                          setReplyingReportId(null);
                        } else {
                          setReplyingReportId(report.id);
                          setReplyFollowUpStatus(
                            report.followUpStatus && report.followUpStatus !== 'waiting_response'
                              ? report.followUpStatus
                              : 'in_progress_school'
                          );
                          setReplyResponderName(
                            report.officialResponse?.responderName || `Kepala ${report.schoolName}`
                          );
                          setReplyResponderRole(
                            report.officialResponse?.responderRole || 'Kepala Sekolah & Tim BOS'
                          );
                          setReplyText(report.officialResponse?.text || '');
                        }
                      }}
                      className="px-3.5 py-2 rounded-full text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-[#5E5CE6] border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tanggapan Resmi Institusi</span>
                    </button>

                    <button
                      disabled={isBusy || isVerified}
                      onClick={() => handleModerationClick(report.id, 'verified')}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✅ Verifikasi Valid (Masuk AI Brief)</span>
                    </button>

                    <button
                      disabled={isBusy || isCountered}
                      onClick={() => handleModerationClick(report.id, 'countered')}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isCountered
                          ? 'bg-rose-100 text-rose-600 border border-rose-200 cursor-default'
                          : 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>❌ Tolak / Hoaks</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ================= SUB-MODUL 2: KONTROL TAHAPAN SLA & JADWAL VISITASI ================= */}
      <section className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-[#5E5CE6] flex items-center justify-center font-extrabold text-xs">
                03
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Kontrol Tahapan SLA & Jadwal Visitasi Lapangan (SLA Stage Updater)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Perbarui progres berkas 5 tahap akreditasi dan status kepatuhan SLA secara langsung. Setiap perubahan memperbarui stepper sekolah dan rasio <strong>Berkas Overdue SLA</strong> di KPI Dashboard.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={slaSearch}
              onChange={(e) => setSlaSearch(e.target.value)}
              placeholder="Cari nama sekolah, NPSN, atau kota..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:outline-none focus:border-[#5E5CE6] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Clean Responsive SLA Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Satuan Pendidikan & NPSN</th>
                <th className="py-3 px-4">Tahapan Akreditasi (1–5)</th>
                <th className="py-3 px-4">Status SLA</th>
                <th className="py-3 px-4">Jadwal Visitasi</th>
                <th className="py-3 px-4 text-right">Aksi Simpan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSlaSchools.map((school) => {
                const draft = getDraftForSchool(school);
                const normalizedCurrentSla = school.slaStatus === 'overdue' ? 'overdue' : 'on_track';
                const hasChanges =
                  Number(draft.currentStageNumber) !== school.currentStageNumber ||
                  draft.slaStatus !== normalizedCurrentSla ||
                  (draft.scheduledVisitationDate || '') !== (school.scheduledVisitationDate || '');
                const isSaving = savingSchoolId === school.id;
                const isJustSaved = savedSchoolId === school.id;

                return (
                  <tr
                    key={school.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* School Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{school.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 tabular-nums">
                          {school.npsn}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {school.level} • {school.district}, {school.city}
                      </div>
                    </td>

                    {/* Stage Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={draft.currentStageNumber}
                        onChange={(e) =>
                          handleSlaFieldChange(school, 'currentStageNumber', Number(e.target.value))
                        }
                        className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
                      >
                        <option value={1}>1. Submit Berkas</option>
                        <option value={2}>2. Verifikasi Provinsi</option>
                        <option value={3}>3. Penugasan Asesor</option>
                        <option value={4}>4. Visitasi Lapangan</option>
                        <option value={5}>5. Pleno & Terbit SK</option>
                      </select>
                    </td>

                    {/* SLA Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={draft.slaStatus}
                        onChange={(e) =>
                          handleSlaFieldChange(school, 'slaStatus', e.target.value as SlaStatus)
                        }
                        className={`px-3.5 py-2 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer ${
                          draft.slaStatus === 'overdue'
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}
                      >
                        <option value="on_track">On-Track (Sesuai Koridor SLA)</option>
                        <option value="overdue">Overdue (Melewati Batas SLA)</option>
                      </select>
                    </td>

                    {/* Visitation Date Input */}
                    <td className="py-3.5 px-4">
                      <div className="relative inline-flex items-center">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="date"
                          value={draft.scheduledVisitationDate}
                          onChange={(e) =>
                            handleSlaFieldChange(
                              school,
                              'scheduledVisitationDate',
                              e.target.value
                            )
                          }
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 tabular-nums focus:outline-none focus:border-[#5E5CE6]"
                        />
                      </div>
                    </td>

                    {/* Save Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSaveSchoolSla(school)}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                          isJustSaved
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : hasChanges
                            ? 'bg-[#5E5CE6] hover:bg-[#4B49C8] text-white shadow-md shadow-indigo-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isJustSaved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tersimpan!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan SLA'}</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

