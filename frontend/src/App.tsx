import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar, NavTabType, EduTrackLogo } from './components/Navbar';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { KpiBentoCards } from './components/KpiBentoCards';
import { AnalyticsChartsSection } from './components/AnalyticsChartsSection';
import { MasterDetailContainer } from './components/MasterDetailContainer';
import { SubmitReportModal } from './components/SubmitReportModal';
import { CompareSchoolsModal } from './components/CompareSchoolsModal';
import { AuthLoginModal } from './components/AuthLoginModal';
import { AddSchoolModal } from './components/AddSchoolModal';
import { AdminModerationPanel } from './components/AdminModerationPanel';
import {
  GranularRegionalDrillDownBar,
  RegionalFilterState
} from './components/GranularRegionalDrillDownBar';
import { PublicAuditPdfModal } from './components/PublicAuditPdfModal';
import { apiService } from './services/api';
import {
  School,
  TransparencyStats,
  AuthUser,
  CreateSchoolPayload,
  UpdateSlaPayload,
  FollowUpStatus
} from './types/school';
import { Database, Scale, CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('overview');
  const [schools, setSchools] = useState<School[]>([]);
  const [stats, setStats] = useState<TransparencyStats | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [compareList, setCompareList] = useState<School[]>([]);

  // Auth & Admin Modals State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => apiService.getCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);

  // Public Modals State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [pdfModalSchool, setPdfModalSchool] = useState<School | null>(null);
  const [defaultReportSchoolId, setDefaultReportSchoolId] = useState<string | undefined>(undefined);
  const [isOfflineFallback, setIsOfflineFallback] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Granular 5-Level Regional Drill-Down Filter State
  const [regionalFilter, setRegionalFilter] = useState<RegionalFilterState>({
    provinsi: 'ALL',
    kabupatenKota: 'ALL',
    kecamatan: 'ALL'
  });

  // Filters State
  const [filters, setFilters] = useState<{
    search: string;
    level: string;
    sla: string;
    aiRisk: string;
    city?: string;
    visitation?: boolean;
  }>({
    search: '',
    level: 'ALL',
    sla: 'ALL',
    aiRisk: 'ALL',
    city: 'ALL',
    visitation: false
  });

  // Section Refs for seamless scrolling
  const overviewRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Initial Data Fetch (from Persistent LocalStorage / Go Fiber Backend)
  useEffect(() => {
    async function loadInitialData() {
      const schoolsRes = await apiService.getSchools();
      const statsRes = await apiService.getStats();

      setSchools(schoolsRes.data);
      setStats(statsRes.data);
      setIsOfflineFallback(schoolsRes.isFallback);

      if (schoolsRes.data.length > 0) {
        setSelectedSchool(schoolsRes.data[0]);
      }
    }
    loadInitialData();
  }, []);

  // Total pending citizen reports across all schools (for Navbar badge)
  const pendingReportsCount = useMemo(() => {
    return schools.reduce(
      (acc, s) => acc + s.citizenReports.filter((r) => r.status === 'investigating').length,
      0
    );
  }, [schools]);

  // Handle Tab Navigation with Smooth Scrolling
  const handleTabChange = (tab: NavTabType) => {
    if (tab === 'admin' && !authUser) {
      setIsLoginModalOpen(true);
      return;
    }

    if (tab === 'compare') {
      setIsCompareModalOpen(true);
      return;
    }

    const wasAdmin = activeTab === 'admin';
    setActiveTab(tab);

    if (tab === 'admin') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Wait one tick if switching out of Admin view so DOM refs exist
    setTimeout(
      () => {
        if (tab === 'overview') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (tab === 'analytics' && analyticsRef.current) {
          analyticsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (tab === 'tracker' && trackerRef.current) {
          trackerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      wasAdmin ? 60 : 0
    );
  };

  // Auth Login & Logout Handlers
  const handleLogin = async (payload: {
    nipOrEmail?: string;
    password?: string;
    isDemoOneClick?: boolean;
  }) => {
    const res = await apiService.login(payload);
    setAuthUser(res.data);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Login berhasil: Selamat datang, ${res.data.name} (${res.data.roleLabel})`);
  };

  const handleLogout = () => {
    apiService.logout();
    setAuthUser(null);
    if (activeTab === 'admin') {
      setActiveTab('overview');
    }
    showToast('Sesi Asesor berakhir. Kembali ke tampilan Dashboard Publik.');
  };

  // Quick Filter Pill Click
  const handleQuickFilter = (newFilter: {
    level?: string;
    sla?: string;
    aiRisk?: string;
    visitation?: boolean;
    search?: string;
  }) => {
    setFilters((prev) => ({
      ...prev,
      level: newFilter.level ?? 'ALL',
      sla: newFilter.sla ?? 'ALL',
      aiRisk: newFilter.aiRisk ?? 'ALL',
      visitation: newFilter.visitation ?? false,
      search: newFilter.search ?? ''
    }));

    setActiveTab('tracker');
    setTimeout(() => {
      if (trackerRef.current) {
        trackerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      level: 'ALL',
      sla: 'ALL',
      aiRisk: 'ALL',
      city: 'ALL',
      visitation: false
    });
  };

  // Toggle School Comparison
  const handleToggleCompare = (school: School) => {
    if (compareList.some((s) => s.id === school.id)) {
      setCompareList(compareList.filter((s) => s.id !== school.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[0], school]);
      } else {
        setCompareList([...compareList, school]);
      }
    }
  };

  // Open Report Modal
  const handleOpenReportModal = (schoolId?: string) => {
    setDefaultReportSchoolId(schoolId || selectedSchool?.id);
    setIsReportModalOpen(true);
  };

  // 1. Citizen Submits New Report (Persisted to LocalStorage + Go API)
  const handleSubmitReportSuccess = async (schoolId: string, newReportData: any) => {
    const res = await apiService.submitCitizenReport(schoolId, newReportData);
    const refreshedSchools = await apiService.getSchools();
    const refreshedStats = await apiService.getStats();

    setSchools([...refreshedSchools.data]);
    setStats({ ...refreshedStats.data });

    const updatedSelected = refreshedSchools.data.find((s) => s.id === schoolId);
    if (updatedSelected && selectedSchool?.id === schoolId) {
      setSelectedSchool(updatedSelected);
    }

    showToast(
      `Laporan warga berhasil dikirim (${res.data.facilityTag}) dan masuk ke Antrean Moderasi Asesor!`
    );
  };

  // 2. Admin / Asesor Verifies or Rejects Citizen Report
  const handleVerifyReport = async (reportId: string, status: 'verified' | 'countered') => {
    const res = await apiService.verifyCitizenReport(
      reportId,
      status,
      authUser?.name || 'Dr. Hendra, M.Pd'
    );
    const refreshedSchools = await apiService.getSchools();

    setSchools([...refreshedSchools.data]);
    setStats({ ...res.stats });

    if (res.school && selectedSchool?.id === res.school.id) {
      setSelectedSchool(res.school);
    }

    if (status === 'verified') {
      showToast(
        'Laporan diverifikasi VALID! Skor Validasi Publik, KPI Dashboard & AI Brief Asesor telah diperbarui.'
      );
    } else {
      showToast('Laporan ditandai DITOLAK / HOAKS dan dikeluarkan dari perhitungan AI Brief.');
    }
  };

  // 2b. Admin / School Submits Official Institution Response (2-Way Feedback Loop)
  const handleSubmitOfficialResponse = async (
    schoolId: string,
    reportId: string,
    payload: {
      followUpStatus: FollowUpStatus;
      responderName: string;
      responderRole: string;
      text: string;
    }
  ) => {
    const res = await apiService.submitOfficialSchoolResponse(schoolId, reportId, payload);
    const refreshedSchools = await apiService.getSchools();
    setSchools([...refreshedSchools.data]);
    if (res.school && selectedSchool?.id === res.school.id) {
      setSelectedSchool(res.school);
    }
    showToast(
      `Tanggapan resmi institusi (${payload.responderName}) berhasil dipublikasikan ke kanal umpan balik warga!`
    );
  };

  // 2c. Citizen Votes Satisfaction on School Follow-Up (2-Way Feedback Loop)
  const handleVoteSatisfaction = async (
    schoolId: string,
    reportId: string,
    voteType: 'satisfied' | 'unsatisfied'
  ) => {
    const updated = await apiService.voteReportSatisfaction(schoolId, reportId, voteType);
    const refreshedSchools = await apiService.getSchools();
    setSchools([...refreshedSchools.data]);
    if (updated && selectedSchool?.id === updated.id) {
      setSelectedSchool(updated);
    }
    showToast(
      voteType === 'satisfied'
        ? 'Terima kasih! Evaluasi "Respons Memuaskan" Anda telah tercatat di Ledger Publik.'
        : 'Catatan "Belum Terbukti di Lapangan" telah dikirim sebagai peringatan ke Asesor BAN-PDM.'
    );
  };

  // 2d. Citizen Adds Follow-Up Comment on Report Thread
  const handleAddPublicComment = async (
    schoolId: string,
    reportId: string,
    payload: { author: string; role: string; text: string }
  ) => {
    const updated = await apiService.addReportPublicComment(schoolId, reportId, payload);
    const refreshedSchools = await apiService.getSchools();
    setSchools([...refreshedSchools.data]);
    if (updated && selectedSchool?.id === updated.id) {
      setSelectedSchool(updated);
    }
    showToast('Komentar aspirasi tindak lanjut warga berhasil ditambahkan!');
  };

  // 3. Admin Updates School SLA Stage & Status
  const handleUpdateSla = async (schoolId: string, payload: UpdateSlaPayload) => {
    const res = await apiService.updateSchoolSla(schoolId, payload);
    const refreshedSchools = await apiService.getSchools();

    setSchools([...refreshedSchools.data]);
    setStats({ ...res.stats });

    if (res.school && selectedSchool?.id === res.school.id) {
      setSelectedSchool(res.school);
    }

    showToast(
      `Perubahan SLA ${res.school?.name || 'sekolah'} (Tahap ${payload.currentStageNumber}/5) berhasil disimpan!`
    );
  };

  // 4. Admin Adds New School Manually
  const handleCreateSchool = async (payload: CreateSchoolPayload) => {
    const res = await apiService.createSchool(payload);
    const refreshedSchools = await apiService.getSchools();

    setSchools([...refreshedSchools.data]);
    setStats({ ...res.stats });
    setSelectedSchool(res.school);

    showToast(`Sekolah baru "${res.school.name}" (NPSN ${res.school.npsn}) berhasil ditambahkan!`);
  };

  // 5. Admin Runs Dapodik & SISPENA Sync Simulation
  const handleSyncDapodik = async () => {
    const res = await apiService.syncDapodikSispena();
    const refreshedSchools = await apiService.getSchools();

    setSchools([...refreshedSchools.data]);
    setStats({ ...res.stats });
    if (res.addedSchools.length > 0) {
      setSelectedSchool(res.addedSchools[0]);
      showToast(
        `Sinkronisasi Dapodik & SISPENA berhasil menarik ${res.addedSchools.length} data sekolah baru!`
      );
    } else {
      showToast('Sinkronisasi Dapodik & SISPENA selesai: seluruh data sekolah mutakhir.');
    }

    return {
      addedSchools: res.addedSchools,
      syncedAt: res.syncedAt
    };
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    const reset = apiService.resetDemoData();
    setSchools([...reset.schools]);
    setStats({ ...reset.stats });
    if (reset.schools.length > 0) {
      setSelectedSchool(reset.schools[0]);
    }
    showToast('Data demo telah dikembalikan ke kondisi awal (12 sekolah Jawa Timur).');
  };

  // Upvote Report Callback
  const handleUpvoteReport = async (schoolId: string, reportId: string) => {
    await apiService.upvoteReport(schoolId, reportId);
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id === schoolId) {
          const updated = {
            ...s,
            citizenReports: s.citizenReports.map((r) =>
              r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r
            )
          };
          if (selectedSchool?.id === schoolId) {
            setSelectedSchool(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Active filter label string
  const activeFilterLabel = [
    filters.level !== 'ALL' ? `Jenjang ${filters.level}` : '',
    filters.sla === 'overdue' ? 'Overdue SLA' : filters.sla === 'on_track' ? 'On-Track' : '',
    filters.aiRisk === 'high_discrepancy'
      ? 'Diskrepansi Tinggi'
      : filters.aiRisk === 'bottleneck'
      ? 'Bottleneck'
      : '',
    filters.city && filters.city !== 'ALL' ? filters.city : '',
    filters.visitation ? 'Visitasi Minggu Ini' : '',
    filters.search ? `"${filters.search}"` : ''
  ]
    .filter(Boolean)
    .join(', ');

  if (!stats || schools.length === 0 || !selectedSchool) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-[#5E5CE6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-700">Memuat EduTrack Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 flex flex-col font-sans selection:bg-[#5E5CE6] selection:text-white antialiased">
      {/* 1. Top Navigation Bar (Gaya FINNOVA + Role Switcher BAN-PDM) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenReportModal={() => handleOpenReportModal()}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        compareCount={compareList.length}
        authUser={authUser}
        pendingReportsCount={pendingReportsCount}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Global Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-200">
          <div className="px-5 py-3 rounded-full bg-[#14151A] text-white text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {activeTab === 'admin' && authUser ? (
          <AdminModerationPanel
            authUser={authUser}
            schools={schools}
            stats={stats}
            isOfflineFallback={isOfflineFallback}
            onVerifyReport={handleVerifyReport}
            onSubmitOfficialResponse={handleSubmitOfficialResponse}
            onUpdateSla={handleUpdateSla}
            onOpenAddSchoolModal={() => setIsAddSchoolModalOpen(true)}
            onSyncDapodik={handleSyncDapodik}
            onResetDemoData={handleResetDemoData}
            onNavigateToPublicSchool={(school) => {
              setSelectedSchool(school);
              setActiveTab('tracker');
              setTimeout(() => {
                if (trackerRef.current) {
                  trackerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 80);
            }}
          />
        ) : (
          <>
            {/* Clean Executive Header Banner */}
            <div ref={overviewRef}>
              <ExecutiveHeader
                onQuickFilter={handleQuickFilter}
                activeFilterLabel={activeFilterLabel}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Baris 1: 4 Kartu Ringkasan KPI (Light Bento Cards FINNOVA) */}
            <section aria-label="Ringkasan Metrik KPI">
              <KpiBentoCards
                stats={stats}
                onFilterAnomaly={() => handleQuickFilter({ aiRisk: 'high_discrepancy' })}
                onFilterOverdue={() => handleQuickFilter({ sla: 'overdue' })}
              />
            </section>

            {/* Baris 2: Grafik Analitik (Area Chart Tren Bulanan & Bar Chart Perbandingan Kategori) */}
            <section ref={analyticsRef} aria-label="Grafik Analitik & Tren">
              <AnalyticsChartsSection />
            </section>

            {/* Baris 3: Granular Regional Drill-Down Bar & Master-Detail Container */}
            <section ref={trackerRef} aria-label="Master-Detail Tracker Sekolah" className="space-y-6">
              <GranularRegionalDrillDownBar
                schools={schools}
                selectedSchool={selectedSchool}
                onSelectSchool={(s) => setSelectedSchool(s)}
                regionalFilter={regionalFilter}
                onChangeRegionalFilter={setRegionalFilter}
              />

              <MasterDetailContainer
                schools={schools}
                selectedSchool={selectedSchool}
                onSelectSchool={(s) => setSelectedSchool(s)}
                onOpenReportModal={handleOpenReportModal}
                onUpvoteReport={handleUpvoteReport}
                onOpenPdfModal={(s) => setPdfModalSchool(s)}
                onVoteSatisfaction={handleVoteSatisfaction}
                onAddPublicComment={handleAddPublicComment}
                regionalFilter={regionalFilter}
                compareList={compareList}
                onToggleCompare={handleToggleCompare}
                onOpenCompareModal={() => setIsCompareModalOpen(true)}
                filters={filters}
                setFilters={setFilters}
              />
            </section>
          </>
        )}
      </main>

      {/* Floating Compare Notification if 2 schools are chosen */}
      {compareList.length === 2 && !isCompareModalOpen && (
        <div className="fixed bottom-6 right-6 z-30 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xl flex items-center gap-4">
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                2 Sekolah Siap Dikomparasi:
              </span>
              <span className="text-[11px] text-[#5E5CE6] font-semibold">
                {compareList[0].name} vs {compareList[1].name}
              </span>
            </div>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#5E5CE6] text-white hover:bg-[#4B49C8] shadow-md shadow-indigo-500/20 transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Buka Komparasi</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <AddSchoolModal
        isOpen={isAddSchoolModalOpen}
        onClose={() => setIsAddSchoolModalOpen(false)}
        onCreateSchool={handleCreateSchool}
      />

      <SubmitReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        schools={schools}
        defaultSchoolId={defaultReportSchoolId}
        onSubmitSuccess={handleSubmitReportSuccess}
      />

      <CompareSchoolsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedSchools={compareList}
        onRemoveSchool={(id) => setCompareList(compareList.filter((s) => s.id !== id))}
        onOpenPdfModal={(s) => setPdfModalSchool(s)}
        onSelectDetailSchool={(s) => {
          setSelectedSchool(s);
          setActiveTab('tracker');
          setTimeout(() => {
            if (trackerRef.current) {
              trackerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 80);
        }}
      />

      <PublicAuditPdfModal
        isOpen={Boolean(pdfModalSchool)}
        onClose={() => setPdfModalSchool(null)}
        school={pdfModalSchool}
      />

      {/* Executive Clean Light Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EduTrackLogo />
            <div>
              <span className="font-extrabold text-sm tracking-tight">
                <span className="text-[#004E98]">Edu</span>
                <span className="text-[#00A896]">Track</span>
                <span className="text-slate-900 font-bold"> — MIA 2026</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Transparent School Assessment Tracking & Public Audit Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Database className="w-3.5 h-3.5 text-[#5E5CE6]" />
              <span>
                Storage Engine:{' '}
                {isOfflineFallback ? (
                  <span className="text-emerald-600 font-bold">
                    Persistent LocalStorage + Offline-Resilient Engine
                  </span>
                ) : (
                  <span className="text-[#5E5CE6] font-bold">
                    Go Fiber API + Persistent Database Synced
                  </span>
                )}
              </span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Tema:{' '}
              <span className="text-slate-800 font-semibold">
                Designing Digital Futures — Powering Public Transparency
              </span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
