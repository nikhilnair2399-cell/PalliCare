'use client';

import { StatCard } from '@/components/ui/StatCard';
import { PatientListPreview } from '@/components/patients/PatientListPreview';
import { AlertsPreview } from '@/components/ui/AlertsPreview';
import { Users, AlertTriangle, Activity, Pill, Loader2 } from 'lucide-react';
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

export default function DashboardPage() {
  const summaryQuery = useDepartmentSummary();
  const alertCountsQuery = useAlertCounts();

  const { data: summary, isFromApi: summaryLive } = useWithFallback(summaryQuery, MOCK_SUMMARY);
  const { data: alertCounts, isFromApi: alertsLive } = useWithFallback(alertCountsQuery, MOCK_ALERT_COUNTS);

  const s = summary as any;
  const a = alertCounts as any;

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

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient List — 2 cols */}
        <div className="lg:col-span-2">
          <PatientListPreview />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AlertsPreview />
        </div>
      </div>
    </div>
  );
}
