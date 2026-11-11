import React from 'react';
import { X, Scale, CheckCircle2, AlertTriangle, Building2, ChevronRight } from 'lucide-react';
import { School } from '../types/school';

interface CompareSchoolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSchools: School[];
  onRemoveSchool: (id: string) => void;
  onSelectDetailSchool: (school: School) => void;
  onOpenPdfModal?: (school: School) => void;
}

export const CompareSchoolsModal: React.FC<CompareSchoolsModalProps> = ({
  isOpen,
  onClose,
  selectedSchools,
  onRemoveSchool,
  onSelectDetailSchool,
  onOpenPdfModal
}) => {
  if (!isOpen) return null;

  const schoolA = selectedSchools[0];
  const schoolB = selectedSchools[1];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5E5CE6]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Parent Decision Support — Komparasi Dua Sekolah
                <span className="text-[10px] font-bold tabular-nums px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Transparansi Publik
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Bandingkan klaim dokumen sekolah vs bukti validasi publik secara objektif tanpa manipulasi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {selectedSchools.length < 2 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                Pilih minimal 2 sekolah di tabel direktori untuk memulai komparasi.
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                Saat ini baru {selectedSchools.length} sekolah yang dipilih.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Side-by-Side School Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* School A */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold tabular-nums px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                        NPSN {schoolA.npsn}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1.5">{schoolA.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{schoolA.district}, {schoolA.city}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5E5CE6] text-white">
                      Akreditasi: {schoolA.accreditationGrade}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Status Integritas AI:</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                      schoolA.aiRiskLevel === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : schoolA.aiRiskLevel === 'bottleneck'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {schoolA.aiRiskLevel === 'verified' ? 'Tervalidasi Terbuka' : schoolA.aiRiskLevel === 'bottleneck' ? 'Bottleneck Birokrasi' : 'Diskrepansi Tinggi'}
                    </span>
                  </div>
                </div>

                {/* School B */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold tabular-nums px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                        NPSN {schoolB.npsn}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1.5">{schoolB.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{schoolB.district}, {schoolB.city}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5E5CE6] text-white">
                      Akreditasi: {schoolB.accreditationGrade}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Status Integritas AI:</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                      schoolB.aiRiskLevel === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : schoolB.aiRiskLevel === 'bottleneck'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {schoolB.aiRiskLevel === 'verified' ? 'Tervalidasi Terbuka' : schoolB.aiRiskLevel === 'bottleneck' ? 'Bottleneck Birokrasi' : 'Diskrepansi Tinggi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric Comparison Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tabular-nums text-[11px] border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-3 px-4 w-1/3">Indikator Komparasi Mutu</th>
                      <th className="py-3 px-4 w-1/3 text-[#5E5CE6] font-bold">{schoolA.name}</th>
                      <th className="py-3 px-4 w-1/3 text-emerald-600 font-bold">{schoolB.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700">Skor Klaim Dokumen (Sispena)</td>
                      <td className="py-3 px-4 tabular-nums font-bold text-slate-900">{schoolA.claimedScore} / 100</td>
                      <td className="py-3 px-4 tabular-nums font-bold text-slate-900">{schoolB.claimedScore} / 100</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700">Skor Validasi Riil Publik & Audit</td>
                      <td className="py-3 px-4 tabular-nums font-bold">
                        <span className={schoolA.verifiedScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}>
                          {schoolA.verifiedScore} / 100
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums font-bold">
                        <span className={schoolB.verifiedScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}>
                          {schoolB.verifiedScore} / 100
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700">Gap Ketidaksesuaian (Discrepancy)</td>
                      <td className="py-3 px-4 tabular-nums">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          schoolA.aiAssessorBrief.discrepancyRate > 15
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {schoolA.aiAssessorBrief.discrepancyRate}% gap
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          schoolB.aiAssessorBrief.discrepancyRate > 15
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {schoolB.aiAssessorBrief.discrepancyRate}% gap
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700">Kepatuhan SLA BAN-PDM</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${schoolA.slaStatus === 'on_track' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {schoolA.slaStatus === 'on_track' ? 'Tepat Waktu' : `Terlambat ${schoolA.slaDaysDifference} Hari`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${schoolB.slaStatus === 'on_track' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {schoolB.slaStatus === 'on_track' ? 'Tepat Waktu' : `Terlambat ${schoolB.slaDaysDifference} Hari`}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700">Realisasi BOS Sarpras Terlapor</td>
                      <td className="py-3 px-4 tabular-nums font-semibold text-slate-800">
                        {formatRupiah(schoolA.bosBudget.reportedAllocations.sarpras)}
                      </td>
                      <td className="py-3 px-4 tabular-nums font-semibold text-slate-800">
                        {formatRupiah(schoolB.bosBudget.reportedAllocations.sarpras)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700">Bukti Foto & Audit Warga Masuk</td>
                      <td className="py-3 px-4 tabular-nums text-[#5E5CE6] font-bold">
                        {schoolA.citizenReports.length} Laporan Lapangan
                      </td>
                      <td className="py-3 px-4 tabular-nums text-[#5E5CE6] font-bold">
                        {schoolB.citizenReports.length} Laporan Lapangan
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 8 SNP Standard Highlights */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Perbandingan Skor Riil 8 Standar Nasional Pendidikan (SNP)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {schoolA.radarStandards.map((std, idx) => {
                    const stdB = schoolB.radarStandards[idx];
                    return (
                      <div key={std.subject} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] font-semibold text-slate-600 truncate mb-1">
                          {std.subject}
                        </div>
                        <div className="flex items-center justify-between text-xs tabular-nums">
                          <span className={std.verifiedScore >= 80 ? 'text-[#5E5CE6] font-bold' : 'text-rose-600 font-bold'}>
                            {std.verifiedScore}
                          </span>
                          <span className="text-slate-400 font-medium">vs</span>
                          <span className={stdB?.verifiedScore >= 80 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {stdB?.verifiedScore || '-'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">
                  Data bersumber dari BAN-PDM Jawa Timur, Kemendikdasmen, dan Ledger Audit Warga Edu Track.
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {onOpenPdfModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPdfModal(schoolA);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      📄 PDF {schoolA.name}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSelectDetailSchool(schoolA);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-indigo-50 text-[#5E5CE6] hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    Buka Detail {schoolA.name}
                  </button>
                  <button
                    onClick={() => {
                      onSelectDetailSchool(schoolB);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-[#5E5CE6] text-white hover:bg-[#4B49C8] transition-colors cursor-pointer"
                  >
                    Buka Detail {schoolB.name}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
