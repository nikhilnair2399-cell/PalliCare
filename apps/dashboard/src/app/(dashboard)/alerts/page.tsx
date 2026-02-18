'use client';

import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Zap,
} from 'lucide-react';

// -- Mock data ---------------------------------------------------------------
interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  patient: string;
  message: string;
  recommendation: string;
  time: string;
  status: 'active' | 'acknowledged' | 'resolved';
  data?: { metric: string; value: string; threshold: string };
}

const ALERTS: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    type: 'pain_sustained_high',
    patient: 'Arun Sharma',
    message: 'Pain sustained at 8-9/10 for 6 consecutive hours',
    recommendation: 'Consider breakthrough dose adjustment or route change',
    time: '12 min ago',
    status: 'active',
    data: { metric: 'NRS Pain', value: '8.5 avg', threshold: '>7 for 4+ hrs' },
  },
  {
    id: '2',
    severity: 'critical',
    type: 'medd_threshold',
    patient: 'Ramesh Kumar',
    message: 'MEDD reached 220 mg/day — exceeds 200mg safety threshold',
    recommendation: 'Review opioid regimen, consider rotation or adjuvant optimization',
    time: '45 min ago',
    status: 'active',
    data: { metric: 'MEDD', value: '220 mg', threshold: '200 mg' },
  },
  {
    id: '3',
    severity: 'warning',
    type: 'medication_non_adherence',
    patient: 'Mahesh Verma',
    message: 'Gabapentin adherence dropped to 57% this week (4/7 doses missed)',
    recommendation: 'Check for side effects; consider caregiver-assisted dosing',
    time: '1 hr ago',
    status: 'active',
    data: { metric: 'Adherence', value: '57%', threshold: '<70%' },
  },
  {
    id: '4',
    severity: 'warning',
    type: 'mood_distress_sustained',
    patient: 'Sunita Devi',
    message: 'Mood reported as "Low" or "Distressed" for 4 consecutive days',
    recommendation: 'Screen for depression (PHQ-9); consider psychosocial referral',
    time: '2 hrs ago',
    status: 'acknowledged',
    data: { metric: 'Mood', value: 'Low 4 days', threshold: '3+ days' },
  },
  {
    id: '5',
    severity: 'warning',
    type: 'breakthrough_frequency_high',
    patient: 'Ramesh Kumar',
    message: '5 breakthrough doses in 24 hours (avg was 2/day)',
    recommendation: 'Review background opioid adequacy',
    time: '3 hrs ago',
    status: 'active',
    data: { metric: 'PRN doses', value: '5/day', threshold: '>3/day' },
  },
  {
    id: '6',
    severity: 'info',
    type: 'functional_decline',
    patient: 'Priya Patel',
    message: 'Sit-to-stand count decreased from 10 to 6 over 2 weeks',
    recommendation: 'Review exercise plan; assess for prehab pathway adjustment',
    time: '4 hrs ago',
    status: 'active',
    data: { metric: 'Sit-to-stand', value: '6 reps', threshold: '<8 or >20% drop' },
  },
  {
    id: '7',
    severity: 'info',
    type: 'no_data_48h',
    patient: 'Kavita Singh',
    message: 'No symptom log for 48 hours',
    recommendation: 'Send gentle reminder; check if caregiver can assist',
    time: '6 hrs ago',
    status: 'active',
    data: { metric: 'Last log', value: '48 hrs ago', threshold: '>24 hrs' },
  },
  {
    id: '8',
    severity: 'info',
    type: 'sleep_disrupted',
    patient: 'Rajendra Gupta',
    message: 'Poor sleep reported 5 of last 7 nights; avg 3.8 hrs',
    recommendation: 'Review pain at night; consider sleep hygiene education',
    time: '8 hrs ago',
    status: 'resolved',
    data: { metric: 'Sleep', value: '3.8 hrs avg', threshold: '<5 hrs' },
  },
];

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-red-50',
    border: 'border-l-red-500',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    label: 'Critical',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-50',
    border: 'border-l-amber-400',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
    label: 'Warning',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-l-blue-400',
    dot: 'bg-blue-400',
    badge: 'bg-blue-100 text-blue-600',
    label: 'Info',
  },
};

type FilterSeverity = 'all' | 'critical' | 'warning' | 'info';

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterSeverity>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState(ALERTS);

  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length,
    warning: alerts.filter((a) => a.severity === 'warning' && a.status === 'active').length,
    info: alerts.filter((a) => a.severity === 'info' && a.status === 'active').length,
    total: alerts.filter((a) => a.status === 'active').length,
  };

  const filtered = alerts
    .filter((a) => filter === 'all' || a.severity === filter)
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      const statusOrder = { active: 0, acknowledged: 1, resolved: 2 };
      const sev = order[a.severity] - order[b.severity];
      if (sev !== 0) return sev;
      return statusOrder[a.status] - statusOrder[b.status];
    });

  function acknowledge(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' as const } : a))
    );
  }

  function resolve(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-alert-critical" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Clinical Alerts
          </h1>
          <p className="text-sm text-charcoal/60">
            {counts.total} active &middot; {counts.critical} critical &middot;{' '}
            {counts.warning} warning &middot; {counts.info} info
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { key: 'all' as const, label: 'All Active', count: counts.total, color: 'bg-teal', text: 'text-teal' },
          { key: 'critical' as const, label: 'Critical', count: counts.critical, color: 'bg-red-500', text: 'text-red-600' },
          { key: 'warning' as const, label: 'Warning', count: counts.warning, color: 'bg-amber-400', text: 'text-amber-600' },
          { key: 'info' as const, label: 'Info', count: counts.info, color: 'bg-blue-400', text: 'text-blue-600' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`rounded-xl border p-4 text-left transition-all ${
              filter === item.key
                ? 'border-teal bg-white shadow-md'
                : 'border-sage/10 bg-white/50 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="text-xs font-medium text-charcoal/60">
                {item.label}
              </span>
            </div>
            <p className={`mt-1 text-2xl font-bold ${item.text}`}>
              {item.count}
            </p>
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const SeverityIcon = config.icon;
          const isExpanded = expandedId === alert.id;
          const isActive = alert.status === 'active';

          return (
            <div
              key={alert.id}
              className={`overflow-hidden rounded-xl border-l-4 ${config.border} ${
                alert.status === 'resolved' ? 'opacity-50' : ''
              } bg-white shadow-sm transition-all`}
            >
              {/* Main row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                className="flex w-full items-start gap-4 p-4 text-left"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <SeverityIcon className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${config.badge}`}>
                      {config.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-charcoal/50">
                      <User className="h-3 w-3" /> {alert.patient}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-charcoal/40">
                      <Clock className="h-3 w-3" /> {alert.time}
                    </span>
                    {alert.status !== 'active' && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        alert.status === 'acknowledged'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-green-50 text-green-600'
                      }`}>
                        {alert.status === 'acknowledged' ? 'Ack' : 'Resolved'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-charcoal">
                    {alert.message}
                  </p>
                </div>

                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0 text-charcoal/30" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-charcoal/30" />
                )}
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-sage/10 bg-cream/20 px-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Data */}
                    {alert.data && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-charcoal/60 uppercase">
                          Trigger Data
                        </p>
                        <div className="rounded-lg bg-white p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-charcoal/60">{alert.data.metric}</span>
                            <span className="font-bold text-charcoal">{alert.data.value}</span>
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-charcoal/40">
                            <span>Threshold</span>
                            <span>{alert.data.threshold}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-charcoal/60 uppercase">
                        Recommended Action
                      </p>
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-sm text-charcoal/80">
                          {alert.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isActive && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => acknowledge(alert.id)}
                        className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90"
                      >
                        <Check className="h-4 w-4" /> Acknowledge
                      </button>
                      <button
                        onClick={() => resolve(alert.id)}
                        className="flex items-center gap-2 rounded-lg border border-sage/30 px-4 py-2 text-sm font-semibold text-charcoal/70 hover:bg-sage/5"
                      >
                        Resolve
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
