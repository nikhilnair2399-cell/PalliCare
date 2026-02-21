'use client';

import { useState } from 'react';
import { Activity, Send, CheckCircle2 } from 'lucide-react';
import { useCreateSymptomLog } from '@/lib/patient-hooks';
import { painColor } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const ESAS_SYMPTOMS = [
  { key: 'pain', label: 'Pain' },
  { key: 'fatigue', label: 'Fatigue' },
  { key: 'nausea', label: 'Nausea' },
  { key: 'depression', label: 'Depression' },
  { key: 'anxiety', label: 'Anxiety' },
  { key: 'drowsiness', label: 'Drowsiness' },
  { key: 'appetite', label: 'Appetite (lack of)' },
  { key: 'wellbeing', label: 'Wellbeing (poor)' },
  { key: 'dyspnea', label: 'Shortness of Breath' },
];

const PAIN_QUALITIES = [
  'Aching', 'Burning', 'Stabbing', 'Throbbing', 'Shooting', 'Cramping', 'Dull', 'Sharp', 'Tingling', 'Pressure',
];

export default function LogPage() {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(ESAS_SYMPTOMS.map((s) => [s.key, 0])),
  );
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const createLog = useCreateSymptomLog();

  function handleScoreChange(key: string, value: number) {
    setScores((prev) => ({ ...prev, [key]: value }));
  }

  function toggleQuality(q: string) {
    setSelectedQualities((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q],
    );
  }

  function handleSubmit() {
    createLog.mutate(
      { esas_scores: scores, pain_qualities: selectedQualities, notes },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => setSubmitted(true),
      },
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-sage-light/30 bg-white p-12 shadow-sm">
          <CheckCircle2 className="h-16 w-16 text-sage" />
          <h2 className="mt-4 font-heading text-xl font-bold text-teal">Symptoms Logged</h2>
          <p className="mt-2 text-sm text-charcoal-light">Your care team can now see how you&apos;re feeling today.</p>
          <button
            onClick={() => { setSubmitted(false); setScores(Object.fromEntries(ESAS_SYMPTOMS.map((s) => [s.key, 0]))); setSelectedQualities([]); setNotes(''); }}
            className="mt-6 rounded-xl bg-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal/90"
          >
            Log Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Log Symptoms</h1>
        <p className="text-sm text-charcoal-light">
          Rate each symptom from 0 (none) to 10 (worst possible) using the ESAS-r scale
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: ESAS-r Symptom Sliders — 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
            <div className="border-b border-sage-light/20 px-5 py-4">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
                <Activity className="h-5 w-5" />
                ESAS-r Symptom Assessment
              </h2>
            </div>
            <div className="divide-y divide-sage-light/10 p-5">
              {ESAS_SYMPTOMS.map((symptom) => (
                <div key={symptom.key} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-charcoal">{symptom.label}</label>
                    <span
                      className="min-w-[2.5rem] rounded-full px-2.5 py-0.5 text-center text-xs font-bold text-white"
                      style={{ backgroundColor: painColor(scores[symptom.key]) }}
                    >
                      {scores[symptom.key]}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[10px] text-charcoal-light">None</span>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={scores[symptom.key]}
                      onChange={(e) => handleScoreChange(symptom.key, Number(e.target.value))}
                      className="flex-1 accent-teal"
                    />
                    <span className="text-[10px] text-charcoal-light">Worst</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pain Qualities + Notes — 1 col */}
        <div className="space-y-6">
          {/* Pain Qualities */}
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-charcoal">Pain Qualities</h3>
            <p className="mt-1 text-xs text-charcoal-light">Select all that apply</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PAIN_QUALITIES.map((q) => (
                <button
                  key={q}
                  onClick={() => toggleQuality(q)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedQualities.includes(q)
                      ? 'bg-teal text-white'
                      : 'border border-sage-light/30 bg-white text-charcoal-light hover:bg-cream'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-charcoal">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other symptoms or observations..."
              rows={4}
              className="mt-3 w-full rounded-lg border border-sage-light/30 bg-cream/30 p-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={createLog.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal/90 disabled:opacity-50"
          >
            {createLog.isPending ? 'Saving...' : (
              <>
                <Send className="h-4 w-4" />
                Submit Symptom Log
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
