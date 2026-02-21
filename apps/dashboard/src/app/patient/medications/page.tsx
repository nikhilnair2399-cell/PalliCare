'use client';

import { useState } from 'react';
import { Pill, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { usePatientMedications, useLogMedicationAdherence } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_MEDICATIONS } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

const TIME_GROUPS = [
  { key: 'morning', label: 'Morning', range: '6:00 AM – 12:00 PM' },
  { key: 'afternoon', label: 'Afternoon', range: '12:00 PM – 5:00 PM' },
  { key: 'evening', label: 'Evening', range: '5:00 PM – 9:00 PM' },
  { key: 'night', label: 'Night', range: '9:00 PM – 6:00 AM' },
];

export default function MedicationsPage() {
  const [showPrnModal, setShowPrnModal] = useState(false);
  const medsQuery = usePatientMedications();
  const logAdherence = useLogMedicationAdherence();
  const { data: rawMeds } = useWithFallback(medsQuery, MOCK_MEDICATIONS);
  const meds: any[] = Array.isArray(rawMeds) ? rawMeds : MOCK_MEDICATIONS;

  const allDoses = meds.flatMap((m: any) =>
    (m.schedule || []).map((s: any) => ({ ...s, medName: m.name, medDose: m.dose, medId: m.id })),
  );
  const taken = allDoses.filter((d: any) => d.status === 'taken').length;
  const total = allDoses.length;
  const adherence = total > 0 ? Math.round((taken / total) * 100) : 0;
  const prnMeds = meds.filter((m: any) => m.is_prn);

  function handleMarkTaken(medId: string, time: string) {
    logAdherence.mutate({ medicationId: medId, status: 'taken', timeTaken: time });
  }

  function handleMarkSkipped(medId: string, time: string) {
    logAdherence.mutate({ medicationId: medId, status: 'skipped', timeTaken: time });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Medications</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Track your daily medication schedule
        </p>
      </div>

      {/* Adherence Banner */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal-light">Today&apos;s Adherence</p>
            <p className="mt-1 font-heading text-4xl font-bold text-charcoal">{adherence}%</p>
            <p className="mt-1 text-sm text-charcoal-light">{taken} of {total} doses taken</p>
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${adherence >= 80 ? 'bg-sage/15' : 'bg-amber/15'}`}>
            {adherence >= 80 ? (
              <CheckCircle2 className="h-7 w-7 text-sage-dark" />
            ) : (
              <Clock className="h-7 w-7 text-amber" />
            )}
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-teal transition-all"
            style={{ width: `${adherence}%` }}
          />
        </div>
      </div>

      {/* Medication Schedule by Time */}
      {TIME_GROUPS.map((group) => {
        const groupDoses = allDoses.filter((d: any) => {
          const hour = parseInt(d.time?.split(':')[0] || '0');
          if (group.key === 'morning') return hour >= 6 && hour < 12;
          if (group.key === 'afternoon') return hour >= 12 && hour < 17;
          if (group.key === 'evening') return hour >= 17 && hour < 21;
          return hour >= 21 || hour < 6;
        });

        if (groupDoses.length === 0) return null;

        return (
          <div key={group.key} className="rounded-2xl bg-white p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-charcoal">{group.label}</h3>
              <p className="text-sm text-charcoal-light">{group.range}</p>
            </div>
            <div className="space-y-3">
              {groupDoses.map((dose: any, i: number) => (
                <div key={i} className="flex items-center gap-4 rounded-xl bg-cream/50 p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    dose.status === 'taken' ? 'bg-sage/15' : dose.status === 'skipped' ? 'bg-terra/15' : 'bg-amber/15'
                  }`}>
                    <Pill className={`h-5 w-5 ${
                      dose.status === 'taken' ? 'text-sage-dark' : dose.status === 'skipped' ? 'text-terra' : 'text-amber'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-charcoal">{dose.medName}</p>
                    <p className="text-sm text-charcoal-light">{dose.medDose} &middot; {dose.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {dose.status === 'taken' ? (
                      <span className="rounded-full bg-sage/10 px-3 py-1 text-sm font-medium text-sage-dark">
                        Taken
                      </span>
                    ) : dose.status === 'skipped' ? (
                      <span className="rounded-full bg-terra/10 px-3 py-1 text-sm font-medium text-terra">
                        Skipped
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleMarkTaken(dose.medId, dose.time)}
                          className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal/90"
                        >
                          Take
                        </button>
                        <button
                          onClick={() => handleMarkSkipped(dose.medId, dose.time)}
                          className="rounded-xl bg-cream px-4 py-2 text-sm font-medium text-charcoal-light transition-colors hover:bg-charcoal/5"
                        >
                          Skip
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* PRN Medications */}
      {prnMeds.length > 0 && (
        <div className="rounded-2xl bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber" />
            <h3 className="text-lg font-semibold text-charcoal">As-Needed (PRN)</h3>
          </div>
          <div className="space-y-3">
            {prnMeds.map((med: any) => (
              <div key={med.id} className="flex items-center justify-between rounded-xl bg-cream/50 p-4">
                <div>
                  <p className="text-base font-semibold text-charcoal">{med.name}</p>
                  <p className="text-sm text-charcoal-light">{med.dose} &middot; {med.instructions || 'As needed'}</p>
                </div>
                <button
                  onClick={() => setShowPrnModal(true)}
                  className="rounded-xl border border-teal/30 px-4 py-2 text-sm font-semibold text-teal transition-colors hover:bg-teal/5"
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
