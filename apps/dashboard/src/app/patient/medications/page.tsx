'use client';

import { useState } from 'react';
import { Pill, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Info, Star } from 'lucide-react';
import { usePatientMedications, useLogMedicationAdherence } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_MEDICATIONS } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Medication Info (expandable details) ─────────────────────────────
const MED_INFO: Record<string, { purpose: string; sideEffects: string; tips: string }> = {
  'Morphine SR': { purpose: 'Controls moderate to severe pain around the clock', sideEffects: 'Constipation, drowsiness, nausea (usually improves after a few days)', tips: 'Take at the same times each day. Do not crush or break the tablet.' },
  'Morphine IR': { purpose: 'Provides quick relief for breakthrough pain episodes', sideEffects: 'Drowsiness, dizziness, nausea', tips: 'Only take when pain breaks through. Wait at least 4 hours between doses.' },
  'Gabapentin': { purpose: 'Helps with nerve pain, tingling, and burning sensations', sideEffects: 'Dizziness, sleepiness, swelling in hands/feet', tips: 'Do not stop suddenly. Take with food to reduce stomach upset.' },
  'Ondansetron': { purpose: 'Prevents and treats nausea and vomiting', sideEffects: 'Headache, constipation, fatigue', tips: 'Take 30 minutes before meals if nausea occurs with eating.' },
  'Lactulose': { purpose: 'Softens stools and prevents constipation from opioids', sideEffects: 'Bloating, gas, stomach cramps', tips: 'Mix with water or juice. Increase fluid intake throughout the day.' },
  'Paracetamol': { purpose: 'Reduces mild pain and fever', sideEffects: 'Generally well-tolerated at prescribed doses', tips: 'Do not exceed 4g per day. Avoid alcohol while taking this medication.' },
};

// ── Motivational Messages ────────────────────────────────────────────
function getMotivation(adherence: number): { text: string; emoji: string } {
  if (adherence === 100) return { text: 'Perfect score! Every dose counts towards your comfort.', emoji: '🌟' };
  if (adherence >= 80) return { text: 'Great job staying on track! Your consistency helps your care team help you.', emoji: '💪' };
  if (adherence >= 60) return { text: 'Good effort! Try to take doses on time — it makes each medication work better.', emoji: '👍' };
  return { text: 'Every dose matters. If you are having trouble, tell your care team — we can help.', emoji: '💙' };
}

const TIME_GROUPS = [
  { key: 'morning', label: 'Morning', range: '6:00 AM – 12:00 PM' },
  { key: 'afternoon', label: 'Afternoon', range: '12:00 PM – 5:00 PM' },
  { key: 'evening', label: 'Evening', range: '5:00 PM – 9:00 PM' },
  { key: 'night', label: 'Night', range: '9:00 PM – 6:00 AM' },
];

export default function MedicationsPage() {
  const [showPrnModal, setShowPrnModal] = useState(false);
  const [expandedMed, setExpandedMed] = useState<string | null>(null);
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
        {/* Motivational nudge */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-cream/60 p-3">
          <Star className="h-5 w-5 flex-shrink-0 text-amber" />
          <p className="text-sm text-charcoal/70">{getMotivation(adherence).text}</p>
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
              {groupDoses.map((dose: any, i: number) => {
                const info = MED_INFO[dose.medName];
                const isExpanded = expandedMed === `${dose.medId}-${dose.time}`;
                return (
                  <div key={i} className="rounded-xl bg-cream/50 overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        dose.status === 'taken' ? 'bg-sage/15' : dose.status === 'skipped' ? 'bg-terra/15' : 'bg-amber/15'
                      }`}>
                        <Pill className={`h-5 w-5 ${
                          dose.status === 'taken' ? 'text-sage-dark' : dose.status === 'skipped' ? 'text-terra' : 'text-amber'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-charcoal">{dose.medName}</p>
                          {info && (
                            <button
                              onClick={() => setExpandedMed(isExpanded ? null : `${dose.medId}-${dose.time}`)}
                              className="text-charcoal/30 hover:text-teal transition-colors"
                              title="Medication info"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
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
                    {/* Expandable medication info */}
                    {info && isExpanded && (
                      <div className="border-t border-charcoal/5 bg-white/50 px-4 py-3 space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-teal uppercase">What it does</p>
                          <p className="text-sm text-charcoal/70">{info.purpose}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-amber uppercase">Possible side effects</p>
                          <p className="text-sm text-charcoal/70">{info.sideEffects}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-sage-dark uppercase">Tips</p>
                          <p className="text-sm text-charcoal/70">{info.tips}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
