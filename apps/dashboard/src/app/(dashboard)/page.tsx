'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/StatCard';
import { PatientListPreview } from '@/components/patients/PatientListPreview';
import { AlertsPreview } from '@/components/ui/AlertsPreview';
import {
  Users, AlertTriangle, Activity, Pill, Loader2,
  ListChecks, ArrowRight, Clock, CalendarClock,
  ArrowUpRight, ArrowDownRight, Minus, Clipboard,
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
