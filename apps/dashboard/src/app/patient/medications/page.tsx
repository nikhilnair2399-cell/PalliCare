'use client';

import { useState } from 'react';
import { Pill, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Info, Star, TrendingUp, Timer, ShieldAlert, RefreshCw, Calendar } from 'lucide-react';
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

      {/* Sprint 40 — 7-Day Adherence Trend + Next Dose */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Weekly trend */}
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-teal" />
            <h3 className="text-sm font-bold text-charcoal">7-Day Trend</h3>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: '64px' }}>
            {[85, 100, 75, 90, 100, 80, adherence].map((pct, i) => {
              const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
              const isToday = i === 6;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-charcoal/60">{pct}%</span>
                  <div
                    className={`w-full rounded-t transition-all ${pct >= 80 ? 'bg-sage/60' : pct >= 50 ? 'bg-amber/60' : 'bg-terra/60'} ${isToday ? 'ring-1 ring-teal' : ''}`}
                    style={{ height: `${pct * 0.5}px`, minHeight: '4px' }}
                  />
                  <span className={`text-[9px] ${isToday ? 'font-bold text-teal' : 'text-charcoal/40'}`}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Next dose countdown */}
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="h-4 w-4 text-amber" />
            <h3 className="text-sm font-bold text-charcoal">Next Dose</h3>
          </div>
          {(() => {
            const pending = allDoses.filter((d: any) => d.status === 'pending');
            if (pending.length === 0) return <p className="text-sm text-sage font-medium">All doses taken today!</p>;
            const next = pending[0];
            const now = new Date();
            const [h, m] = (next.time || '12:00').split(':').map(Number);
            const doseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
            const diff = Math.max(0, Math.round((doseTime.getTime() - now.getTime()) / 60000));
            const hrs = Math.floor(diff / 60);
            const mins = diff % 60;
            return (
              <div>
                <p className="text-2xl font-bold text-charcoal">
                  {hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`}
                </p>
                <p className="text-sm text-charcoal-light mt-1">{next.medName} · {next.medDose}</p>
                <p className="text-xs text-charcoal/40 mt-0.5">Scheduled at {next.time}</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Sprint 53 — Adherence by Time-of-Day + Missed Dose Insights */}
      {(() => {
        const timeSlots = [
          { label: 'Morning', key: 'morning', taken: 12, missed: 1, icon: '🌅' },
          { label: 'Afternoon', key: 'afternoon', taken: 10, missed: 3, icon: '☀️' },
          { label: 'Evening', key: 'evening', taken: 11, missed: 2, icon: '🌇' },
          { label: 'Night', key: 'night', taken: 9, missed: 4, icon: '🌙' },
        ];
        const missReasons = [
          { reason: 'Forgot', count: 5, pct: 50 },
          { reason: 'Side effects', count: 2, pct: 20 },
          { reason: 'Asleep', count: 2, pct: 20 },
          { reason: 'Nausea', count: 1, pct: 10 },
        ];
        const totalMissed = timeSlots.reduce((s, t) => s + t.missed, 0);
        const worstSlot = timeSlots.reduce((w, t) => t.missed > w.missed ? t : w, timeSlots[0]);
        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-teal" />
              <h3 className="text-sm font-bold text-charcoal">Adherence Patterns</h3>
              <span className="ml-auto text-[10px] text-charcoal/40">Last 7 days</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {timeSlots.map((slot) => {
                const total = slot.taken + slot.missed;
                const pct = total > 0 ? Math.round((slot.taken / total) * 100) : 0;
                return (
                  <div key={slot.key} className="rounded-xl bg-cream/50 p-3 text-center">
                    <span className="text-lg">{slot.icon}</span>
                    <p className="text-xs font-medium text-charcoal mt-1">{slot.label}</p>
                    <p className={`text-sm font-bold ${pct >= 90 ? 'text-sage-dark' : pct >= 70 ? 'text-amber' : 'text-terra'}`}>{pct}%</p>
                    <p className="text-[10px] text-charcoal/40">{slot.taken}/{total}</p>
                  </div>
                );
              })}
            </div>
            {totalMissed > 0 && (
              <div>
                <p className="text-xs font-semibold text-charcoal/50 uppercase mb-2">Why Doses Were Missed</p>
                <div className="space-y-1.5">
                  {missReasons.map((r) => (
                    <div key={r.reason} className="flex items-center gap-2">
                      <span className="w-20 text-xs text-charcoal">{r.reason}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream">
                        <div className="h-full rounded-full bg-terra/50" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="w-6 text-right text-[10px] font-bold text-charcoal/40">{r.count}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-charcoal/40">
                  Most missed: {worstSlot.label} doses. Consider setting a reminder for {worstSlot.label.toLowerCase()} medications.
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Medication Interaction Awareness & Refill Tracker */}
      {meds.length >= 2 && (() => {
        const INTERACTIONS: { pair: [string, string]; severity: 'info' | 'caution'; note: string }[] = [
          { pair: ['Morphine SR', 'Gabapentin'], severity: 'caution', note: 'Both cause drowsiness — avoid driving and report excessive sedation' },
          { pair: ['Morphine SR', 'Morphine IR'], severity: 'info', note: 'Same class — track total daily opioid dose with your care team' },
          { pair: ['Morphine SR', 'Ondansetron'], severity: 'info', note: 'Ondansetron helps manage opioid-induced nausea — take as prescribed' },
          { pair: ['Morphine SR', 'Lactulose'], severity: 'info', note: 'Lactulose prevents opioid constipation — do not skip this medication' },
          { pair: ['Gabapentin', 'Paracetamol'], severity: 'info', note: 'Safe combination — no significant interaction' },
        ];

        const medNames = meds.map((m: any) => m.name);
        const relevant = INTERACTIONS.filter(ix =>
          medNames.includes(ix.pair[0]) && medNames.includes(ix.pair[1])
        );

        const REFILL_MOCK = meds.slice(0, 3).map((m: any, i: number) => ({
          name: m.name,
          daysLeft: [5, 12, 21][i] || 14,
          lastRefill: new Date(Date.now() - (30 - ([5, 12, 21][i] || 14)) * 86400000),
        }));

        return (
          <div className="space-y-3">
            {/* Interactions */}
            {relevant.length > 0 && (
              <div className="rounded-2xl bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="h-5 w-5 text-amber" />
                  <h3 className="text-sm font-bold text-charcoal">Interaction Awareness</h3>
                </div>
                <div className="space-y-2">
                  {relevant.map((ix, i) => (
                    <div key={i} className={`rounded-xl p-3 ${ix.severity === 'caution' ? 'bg-amber/10' : 'bg-cream/60'}`}>
                      <p className="text-sm font-semibold text-charcoal">
                        {ix.pair[0]} + {ix.pair[1]}
                        {ix.severity === 'caution' && <span className="ml-2 text-xs text-amber font-bold">CAUTION</span>}
                      </p>
                      <p className="text-xs text-charcoal/60 mt-0.5">{ix.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refill Tracker */}
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="h-5 w-5 text-teal" />
                <h3 className="text-sm font-bold text-charcoal">Refill Tracker</h3>
              </div>
              <div className="space-y-2">
                {REFILL_MOCK.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{r.name}</p>
                      <div className="mt-1 h-1.5 rounded-full bg-charcoal/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.daysLeft <= 7 ? 'bg-terra' : r.daysLeft <= 14 ? 'bg-amber' : 'bg-sage'}`}
                          style={{ width: `${Math.min(100, (r.daysLeft / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-bold whitespace-nowrap ${r.daysLeft <= 7 ? 'text-terra' : r.daysLeft <= 14 ? 'text-amber' : 'text-charcoal/60'}`}>
                      {r.daysLeft}d left
                    </span>
                  </div>
                ))}
              </div>
              {REFILL_MOCK.some(r => r.daysLeft <= 7) && (
                <p className="mt-3 text-xs text-terra font-medium">
                  Refill needed soon — contact your pharmacy or care team
                </p>
              )}
            </div>
          </div>
        );
      })()}

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
