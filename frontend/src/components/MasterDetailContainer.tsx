import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertOctagon,
  Scale,
  Sparkles,
  Camera,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  FileText,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  ThumbsDown,
  Send
} from 'lucide-react';
import { School } from '../types/school';
import { SlaStepper } from './SlaStepper';
import { RadarStandardsChart } from './RadarStandardsChart';
import { RegionalFilterState } from './GranularRegionalDrillDownBar';

interface MasterDetailContainerProps {
  schools: School[];
  selectedSchool: School;
  onSelectSchool: (school: School) => void;
  onOpenReportModal: (defaultSchoolId?: string) => void;
  onUpvoteReport: (schoolId: string, reportId: string) => void;
  onOpenPdfModal?: (school: School) => void;
  onVoteSatisfaction?: (
    schoolId: string,
    reportId: string,
    voteType: 'satisfied' | 'unsatisfied'
  ) => void;
  onAddPublicComment?: (
    schoolId: string,
    reportId: string,
    payload: { author: string; role: string; text: string }
  ) => void;
  regionalFilter?: RegionalFilterState;
  compareList: School[];
  onToggleCompare: (school: School) => void;
  onOpenCompareModal: () => void;
  filters: {
    search: string;
    level: string;
    sla: string;
    aiRisk: string;
    city?: string;
    visitation?: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    level: string;
    sla: string;
    aiRisk: string;
    city?: string;
    visitation?: boolean;
  }>>;
}

export const MasterDetailContainer: React.FC<MasterDetailContainerProps> = ({
  schools,
  selectedSchool,
  onSelectSchool,
  onOpenReportModal,
  onUpvoteReport,
  onOpenPdfModal,
  onVoteSatisfaction,
  onAddPublicComment,
  regionalFilter,
  compareList,
  onToggleCompare,
  onOpenCompareModal,
  filters,
  setFilters
}) => {
  // Master Container Tab Notch State
  const [activeTabNotch, setActiveTabNotch] = useState<'all' | 'overdue' | 'anomaly'>('all');

  // Two-Way Feedback Comment Input State (per reportId)
  const [openCommentReportId, setOpenCommentReportId] = useState<string | null>(null);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRole, setCommentRole] = useState('Wali Murid');
  const [commentText, setCommentText] = useState('');

  // Pagination State (5 schools per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered Schools Logic
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      // Granular Regional Hierarchy Filter
      if (regionalFilter) {
        const prov = school.provinsi || 'Jawa Timur';
        const kab = school.kabupatenKota || school.city;
        const kec = school.kecamatan || school.district;
        if (regionalFilter.provinsi !== 'ALL' && prov !== regionalFilter.provinsi) return false;
        if (regionalFilter.kabupatenKota !== 'ALL' && kab !== regionalFilter.kabupatenKota)
          return false;
        if (regionalFilter.kecamatan !== 'ALL' && kec !== regionalFilter.kecamatan) return false;
      }

      // Tab Notch Filter
      if (activeTabNotch === 'overdue' && school.slaStatus !== 'overdue') return false;
      if (activeTabNotch === 'anomaly' && school.aiRiskLevel !== 'high_discrepancy') return false;

      // Search term
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchName = school.name.toLowerCase().includes(query);
        const matchNpsn = school.npsn.includes(query);
        const matchDistrict = school.district.toLowerCase().includes(query);
        const matchCity = school.city.toLowerCase().includes(query);
        if (!matchName && !matchNpsn && !matchDistrict && !matchCity) return false;
      }

      // City / District
      if (filters.city && filters.city !== 'ALL') {
        if (!school.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      }

      // Level
      if (filters.level !== 'ALL' && school.level !== filters.level) return false;

      // SLA
      if (filters.sla === 'overdue' && school.slaStatus !== 'overdue') return false;
      if (filters.sla === 'on_track' && school.slaStatus !== 'on_track') return false;

      // AI Risk
      if (filters.aiRisk === 'high_discrepancy' && school.aiRiskLevel !== 'high_discrepancy') return false;
      if (filters.aiRisk === 'bottleneck' && school.aiRiskLevel !== 'bottleneck') return false;
      if (filters.aiRisk === 'verified' && school.aiRiskLevel !== 'verified') return false;

      // Visitation Filter
      if (filters.visitation && !school.scheduledVisitationDate) return false;

      return true;
    });
  }, [schools, filters, activeTabNotch]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTabNotch]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage) || 1;
  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSchools.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSchools, currentPage, itemsPerPage]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isCompared = (schoolId: string) => {
    return compareList.some((s) => s.id === schoolId);
  };

  const activeFiltersCount = [
    filters.level !== 'ALL',
    filters.sla !== 'ALL',
    filters.aiRisk !== 'ALL',
    Boolean(filters.city && filters.city !== 'ALL'),
    Boolean(filters.search.trim())
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* ================= 1. ACTIVE FILTERS BAR (PERSIS DI TENGAH HALAMAN FINNOVA) ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Filter Pill Badge */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-full px-4 py-2 shadow-sm">
            <span className="text-sm font-bold text-slate-800">Filter Aktif</span>
            <span className="w-5 h-5 rounded-full bg-[#14151A] text-white flex items-center justify-center text-xs font-bold">
              {activeFiltersCount}
            </span>
          </div>

          {/* Wilayah Dropdown */}
          <select
            value={filters.city || 'ALL'}
            onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            aria-label="Filter berdasarkan wilayah"
            className="bg-white border border-slate-200/90 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            <option value="ALL">Semua Wilayah</option>
            <option value="Surabaya">Kota Surabaya</option>
            <option value="Sidoarjo">Kab. Sidoarjo</option>
            <option value="Gresik">Kab. Gresik</option>
          </select>

          {/* Jenjang Dropdown */}
          <select
            value={filters.level}
            onChange={(e) => setFilters((prev) => ({ ...prev, level: e.target.value }))}
            aria-label="Filter berdasarkan jenjang"
            className="bg-white border border-slate-200/90 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            <option value="ALL">Semua Jenjang</option>
            <option value="SD">Jenjang SD</option>
            <option value="SMP">Jenjang SMP</option>
            <option value="SMA">Jenjang SMA</option>
            <option value="SMK">Jenjang SMK</option>
          </select>

          {/* Status SLA Dropdown */}
          <select
            value={filters.sla}
            onChange={(e) => setFilters((prev) => ({ ...prev, sla: e.target.value }))}
            aria-label="Filter berdasarkan status SLA"
            className="bg-white border border-slate-200/90 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            <option value="ALL">Semua Status SLA</option>
            <option value="on_track">SLA On-Track</option>
            <option value="overdue">SLA Overdue (&gt; 14 Hari)</option>
          </select>

          {/* Status AI Dropdown */}
          <select
            value={filters.aiRisk}
            onChange={(e) => setFilters((prev) => ({ ...prev, aiRisk: e.target.value }))}
            aria-label="Filter berdasarkan status AI"
            className="bg-white border border-slate-200/90 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            <option value="ALL">Semua Status AI</option>
            <option value="verified">Verified / Normal</option>
            <option value="bottleneck">Bottleneck Birokrasi</option>
            <option value="high_discrepancy">Diskrepansi Tinggi</option>
          </select>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => setFilters({ search: '', level: 'ALL', sla: 'ALL', aiRisk: 'ALL', city: 'ALL', visitation: false })}
              className="text-xs font-semibold text-slate-400 hover:text-slate-800 underline ml-1"
            >
              Reset
            </button>
          )}
        </div>

        {/* Round Search Input (Persis FINNOVA) */}
        <div className="relative min-w-[260px] max-w-sm w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Cari nama, NPSN, atau kota..."
            className="w-full pl-9 pr-8 py-2 rounded-full bg-white border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#5E5CE6]"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ================= 2. MASTER-DETAIL SPLIT CONTAINER BAWAH (SIGNATURE FINNOVA) ================= */}
      <div className="finnova-dark-container p-7 text-white shadow-2xl">
        {/* Top Notch Tabs (Persis FINNOVA) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-1.5 bg-[#1F2028] p-1.5 rounded-full border border-slate-800 self-start">
            <button
              onClick={() => setActiveTabNotch('all')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTabNotch === 'all'
                  ? 'bg-[#5E5CE6] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Sekolah ({schools.length})
            </button>

            <button
              onClick={() => setActiveTabNotch('overdue')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTabNotch === 'overdue'
                  ? 'bg-[#5E5CE6] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Overdue SLA</span>
            </button>

            <button
              onClick={() => setActiveTabNotch('anomaly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTabNotch === 'anomaly'
                  ? 'bg-[#5E5CE6] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Anomali AI</span>
            </button>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Ditemukan: <strong className="text-white tabular-nums">{filteredSchools.length}</strong> Sekolah</span>
            {compareList.length > 0 && (
              <button
                onClick={onOpenCompareModal}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#5E5CE6] text-white hover:bg-[#4B49C8] transition-all flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Bandingkan ({compareList.length}/2)</span>
              </button>
            )}
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ================= SISI KIRI (38% Lebar - Daftar Sekolah di atas Dark Charcoal #16171D) ================= */}
          <div className="w-full lg:w-[38%] space-y-3.5">
            <div className="space-y-3">
              {paginatedSchools.length === 0 ? (
                <div className="p-10 text-center text-slate-400 bg-[#1F2028] rounded-2xl border border-slate-800 space-y-2">
                  <Search className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">Tidak ada sekolah yang cocok.</p>
                  <button
                    onClick={() => {
                      setActiveTabNotch('all');
                      setFilters({ search: '', level: 'ALL', sla: 'ALL', aiRisk: 'ALL', city: 'ALL', visitation: false });
                    }}
                    className="text-xs text-[#5E5CE6] hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                paginatedSchools.map((school) => {
                  const isSelected = selectedSchool?.id === school.id;
                  const compared = isCompared(school.id);

                  return (
                    <div
                      key={school.id}
                      onClick={() => onSelectSchool(school)}
                      className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer relative group ${
                        isSelected
                          ? 'finnova-row-active'
                          : 'bg-[#1F2028] hover:bg-[#262832] border border-white/5 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Checkbox & Basic Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Compare Checkbox */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCompare(school);
                            }}
                            className="pt-0.5"
                            title="Pilih untuk bandingkan"
                          >
                            <input
                              type="checkbox"
                              checked={compared}
                              onChange={() => {}}
                              className={`w-4 h-4 rounded cursor-pointer ${
                                isSelected
                                  ? 'border-white text-slate-900 bg-white'
                                  : 'border-slate-700 text-[#5E5CE6] bg-slate-900'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-white'}`}>
                                {school.name}
                              </h4>
                              <span className={`text-[10px] tabular-nums font-semibold px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
                              }`}>
                                NPSN {school.npsn}
                              </span>
                            </div>

                            <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                              {school.district}, {school.city}
                            </p>

                            {/* Status Pills */}
                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                              {/* SLA Badge (FINNOVA white badge on active row!) */}
                              <span
                                className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                                  isSelected
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : school.slaStatus === 'on_track'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {school.slaStatus === 'on_track' ? 'SLA On-Track' : `Overdue +${school.slaDaysDifference}h`}
                              </span>

                              {/* Stage Badge */}
                              <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                              }`}>
                                Tahap {school.currentStageNumber}/5
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Scores & BOS */}
                        <div className="text-right shrink-0 space-y-1">
                          <div className="tabular-nums font-bold text-sm">
                            <span className={isSelected ? 'text-white' : 'text-slate-300'}>
                              {school.verifiedScore}
                            </span>
                            <span className={isSelected ? 'text-white/70 text-xs' : 'text-slate-500 text-xs'}>
                              {' '}/ {school.claimedScore}
                            </span>
                          </div>

                          <div className={`text-[11px] tabular-nums font-medium ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                            {formatRupiah(school.bosBudget.absorbed).replace(',00', '')}
                          </div>

                          <div className={`text-[10px] font-semibold ${isSelected ? 'text-white/90' : 'text-indigo-400'}`}>
                            {school.citizenReports.length} Laporan Warga
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                <span className="tabular-nums">
                  Hal {currentPage} dari {totalPages}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-[#1F2028] hover:bg-[#262832] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold tabular-nums transition-all ${
                        currentPage === idx + 1
                          ? 'bg-[#5E5CE6] text-white'
                          : 'bg-[#1F2028] text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-[#1F2028] hover:bg-[#262832] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= SISI KANAN (62% Lebar - Deep-Dive Card Berwarna Indigo/Violet #5B58EB) ================= */}
          <div className="w-full lg:w-[62%] sticky top-24">
            {selectedSchool ? (
              <div className="finnova-deepdive-card p-6 text-white space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto dark-scroll">
                {/* 1. Header Detail Sekolah di dalam Kartu Indigo */}
                <div className="border-b border-white/20 pb-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                          NPSN {selectedSchool.npsn}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#5B58EB]">
                          {selectedSchool.level}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                          Akreditasi {selectedSchool.accreditationGrade}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
                        {selectedSchool.name}
                      </h3>
                      <p className="text-xs text-white/80">
                        {selectedSchool.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onOpenPdfModal && (
                        <button
                          onClick={() => onOpenPdfModal(selectedSchool)}
                          className="px-3.5 py-2.5 rounded-2xl bg-white text-[#5B58EB] hover:bg-indigo-50 text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Unduh / Cetak Ringkasan Audit Publik (PDF)"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="hidden sm:inline">📄 Unduh Laporan Audit Publik (PDF)</span>
                          <span className="sm:hidden">PDF</span>
                        </button>
                      )}

                      <button
                        onClick={() => onToggleCompare(selectedSchool)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                          isCompared(selectedSchool.id)
                            ? 'bg-white text-slate-900 border-white shadow-md'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                        title="Bandingkan sekolah ini"
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 2. 3 Sub-Kotak Metrik Transparan (bg-white/15 persis FINNOVA) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                      <span className="text-[11px] uppercase tracking-wider text-white/70 block font-semibold">
                        Serapan Dana BOS
                      </span>
                      <span className="text-base font-extrabold text-white tabular-nums block mt-1">
                        {formatRupiah(selectedSchool.bosBudget.absorbed).replace(',00', '')}
                      </span>
                      <span className="text-[11px] text-emerald-300 font-bold tabular-nums">
                        {selectedSchool.bosBudget.absorptionRate}% Terserap
                      </span>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                      <span className="text-[11px] uppercase tracking-wider text-white/70 block font-semibold">
                        Skor Klaim Mandiri
                      </span>
                      <span className="text-base font-extrabold text-white tabular-nums block mt-1">
                        {selectedSchool.claimedScore} / 100
                      </span>
                      <span className="text-[11px] text-white/80 font-medium">
                        Evaluasi Diri Sispena
                      </span>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                      <span className="text-[11px] uppercase tracking-wider text-white/70 block font-semibold">
                        Skor Validasi Warga
                      </span>
                      <span className="text-base font-extrabold text-white tabular-nums block mt-1">
                        {selectedSchool.verifiedScore} / 100
                      </span>
                      <span className={`text-[11px] font-bold tabular-nums ${
                        selectedSchool.aiAssessorBrief.discrepancyRate > 15 ? 'text-rose-300' : 'text-emerald-300'
                      }`}>
                        Selisih Gap: {selectedSchool.aiAssessorBrief.discrepancyRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Live 5-Step SLA Progress Stepper di dalam Kartu Indigo */}
                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <SlaStepper
                    stages={selectedSchool.stageDetails}
                    currentStageNumber={selectedSchool.currentStageNumber}
                    theme="indigoCard"
                  />
                </div>

                {/* 4. Tab / Panel Bawah: AI Brief, Radar Chart, dan Bukti Warga */}
                <div className="space-y-4">
                  {/* AI Field-Assessor Brief */}
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-white" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                          AI Field-Assessor Briefing
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#5B58EB]">
                        {selectedSchool.aiAssessorBrief.riskBadge}
                      </span>
                    </div>

                    <p className="text-xs text-white/90 leading-relaxed bg-black/15 p-3.5 rounded-xl border border-white/10">
                      {selectedSchool.aiAssessorBrief.summary}
                    </p>

                    {/* 3 Fokus Investigasi Lapangan Wajib */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block">
                        3 Fokus Investigasi Lapangan Wajib bagi Asesor:
                      </span>
                      {selectedSchool.aiAssessorBrief.mandatoryInvestigationFocus.map((focus, i) => (
                        <div
                          key={i}
                          className="text-xs text-white p-2.5 rounded-xl bg-black/15 border border-white/10 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-white text-[#5B58EB] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            {i + 1}
                          </span>
                          <span className="leading-snug">{focus}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Radar Chart 8 Standar Nasional Pendidikan (SNP) */}
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Radar 8 Standar Nasional Pendidikan (SNP)
                      </h4>
                      <span className="text-[11px] text-white/80">
                        Klaim vs Validasi Riil
                      </span>
                    </div>

                    <RadarStandardsChart
                      data={selectedSchool.radarStandards}
                      isHighDiscrepancy={selectedSchool.aiRiskLevel === 'high_discrepancy'}
                      theme="indigoCard"
                    />
                  </div>

                  {/* Crowdsourced Reality Check Ledger & Two-Way Citizen Feedback Loop */}
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-emerald-300" />
                          <span>
                            💬 Kanal Umpan Balik & Tanggapan Resmi (2-Way Feedback Loop —{' '}
                            {selectedSchool.citizenReports.length})
                          </span>
                        </h4>
                        <p className="text-[11px] text-white/80">
                          Akuntabilitas dua arah antara laporan bukti warga, respons resmi Kepala Sekolah/Komite, & evaluasi kepuasan publik
                        </p>
                      </div>
                    </div>

                    {/* Citizen Reports & 2-Way Feedback List */}
                    <div className="space-y-3.5 pt-1">
                      {selectedSchool.citizenReports.map((report) => {
                        const followUp = report.followUpStatus || 'waiting_response';
                        const votes = report.satisfactionVotes || { satisfied: 0, unsatisfied: 0 };
                        const comments = report.publicComments || [];
                        const isCommentBoxOpen = openCommentReportId === report.id;

                        return (
                          <div
                            key={report.id}
                            className="p-4 rounded-2xl bg-black/25 border border-white/15 space-y-3 text-white"
                          >
                            {/* Header: Reporter & Follow-up Status */}
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white">{report.author}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                                  {report.authorRole}
                                </span>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#5B58EB]">
                                  Fasilitas: {report.facilityTag}
                                </span>
                              </div>

                              {/* Status Tindak Lanjut Sekolah Badge */}
                              <div className="flex items-center gap-2">
                                {followUp === 'resolved' ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-200 border border-emerald-300/40">
                                    ✓ Selesai Ditindaklanjuti
                                  </span>
                                ) : followUp === 'in_progress_school' ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-200 border border-amber-300/40">
                                    🔧 Sedang Diperbaiki oleh Sekolah
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/15 text-white/90 border border-white/25">
                                    ⏳ Menunggu Respons Sekolah
                                  </span>
                                )}
                                <span className="text-[10px] tabular-nums text-white/70">
                                  {report.date}
                                </span>
                              </div>
                            </div>

                            {/* Citizen Report Text */}
                            <p className="text-xs text-white/95 leading-relaxed">{report.text}</p>

                            {report.photoUrl && (
                              <div className="rounded-xl overflow-hidden border border-white/20 max-h-36">
                                <img
                                  src={report.photoUrl}
                                  alt="Bukti Lapangan"
                                  className="w-full h-36 object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            )}

                            {/* Kotak Balasan Resmi Kepala Sekolah / Komite Sekolah */}
                            {report.officialResponse ? (
                              <div className="p-3.5 rounded-xl bg-white/15 border-l-4 border-emerald-300 space-y-1">
                                <div className="flex items-center justify-between flex-wrap gap-1 text-[11px]">
                                  <span className="font-extrabold text-emerald-200 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>
                                      Tanggapan Resmi Institusi: {report.officialResponse.responderName} ({report.officialResponse.responderRole})
                                    </span>
                                  </span>
                                  <span className="text-[10px] text-white/70 tabular-nums">
                                    {report.officialResponse.respondedAt}
                                  </span>
                                </div>
                                <p className="text-xs text-white leading-relaxed italic">
                                  "{report.officialResponse.text}"
                                </p>
                              </div>
                            ) : (
                              <div className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px] text-amber-200 flex items-center justify-between gap-2">
                                <span>
                                  Belum ada balasan resmi institusi. Pihak Sekolah / Admin dapat merespons melalui Portal Moderasi.
                                </span>
                              </div>
                            )}

                            {/* Public Follow-Up Comments Thread */}
                            {comments.length > 0 && (
                              <div className="space-y-1.5 pl-3 border-l-2 border-white/20">
                                {comments.map((cmt) => (
                                  <div
                                    key={cmt.id}
                                    className="p-2.5 rounded-xl bg-black/20 text-[11px] space-y-0.5"
                                  >
                                    <div className="flex items-center justify-between text-white/80">
                                      <span className="font-bold text-white">
                                        {cmt.author}{' '}
                                        <span className="text-[10px] font-normal text-white/70">
                                          ({cmt.role})
                                        </span>
                                      </span>
                                      <span className="text-[10px] tabular-nums">{cmt.date}</span>
                                    </div>
                                    <p className="text-white/90">{cmt.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Interactive 2-Way Satisfaction Voting & Comment Trigger */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/15 text-xs">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() =>
                                    onVoteSatisfaction &&
                                    onVoteSatisfaction(selectedSchool.id, report.id, 'satisfied')
                                  }
                                  className="px-2.5 py-1 rounded-full bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-300/30 text-[11px] font-bold text-emerald-100 transition-colors flex items-center gap-1 cursor-pointer tabular-nums"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>👍 Respons Memuaskan ({votes.satisfied})</span>
                                </button>

                                <button
                                  onClick={() =>
                                    onVoteSatisfaction &&
                                    onVoteSatisfaction(selectedSchool.id, report.id, 'unsatisfied')
                                  }
                                  className="px-2.5 py-1 rounded-full bg-rose-500/25 hover:bg-rose-500/40 border border-rose-300/30 text-[11px] font-bold text-rose-100 transition-colors flex items-center gap-1 cursor-pointer tabular-nums"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>👎 Belum Terbukti di Lapangan ({votes.unsatisfied})</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    setOpenCommentReportId(isCommentBoxOpen ? null : report.id)
                                  }
                                  className="text-[11px] font-bold text-indigo-200 hover:text-white underline cursor-pointer"
                                >
                                  {isCommentBoxOpen ? 'Tutup Form' : '+ Tanggapi / Komentar Warga'}
                                </button>

                                <button
                                  onClick={() => onUpvoteReport(selectedSchool.id, report.id)}
                                  className="flex items-center gap-1 text-[11px] tabular-nums text-white/80 hover:text-white transition-colors cursor-pointer"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>Dukung ({report.upvotes})</span>
                                </button>
                              </div>
                            </div>

                            {/* Inline Add Citizen Follow-Up Comment Form */}
                            {isCommentBoxOpen && (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!commentText.trim() || !onAddPublicComment) return;
                                  onAddPublicComment(selectedSchool.id, report.id, {
                                    author: commentAuthor.trim() || 'Wali Murid Terverifikasi',
                                    role: commentRole,
                                    text: commentText.trim()
                                  });
                                  setCommentText('');
                                  setOpenCommentReportId(null);
                                }}
                                className="p-3 rounded-xl bg-black/30 border border-white/20 space-y-2.5"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={commentAuthor}
                                    onChange={(e) => setCommentAuthor(e.target.value)}
                                    placeholder="Nama Anda (Contoh: Hendra - Wali Murid)"
                                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder-white/50 focus:outline-none focus:border-white"
                                  />
                                  <select
                                    value={commentRole}
                                    onChange={(e) => setCommentRole(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/20 text-xs text-white focus:outline-none"
                                  >
                                    <option value="Wali Murid">Wali Murid</option>
                                    <option value="Siswa">Siswa</option>
                                    <option value="Komite Sekolah">Komite Sekolah</option>
                                    <option value="Warga Sekitar">Warga Sekitar</option>
                                  </select>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    required
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Tulis konfirmasi kondisi riil terbaru di lapangan..."
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder-white/50 focus:outline-none focus:border-white"
                                  />
                                  <button
                                    type="submit"
                                    className="px-3.5 py-1.5 rounded-lg bg-white text-[#5B58EB] font-extrabold text-xs flex items-center gap-1 hover:bg-indigo-50 cursor-pointer"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Kirim</span>
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tombol Putih Bersih di Pojok Kanan Bawah (Persis FINNOVA) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {onOpenPdfModal && (
                      <button
                        onClick={() => onOpenPdfModal(selectedSchool)}
                        className="bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-full px-5 py-3 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-emerald-300" />
                        <span>📄 Unduh Laporan Audit Publik (PDF)</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenReportModal(selectedSchool.id)}
                      className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-6 py-3 font-bold text-xs shadow-md shadow-black/10 transition-colors flex items-center gap-2 cursor-pointer ml-auto"
                    >
                      <Camera className="w-4 h-4 text-[#5E5CE6]" />
                      <span>+ Kirim Bukti Lapangan</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1F2028] rounded-3xl p-12 text-center text-slate-400 space-y-2 border border-slate-800">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-200">Pilih sekolah di tabel kiri</p>
                <p className="text-xs text-slate-400">
                  Detail SLA, AI Briefing, dan Radar Standar akan muncul secara instan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
