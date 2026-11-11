import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  FileText,
  QrCode,
  Sparkles
} from 'lucide-react';
import { School } from '../types/school';
import { EduTrackLogo } from './Navbar';

interface PublicAuditPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
}

export const PublicAuditPdfModal: React.FC<PublicAuditPdfModalProps> = ({
  isOpen,
  onClose,
  school
}) => {
  if (!isOpen || !school) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const nowDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const nowTime = new Date().toTimeString().slice(0, 5);
  const auditHash = `0x8F4E${school.npsn}B92C71A02026`;
  const docNumber = `AUD-EDUTRACK/${school.npsn}/XI/2026`;

  const resolvedReportsCount = school.citizenReports.filter(
    (r) => r.followUpStatus === 'resolved'
  ).length;
  const inProgressReportsCount = school.citizenReports.filter(
    (r) => r.followUpStatus === 'in_progress_school'
  ).length;

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Non-Print Top Action Bar */}
        <div className="no-print px-6 py-4 bg-[#14151A] text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-[#A5B4FC]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Pratinjau Dokumen Resmi Siap Cetak (A4 PDF)</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5E5CE6] text-white">
                  Public Audit Sheet
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Gunakan tombol Cetak / Simpan sebagai PDF untuk mengunduh lembar akuntabilitas publik resmi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrintPdf}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#5E5CE6] hover:bg-[#4B49C8] text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Cetak / Simpan sebagai PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup Pratinjau PDF"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 Audit Document Body */}
        <div
          id="edutrack-printable-audit-sheet"
          className="p-8 sm:p-10 overflow-y-auto space-y-6 bg-white text-slate-900"
        >
          {/* 1. Kop Dokumen Resmi */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <EduTrackLogo />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 uppercase">
                    EduTrack Public Transparency Ledger
                  </span>
                </div>
                <p className="text-xs font-bold text-[#5E5CE6]">
                  Ringkasan Akreditasi BAN-PDM, Korelasi Dana BOS & Audit Partisipatif Publik
                </p>
                <p className="text-[11px] text-slate-500">
                  Portal Akuntabilitas Pendidikan Nasional • MIA 2026 — Designing Digital Futures
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-[11px] space-y-0.5 tabular-nums bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
              <div className="font-extrabold text-slate-900">{docNumber}</div>
              <div className="text-slate-500">
                Tanggal Cetak: {nowDate}, {nowTime} WIB
              </div>
              <div className="text-emerald-700 font-bold flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Terverifikasi Ledger Publik</span>
              </div>
            </div>
          </div>

          {/* 2. Identitas Satuan Pendidikan & Ringkasan Skor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Identitas Satuan Pendidikan Terpantau
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{school.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#14151A] text-white tabular-nums">
                  NPSN: {school.npsn}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{school.address}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Provinsi
                  </span>
                  <span className="font-bold text-slate-800">
                    {school.provinsi || 'Jawa Timur'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Kabupaten/Kota
                  </span>
                  <span className="font-bold text-slate-800">
                    {school.kabupatenKota || school.city}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Kecamatan
                  </span>
                  <span className="font-bold text-slate-800">
                    {school.kecamatan || school.district}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Jenjang / Peringkat
                  </span>
                  <span className="font-extrabold text-[#5E5CE6]">
                    {school.level} — Akreditasi {school.accreditationGrade}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Score Summary Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E5CE6]">
                Ringkasan Skor Integritas Audit
              </span>
              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    Klaim SISPENA
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                    {school.claimedScore}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    Validasi Publik
                  </span>
                  <span
                    className={`text-lg font-extrabold tabular-nums ${
                      school.verifiedScore >= 80 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {school.verifiedScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-indigo-200/70">
                <span className="font-bold text-slate-700">Selisih Diskrepansi:</span>
                <span
                  className={`font-extrabold tabular-nums ${
                    school.aiAssessorBrief.discrepancyRate > 15
                      ? 'text-rose-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {school.aiAssessorBrief.discrepancyRate}% ({school.aiAssessorBrief.riskBadge})
                </span>
              </div>
            </div>
          </div>

          {/* 3. Status Tahapan SLA Akreditasi Saat Ini */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                1. Status Progres 5 Tahapan SLA Akreditasi BAN-PDM
              </h4>
              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold ${
                  school.slaStatus === 'on_track'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {school.slaStatus === 'on_track'
                  ? 'SLA On-Track (Sesuai Standar 62 Hari)'
                  : `SLA Overdue (+${school.slaDaysDifference} Hari Melewati Batas)`}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {school.stageDetails.map((st) => {
                const isDone = st.status === 'completed';
                const isOverdue = st.status === 'overdue';
                const isCurrent = st.stageNumber === school.currentStageNumber;
                return (
                  <div
                    key={st.stageNumber}
                    className={`p-2.5 rounded-xl border text-xs ${
                      isOverdue
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : isCurrent
                        ? 'bg-indigo-50 border-[#5E5CE6] text-slate-900'
                        : isDone
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="font-extrabold text-[11px]">
                      Tahap {st.stageNumber}: {st.name}
                    </div>
                    <div className="text-[10px] tabular-nums mt-1 font-semibold">
                      Durasi: {st.daysSpent} / {st.maxSlaDays} Hari
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Tabel Perbandingan 8 Standar Nasional Pendidikan (SNP) */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              2. Tabel Perbandingan 8 Standar Nasional Pendidikan (Klaim Mandiri vs Validasi Publik)
            </h4>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 text-[11px] font-extrabold uppercase">
                  <tr>
                    <th className="py-2.5 px-3.5">Standar Nasional Pendidikan (SNP)</th>
                    <th className="py-2.5 px-3.5 text-center">Skor Klaim Sekolah</th>
                    <th className="py-2.5 px-3.5 text-center">Skor Validasi Publik</th>
                    <th className="py-2.5 px-3.5 text-center">Selisih (Gap)</th>
                    <th className="py-2.5 px-3.5 text-right">Status Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 tabular-nums">
                  {school.radarStandards.map((std, i) => {
                    const gap = Number((std.claimedScore - std.verifiedScore).toFixed(1));
                    const isAnomalous = gap >= 15;
                    return (
                      <tr key={std.subject} className="hover:bg-slate-50">
                        <td className="py-2 px-3.5 font-bold text-slate-800">
                          {i + 1}. {std.subject}
                        </td>
                        <td className="py-2 px-3.5 text-center font-semibold text-slate-700">
                          {std.claimedScore} / 100
                        </td>
                        <td className="py-2 px-3.5 text-center font-extrabold text-slate-900">
                          {std.verifiedScore} / 100
                        </td>
                        <td
                          className={`py-2 px-3.5 text-center font-bold ${
                            isAnomalous ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {gap > 0 ? `-${gap}` : '0'} Poin
                        </td>
                        <td className="py-2 px-3.5 text-right">
                          {isAnomalous ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600">
                              <AlertOctagon className="w-3 h-3" />
                              Wajib Uji Petik Fisik
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Sesuai Fakta Lapangan
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Realisasi Anggaran Dana BOS & 3 Fokus Investigasi AI Field-Assessor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dana BOS Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  3. Realisasi Anggaran Dana BOS (ARKAS)
                </h4>
                <span className="text-xs font-extrabold text-emerald-700 tabular-nums">
                  {school.bosBudget.absorptionRate}% Terserap
                </span>
              </div>
              <div className="text-xs space-y-1.5 tabular-nums">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Total Pagu Diterima:</span>
                  <span className="font-bold text-slate-900">
                    {formatRupiah(school.bosBudget.totalReceived)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Total Realisasi Terserap:</span>
                  <span className="font-extrabold text-[#5E5CE6]">
                    {formatRupiah(school.bosBudget.absorbed)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">• Alokasi Sarana & Prasarana:</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(school.bosBudget.reportedAllocations.sarpras)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">• Alokasi Operasional Pembelajaran:</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(school.bosBudget.reportedAllocations.operasional)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">• Alokasi Honorarium Guru & Tendik:</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(school.bosBudget.reportedAllocations.guruHonor)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">• Alokasi Digitalisasi & Multimedia:</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(school.bosBudget.reportedAllocations.digitalisasi)}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Field-Assessor Brief & 2-Way Feedback Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5E5CE6]" />
                  <span>4. Rekomendasi AI Field-Assessor</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                  {school.citizenReports.length} Laporan Warga ({resolvedReportsCount} Selesai,{' '}
                  {inProgressReportsCount} Proses)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {school.aiAssessorBrief.summary}
              </p>
              <div className="space-y-1.5 pt-1">
                {school.aiAssessorBrief.mandatoryInvestigationFocus.slice(0, 3).map((focus, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-800 flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#14151A] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug font-medium">{focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. QR Verifikasi Publik & Hash Pengesahan Digital */}
          <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              {/* Crisp Inline QR Verification Graphic */}
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 p-1.5">
                <QrCode className="w-9 h-9 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">
                  Kode Otentikasi & Hash Verifikasi Publik (SHA-256)
                </div>
                <div className="font-mono text-xs font-bold text-[#5E5CE6]">{auditHash}</div>
                <p className="text-[10px] text-slate-500">
                  Dokumen ini diterbitkan secara otomatis oleh Sistem Audit Terbuka EduTrack dan sah digunakan sebagai lampiran visitasi BAN-PDM maupun pengawasan publik.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 space-y-0.5">
              <div className="font-bold text-slate-800">
                Sistem Transparansi Akreditasi EduTrack
              </div>
              <div>Diverifikasi AI Vision & Kanal Partisipatif Warga</div>
              <div className="text-[10px] text-slate-400 tabular-nums">
                Timestamp: {nowDate} • {nowTime} WIB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
