import React, { useMemo } from 'react';
import {
  MapPin,
  ChevronRight,
  Building2,
  CheckCircle2,
  AlertOctagon,
  RotateCcw,
  Layers,
  Wallet
} from 'lucide-react';
import { School } from '../types/school';

export interface RegionalFilterState {
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
}

interface GranularRegionalDrillDownBarProps {
  schools: School[];
  selectedSchool: School;
  onSelectSchool: (school: School) => void;
  regionalFilter: RegionalFilterState;
  onChangeRegionalFilter: (next: RegionalFilterState) => void;
}

export const GranularRegionalDrillDownBar: React.FC<GranularRegionalDrillDownBarProps> = ({
  schools,
  selectedSchool,
  onSelectSchool,
  regionalFilter,
  onChangeRegionalFilter
}) => {
  // Normalize helper
  const getProvinsi = (s: School) => s.provinsi || 'Jawa Timur';
  const getKabKota = (s: School) => s.kabupatenKota || s.city;
  const getKecamatan = (s: School) => s.kecamatan || s.district;

  // 1. Unique Provinces
  const provinces = useMemo(() => {
    return Array.from(new Set(schools.map(getProvinsi))).sort();
  }, [schools]);

  // 2. Cascading Kabupaten/Kota based on selected Provinsi
  const kabupatenList = useMemo(() => {
    const subset =
      regionalFilter.provinsi === 'ALL'
        ? schools
        : schools.filter((s) => getProvinsi(s) === regionalFilter.provinsi);
    return Array.from(new Set(subset.map(getKabKota))).sort();
  }, [schools, regionalFilter.provinsi]);

  // 3. Cascading Kecamatan based on selected Provinsi & Kabupaten/Kota
  const kecamatanList = useMemo(() => {
    const subset = schools.filter((s) => {
      if (regionalFilter.provinsi !== 'ALL' && getProvinsi(s) !== regionalFilter.provinsi) {
        return false;
      }
      if (regionalFilter.kabupatenKota !== 'ALL' && getKabKota(s) !== regionalFilter.kabupatenKota) {
        return false;
      }
      return true;
    });
    return Array.from(new Set(subset.map(getKecamatan))).sort();
  }, [schools, regionalFilter.provinsi, regionalFilter.kabupatenKota]);

  // 4. Matching Schools in Current Regional Drill-Down Slice
  const matchingSchools = useMemo(() => {
    return schools.filter((s) => {
      if (regionalFilter.provinsi !== 'ALL' && getProvinsi(s) !== regionalFilter.provinsi) {
        return false;
      }
      if (regionalFilter.kabupatenKota !== 'ALL' && getKabKota(s) !== regionalFilter.kabupatenKota) {
        return false;
      }
      if (regionalFilter.kecamatan !== 'ALL' && getKecamatan(s) !== regionalFilter.kecamatan) {
        return false;
      }
      return true;
    });
  }, [schools, regionalFilter]);

  // Regional Aggregated Metrics (BOS & SLA Compliance)
  const regionalMetrics = useMemo(() => {
    const list = matchingSchools.length > 0 ? matchingSchools : schools;
    const totalBos = list.reduce((sum, s) => sum + s.bosBudget.absorbed, 0);
    const avgAbsorption =
      list.reduce((sum, s) => sum + s.bosBudget.absorptionRate, 0) / Math.max(1, list.length);
    const overdueCount = list.filter((s) => s.slaStatus === 'overdue').length;
    const onTrackCount = list.length - overdueCount;
    const overduePct = Number(((overdueCount / Math.max(1, list.length)) * 100).toFixed(1));
    const avgGap = Number(
      (
        list.reduce((sum, s) => sum + s.aiAssessorBrief.discrepancyRate, 0) /
        Math.max(1, list.length)
      ).toFixed(1)
    );

    return {
      count: matchingSchools.length,
      totalBosMiliar: (totalBos / 1_000_000_000).toFixed(2),
      avgAbsorption: avgAbsorption.toFixed(1),
      overdueCount,
      onTrackCount,
      overduePct,
      avgGap
    };
  }, [matchingSchools, schools]);

  // Quick Sub-Region Breakdown Chips for 1-Click Drill-Down
  const subRegionChips = useMemo(() => {
    if (regionalFilter.provinsi === 'ALL') {
      return provinces.map((prov) => {
        const group = schools.filter((s) => getProvinsi(s) === prov);
        const bosMiliar = (
          group.reduce((sum, s) => sum + s.bosBudget.absorbed, 0) / 1_000_000_000
        ).toFixed(1);
        const overdue = group.filter((s) => s.slaStatus === 'overdue').length;
        return {
          level: 'provinsi' as const,
          name: prov,
          count: group.length,
          bosMiliar,
          overdue
        };
      });
    }

    if (regionalFilter.kabupatenKota === 'ALL') {
      return kabupatenList.map((kab) => {
        const group = matchingSchools.filter((s) => getKabKota(s) === kab);
        const bosMiliar = (
          group.reduce((sum, s) => sum + s.bosBudget.absorbed, 0) / 1_000_000_000
        ).toFixed(1);
        const overdue = group.filter((s) => s.slaStatus === 'overdue').length;
        return {
          level: 'kabupatenKota' as const,
          name: kab,
          count: group.length,
          bosMiliar,
          overdue
        };
      });
    }

    if (regionalFilter.kecamatan === 'ALL') {
      return kecamatanList.map((kec) => {
        const group = matchingSchools.filter((s) => getKecamatan(s) === kec);
        const bosMiliar = (
          group.reduce((sum, s) => sum + s.bosBudget.absorbed, 0) / 1_000_000_000
        ).toFixed(1);
        const overdue = group.filter((s) => s.slaStatus === 'overdue').length;
        return {
          level: 'kecamatan' as const,
          name: kec,
          count: group.length,
          bosMiliar,
          overdue
        };
      });
    }

    return [];
  }, [
    regionalFilter,
    provinces,
    kabupatenList,
    kecamatanList,
    schools,
    matchingSchools
  ]);

  const handleSelectProvinsi = (prov: string) => {
    const nextFilter: RegionalFilterState = {
      provinsi: prov,
      kabupatenKota: 'ALL',
      kecamatan: 'ALL'
    };
    onChangeRegionalFilter(nextFilter);
    const firstMatch =
      prov === 'ALL' ? schools[0] : schools.find((s) => getProvinsi(s) === prov);
    if (firstMatch) onSelectSchool(firstMatch);
  };

  const handleSelectKabKota = (kab: string) => {
    const inferredProv =
      kab === 'ALL'
        ? regionalFilter.provinsi
        : getProvinsi(schools.find((s) => getKabKota(s) === kab) || schools[0]);
    const nextFilter: RegionalFilterState = {
      provinsi: inferredProv,
      kabupatenKota: kab,
      kecamatan: 'ALL'
    };
    onChangeRegionalFilter(nextFilter);
    const firstMatch = schools.find(
      (s) =>
        (inferredProv === 'ALL' || getProvinsi(s) === inferredProv) &&
        (kab === 'ALL' || getKabKota(s) === kab)
    );
    if (firstMatch) onSelectSchool(firstMatch);
  };

  const handleSelectKecamatan = (kec: string) => {
    if (kec === 'ALL') {
      onChangeRegionalFilter({
        ...regionalFilter,
        kecamatan: 'ALL'
      });
      return;
    }
    const targetSchool = schools.find(
      (s) =>
        (regionalFilter.provinsi === 'ALL' || getProvinsi(s) === regionalFilter.provinsi) &&
        (regionalFilter.kabupatenKota === 'ALL' ||
          getKabKota(s) === regionalFilter.kabupatenKota) &&
        getKecamatan(s) === kec
    );
    const nextFilter: RegionalFilterState = {
      provinsi: targetSchool ? getProvinsi(targetSchool) : regionalFilter.provinsi,
      kabupatenKota: targetSchool ? getKabKota(targetSchool) : regionalFilter.kabupatenKota,
      kecamatan: kec
    };
    onChangeRegionalFilter(nextFilter);
    if (targetSchool) onSelectSchool(targetSchool);
  };

  const handleResetRegional = () => {
    onChangeRegionalFilter({
      provinsi: 'ALL',
      kabupatenKota: 'ALL',
      kecamatan: 'ALL'
    });
  };

  const isFiltered =
    regionalFilter.provinsi !== 'ALL' ||
    regionalFilter.kabupatenKota !== 'ALL' ||
    regionalFilter.kecamatan !== 'ALL';

  return (
    <div className="bg-white rounded-[28px] p-6 border border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-5">
      {/* Top Row: Title + Interactive Breadcrumb Path */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5E5CE6] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Granular Regional Drill-Down — Akuntabilitas Wilayah Bertingkat
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#5E5CE6] border border-indigo-200/80">
                5-Level Hierarchy
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Telusuri serapan Dana BOS dan kepatuhan SLA akreditasi dari tingkat Nasional hingga Kecamatan dan Satuan Pendidikan.
            </p>
          </div>
        </div>

        {/* Interactive Breadcrumb Path */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs">
          <button
            onClick={handleResetRegional}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              !isFiltered
                ? 'bg-[#14151A] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            🇮🇩 Nasional
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <button
            onClick={() =>
              regionalFilter.provinsi !== 'ALL' &&
              handleSelectProvinsi(regionalFilter.provinsi)
            }
            className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              regionalFilter.provinsi !== 'ALL' && regionalFilter.kabupatenKota === 'ALL'
                ? 'bg-[#5E5CE6] text-white shadow-sm'
                : regionalFilter.provinsi !== 'ALL'
                ? 'bg-indigo-50 text-[#5E5CE6] hover:bg-indigo-100'
                : 'text-slate-400'
            }`}
          >
            {regionalFilter.provinsi === 'ALL' ? 'Semua Provinsi' : regionalFilter.provinsi}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <button
            onClick={() =>
              regionalFilter.kabupatenKota !== 'ALL' &&
              handleSelectKabKota(regionalFilter.kabupatenKota)
            }
            className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              regionalFilter.kabupatenKota !== 'ALL' && regionalFilter.kecamatan === 'ALL'
                ? 'bg-[#5E5CE6] text-white shadow-sm'
                : regionalFilter.kabupatenKota !== 'ALL'
                ? 'bg-indigo-50 text-[#5E5CE6] hover:bg-indigo-100'
                : 'text-slate-400'
            }`}
          >
            {regionalFilter.kabupatenKota === 'ALL'
              ? 'Semua Kab/Kota'
              : regionalFilter.kabupatenKota}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <span
            className={`px-2.5 py-1 rounded-xl font-bold ${
              regionalFilter.kecamatan !== 'ALL'
                ? 'bg-[#5E5CE6] text-white shadow-sm'
                : 'text-slate-400'
            }`}
          >
            {regionalFilter.kecamatan === 'ALL'
              ? 'Semua Kecamatan'
              : `Kec. ${regionalFilter.kecamatan}`}
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <span className="px-2.5 py-1 rounded-xl font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 truncate max-w-[190px]">
            {selectedSchool.name}
          </span>

          {isFiltered && (
            <button
              onClick={handleResetRegional}
              className="ml-1 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Reset Filter Wilayah ke Nasional"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: 4 Cascading Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Level 1: Provinsi */}
        <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#5E5CE6]" />
            <span>1. Tingkat Provinsi</span>
          </label>
          <select
            value={regionalFilter.provinsi}
            onChange={(e) => handleSelectProvinsi(e.target.value)}
            aria-label="Pilih Provinsi"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            <option value="ALL">🇮🇩 Semua Provinsi (Nasional)</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                Provinsi {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Level 2: Kabupaten / Kota */}
        <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#5E5CE6]" />
            <span>2. Tingkat Kabupaten / Kota</span>
          </label>
          <select
            value={regionalFilter.kabupatenKota}
            onChange={(e) => handleSelectKabKota(e.target.value)}
            aria-label="Pilih Kabupaten atau Kota"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            <option value="ALL">
              Semua Kab/Kota ({kabupatenList.length} Daerah)
            </option>
            {kabupatenList.map((kab) => (
              <option key={kab} value={kab}>
                {kab}
              </option>
            ))}
          </select>
        </div>

        {/* Level 3: Kecamatan */}
        <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#5E5CE6]" />
            <span>3. Tingkat Kecamatan</span>
          </label>
          <select
            value={regionalFilter.kecamatan}
            onChange={(e) => handleSelectKecamatan(e.target.value)}
            aria-label="Pilih Kecamatan"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            <option value="ALL">
              Semua Kecamatan ({kecamatanList.length} Kec.)
            </option>
            {kecamatanList.map((kec) => (
              <option key={kec} value={kec}>
                Kec. {kec}
              </option>
            ))}
          </select>
        </div>

        {/* Level 4: Satuan Pendidikan */}
        <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E5CE6] flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#5E5CE6]" />
            <span>4. Satuan Pendidikan ({matchingSchools.length})</span>
          </label>
          <select
            value={selectedSchool.id}
            onChange={(e) => {
              const found = schools.find((s) => s.id === e.target.value);
              if (found) onSelectSchool(found);
            }}
            aria-label="Pilih Satuan Pendidikan"
            className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#5E5CE6] cursor-pointer"
          >
            {matchingSchools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.npsn}) — {getKecamatan(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Row: Regional Drill-Down Summary Strip & Quick Click Chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
        {/* RegionalBOS & SLA KPI Summary */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#5E5CE6]" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                Serapan BOS Wilayah Aktif
              </span>
              <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                Rp {regionalMetrics.totalBosMiliar} Miliar ({regionalMetrics.avgAbsorption}% Terserap)
              </span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                Kepatuhan SLA Wilayah
              </span>
              <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                {regionalMetrics.onTrackCount} On-Track •{' '}
                <span className={regionalMetrics.overdueCount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                  {regionalMetrics.overdueCount} Overdue ({regionalMetrics.overduePct}%)
                </span>
              </span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                Rata-rata Gap Klaim vs Riil
              </span>
              <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                {regionalMetrics.avgGap}% Discrepancy
              </span>
            </div>
          </div>
        </div>

        {/* Quick 1-Click Sub-Region Drill-Down Pills */}
        {subRegionChips.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              Drill-Down Cepat:
            </span>
            {subRegionChips.map((chip) => (
              <button
                key={chip.name}
                onClick={() => {
                  if (chip.level === 'provinsi') handleSelectProvinsi(chip.name);
                  else if (chip.level === 'kabupatenKota') handleSelectKabKota(chip.name);
                  else handleSelectKecamatan(chip.name);
                }}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-[#5E5CE6] text-slate-700 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{chip.name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/80 text-slate-800 text-[10px] tabular-nums">
                  {chip.count} Sek • Rp {chip.bosMiliar}M
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

