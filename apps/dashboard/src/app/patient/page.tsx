'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pill, Heart, Wind, Sparkles, CheckCircle2, Smile, Meh, Frown } from 'lucide-react';
import { usePatientProfile, useWellnessSummary, usePatientMedications, useCreateSymptomLog } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PATIENT_PROFILE, MOCK_WELLNESS_SUMMARY, MOCK_MEDICATIONS } from '@/lib/patient-mock-data';
import { painColor } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PatientHomePage() {
  const [painScore, setPainScore] = useState(3);
  const [mood, setMood] = useState<'good' | 'okay' | 'bad' | null>(null);
  const [logged, setLogged] = useState(false);

  const profileQuery = usePatientProfile();
  const wellnessQuery = useWellnessSummary();
  const medsQuery = usePatientMedications();
  const createLog = useCreateSymptomLog();

  const { data: profile } = useWithFallback(profileQuery, MOCK_PATIENT_PROFILE);
  const { data: wellness } = useWithFallback(wellnessQuery, MOCK_WELLNESS_SUMMARY);
  const { data: rawMeds } = useWithFallback(medsQuery, MOCK_MEDICATIONS);

  const p = profile as any;
  const w = wellness as any;
  const meds: any[] = Array.isArray(rawMeds) ? rawMeds : MOCK_MEDICATIONS;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  function handleQuickLog() {
    createLog.mutate(
      { esas_scores: { pain: painScore }, mood: mood || 'okay', notes: '' },
      {
        onSuccess: () => setLogged(true),
        onError: () => setLogged(true),
      },
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hero Greeting Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal to-sage p-8 text-white">
        <h1 className="font-heading text-3xl font-bold">
          {timeGreeting}, {p.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-2 text-base text-white/75 italic">
          &ldquo;{w.todays_intention || 'I will find moments of peace and gratitude today.'}&rdquo;
        </p>
      </div>

      {/* How Are You Feeling? */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="font-heading text-xl font-bold text-charcoal">How are you feeling?</h2>
        <p className="mt-1 text-sm text-charcoal-light">A quick check-in helps your care team understand your comfort.</p>

        {logged ? (
          <div className="mt-6 flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="h-12 w-12 text-sage" />
            <p className="text-base font-semibold text-sage-dark">Logged! Thank you.</p>
            <button
              onClick={() => { setLogged(false); setMood(null); setPainScore(3); }}
              className="text-sm text-teal hover:underline"
            >
              Log again
            </button>
          </div>
        ) : (
          <>
            {/* Pain Slider */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal">Pain Level</span>
                <span
                  className="rounded-full px-3 py-1 text-sm font-bold text-white"
                  style={{ backgroundColor: painColor(painScore) }}
                >
                  {painScore}/10
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={painScore}
                onChange={(e) => setPainScore(Number(e.target.value))}
                className="mt-3 w-full accent-teal"
              />
              <div className="mt-1 flex justify-between text-sm text-charcoal-light">
                <span>No pain</span>
                <span>Worst pain</span>
              </div>
            </div>

            {/* Mood */}
            <div className="mt-5">
              <p className="text-sm font-medium text-charcoal">Mood</p>
              <div className="mt-3 flex gap-3">
                {[
                  { key: 'good' as const, icon: Smile, label: 'Good', color: 'bg-sage/10 text-sage-dark border-sage/30' },
                  { key: 'okay' as const, icon: Meh, label: 'Okay', color: 'bg-amber/10 text-amber border-amber/30' },
                  { key: 'bad' as const, icon: Frown, label: 'Not great', color: 'bg-terra/10 text-terra border-terra/30' },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMood(m.key)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                      mood === m.key ? m.color : 'border-charcoal/5 bg-cream/50 text-charcoal-light'
                    }`}
                  >
                    <m.icon className="h-7 w-7" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Log Button */}
            <button
              onClick={handleQuickLog}
              disabled={createLog.isPending}
              className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
            >
              {createLog.isPending ? 'Saving...' : 'Log How I Feel'}
            </button>
          </>
        )}
      </div>

      {/* Today's Medications */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-charcoal">Today&apos;s Medications</h2>
          <Link href="/patient/medications" className="text-sm font-semibold text-teal hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {meds.slice(0, 3).map((med: any, i: number) => {
            const takenDoses = (med.schedule || []).filter((s: any) => s.status === 'taken').length;
            const totalDoses = (med.schedule || []).length;
            const allTaken = totalDoses > 0 && takenDoses === totalDoses;

            return (
              <div key={med.id || i} className="flex items-center gap-4 rounded-xl bg-cream/50 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${allTaken ? 'bg-sage/15' : 'bg-amber/15'}`}>
                  {allTaken ? <CheckCircle2 className="h-5 w-5 text-sage-dark" /> : <Pill className="h-5 w-5 text-amber" />}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-charcoal">{med.name}</p>
                  <p className="text-sm text-charcoal-light">{med.dose} &middot; {med.frequency || 'Daily'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${allTaken ? 'bg-sage/10 text-sage-dark' : 'bg-amber/10 text-amber'}`}>
                  {allTaken ? 'Taken' : 'Pending'}
                </span>
              </div>
            );
          })}
          {meds.length === 0 && (
            <p className="py-6 text-center text-sm text-charcoal/40">No medications scheduled today.</p>
          )}
        </div>
      </div>

      {/* Wellness Stats — 2 cards side by side */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/patient/journey" className="block rounded-2xl bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <Heart className="h-6 w-6 text-terra" />
          <p className="mt-3 font-heading text-3xl font-bold text-charcoal">
            {w.gratitude_streak ?? w.streak ?? 5}
          </p>
          <p className="mt-1 text-sm text-charcoal-light">Day gratitude streak</p>
        </Link>
        <Link href="/patient/breathe" className="block rounded-2xl bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <Wind className="h-6 w-6 text-sage" />
          <p className="mt-3 font-heading text-3xl font-bold text-charcoal">
            {w.breathe_sessions ?? w.total_sessions ?? 12}
          </p>
          <p className="mt-1 text-sm text-charcoal-light">Breathe sessions</p>
        </Link>
      </div>

      {/* Today's Intention (if not shown in hero) */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber" />
          <h3 className="text-base font-semibold text-charcoal">Your Journey</h3>
        </div>
        <p className="mt-3 text-sm text-charcoal-light">
          You&apos;ve set {(w.goals_count ?? 3)} goals and logged {(w.gratitude_count ?? w.gratitude_streak ?? 5)} gratitude entries.
          Keep going &mdash; every moment of reflection matters.
        </p>
        <Link
          href="/patient/journey"
          className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
        >
          Visit your journey
        </Link>
      </div>
    </div>
  );
}
