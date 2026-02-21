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
      { log_type: 'quick', pain_intensity: pain, mood },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        },
        onError: () => {
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        },
      },
    );
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ border: '1px solid rgba(123,166,140,0.3)', backgroundColor: 'rgba(123,166,140,0.04)' }}
      >
        <CheckCircle2 className="mx-auto h-10 w-10" style={{ color: '#7BA68C' }} />
        <p className="mt-2 font-heading text-lg font-bold" style={{ color: '#5A8A6E' }}>
          Logged!
        </p>
        <p className="mt-1 text-[13px]" style={{ color: '#4A4A4A' }}>
          Thank you for sharing how you feel today.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl bg-white p-6"
      style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'rgba(42,107,107,0.08)' }}
        >
          <Activity className="h-5 w-5" style={{ color: '#2A6B6B' }} />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold" style={{ color: '#2D2D2D' }}>
            How are you feeling?
          </h2>
          <p className="text-[12px]" style={{ color: '#4A4A4A' }}>Quick symptom check-in</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-[12px] font-semibold uppercase" style={{ color: '#4A4A4A' }}>
            Pain Level
          </label>
          <PainSlider value={pain} onChange={setPain} />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold uppercase" style={{ color: '#4A4A4A' }}>
            Overall Mood
          </label>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={mood === null || createLog.isPending}
          className="w-full rounded-xl py-3 text-[14px] font-semibold text-white transition-all hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: '#2A6B6B' }}
        >
          {createLog.isPending ? 'Logging...' : 'Log How I Feel'}
        </button>
      </div>
    </div>
  );
}
