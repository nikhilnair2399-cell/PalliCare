'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Send, CheckCircle2, Smile, Meh, Frown, BarChart3, Lightbulb } from 'lucide-react';
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

const QUALITY_HINTS: Record<string, string> = {
  Aching: 'Deep, constant discomfort — often from muscles or joints',
  Burning: 'Hot, stinging sensation — may suggest nerve involvement',
  Stabbing: 'Sudden, intense piercing pain — may be neuropathic',
  Throbbing: 'Pulsing pain that comes in waves — often vascular',
  Shooting: 'Electric-like pain that travels — typical of nerve pain',
  Cramping: 'Squeezing, tightening pain — common in visceral/muscle pain',
  Dull: 'Low-grade persistent ache — common background pain',
  Sharp: 'Intense, focused pain — may be incident or mechanical',
  Tingling: 'Pins-and-needles sensation — suggests nerve involvement',
  Pressure: 'Heaviness or squeezing — may be visceral or tension',
};

export default function LogPage() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<string | null>(null);
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
      { esas_scores: scores, pain_qualities: selectedQualities, notes, mood },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => setSubmitted(true),
      },
    );
  }

  function resetForm() {
    setStep(1);
    setMood(null);
    setScores(Object.fromEntries(ESAS_SYMPTOMS.map((s) => [s.key, 0])));
    setSelectedQualities([]);
    setNotes('');
    setSubmitted(false);
  }

  if (submitted) {
    const highSymptoms = ESAS_SYMPTOMS.filter(s => scores[s.key] >= 7);
    const totalBurden = ESAS_SYMPTOMS.reduce((sum, s) => sum + scores[s.key], 0);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-col items-center rounded-2xl bg-white p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-sage" />
          <h2 className="mt-4 font-heading text-2xl font-bold text-charcoal">Symptoms Logged</h2>
          <p className="mt-2 text-base text-charcoal-light">
            Your care team can now see how you&apos;re feeling today. Thank you for sharing.
          </p>
          <button
            onClick={resetForm}
            className="mt-8 rounded-2xl bg-teal px-8 py-4 text-base font-bold text-white transition-colors hover:bg-teal/90"
          >
            Log Again
          </button>
        </div>

        {/* ESAS Summary */}
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-teal" />
            <h3 className="text-base font-bold text-charcoal">Your Symptom Snapshot</h3>
          </div>
          <div className="space-y-2">
            {ESAS_SYMPTOMS.map(s => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="w-32 text-sm text-charcoal-light truncate">{s.label}</span>
                <div className="flex-1 h-3 rounded-full bg-cream overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${scores[s.key] * 10}%`,
                      backgroundColor: painColor(scores[s.key]),
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-bold text-charcoal">{scores[s.key]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-charcoal-light">
            <span>Total burden: <strong className="text-charcoal">{totalBurden}/90</strong></span>
            {highSymptoms.length > 0 && (
              <span className="text-terra font-medium">{highSymptoms.length} symptom{highSymptoms.length > 1 ? 's' : ''} ≥ 7/10</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Log Symptoms</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Tell us how you&apos;re feeling today
        </p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-teal' : 'bg-charcoal/10'}`} />
          </div>
        ))}
        <span className="ml-2 text-sm text-charcoal-light">Step {step} of 3</span>
      </div>

      {/* Step 1: Quick Check */}
      {step === 1 && (
        <div className="rounded-2xl bg-white p-6">
          <h2 className="font-heading text-xl font-bold text-charcoal">Quick Check</h2>
          <p className="mt-1 text-sm text-charcoal-light">Rate your overall pain and mood right now.</p>

          {/* Pain Slider */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-charcoal">Pain Level</span>
              <span
                className="rounded-full px-3 py-1 text-sm font-bold text-white"
                style={{ backgroundColor: painColor(scores.pain) }}
              >
                {scores.pain}/10
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={scores.pain}
              onChange={(e) => handleScoreChange('pain', Number(e.target.value))}
              className="mt-3 w-full accent-teal"
            />
            <div className="mt-1 flex justify-between text-sm text-charcoal-light">
              <span>No pain</span>
              <span>Worst pain</span>
            </div>
          </div>

          {/* Mood */}
          <div className="mt-6">
            <p className="text-base font-medium text-charcoal">How is your mood?</p>
            <div className="mt-3 flex gap-3">
              {[
                { key: 'good', icon: Smile, label: 'Good', color: 'bg-sage/10 text-sage-dark border-sage/30' },
                { key: 'okay', icon: Meh, label: 'Okay', color: 'bg-amber/10 text-amber border-amber/30' },
                { key: 'bad', icon: Frown, label: 'Not great', color: 'bg-terra/10 text-terra border-terra/30' },
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

          <button
            onClick={() => setStep(2)}
            className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90"
          >
            Next: Detailed Symptoms
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Step 2: ESAS-r Symptoms */}
      {step === 2 && (
        <div className="rounded-2xl bg-white p-6">
          <h2 className="font-heading text-xl font-bold text-charcoal">ESAS-r Assessment</h2>
          <p className="mt-1 text-sm text-charcoal-light">Rate each symptom from 0 (none) to 10 (worst).</p>

          <div className="mt-6 space-y-6">
            {ESAS_SYMPTOMS.filter((s) => s.key !== 'pain').map((symptom) => (
              <div key={symptom.key}>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-charcoal">{symptom.label}</label>
                  <span
                    className="rounded-full px-3 py-1 text-sm font-bold text-white"
                    style={{ backgroundColor: painColor(scores[symptom.key]) }}
                  >
                    {scores[symptom.key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={scores[symptom.key]}
                  onChange={(e) => handleScoreChange(symptom.key, Number(e.target.value))}
                  className="mt-2 w-full accent-teal"
                />
                <div className="mt-1 flex justify-between text-sm text-charcoal/30">
                  <span>None</span>
                  <span>Worst</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-cream text-base font-medium text-charcoal transition-colors hover:bg-charcoal/5"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Pain Qualities + Notes */}
      {step === 3 && (
        <div className="rounded-2xl bg-white p-6">
          <h2 className="font-heading text-xl font-bold text-charcoal">Pain Details &amp; Notes</h2>
          <p className="mt-1 text-sm text-charcoal-light">Describe your pain quality and add any notes for your care team.</p>

          {/* Pain Qualities */}
          <div className="mt-6">
            <p className="text-base font-medium text-charcoal">Pain Qualities</p>
            <p className="mt-1 text-sm text-charcoal-light">Select all that apply</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PAIN_QUALITIES.map((q) => (
                <button
                  key={q}
                  onClick={() => toggleQuality(q)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedQualities.includes(q)
                      ? 'bg-teal text-white'
                      : 'bg-cream text-charcoal-light hover:bg-charcoal/5'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            {selectedQualities.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedQualities.map(q => (
                  <div key={q} className="flex items-start gap-2 rounded-xl bg-teal/5 px-4 py-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal" />
                    <p className="text-sm text-charcoal-light"><strong className="text-charcoal">{q}:</strong> {QUALITY_HINTS[q]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mt-6">
            <p className="text-base font-medium text-charcoal">Additional Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other symptoms or observations..."
              rows={4}
              className="mt-3 w-full rounded-2xl border border-charcoal/10 bg-cream/30 p-4 text-base text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-cream text-base font-medium text-charcoal transition-colors hover:bg-charcoal/5"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={createLog.isPending}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
            >
              {createLog.isPending ? 'Saving...' : (
                <>
                  <Send className="h-5 w-5" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
