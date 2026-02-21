'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, Search, ArrowUpRight, ArrowDownRight,
  Minus, Clock, Loader2, Activity, Pill,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePatients } from '@/lib/hooks';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

const MOCK_PATIENTS = [
  { id: '1', name: 'Ramesh Kumar', age: 62, gender: 'M', diagnosis: 'Lung Ca (Stage IIIB)', category: 'Thoracic', pain: 7, trend: 'worsening', lastLog: '35 min ago', adherence: 86, alertLevel: 'critical', pps: 50, ppsTrend: 'declining', medd: 220, caregiver: 'Sunita Kumar' },
  { id: '2', name: 'Sunita Devi', age: 55, gender: 'F', diagnosis: 'Breast Ca (Stage IV)', category: 'Breast', pain: 4, trend: 'stable', lastLog: '2 hrs ago', adherence: 94, alertLevel: 'warning', pps: 60, ppsTrend: 'stable', medd: 75, caregiver: 'Mohan Devi' },
  { id: '3', name: 'Arun Sharma', age: 70, gender: 'M', diagnosis: 'Pancreatic Ca', category: 'GI', pain: 8, trend: 'worsening', lastLog: '15 min ago', adherence: 72, alertLevel: 'critical', pps: 40, ppsTrend: 'declining', medd: 300, caregiver: 'Vikram Sharma' },
  { id: '4', name: 'Priya Patel', age: 48, gender: 'F', diagnosis: 'Ovarian Ca (Stage III)', category: 'Gynae', pain: 3, trend: 'improving', lastLog: '4 hrs ago', adherence: 98, alertLevel: 'info', pps: 60, ppsTrend: 'stable', medd: 30, caregiver: 'Rajesh Patel' },
  { id: '5', name: 'Mahesh Verma', age: 65, gender: 'M', diagnosis: 'Head & Neck Ca', category: 'Head & Neck', pain: 6, trend: 'stable', lastLog: '1 hr ago', adherence: 88, alertLevel: 'warning', pps: 50, ppsTrend: 'stable', medd: 90, caregiver: 'Sita Verma' },
  { id: '6', name: 'Kavita Singh', age: 52, gender: 'F', diagnosis: 'Cervical Ca (Stage IIB)', category: 'Gynae', pain: 2, trend: 'improving', lastLog: '6 hrs ago', adherence: 100, alertLevel: null, pps: 80, ppsTrend: 'stable', medd: 0, caregiver: 'Amit Singh' },
  { id: '7', name: 'Rajendra Gupta', age: 73, gender: 'M', diagnosis: 'Prostate Ca (mCRPC)', category: 'Urological', pain: 5, trend: 'stable', lastLog: '3 hrs ago', adherence: 91, alertLevel: 'info', pps: 70, ppsTrend: 'improving', medd: 60, caregiver: 'Geeta Gupta' },
  { id: '8', name: 'Fatima Begum', age: 60, gender: 'F', diagnosis: 'Colorectal Ca', category: 'GI', pain: 4, trend: 'improving', lastLog: '5 hrs ago', adherence: 95, alertLevel: null, pps: 70, ppsTrend: 'stable', medd: 45, caregiver: 'Nasreen Begum' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Thoracic: 'bg-blue-50 text-blue-600',
  Breast: 'bg-pink-50 text-pink-600',
  GI: 'bg-amber/10 text-amber',
  Gynae: 'bg-purple-50 text-purple-600',
  'Head & Neck': 'bg-teal/10 text-teal',
  Urological: 'bg-orange-50 text-orange-600',
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function mapApiPatient(p: any) {
  const pain = p.latest_pain_score ?? p.pain ?? 0;
  return {
    id: p.id,
    name: p.name || p.full_name || `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim(),
    age: p.age ?? (p.date_of_birth ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / 31557600000) : 0),
    gender: p.gender || 'U',
    diagnosis: p.diagnosis || p.primary_diagnosis || '',
    category: p.category || '',
    pain,
    trend: p.pain_trend || 'stable',
    lastLog: p.last_log_at ? formatTimeAgo(p.last_log_at) : 'N/A',
    adherence: p.medication_adherence ?? p.adherence ?? 0,
    alertLevel: pain >= 7 ? 'critical' : pain >= 5 ? 'warning' : pain >= 3 ? 'info' : null,
    pps: p.pps ?? 0,
    ppsTrend: p.pps_trend || 'stable',
    medd: p.medd ?? 0,
    caregiver: p.caregiver || '',
  };
}

const PAIN_COLORS: Record<number, string> = {
  0: '#7BA68C', 1: '#8FB89E', 2: '#A8C97F', 3: '#C4D94F', 4: '#E8D44D',
  5: '#E8C033', 6: '#E8A838', 7: '#E89040', 8: '#E87461', 9: '#D94F4F', 10: '#C0392B',
};

const ALERT_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  info: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
};

function computeRisk(p: any): { level: 'high' | 'medium' | 'low'; score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];
  if (p.pain >= 7) { score += 3; factors.push('Severe pain'); }
  else if (p.pain >= 5) { score += 1; }
  if (p.trend === 'worsening') { score += 2; factors.push('Worsening'); }
  if (p.pps <= 40) { score += 2; factors.push('Low PPS'); }
  if (p.medd > 200) { score += 2; factors.push('High MEDD'); }
  if (p.adherence < 70) { score += 2; factors.push('Low adherence'); }
  else if (p.adherence < 85) { score += 1; }
  if (p.ppsTrend === 'declining') { score += 1; factors.push('PPS declining'); }
  const level = score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low';
  return { level, score, factors };
}

const RISK_STYLE = {
  high: { bg: 'bg-alert-critical/10', text: 'text-alert-critical', label: 'High' },
  medium: { bg: 'bg-amber/10', text: 'text-amber', label: 'Medium' },
  low: { bg: 'bg-sage/10', text: 'text-sage', label: 'Low' },
};

type SortKey = 'pain' | 'name' | 'lastLog' | 'adherence';
type FilterStatus = 'all' | 'critical' | 'warning';

export default function PatientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('pain');
  const [filter, setFilter] = useState<FilterStatus>('all');

  const patientsQuery = usePatients({ search: search || undefined, sort_by: sortBy });
  const { data: rawData, isLoading, isFromApi } = useWithFallback(patientsQuery, MOCK_PATIENTS);

  const allPatients: any[] = isFromApi
    ? (Array.isArray(rawData) ? rawData : (rawData as any)?.data || []).map(mapApiPatient)
    : (rawData as any[]);

  const filtered = allPatients.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'critical') return p.alertLevel === 'critical';
    if (filter === 'warning') return p.alertLevel === 'warning';
    return true;
  }).sort((a, b) => {
    if (sortBy === 'pain') return b.pain - a.pain;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'adherence') return a.adherence - b.adherence;
    return 0;
  });

  const criticalCount = allPatients.filter((p) => p.alertLevel === 'critical').length;
  const warningCount = allPatients.filter((p) => p.alertLevel === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-teal" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">Patient Management</h1>
            <p className="text-sm text-charcoal/60">
              {allPatients.length} active &middot; {criticalCount} critical &middot; {warningCount} warning
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-teal" />}
          {!isFromApi && !isLoading && (
            <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">Demo Data</span>
          )}
        </div>
      </div>

      {/* Census Summary */}
      {(() => {
        const avgPain = allPatients.length > 0 ? (allPatients.reduce((s, p) => s + p.pain, 0) / allPatients.length).toFixed(1) : '0';
        const avgPPS = allPatients.length > 0 ? Math.round(allPatients.reduce((s, p) => s + p.pps, 0) / allPatients.length) : 0;
        const avgAdherence = allPatients.length > 0 ? Math.round(allPatients.reduce((s, p) => s + p.adherence, 0) / allPatients.length) : 0;
        const worseningCount = allPatients.filter(p => p.trend === 'worsening').length;
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
              <p className="text-[10px] font-semibold text-charcoal/50 uppercase">Avg Pain</p>
              <p className={cn('text-2xl font-bold', parseFloat(avgPain) >= 6 ? 'text-alert-critical' : parseFloat(avgPain) >= 4 ? 'text-amber' : 'text-alert-success')}>{avgPain}</p>
              <p className="text-[10px] text-charcoal/40">NRS across census</p>
            </div>
            <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
              <p className="text-[10px] font-semibold text-charcoal/50 uppercase">Avg PPS</p>
              <p className={cn('text-2xl font-bold', avgPPS <= 40 ? 'text-alert-critical' : avgPPS <= 60 ? 'text-amber' : 'text-sage')}>{avgPPS}%</p>
              <p className="text-[10px] text-charcoal/40">functional status</p>
            </div>
            <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
              <p className="text-[10px] font-semibold text-charcoal/50 uppercase">Avg Adherence</p>
              <p className={cn('text-2xl font-bold', avgAdherence >= 90 ? 'text-alert-success' : avgAdherence >= 70 ? 'text-amber' : 'text-alert-critical')}>{avgAdherence}%</p>
              <p className="text-[10px] text-charcoal/40">medication compliance</p>
            </div>
            <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
              <p className="text-[10px] font-semibold text-charcoal/50 uppercase">Worsening</p>
              <p className={cn('text-2xl font-bold', worseningCount > 0 ? 'text-alert-critical' : 'text-alert-success')}>{worseningCount}</p>
              <p className="text-[10px] text-charcoal/40">pain trend ↑</p>
            </div>
          </div>
        );
      })()}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-sage/20 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
        </div>
        <div className="flex gap-2">
          {(['all', 'critical', 'warning'] as FilterStatus[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-teal text-white' : 'bg-white text-charcoal/70 hover:bg-sage/10'}`}>
              {f === 'all' ? `All (${allPatients.length})` : f === 'critical' ? `Critical (${criticalCount})` : `Warning (${warningCount})`}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded-lg border border-sage/20 bg-white px-3 py-2.5 text-xs text-charcoal/70">
          <option value="pain">Sort: Pain (high first)</option>
          <option value="name">Sort: Name (A-Z)</option>
          <option value="adherence">Sort: Adherence (low first)</option>
        </select>
      </div>

      {/* Patient Table */}
      <div className="overflow-x-auto rounded-xl border border-sage/10 bg-white shadow-sm">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-sage/10 bg-cream/30">
              <th className="px-3 py-3 text-left text-xs font-semibold text-charcoal/60 w-10"></th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-charcoal/60">Patient</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-charcoal/60">Diagnosis</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-charcoal/60">Pain</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-charcoal/60">Trend</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-charcoal/60">
                <span className="flex items-center justify-center gap-1"><Activity className="h-3 w-3" /> PPS</span>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-charcoal/60">
                <span className="flex items-center justify-center gap-1"><Pill className="h-3 w-3" /> MEDD</span>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-charcoal/60">Adherence</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-charcoal/60">Risk</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-charcoal/60">Last Log</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => {
              const alertStyle = patient.alertLevel ? ALERT_STYLES[patient.alertLevel] : null;
              return (
                <tr key={patient.id} onClick={() => router.push(`/patients/${patient.id}`)} className="cursor-pointer border-b border-sage/5 transition-colors hover:bg-cream/20">
                  <td className="px-3 py-3.5">
                    {alertStyle ? (
                      <span className="relative flex h-3 w-3">
                        {patient.alertLevel === 'critical' && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />}
                        <span className={`relative inline-flex h-3 w-3 rounded-full ${alertStyle.dot}`} />
                      </span>
                    ) : (<span className="inline-flex h-3 w-3 rounded-full bg-sage/30" />)}
                  </td>
                  <td className="px-3 py-3.5">
                    <Link href={`/patients/${patient.id}`}>
                      <p className="text-sm font-semibold text-charcoal">{patient.name}</p>
                      <p className="text-xs text-charcoal/50">{patient.age}y / {patient.gender}</p>
                      {patient.caregiver && (
                        <p className="text-[10px] text-charcoal/30 mt-0.5">CG: {patient.caregiver}</p>
                      )}
                    </Link>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-sm text-charcoal/70">{patient.diagnosis}</p>
                    {patient.category && (
                      <span className={cn(
                        'mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        CATEGORY_COLORS[patient.category] || 'bg-sage/10 text-charcoal/50',
                      )}>
                        {patient.category}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
                      style={{ backgroundColor: PAIN_COLORS[patient.pain] || '#ccc', color: patient.pain >= 6 ? '#fff' : '#2D2D2D' }}>
                      {patient.pain}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    {patient.trend === 'worsening' && <ArrowUpRight className="mx-auto h-4 w-4 text-alert-critical" />}
                    {patient.trend === 'improving' && <ArrowDownRight className="mx-auto h-4 w-4 text-alert-success" />}
                    {patient.trend === 'stable' && <Minus className="mx-auto h-4 w-4 text-charcoal/40" />}
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        'text-sm font-bold',
                        patient.pps <= 30 ? 'text-alert-critical' :
                        patient.pps <= 50 ? 'text-terra' :
                        patient.pps <= 70 ? 'text-amber' :
                        'text-sage',
                      )}>
                        {patient.pps}%
                      </span>
                      <span className="text-[9px] text-charcoal/30">
                        {patient.ppsTrend === 'declining' ? '↓ declining' :
                         patient.ppsTrend === 'improving' ? '↑ improving' :
                         '→ stable'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        'text-sm font-bold',
                        patient.medd > 200 ? 'text-alert-critical' :
                        patient.medd > 90 ? 'text-terra' :
                        patient.medd > 0 ? 'text-charcoal/70' :
                        'text-charcoal/30',
                      )}>
                        {patient.medd > 0 ? `${patient.medd}` : '—'}
                      </span>
                      {patient.medd > 200 && (
                        <span className="text-[9px] text-alert-critical font-semibold">HIGH</span>
                      )}
                      {patient.medd > 90 && patient.medd <= 200 && (
                        <span className="text-[9px] text-terra">mg/day</span>
                      )}
                      {patient.medd > 0 && patient.medd <= 90 && (
                        <span className="text-[9px] text-charcoal/30">mg/day</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className={cn(
                      'text-sm font-semibold',
                      patient.adherence >= 90 ? 'text-alert-success' :
                      patient.adherence >= 70 ? 'text-amber' :
                      'text-alert-critical',
                    )}>
                      {patient.adherence}%
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    {(() => {
                      const risk = computeRisk(patient);
                      const rs = RISK_STYLE[risk.level];
                      return (
                        <div className="flex flex-col items-center">
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', rs.bg, rs.text)}>
                            {rs.label}
                          </span>
                          {risk.factors.length > 0 && (
                            <p className="mt-0.5 text-[8px] text-charcoal/30 max-w-[80px] truncate" title={risk.factors.join(', ')}>
                              {risk.factors.slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="flex items-center gap-1 text-xs text-charcoal/50"><Clock className="h-3 w-3" /> {patient.lastLog}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
