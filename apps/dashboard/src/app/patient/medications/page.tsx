'use client';

import { useState } from 'react';
import { Pill, Check, X, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePatientMedications, useLogMedicationAdherence } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_MEDICATIONS_TODAY } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

const categoryColors: Record<string, string> = {
  opioid: 'bg-terra/10 text-terra',
  adjuvant: 'bg-lavender text-charcoal',
  supportive: 'bg-sage/10 text-sage-dark',
};

const timeGroups = [
  { key: 'Morning', times: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'] },
  { key: 'Afternoon', times: ['12:00', '13:00', '14:00', '15:00', '16:00'] },
  { key: 'Evening', times: ['17:00', '18:00', '19:00'] },
  { key: 'Night', times: ['20:00', '21:00', '22:00', '23:00'] },
];

export default function MedicationsPage() {
  const medsQuery = usePatientMedications();
  const logAdherence = useLogMedicationAdherence();
  const { data: rawMeds } = useWithFallback(medsQuery, MOCK_MEDICATIONS_TODAY);
  const meds: any[] = Array.isArray(rawMeds) ? rawMeds : MOCK_MEDICATIONS_TODAY;

  // Track local status overrides (for optimistic UI)
  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});

  // Calculate adherence
  const allDoses = meds.flatMap((m: any) => m.schedule || []);
  const takenCount = allDoses.filter(
    (d: any) => localStatus[`${d.time}-${d.label}`] === 'taken' || (!localStatus[`${d.time}-${d.label}`] && d.status === 'taken'),
  ).length;
  const totalDoses = allDoses.length || 1;
  const adherencePercent = Math.round((takenCount / totalDoses) * 100);

  function handleMarkStatus(medId: string, time: string, label: string, status: 'taken' | 'skipped') {
    setLocalStatus((prev) => ({ ...prev, [`${time}-${label}`]: status }));
    logAdherence.mutate({
      medicationId: medId,
      status,
      timeTaken: status === 'taken' ? new Date().toISOString() : undefined,
    });
  }

  // Group medications by time of day
  function getTimeGroup(time: string): string {
    const hour = parseInt(time.split(':')[0], 10);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 20) return 'Evening';
    return 'Night';
  }

  const groupedDoses: Record<string, any[]> = {};
  meds.forEach((med: any) => {
    if (med.is_prn) return;
    (med.schedule || []).forEach((s: any) => {
      const group = s.label || getTimeGroup(s.time);
      if (!groupedDoses[group]) groupedDoses[group] = [];
      groupedDoses[group].push({
        ...s,
        medId: med.id,
        medName: med.name,
        dose: med.dose,
        category: med.category,
        effectiveStatus: localStatus[`${s.time}-${s.label}`] || s.status,
      });
    });
  });

  const prnMeds = meds.filter((m: any) => m.is_prn);
  const orderedGroups = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">
          Medications
        </h1>
        <p className="text-sm text-charcoal-light">
          Today&apos;s medication schedule and adherence
        </p>
      </div>

      {/* Adherence Card */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal-light">Today&apos;s Adherence</p>
            <p className="mt-1 font-heading text-3xl font-bold text-sage-dark">
              {adherencePercent}%
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/10">
            <Pill className="h-7 w-7 text-sage" />
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-sage-light/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage to-teal transition-all"
            style={{ width: `${adherencePercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-charcoal-light">
          {takenCount} of {totalDoses} doses taken
        </p>
      </div>

      {/* Scheduled Medications by Time Group */}
      {orderedGroups.map((group) => {
        const doses = groupedDoses[group];
        if (!doses || doses.length === 0) return null;

        return (
          <div key={group}>
            <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-charcoal">
              <Clock className="h-4 w-4 text-charcoal-light" />
              {group}
            </h2>
            <div className="space-y-3">
              {doses.map((dose: any, i: number) => (
                <div
                  key={`${dose.medId}-${dose.time}-${i}`}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all',
                    dose.effectiveStatus === 'taken'
                      ? 'border-sage/30 bg-sage/5'
                      : dose.effectiveStatus === 'skipped'
                        ? 'border-terra/20 bg-terra/5'
                        : 'border-sage-light/20',
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-charcoal">
                        {dose.medName}
                      </span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', categoryColors[dose.category] || categoryColors.supportive)}>
                        {dose.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-charcoal-light">
                      {dose.dose} &middot; {dose.time}
                    </p>
                  </div>

                  {dose.effectiveStatus === 'taken' ? (
                    <div className="flex items-center gap-1 rounded-full bg-sage/10 px-3 py-1.5 text-xs font-semibold text-sage">
                      <Check className="h-3.5 w-3.5" />
                      Taken
                    </div>
                  ) : dose.effectiveStatus === 'skipped' ? (
                    <div className="flex items-center gap-1 rounded-full bg-terra/10 px-3 py-1.5 text-xs font-semibold text-terra">
                      <X className="h-3.5 w-3.5" />
                      Skipped
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkStatus(dose.medId, dose.time, dose.label, 'taken')}
                        className="flex items-center gap-1 rounded-full bg-sage/10 px-3 py-1.5 text-xs font-semibold text-sage hover:bg-sage/20"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Taken
                      </button>
                      <button
                        onClick={() => handleMarkStatus(dose.medId, dose.time, dose.label, 'skipped')}
                        className="flex items-center gap-1 rounded-full bg-terra/10 px-3 py-1.5 text-xs font-semibold text-terra hover:bg-terra/20"
                      >
                        <X className="h-3.5 w-3.5" />
                        Skip
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* PRN Medications */}
      {prnMeds.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <AlertCircle className="h-4 w-4 text-lavender" />
            As Needed (PRN)
          </h2>
          <div className="space-y-3">
            {prnMeds.map((med: any) => (
              <div
                key={med.id}
                className="flex items-center gap-4 rounded-xl border border-lavender/30 bg-white p-4 shadow-sm"
              >
                <div className="flex-1">
                  <span className="text-sm font-semibold text-charcoal">
                    {med.name}
                  </span>
                  <p className="mt-0.5 text-xs text-charcoal-light">
                    {med.dose} &middot; Take as needed
                  </p>
                  {med.last_taken && (
                    <p className="mt-1 text-[11px] text-charcoal/40">
                      Last taken:{' '}
                      {new Date(med.last_taken).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    handleMarkStatus(med.id, 'prn', 'prn', 'taken')
                  }
                  className="rounded-xl bg-lavender/30 px-4 py-2 text-xs font-semibold text-charcoal hover:bg-lavender/50"
                >
                  Log Dose
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
