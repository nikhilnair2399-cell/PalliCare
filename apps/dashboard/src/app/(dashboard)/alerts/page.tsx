'use client';

import { useState } from 'react';
import {
  Bell, AlertTriangle, AlertCircle, Info, Check, Clock,
  ChevronDown, ChevronUp, User, Loader2, BellOff,
  CheckCheck, ArrowUpRight, History, TrendingUp, TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlerts, useAcknowledgeAlert, useResolveAlert } from '@/lib/hooks';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AlertTimeline {
  time: string;
  event: string;
  actor?: string;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  patient: string;
  message: string;
  recommendation: string;
  time: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'snoozed';
  data?: { metric: string; value: string; threshold: string };
  escalation?: { level: number; nextIn: string; notified: string[] };
  timeline?: AlertTimeline[];
}

const MOCK_ALERTS: Alert[] = [
  {
    id: '1', severity: 'critical', type: 'pain_sustained_high', patient: 'Arun Sharma',
    message: 'Pain sustained at 8-9/10 for 6 consecutive hours',
    recommendation: 'Consider breakthrough dose adjustment or route change',
    time: '12 min ago', status: 'active',
    data: { metric: 'NRS Pain', value: '8.5 avg', threshold: '>7 for 4+ hrs' },
    escalation: { level: 2, nextIn: '18 min', notified: ['Dr. Nikhil N.', 'Sr. Meena R.'] },
    timeline: [
      { time: '6 hrs ago', event: 'Pain NRS reported 8/10 — monitoring started' },
      { time: '4 hrs ago', event: 'Pain NRS 9/10 — sustained high threshold breached' },
      { time: '2 hrs ago', event: 'Level 1 escalation — Dr. Nikhil N. notified', actor: 'System' },
      { time: '12 min ago', event: 'Level 2 escalation — Sr. Meena R. notified', actor: 'System' },
    ],
  },
  {
    id: '2', severity: 'critical', type: 'medd_threshold', patient: 'Ramesh Kumar',
    message: 'MEDD reached 220 mg/day — exceeds 200mg safety threshold',
    recommendation: 'Review opioid regimen, consider rotation or adjuvant optimization',
    time: '45 min ago', status: 'active',
    data: { metric: 'MEDD', value: '220 mg', threshold: '200 mg' },
    escalation: { level: 1, nextIn: '15 min', notified: ['Dr. Nikhil N.'] },
    timeline: [
      { time: '3 hrs ago', event: 'MEDD calculated at 180 mg/day after dose increase' },
      { time: '45 min ago', event: 'MEDD recalculated at 220 mg/day — threshold breached', actor: 'System' },
      { time: '45 min ago', event: 'Level 1 escalation — Dr. Nikhil N. notified', actor: 'System' },
    ],
  },
  {
    id: '3', severity: 'warning', type: 'medication_non_adherence', patient: 'Mahesh Verma',
    message: 'Gabapentin adherence dropped to 57% this week (4/7 doses missed)',
    recommendation: 'Check for side effects; consider caregiver-assisted dosing',
    time: '1 hr ago', status: 'active',
    data: { metric: 'Adherence', value: '57%', threshold: '<70%' },
    timeline: [
      { time: '3 days ago', event: 'Adherence dropped to 71% — approaching threshold' },
      { time: '1 hr ago', event: 'Weekly adherence calculated at 57% — alert triggered', actor: 'System' },
    ],
  },
  {
    id: '4', severity: 'warning', type: 'mood_distress_sustained', patient: 'Sunita Devi',
    message: 'Mood reported as "Low" or "Distressed" for 4 consecutive days',
    recommendation: 'Screen for depression (PHQ-9); consider psychosocial referral',
    time: '2 hrs ago', status: 'acknowledged',
    data: { metric: 'Mood', value: 'Low 4 days', threshold: '3+ days' },
    timeline: [
      { time: '4 days ago', event: 'Mood log: "Low" — day 1' },
      { time: '3 days ago', event: 'Mood log: "Distressed" — day 2' },
      { time: '2 days ago', event: 'Mood log: "Low" — day 3, threshold breached' },
      { time: '2 hrs ago', event: 'Day 4 sustained — alert generated', actor: 'System' },
      { time: '1 hr ago', event: 'Acknowledged by Dr. Nikhil N.', actor: 'Dr. Nikhil N.' },
    ],
  },
  {
    id: '5', severity: 'warning', type: 'breakthrough_frequency_high', patient: 'Ramesh Kumar',
    message: '5 breakthrough doses in 24 hours (avg was 2/day)',
    recommendation: 'Review background opioid adequacy',
    time: '3 hrs ago', status: 'active',
    data: { metric: 'PRN doses', value: '5/day', threshold: '>3/day' },
    timeline: [
      { time: '3 hrs ago', event: '5th breakthrough dose recorded in 24h — alert triggered', actor: 'System' },
    ],
  },
  {
    id: '6', severity: 'info', type: 'functional_decline', patient: 'Priya Patel',
    message: 'Sit-to-stand count decreased from 10 to 6 over 2 weeks',
    recommendation: 'Review functional status; consider physiotherapy referral',
    time: '4 hrs ago', status: 'active',
    data: { metric: 'Sit-to-stand', value: '6 reps', threshold: '<8 or >20% drop' },
  },
  {
    id: '7', severity: 'info', type: 'no_data_48h', patient: 'Kavita Singh',
    message: 'No symptom log for 48 hours',
    recommendation: 'Send gentle reminder; check if caregiver can assist',
    time: '6 hrs ago', status: 'active',
    data: { metric: 'Last log', value: '48 hrs ago', threshold: '>24 hrs' },
  },
  {
    id: '8', severity: 'info', type: 'sleep_disrupted', patient: 'Rajendra Gupta',
    message: 'Poor sleep reported 5 of last 7 nights; avg 3.8 hrs',
    recommendation: 'Review pain at night; consider sleep hygiene education',
    time: '8 hrs ago', status: 'resolved',
    data: { metric: 'Sleep', value: '3.8 hrs avg', threshold: '<5 hrs' },
    timeline: [
      { time: '8 hrs ago', event: 'Alert triggered — sleep below threshold', actor: 'System' },
      { time: '6 hrs ago', event: 'Resolved by Dr. Nikhil N. — sleep hygiene plan started', actor: 'Dr. Nikhil N.' },
    ],
  },
];

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function mapApiAlert(a: any): Alert {
  return {
    id: a.id,
    severity: a.severity || 'info',
    type: a.alert_type || a.type || 'unknown',
    patient: a.patient_name || a.patient || 'Unknown',
    message: a.message || a.description || '',
    recommendation: a.recommendation || a.suggested_action || '',
    time: a.created_at ? formatTimeAgo(a.created_at) : '',
    status: a.status || 'active',
    data: a.trigger_data || a.data || undefined,
  };
}

const SEVERITY_CONFIG = {
  critical: { icon: AlertTriangle, bg: 'bg-red-50', border: 'border-l-red-500', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700', label: 'Critical' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-l-amber-400', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Warning' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-l-blue-400', dot: 'bg-blue-400', badge: 'bg-blue-100 text-blue-600', label: 'Info' },
};

type FilterSeverity = 'all' | 'critical' | 'warning' | 'info';

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterSeverity>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localOverrides, setLocalOverrides] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showTimeline, setShowTimeline] = useState<string | null>(null);

  const alertsQuery = useAlerts();
  const { data: rawData, isLoading, isFromApi } = useWithFallback(alertsQuery, MOCK_ALERTS);
  const acknowledgeMutation = useAcknowledgeAlert();
  const resolveMutation = useResolveAlert();

  const alerts: Alert[] = isFromApi
    ? (Array.isArray(rawData) ? rawData : (rawData as any)?.data || []).map(mapApiAlert)
    : (rawData as Alert[]);

  // Apply local status overrides for optimistic UI when API is offline
  const alertsWithOverrides = alerts.map((a) => ({
    ...a,
    status: (localOverrides[a.id] || a.status) as Alert['status'],
  }));

  const counts = {
    critical: alertsWithOverrides.filter((a) => a.severity === 'critical' && a.status === 'active').length,
    warning: alertsWithOverrides.filter((a) => a.severity === 'warning' && a.status === 'active').length,
    info: alertsWithOverrides.filter((a) => a.severity === 'info' && a.status === 'active').length,
    total: alertsWithOverrides.filter((a) => a.status === 'active').length,
  };

  const filtered = alertsWithOverrides
    .filter((a) => filter === 'all' || a.severity === filter)
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      const statusOrder: Record<string, number> = { active: 0, acknowledged: 1, snoozed: 1.5, resolved: 2 };
      const sev = order[a.severity] - order[b.severity];
      if (sev !== 0) return sev;
      return statusOrder[a.status] - statusOrder[b.status];
    });

  function acknowledge(id: string) {
    setLocalOverrides((prev) => ({ ...prev, [id]: 'acknowledged' }));
    if (isFromApi) acknowledgeMutation.mutate(id);
  }

  function resolve(id: string) {
    setLocalOverrides((prev) => ({ ...prev, [id]: 'resolved' }));
    if (isFromApi) resolveMutation.mutate({ id });
  }

  function snooze(id: string) {
    setLocalOverrides((prev) => ({ ...prev, [id]: 'snoozed' }));
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectAll() {
    const activeIds = filtered.filter((a) => a.status === 'active').map((a) => a.id);
    setSelectedIds(new Set(activeIds));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function batchAcknowledge() {
    selectedIds.forEach((id) => acknowledge(id));
    clearSelection();
  }

  function batchResolve() {
    selectedIds.forEach((id) => resolve(id));
    clearSelection();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-alert-critical" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">Clinical Alerts</h1>
          <p className="text-sm text-charcoal/60">
            {counts.total} active &middot; {counts.critical} critical &middot; {counts.warning} warning &middot; {counts.info} info
          </p>
        </div>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-teal" />}
        {!isFromApi && !isLoading && (
          <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">Demo</span>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { key: 'all' as const, label: 'All Active', count: counts.total, color: 'bg-teal', text: 'text-teal' },
          { key: 'critical' as const, label: 'Critical', count: counts.critical, color: 'bg-red-500', text: 'text-red-600' },
          { key: 'warning' as const, label: 'Warning', count: counts.warning, color: 'bg-amber-400', text: 'text-amber-600' },
          { key: 'info' as const, label: 'Info', count: counts.info, color: 'bg-blue-400', text: 'text-blue-600' },
        ].map((item) => (
          <button key={item.key} onClick={() => setFilter(item.key)}
            className={`rounded-xl border p-4 text-left transition-all ${filter === item.key ? 'border-teal bg-white shadow-md' : 'border-sage/10 bg-white/50 hover:bg-white'}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="text-xs font-medium text-charcoal/60">{item.label}</span>
            </div>
            <p className={`mt-1 text-2xl font-bold ${item.text}`}>{item.count}</p>
          </button>
        ))}
      </div>

      {/* Daily Digest */}
      {(() => {
        const resolved = alertsWithOverrides.filter(a => a.status === 'resolved').length;
        const acknowledged = alertsWithOverrides.filter(a => a.status === 'acknowledged').length;
        const total = alertsWithOverrides.length;
        const resolutionRate = total > 0 ? Math.round(((resolved + acknowledged) / total) * 100) : 0;
        const avgResponseTime = counts.critical > 0 ? '12 min' : '—';
        return (
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-teal/5 border border-teal/10 p-4">
            <div className="text-center">
              <p className="text-xs text-charcoal/50">Resolution Rate</p>
              <p className="text-xl font-bold text-teal">{resolutionRate}%</p>
              <p className="text-[10px] text-charcoal/40">{resolved + acknowledged}/{total} addressed</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-charcoal/50">Avg Response</p>
              <p className="text-xl font-bold text-charcoal">{avgResponseTime}</p>
              <p className="text-[10px] text-charcoal/40">for critical alerts</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-charcoal/50">Needs Attention</p>
              <p className={cn('text-xl font-bold', counts.critical > 0 ? 'text-red-600' : 'text-alert-success')}>
                {counts.critical + counts.warning}
              </p>
              <p className="text-[10px] text-charcoal/40">
                {counts.critical > 0 ? (
                  <span className="flex items-center justify-center gap-0.5 text-red-500"><TrendingUp className="h-3 w-3" /> critical alerts active</span>
                ) : (
                  <span className="flex items-center justify-center gap-0.5 text-alert-success"><TrendingDown className="h-3 w-3" /> all under control</span>
                )}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Batch Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-teal/30 bg-teal/5 px-4 py-3">
          <span className="text-sm font-semibold text-teal">{selectedIds.size} selected</span>
          <button onClick={batchAcknowledge} className="flex items-center gap-1.5 rounded-lg bg-teal px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal/90">
            <CheckCheck className="h-3.5 w-3.5" /> Acknowledge All
          </button>
          <button onClick={batchResolve} className="flex items-center gap-1.5 rounded-lg border border-sage/30 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:bg-sage/5">
            Resolve All
          </button>
          <button onClick={clearSelection} className="ml-auto text-xs text-charcoal/40 hover:text-charcoal/60">
            Clear
          </button>
        </div>
      )}

      {/* Select All / Clear helpers */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={selectAll} className="text-xs text-teal hover:underline">Select all active</button>
          {selectedIds.size > 0 && (
            <button onClick={clearSelection} className="text-xs text-charcoal/40 hover:underline">Deselect all</button>
          )}
        </div>
        <span className="text-xs text-charcoal/40">{filtered.length} alerts shown</span>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const SeverityIcon = config.icon;
          const isExpanded = expandedId === alert.id;
          const isActive = alert.status === 'active';
          const isSelected = selectedIds.has(alert.id);

          return (
            <div key={alert.id}
              className={cn(
                'overflow-hidden rounded-xl border-l-4 bg-white shadow-sm transition-all',
                config.border,
                alert.status === 'resolved' && 'opacity-50',
                alert.status === 'snoozed' && 'opacity-60',
                isSelected && 'ring-2 ring-teal/40',
              )}>
              <div className="flex w-full items-start gap-3 p-4">
                {/* Checkbox */}
                {isActive && (
                  <button onClick={() => toggleSelect(alert.id)} className="mt-1 flex-shrink-0">
                    <div className={cn(
                      'h-4 w-4 rounded border-2 transition-colors',
                      isSelected ? 'border-teal bg-teal' : 'border-charcoal/20 hover:border-teal',
                    )}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                )}

                <button onClick={() => setExpandedId(isExpanded ? null : alert.id)} className="flex flex-1 items-start gap-3 text-left">
                  <div className="mt-0.5 flex-shrink-0">
                    <SeverityIcon className={`h-5 w-5 ${alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${config.badge}`}>{config.label}</span>
                      <span className="flex items-center gap-1 text-xs text-charcoal/50"><User className="h-3 w-3" /> {alert.patient}</span>
                      <span className="flex items-center gap-1 text-xs text-charcoal/40"><Clock className="h-3 w-3" /> {alert.time}</span>
                      {alert.status !== 'active' && (
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          alert.status === 'acknowledged' ? 'bg-amber-50 text-amber-600' :
                          alert.status === 'snoozed' ? 'bg-charcoal/10 text-charcoal/50' :
                          'bg-green-50 text-green-600',
                        )}>
                          {alert.status === 'acknowledged' ? 'Ack' : alert.status === 'snoozed' ? 'Snoozed' : 'Resolved'}
                        </span>
                      )}
                      {alert.escalation && isActive && (
                        <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          <ArrowUpRight className="h-2.5 w-2.5" />
                          Level {alert.escalation.level}
                          {alert.escalation.nextIn && <span> &middot; next in {alert.escalation.nextIn}</span>}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-charcoal">{alert.message}</p>
                    {alert.escalation && isActive && (
                      <p className="mt-0.5 text-[10px] text-charcoal/40">
                        Notified: {alert.escalation.notified.join(', ')}
                      </p>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-charcoal/30" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-charcoal/30" />}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-sage/10 bg-cream/20 px-4 py-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {alert.data && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-charcoal/60 uppercase">Trigger Data</p>
                        <div className="rounded-lg bg-white p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-charcoal/60">{alert.data.metric}</span>
                            <span className="font-bold text-charcoal">{alert.data.value}</span>
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-charcoal/40">
                            <span>Threshold</span><span>{alert.data.threshold}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-charcoal/60 uppercase">Recommended Action</p>
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-sm text-charcoal/80">{alert.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {alert.timeline && alert.timeline.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowTimeline(showTimeline === alert.id ? null : alert.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline"
                      >
                        <History className="h-3.5 w-3.5" />
                        {showTimeline === alert.id ? 'Hide Timeline' : `Show Timeline (${alert.timeline.length} events)`}
                      </button>
                      {showTimeline === alert.id && (
                        <div className="mt-2 space-y-0 border-l-2 border-sage/20 ml-1.5 pl-4">
                          {alert.timeline.map((event, i) => (
                            <div key={i} className="relative pb-3 last:pb-0">
                              <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-sage/40 border-2 border-white" />
                              <div className="flex items-start gap-2">
                                <span className="text-[10px] text-charcoal/40 min-w-[70px] flex-shrink-0">{event.time}</span>
                                <p className="text-xs text-charcoal/70">{event.event}</p>
                                {event.actor && (
                                  <span className="flex-shrink-0 rounded-full bg-sage/10 px-1.5 py-0.5 text-[9px] text-charcoal/50">{event.actor}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {isActive && (
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={() => acknowledge(alert.id)}
                        className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90">
                        <Check className="h-4 w-4" /> Acknowledge
                      </button>
                      <button onClick={() => resolve(alert.id)}
                        className="flex items-center gap-2 rounded-lg border border-sage/30 px-4 py-2 text-sm font-semibold text-charcoal/70 hover:bg-sage/5">
                        Resolve
                      </button>
                      <button onClick={() => snooze(alert.id)}
                        className="flex items-center gap-2 rounded-lg border border-charcoal/10 px-4 py-2 text-sm font-semibold text-charcoal/50 hover:bg-charcoal/5">
                        <BellOff className="h-4 w-4" /> Snooze 1hr
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
