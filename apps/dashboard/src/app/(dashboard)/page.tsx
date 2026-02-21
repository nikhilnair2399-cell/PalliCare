'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/StatCard';
import { PatientListPreview } from '@/components/patients/PatientListPreview';
import { AlertsPreview } from '@/components/ui/AlertsPreview';
import {
  Users, AlertTriangle, Activity, Pill, Loader2,
  ListChecks, ArrowRight, Clock, CalendarClock,
  ArrowUpRight, ArrowDownRight, Minus, Clipboard, ShieldCheck, BedDouble, Syringe, LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDepartmentSummary, useAlertCounts } from '@/lib/hooks';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

const MOCK_SUMMARY = {
  active_patients: 24,
  avg_pain: 4.2,
  medication_adherence: 87,
};

const MOCK_ALERT_COUNTS = {
  critical: 3,
  warning: 4,
  info: 3,
  total: 10,
  unacknowledged: 2,
};

// ── Quick Actions / Critical Next Steps ──────────────────────────────
const MOCK_CRITICAL_ACTIONS = [
  { id: 'a1', patient: 'Arun Sharma', action: 'Fentanyl dose review — pain 8/10 sustained', priority: 'urgent' as const, route: '/patients/3', deadline: 'Today' },
  { id: 'a2', patient: 'Ramesh Kumar', action: 'MEDD 220mg — opioid rotation review', priority: 'urgent' as const, route: '/patients/1', deadline: 'Today' },
  { id: 'a3', patient: 'Mahesh Verma', action: 'Gabapentin adherence 57% — side-effect check', priority: 'high' as const, route: '/patients/5', deadline: 'Tomorrow' },
  { id: 'a4', patient: 'Sunita Devi', action: 'PHQ-9 screening — low mood 4+ days', priority: 'high' as const, route: '/patients/2', deadline: 'Tomorrow' },
  { id: 'a5', patient: 'Priya Patel', action: 'Physiotherapy mobilization — post-op day 5', priority: 'medium' as const, route: '/patients/4', deadline: '23 Feb' },
];

const PRIORITY_STYLE = {
  urgent: { bg: 'bg-alert-critical/10', text: 'text-alert-critical', dot: 'bg-alert-critical' },
  high: { bg: 'bg-terra/10', text: 'text-terra', dot: 'bg-terra' },
  medium: { bg: 'bg-amber/10', text: 'text-amber', dot: 'bg-amber' },
};

// ── 7-Day Sparkline Data ─────────────────────────────────────────────
const MOCK_TRENDS = {
  pain: { values: [4.8, 4.6, 4.5, 4.3, 4.4, 4.2, 4.2], change: -0.6, label: 'Avg Pain' },
  alerts: { values: [12, 10, 11, 9, 10, 8, 10], change: -2, label: 'Alerts/day' },
  adherence: { values: [84, 85, 85, 86, 87, 87, 87], change: +3, label: 'Adherence %' },
  pps: { values: [56, 55, 55, 54, 54, 53, 53], change: -3, label: 'Avg PPS' },
};

// ── Shift Handover Summary ───────────────────────────────────────────
const MOCK_HANDOVER = {
  shiftStart: '09:00 IST',
  sinceLastHandover: '12 hours',
  highlights: [
    { type: 'alert' as const, text: 'Arun Sharma — pain escalated to 8/10, fentanyl patch due for increase' },
    { type: 'med_change' as const, text: 'Ramesh Kumar — morphine SR increased 60→90mg q12h' },
    { type: 'task' as const, text: 'Family meeting for Arjun Singh at 3 PM today (Chaplain confirmed)' },
    { type: 'new' as const, text: 'Kavita Singh — no symptom log for 48 hours, gentle reminder sent' },
  ],
};

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const h = 24;
  const w = 64;
  const step = w / (values.length - 1);
  const points = values.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-16" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

export default function DashboardPage() {
  const [dismissedActions, setDismissedActions] = useState<Set<string>>(new Set());
  const summaryQuery = useDepartmentSummary();
  const alertCountsQuery = useAlertCounts();

  const { data: summary, isFromApi: summaryLive } = useWithFallback(summaryQuery, MOCK_SUMMARY);
  const { data: alertCounts, isFromApi: alertsLive } = useWithFallback(alertCountsQuery, MOCK_ALERT_COUNTS);

  const s = summary as any;
  const a = alertCounts as any;

  const visibleActions = MOCK_CRITICAL_ACTIONS.filter((act) => !dismissedActions.has(act.id));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Clinician Dashboard
          </h1>
          <p className="text-sm text-charcoal-light">
            Real-time patient monitoring and clinical decision support
          </p>
        </div>
        {(!summaryLive || !alertsLive) && (
          <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
            Demo Data — API offline
          </span>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Patients"
          value={String(s.active_patients ?? s.activePatients ?? 24)}
          change={summaryLive ? 'Live from API' : '+3 this week'}
          changeType="increase"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Critical Alerts"
          value={String(a.critical ?? 3)}
          change={`${a.unacknowledged ?? a.unacked ?? 2} unacknowledged`}
          changeType="alert"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Pain Score"
          value={String(s.avg_pain ?? s.avgPain ?? s.average_pain_score ?? '4.2')}
          change={summaryLive ? 'Live from API' : '-0.8 from last week'}
          changeType="decrease"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          title="Medication Adherence"
          value={`${s.medication_adherence ?? s.medicationAdherence ?? s.avg_adherence ?? 87}%`}
          change={summaryLive ? 'Live from API' : '+2% from last week'}
          changeType="increase"
          icon={<Pill className="h-5 w-5" />}
        />
      </div>

      {/* 7-Day Trend Sparklines */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          { key: 'pain', color: '#E87461', goodDir: 'down' },
          { key: 'alerts', color: '#C67B5C', goodDir: 'down' },
          { key: 'adherence', color: '#7BA68C', goodDir: 'up' },
          { key: 'pps', color: '#5C9EAD', goodDir: 'up' },
        ] as const).map(({ key, color, goodDir }) => {
          const t = MOCK_TRENDS[key];
          const isGood = (goodDir === 'up' && t.change > 0) || (goodDir === 'down' && t.change < 0);
          return (
            <div key={key} className="rounded-xl border border-sage-light/30 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-charcoal/50 uppercase">{t.label}</span>
                <span className={cn(
                  'flex items-center gap-0.5 text-[10px] font-bold',
                  isGood ? 'text-alert-success' : t.change === 0 ? 'text-charcoal/40' : 'text-alert-critical',
                )}>
                  {t.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : t.change < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                  {Math.abs(t.change)}
                </span>
              </div>
              <div className="mt-1.5 flex items-end justify-between">
                <span className="text-lg font-bold text-charcoal">{t.values[t.values.length - 1]}{key === 'adherence' || key === 'pps' ? '%' : ''}</span>
                <MiniSparkline values={t.values} color={color} />
              </div>
              <p className="mt-0.5 text-[9px] text-charcoal/30">7-day trend</p>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule Strip */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="h-4 w-4 text-teal" />
          <h2 className="text-sm font-bold text-teal">Today&apos;s Schedule</h2>
          <span className="ml-auto text-[10px] text-charcoal/40">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[
            { time: '09:00', event: 'Ward Round', patients: 8, type: 'round' },
            { time: '11:00', event: 'MDT Meeting', patients: 3, type: 'mdt' },
            { time: '14:00', event: 'Family Meeting', patients: 1, type: 'family' },
            { time: '15:30', event: 'New Referral', patients: 1, type: 'referral' },
            { time: '16:30', event: 'Opioid Reviews', patients: 2, type: 'review' },
          ].map((slot) => {
            const now = new Date();
            const [h, m] = slot.time.split(':').map(Number);
            const isPast = now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m);
            const isCurrent = now.getHours() === h;
            return (
              <div
                key={slot.time}
                className={cn(
                  'flex-shrink-0 rounded-lg border px-3 py-2 min-w-[120px] transition-all',
                  isCurrent ? 'border-teal bg-teal/5' : isPast ? 'border-sage-light/20 bg-cream/30 opacity-60' : 'border-sage-light/30 bg-white',
                )}
              >
                <p className={cn('text-xs font-bold', isCurrent ? 'text-teal' : 'text-charcoal/50')}>{slot.time}</p>
                <p className="text-xs font-semibold text-charcoal mt-0.5">{slot.event}</p>
                <p className="text-[10px] text-charcoal/40">{slot.patients} patient{slot.patients !== 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sprint 46 — Department Bed Occupancy */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BedDouble className="h-4 w-4 text-teal" />
          <h2 className="text-sm font-bold text-teal">Bed Occupancy</h2>
          <span className="ml-auto text-[10px] text-charcoal/40">Palliative Care Unit</span>
        </div>
        {(() => {
          const beds = { total: 16, occupied: 12, reserved: 2, available: 2 };
          const occupancyPct = Math.round((beds.occupied / beds.total) * 100);
          const rows = [
            { label: 'Occupied', count: beds.occupied, color: 'bg-teal' },
            { label: 'Reserved', count: beds.reserved, color: 'bg-amber' },
            { label: 'Available', count: beds.available, color: 'bg-sage/40' },
          ];
          return (
            <>
              <div className="flex h-4 overflow-hidden rounded-full mb-3">
                {rows.map(r => (
                  <div
                    key={r.label}
                    className={r.color}
                    style={{ width: `${(r.count / beds.total) * 100}%` }}
                    title={`${r.label}: ${r.count}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {rows.map(r => (
                    <div key={r.label} className="flex items-center gap-1.5 text-xs text-charcoal/60">
                      <span className={`h-2 w-2 rounded-full ${r.color}`} />
                      {r.label}: <strong className="text-charcoal">{r.count}</strong>
                    </div>
                  ))}
                </div>
                <span className={cn(
                  'text-xs font-bold',
                  occupancyPct >= 90 ? 'text-terra' : occupancyPct >= 75 ? 'text-amber' : 'text-sage',
                )}>
                  {occupancyPct}% occupied
                </span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Sprint 42 — Clinical Quality Compliance */}
      {(() => {
        const metrics = [
          { label: 'Pain assessed <4h', compliant: 21, total: 24, threshold: 85 },
          { label: 'MEDD review current', compliant: 18, total: 22, threshold: 90 },
          { label: 'Goals-of-care documented', compliant: 20, total: 24, threshold: 80 },
          { label: 'PHQ-9 screened (7d)', compliant: 15, total: 24, threshold: 70 },
          { label: 'NDPS register updated', compliant: 22, total: 22, threshold: 95 },
        ];
        const overallPct = Math.round(metrics.reduce((s, m) => s + (m.compliant / m.total) * 100, 0) / metrics.length);
        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-teal">
                <ShieldCheck className="h-4 w-4" />
                Clinical Quality Compliance
              </h2>
              <span className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-bold',
                overallPct >= 85 ? 'bg-sage/10 text-sage-dark' : overallPct >= 70 ? 'bg-amber/10 text-amber' : 'bg-alert-critical/10 text-alert-critical',
              )}>
                {overallPct}% overall
              </span>
            </div>
            <div className="space-y-2.5">
              {metrics.map((m) => {
                const pct = Math.round((m.compliant / m.total) * 100);
                const met = pct >= m.threshold;
                return (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-charcoal/60">{m.label}</span>
                      <span className={cn('text-xs font-bold', met ? 'text-sage' : 'text-terra')}>
                        {m.compliant}/{m.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-cream">
                      <div
                        className={cn('h-full rounded-full transition-all', met ? 'bg-sage' : pct >= m.threshold - 10 ? 'bg-amber' : 'bg-terra')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-charcoal/30">Targets set per AIIMS Palliative Medicine quality standards</p>
          </div>
        );
      })()}

      {/* Sprint 57 — Opioid Census Summary */}
      {(() => {
        const OPIOID_CENSUS = [
          { patient: 'Ramesh Kumar', opioid: 'Morphine SR', medd: 220, route: 'Oral', breakthrough: 'Morphine IR 15mg' },
          { patient: 'Sunita Devi', opioid: 'Oxycodone CR', medd: 120, route: 'Oral', breakthrough: 'Oxycodone IR 10mg' },
          { patient: 'Arjun Singh', opioid: 'Fentanyl Patch', medd: 180, route: 'Transdermal', breakthrough: 'Morphine IR 20mg' },
          { patient: 'Priya Sharma', opioid: 'Morphine SR', medd: 60, route: 'Oral', breakthrough: 'Morphine IR 10mg' },
          { patient: 'Manoj Patel', opioid: 'Tapentadol SR', medd: 90, route: 'Oral', breakthrough: 'Tapentadol IR' },
          { patient: 'Kavita Gupta', opioid: 'Tramadol SR', medd: 40, route: 'Oral', breakthrough: 'Paracetamol' },
          { patient: 'Arun Sharma', opioid: 'Fentanyl Patch', medd: 300, route: 'Transdermal', breakthrough: 'Morphine IR 30mg' },
          { patient: 'Mahesh Verma', opioid: 'Morphine SR', medd: 45, route: 'Oral', breakthrough: 'Morphine IR 5mg' },
        ];
        const highMEDD = OPIOID_CENSUS.filter((p) => p.medd >= 200);
        const moderateMEDD = OPIOID_CENSUS.filter((p) => p.medd >= 90 && p.medd < 200);
        const lowMEDD = OPIOID_CENSUS.filter((p) => p.medd < 90);
        const avgMEDD = Math.round(OPIOID_CENSUS.reduce((s, p) => s + p.medd, 0) / OPIOID_CENSUS.length);
        const maxMEDD = Math.max(...OPIOID_CENSUS.map((p) => p.medd));
        const opioidTypes: Record<string, number> = {};
        OPIOID_CENSUS.forEach((p) => {
          const base = p.opioid.split(' ')[0];
          opioidTypes[base] = (opioidTypes[base] || 0) + 1;
        });
        const sortedTypes = Object.entries(opioidTypes).sort((a, b) => b[1] - a[1]);

        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-teal">
                <Syringe className="h-4 w-4" />
                Opioid Census
              </h2>
              <span className="text-[10px] text-charcoal/40">{OPIOID_CENSUS.length} patients on opioids</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-cream/50 p-3 text-center">
                <p className="text-xl font-bold text-charcoal">{avgMEDD}</p>
                <p className="text-[10px] text-charcoal/40">avg MEDD mg/d</p>
              </div>
              <div className="rounded-lg bg-cream/50 p-3 text-center">
                <p className="text-xl font-bold text-terra">{maxMEDD}</p>
                <p className="text-[10px] text-charcoal/40">highest MEDD</p>
              </div>
              <div className="rounded-lg bg-cream/50 p-3 text-center">
                <p className="text-xl font-bold text-alert-critical">{highMEDD.length}</p>
                <p className="text-[10px] text-charcoal/40">MEDD ≥200</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-charcoal/40 uppercase mb-2">MEDD Distribution</p>
                <div className="space-y-1.5">
                  {[
                    { label: '≥200 mg/d (high)', count: highMEDD.length, color: 'bg-alert-critical', textColor: 'text-alert-critical' },
                    { label: '90–199 mg/d', count: moderateMEDD.length, color: 'bg-amber', textColor: 'text-amber' },
                    { label: '<90 mg/d', count: lowMEDD.length, color: 'bg-sage', textColor: 'text-sage' },
                  ].map((tier) => (
                    <div key={tier.label} className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full flex-shrink-0', tier.color)} />
                      <span className="text-xs text-charcoal/60 flex-1">{tier.label}</span>
                      <div className="w-16 h-1.5 rounded-full bg-cream">
                        <div className={cn('h-full rounded-full', tier.color)} style={{ width: `${(tier.count / OPIOID_CENSUS.length) * 100}%` }} />
                      </div>
                      <span className={cn('text-xs font-bold w-4 text-right', tier.textColor)}>{tier.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-charcoal/40 uppercase mb-2">Opioid Types in Use</p>
                <div className="space-y-1.5">
                  {sortedTypes.map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span className="text-xs text-charcoal/60 flex-1">{type}</span>
                      <div className="w-16 h-1.5 rounded-full bg-cream">
                        <div className="h-full rounded-full bg-teal/60" style={{ width: `${(count / OPIOID_CENSUS.length) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-charcoal/50 w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {highMEDD.length > 0 && (
              <div className="mt-3 rounded-lg bg-alert-critical/5 px-3 py-2">
                <p className="text-[10px] text-alert-critical font-semibold">
                  {highMEDD.map((p) => p.patient).join(', ')} — MEDD ≥200mg, ensure naloxone availability & NDPS register updated
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Sprint 64 — Department Workload Heatmap */}
      {(() => {
        const TIME_SLOTS = ['06–09', '09–12', '12–15', '15–18', '18–21', '21–00'];
        const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const WORKLOAD: number[][] = [
          [2, 5, 4, 3, 2, 1], // Mon
          [3, 5, 3, 4, 2, 1], // Tue
          [2, 4, 5, 4, 3, 1], // Wed
          [3, 5, 4, 5, 2, 2], // Thu
          [2, 4, 3, 3, 2, 1], // Fri
          [1, 3, 2, 2, 1, 1], // Sat
          [1, 2, 2, 1, 1, 0], // Sun
        ];
        const heatColor = (v: number) =>
          v >= 5 ? 'bg-alert-critical text-white' :
          v >= 4 ? 'bg-terra text-white' :
          v >= 3 ? 'bg-amber text-white' :
          v >= 2 ? 'bg-amber/30 text-charcoal' :
          v >= 1 ? 'bg-sage/20 text-charcoal/60' :
          'bg-cream text-charcoal/20';
        const totalTasks = WORKLOAD.flat().reduce((s, v) => s + v, 0);
        const peakDay = DAYS[WORKLOAD.map((row) => row.reduce((s, v) => s + v, 0)).reduce((max, v, i, arr) => v > arr[max] ? i : max, 0)];
        const peakSlot = TIME_SLOTS[WORKLOAD[0].map((_, ci) => WORKLOAD.reduce((s, row) => s + row[ci], 0)).reduce((max, v, i, arr) => v > arr[max] ? i : max, 0)];
        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-teal">
                <LayoutGrid className="h-4 w-4" />
                Department Workload Heatmap
              </h2>
              <span className="text-[10px] text-charcoal/40">This week · {totalTasks} task-slots</span>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[420px]">
                {/* Time header */}
                <div className="flex">
                  <div className="w-10" />
                  {TIME_SLOTS.map((t) => (
                    <div key={t} className="flex-1 text-center text-[9px] font-semibold text-charcoal/40 pb-1">{t}</div>
                  ))}
                </div>
                {/* Grid rows */}
                {DAYS.map((day, di) => (
                  <div key={day} className="flex items-center gap-0.5 mb-0.5">
                    <span className="w-10 text-[10px] font-semibold text-charcoal/50">{day}</span>
                    {WORKLOAD[di].map((v, ti) => (
                      <div
                        key={ti}
                        className={cn('flex-1 h-6 rounded flex items-center justify-center text-[9px] font-bold', heatColor(v))}
                        title={`${day} ${TIME_SLOTS[ti]}: ${v} tasks`}
                      >
                        {v > 0 ? v : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[9px] text-charcoal/40">
                <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-sage/20" /> Low</span>
                <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-amber/30" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-amber" /> High</span>
                <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-terra" /> Very High</span>
                <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-alert-critical" /> Peak</span>
              </div>
              <p className="text-[10px] text-charcoal/40">
                Peak: <strong className="text-charcoal/60">{peakDay}</strong> at <strong className="text-charcoal/60">{peakSlot}</strong>
              </p>
            </div>
          </div>
        );
      })()}

      {/* Critical Next Steps */}
      {visibleActions.length > 0 && (
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-teal">
              <ListChecks className="h-4 w-4" />
              Critical Next Steps
            </h2>
            <span className="text-xs text-charcoal/40">{visibleActions.length} actions pending</span>
          </div>
          <div className="mt-3 space-y-2">
            {visibleActions.map((act) => {
              const style = PRIORITY_STYLE[act.priority];
              return (
                <div key={act.id} className="flex items-center gap-3 rounded-lg border border-sage/10 p-3 hover:bg-cream/30 transition-colors">
                  <span className={cn('h-2 w-2 rounded-full flex-shrink-0', style.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-charcoal">{act.patient}</span>
                      <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase', style.bg, style.text)}>
                        {act.priority}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-charcoal/60 truncate">{act.action}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1 text-[10px] text-charcoal/40">
                      <CalendarClock className="h-3 w-3" /> {act.deadline}
                    </span>
                    <Link href={act.route} className="flex items-center gap-1 rounded-lg bg-teal/10 px-2.5 py-1 text-[10px] font-semibold text-teal hover:bg-teal/20">
                      View <ArrowRight className="h-3 w-3" />
                    </Link>
                    <button
                      onClick={() => setDismissedActions((prev) => new Set([...prev, act.id]))}
                      className="text-[10px] text-charcoal/30 hover:text-charcoal/50"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient List — 2 cols */}
        <div className="lg:col-span-2">
          <PatientListPreview />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AlertsPreview />

          {/* Shift Handover Snapshot */}
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-teal">
                <Clipboard className="h-4 w-4" />
                Shift Snapshot
              </h3>
              <span className="text-[10px] text-charcoal/40">Since {MOCK_HANDOVER.shiftStart}</span>
            </div>
            <div className="mt-3 space-y-2">
              {MOCK_HANDOVER.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={cn(
                    'mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0',
                    h.type === 'alert' ? 'bg-alert-critical' :
                    h.type === 'med_change' ? 'bg-amber' :
                    h.type === 'task' ? 'bg-teal' :
                    'bg-sage',
                  )} />
                  <p className="text-xs text-charcoal/70 leading-relaxed">{h.text}</p>
                </div>
              ))}
            </div>
            <Link href="/mdt" className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal hover:underline">
              Open full MDT view <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
