'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Search, ArrowUpRight, ArrowDownRight,
  Minus, Clock, Loader2,
} from 'lucide-react';
import { usePatients } from '@/lib/hooks';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

const MOCK_PATIENTS = [
  { id: '1', name: 'Ramesh Kumar', age: 62, gender: 'M', diagnosis: 'Lung Ca (Stage IIIB)', pain: 7, trend: 'worsening', lastLog: '35 min ago', adherence: 86, alertLevel: 'critical' },
  { id: '2', name: 'Sunita Devi', age: 55, gender: 'F', diagnosis: 'Breast Ca (Stage IV)', pain: 4, trend: 'stable', lastLog: '2 hrs ago', adherence: 94, alertLevel: 'warning' },
  { id: '3', name: 'Arun Sharma', age: 70, gender: 'M', diagnosis: 'Pancreatic Ca', pain: 8, trend: 'worsening', lastLog: '15 min ago', adherence: 72, alertLevel: 'critical' },
  { id: '4', name: 'Priya Patel', age: 48, gender: 'F', diagnosis: 'Ovarian Ca (Stage III)', pain: 3, trend: 'improving', lastLog: '4 hrs ago', adherence: 98, alertLevel: 'info' },
  { id: '5', name: 'Mahesh Verma', age: 65, gender: 'M', diagnosis: 'Head & Neck Ca', pain: 6, trend: 'stable', lastLog: '1 hr ago', adherence: 88, alertLevel: 'warning' },
  { id: '6', name: 'Kavita Singh', age: 52, gender: 'F', diagnosis: 'Cervical Ca (Stage IIB)', pain: 2, trend: 'improving', lastLog: '6 hrs ago', adherence: 100, alertLevel: null },
  { id: '7', name: 'Rajendra Gupta', age: 73, gender: 'M', diagnosis: 'Prostate Ca (mCRPC)', pain: 5, trend: 'stable', lastLog: '3 hrs ago', adherence: 91, alertLevel: 'info' },
  { id: '8', name: 'Fatima Begum', age: 60, gender: 'F', diagnosis: 'Colorectal Ca', pain: 4, trend: 'improving', lastLog: '5 hrs ago', adherence: 95, alertLevel: null },
];

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
    pain,
    trend: p.pain_trend || 'stable',
    lastLog: p.last_log_at ? formatTimeAgo(p.last_log_at) : 'N/A',
    adherence: p.medication_adherence ?? p.adherence ?? 0,
    alertLevel: pain >= 7 ? 'critical' : pain >= 5 ? 'warning' : pain >= 3 ? 'info' : null,
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

type SortKey = 'pain' | 'name' | 'lastLog' | 'adherence';
type FilterStatus = 'all' | 'critical' | 'warning';

export default function PatientsPage() {
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
      <div className="overflow-hidden rounded-xl border border-sage/10 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sage/10 bg-cream/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">Diagnosis</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal/60">Pain</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal/60">Trend</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal/60">Adherence</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">Last Log</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => {
              const alertStyle = patient.alertLevel ? ALERT_STYLES[patient.alertLevel] : null;
              return (
                <tr key={patient.id} className="cursor-pointer border-b border-sage/5 transition-colors hover:bg-cream/20">
                  <td className="px-4 py-3.5">
                    {alertStyle ? (
                      <span className="relative flex h-3 w-3">
                        {patient.alertLevel === 'critical' && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />}
                        <span className={`relative inline-flex h-3 w-3 rounded-full ${alertStyle.dot}`} />
                      </span>
                    ) : (<span className="inline-flex h-3 w-3 rounded-full bg-sage/30" />)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/patients/${patient.id}`}>
                      <p className="text-sm font-semibold text-charcoal">{patient.name}</p>
                      <p className="text-xs text-charcoal/50">{patient.age}y / {patient.gender}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-charcoal/70">{patient.diagnosis}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
                      style={{ backgroundColor: PAIN_COLORS[patient.pain] || '#ccc', color: patient.pain >= 6 ? '#fff' : '#2D2D2D' }}>
                      {patient.pain}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {patient.trend === 'worsening' && <ArrowUpRight className="mx-auto h-4 w-4 text-alert-critical" />}
                    {patient.trend === 'improving' && <ArrowDownRight className="mx-auto h-4 w-4 text-alert-success" />}
                    {patient.trend === 'stable' && <Minus className="mx-auto h-4 w-4 text-charcoal/40" />}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-sm font-semibold ${patient.adherence >= 90 ? 'text-alert-success' : patient.adherence >= 70 ? 'text-amber' : 'text-alert-critical'}`}>
                      {patient.adherence}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
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
