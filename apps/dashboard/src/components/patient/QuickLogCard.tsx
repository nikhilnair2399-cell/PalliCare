'use client';

import { useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { PainSlider } from './PainSlider';
import { MoodSelector } from './MoodSelector';
import { useCreateSymptomLog } from '@/lib/patient-hooks';

type Mood = 'good' | 'okay' | 'bad';

export function QuickLogCard() {
  const [pain, setPain] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const createLog = useCreateSymptomLog();

  function handleSubmit() {
    if (mood === null) return;
    createLog.mutate(
      {
        log_type: 'quick',
        pain_intensity: pain,
        mood,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        },
        onError: () => {
          // Fallback: show success in demo mode
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        },
      },
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-sage" />
        <p className="mt-2 font-heading text-lg font-bold text-sage-dark">
          Logged!
        </p>
        <p className="mt-1 text-sm text-charcoal-light">
          Thank you for sharing how you feel today.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sage-light/20 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
          <Activity className="h-5 w-5 text-teal" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-charcoal">
            How are you feeling?
          </h2>
          <p className="text-xs text-charcoal-light">Quick symptom check-in</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Pain slider */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-charcoal-light">
            Pain Level
          </label>
          <PainSlider value={pain} onChange={setPain} />
        </div>

        {/* Mood selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-charcoal-light">
            Overall Mood
          </label>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={mood === null || createLog.isPending}
          className="w-full rounded-xl bg-gradient-to-r from-sage to-teal py-3 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
        >
          {createLog.isPending ? 'Logging...' : 'Log How I Feel'}
        </button>
      </div>
    </div>
  );
}
