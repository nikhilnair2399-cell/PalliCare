'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Pill,
} from 'lucide-react';

// -- Mock data ---------------------------------------------------------------
const PATIENTS = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    age: 62,
    gender: 'M',
    diagnosis: 'Lung Ca (Stage IIIB)',
    pain: 7,
    trend: 'worsening',
    lastLog: '35 min ago',
    adherence: 86,
    alertLevel: 'critical',
    prehab: null,
  },
  {
    id: '2',
    name: 'Sunita Devi',
    age: 55,
    gender: 'F',
    diagnosis: 'Breast Ca (Stage IV)',
    pain: 4,
    trend: 'stable',
    lastLog: '2 hrs ago',
    adherence: 94,
    alertLevel: 'warning',
    prehab: { daysToSurgery: 8, readiness: 72 },
  },
  {
    id: '3',
    name: 'Arun Sharma',
    age: 70,
    gender: 'M',
    diagnosis: 'Pancreatic Ca',
    pain: 8,
    trend: 'worsening',
    lastLog: '15 min ago',
    adherence: 72,
    alertLevel: 'critical',
    prehab: null,
  },
  {
    id: '4',
    name: 'Priya Patel',
    age: 48,
    gender: 'F',
    diagnosis: 'Ovarian Ca (Stage III)',
    pain: 3,
    trend: 'improving',
    lastLog: '4 hrs ago',
    adherence: 98,
    alertLevel: 'info',
    prehab: { daysToSurgery: 14, readiness: 85 },
  },
  {
    id: '5',
    name: 'Mahesh Verma',
    age: 65,
    gender: 'M',
    diagnosis: 'Head & Neck Ca',
    pain: 6,
    trend: 'stable',
    lastLog: '1 hr ago',
    adherence: 88,
    alertLevel: 'warning',
    prehab: null,
  },
  {
    id: '6',
    name: 'Kavita Singh',
    age: 52,
    gender: 'F',
    diagnosis: 'Cervical Ca (Stage IIB)',
    pain: 2,
    trend: 'improving',
    lastLog: '6 hrs ago',
    adherence: 100,
    alertLevel: null,
    prehab: { daysToSurgery: 21, readiness: 60 },
  },
  {
    id: '7',
    name: 'Rajendra Gupta',
    age: 73,
    gender: 'M',
    diagnosis: 'Prostate Ca (mCRPC)',
    pain: 5,
    trend: 'stable',
    lastLog: '3 hrs ago',
    adherence: 91,
    alertLevel: 'info',
    prehab: null,
  },
  {
    id: '8',
    name: 'Fatima Begum',
    age: 60,
    gender: 'F',
    diagnosis: 'Colorectal Ca',
    pain: 4,
    trend: 'improving',
    lastLog: '5 hrs ago',
    adherence: 95,
    alertLevel: null,
    prehab: { daysToSurgery: 5, readiness: 88 },
  },
];

const PAIN_COLORS: Record<number, string> = {
  0: '#7BA68C',
  1: '#8FB89E',
  2: '#A8C97F',
  3: '#C4D94F',
  4: '#E8D44D',
  5: '#E8C033',
  6: '#E8A838',
  7: '#E89040',
  8: '#E87461',
  9: '#D94F4F',
  10: '#C0392B',
};

const ALERT_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  info: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
};

type SortKey = 'pain' | 'name' | 'lastLog' | 'adherence';
type FilterStatus = 'all' | 'critical' | 'prehab';

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('pain');
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = PATIENTS.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'critical') return p.alertLevel === 'critical';
    if (filter === 'prehab') return p.prehab !== null;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'pain') return b.pain - a.pain;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'adherence') return a.adherence - b.adherence;
    return 0;
  });

  const criticalCount = PATIENTS.filter((p) => p.alertLevel === 'critical').length;
  const prehabCount = PATIENTS.filter((p) => p.prehab).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-teal" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">
              Patient Management
            </h1>
            <p className="text-sm text-charcoal/60">
              {PATIENTS.length} active &middot; {criticalCount} critical &middot;{' '}
              {prehabCount} prehab
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-sage/20 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'critical', 'prehab'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-teal text-white'
                  : 'bg-white text-charcoal/70 hover:bg-sage/10'
              }`}
            >
              {f === 'all' ? `All (${PATIENTS.length})` : f === 'critical' ? `Critical (${criticalCount})` : `Prehab (${prehabCount})`}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded-lg border border-sage/20 bg-white px-3 py-2.5 text-xs text-charcoal/70"
        >
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">
                Patient
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">
                Diagnosis
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal/60">
                Pain
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal/60">
                Trend
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal/60">
                Adherence
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60">
                Last Log
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal/60">
                Prehab
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => {
              const alertStyle = patient.alertLevel
                ? ALERT_STYLES[patient.alertLevel]
                : null;
              return (
                <tr
                  key={patient.id}
                  className="cursor-pointer border-b border-sage/5 transition-colors hover:bg-cream/20"
                >
                  {/* Alert indicator */}
                  <td className="px-4 py-3.5">
                    {alertStyle ? (
                      <span className="relative flex h-3 w-3">
                        {patient.alertLevel === 'critical' && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex h-3 w-3 rounded-full ${alertStyle.dot}`}
                        />
                      </span>
                    ) : (
                      <span className="inline-flex h-3 w-3 rounded-full bg-sage/30" />
                    )}
                  </td>

                  {/* Patient name */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-charcoal">
                      {patient.name}
                    </p>
                    <p className="text-xs text-charcoal/50">
                      {patient.age}y / {patient.gender}
                    </p>
                  </td>

                  {/* Diagnosis */}
                  <td className="px-4 py-3.5 text-sm text-charcoal/70">
                    {patient.diagnosis}
                  </td>

                  {/* Pain badge */}
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
                      style={{
                        backgroundColor: PAIN_COLORS[patient.pain] || '#ccc',
                        color: patient.pain >= 6 ? '#fff' : '#2D2D2D',
                      }}
                    >
                      {patient.pain}
                    </span>
                  </td>

                  {/* Trend */}
                  <td className="px-4 py-3.5 text-center">
                    {patient.trend === 'worsening' && (
                      <ArrowUpRight className="mx-auto h-4 w-4 text-alert-critical" />
                    )}
                    {patient.trend === 'improving' && (
                      <ArrowDownRight className="mx-auto h-4 w-4 text-alert-success" />
                    )}
                    {patient.trend === 'stable' && (
                      <Minus className="mx-auto h-4 w-4 text-charcoal/40" />
                    )}
                  </td>

                  {/* Adherence */}
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`text-sm font-semibold ${
                        patient.adherence >= 90
                          ? 'text-alert-success'
                          : patient.adherence >= 70
                            ? 'text-amber'
                            : 'text-alert-critical'
                      }`}
                    >
                      {patient.adherence}%
                    </span>
                  </td>

                  {/* Last log */}
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-xs text-charcoal/50">
                      <Clock className="h-3 w-3" /> {patient.lastLog}
                    </span>
                  </td>

                  {/* Prehab */}
                  <td className="px-4 py-3.5 text-center">
                    {patient.prehab ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="rounded-full bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal">
                          T-{patient.prehab.daysToSurgery}d
                        </span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-sage/20">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${patient.prehab.readiness}%`,
                              backgroundColor:
                                patient.prehab.readiness >= 80
                                  ? '#7BA68C'
                                  : patient.prehab.readiness >= 60
                                    ? '#E8A838'
                                    : '#E87461',
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal/30">—</span>
                    )}
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
