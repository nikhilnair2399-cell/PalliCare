'use client';

import { useState } from 'react';
import { Pill, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import { usePatientMedications, useLogMedicationAdherence } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_MEDICATIONS } from '@/lib/patient-mock-data';
import { StatCard } from '@/components/ui/StatCard';

/* eslint-disable @typescript-eslint/no-explicit-any */

const TIME_GROUPS = [
  { key: 'morning', label: 'Morning', range: '6:00 AM - 12:00 PM' },
  { key: 'afternoon', label: 'Afternoon', range: '12:00 PM - 5:00 PM' },
  { key: 'evening', label: 'Evening', range: '5:00 PM - 9:00 PM' },
  { key: 'night', label: 'Night', range: '9:00 PM - 6:00 AM' },
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Medications</h1>
        <p className="text-sm text-charcoal-light">
          Track your daily medication schedule and adherence
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Adherence Today"
          value={`${adherence}%`}
          change={`${taken} of ${total} doses taken`}
          changeType={adherence >= 80 ? 'increase' : 'alert'}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Total Medications"
          value={String(meds.length)}
          change="Active prescriptions"
          changeType="info"
          icon={<Pill className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Doses"
          value={String(total - taken - allDoses.filter((d: any) => d.status === 'skipped').length)}
          change="Remaining today"
          changeType={total - taken > 0 ? 'alert' : 'increase'}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="PRN Available"
          value={String(prnMeds.length)}
          change="As-needed medications"
          changeType="info"
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      {/* Medication Schedule by Time */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
            <div key={group.key} className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
              <div className="border-b border-sage-light/20 px-5 py-4">
                <h3 className="text-base font-semibold text-charcoal">{group.label}</h3>
                <p className="text-xs text-charcoal-light">{group.range}</p>
              </div>
              <div className="divide-y divide-sage-light/10">
                {groupDoses.map((dose: any, i: number) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        dose.status === 'taken' ? 'bg-sage/10' : dose.status === 'skipped' ? 'bg-alert-critical/10' : 'bg-amber/10'
                      }`}>
                        <Pill className={`h-4 w-4 ${
                          dose.status === 'taken' ? 'text-sage-dark' : dose.status === 'skipped' ? 'text-alert-critical' : 'text-amber'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{dose.medName}</p>
                        <p className="text-xs text-charcoal-light">{dose.medDose} &middot; {dose.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dose.status === 'taken' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-medium text-sage-dark">
                          <CheckCircle2 className="h-3 w-3" /> Taken
                        </span>
                      ) : dose.status === 'skipped' ? (
                        <span className="rounded-full bg-alert-critical/10 px-2.5 py-0.5 text-xs font-medium text-alert-critical">
                          Skipped
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleMarkTaken(dose.medId, dose.time)}
                            className="rounded-lg bg-teal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal/90"
                          >
                            Take
                          </button>
                          <button
                            onClick={() => handleMarkSkipped(dose.medId, dose.time)}
                            className="rounded-lg border border-sage-light/30 px-3 py-1.5 text-xs font-medium text-charcoal-light transition-colors hover:bg-cream"
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
      </div>

      {/* PRN Medications */}
      {prnMeds.length > 0 && (
        <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
          <div className="border-b border-sage-light/20 px-5 py-4">
            <h3 className="text-base font-semibold text-charcoal">As-Needed (PRN) Medications</h3>
          </div>
          <div className="divide-y divide-sage-light/10">
            {prnMeds.map((med: any) => (
              <div key={med.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-charcoal">{med.name}</p>
                  <p className="text-xs text-charcoal-light">{med.dose} &middot; {med.instructions || 'As needed'}</p>
                </div>
                <button
                  onClick={() => setShowPrnModal(true)}
                  className="rounded-lg border border-teal/30 px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:bg-teal/5"
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
