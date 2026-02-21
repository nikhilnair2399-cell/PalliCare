'use client';

import { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { PainSlider } from '@/components/patient/PainSlider';
import { MoodSelector } from '@/components/patient/MoodSelector';
import { useCreateSymptomLog, usePatientSymptoms } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_RECENT_LOGS } from '@/lib/patient-mock-data';
import { painColor, relativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Mood = 'good' | 'okay' | 'bad';

const ESAS_SYMPTOMS = [
  { key: 'fatigue', label: 'Fatigue / Tiredness' },
  { key: 'nausea', label: 'Nausea' },
  { key: 'depression', label: 'Feeling Down / Sadness' },
  { key: 'anxiety', label: 'Anxiety / Worry' },
  { key: 'drowsiness', label: 'Drowsiness / Sleepiness' },
  { key: 'appetite', label: 'Appetite (0 = Good, 10 = No Appetite)' },
  { key: 'wellbeing', label: 'Wellbeing (0 = Good, 10 = Bad)' },
  { key: 'dyspnea', label: 'Shortness of Breath' },
];

const PAIN_QUALITIES = [
  'Burning', 'Aching', 'Shooting', 'Stabbing', 'Throbbing',
  'Tingling', 'Cramping', 'Dull', 'Sharp', 'Pressure',
];

export default function SymptomLoggerPage() {
  const [pain, setPain] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [showFullLog, setShowFullLog] = useState(false);
  const [esasScores, setEsasScores] = useState<Record<string, number>>(
    Object.fromEntries(ESAS_SYMPTOMS.map((s) => [s.key, 0])),
  );
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const createLog = useCreateSymptomLog();
  const logsQuery = usePatientSymptoms();
  const { data: recentLogs } = useWithFallback(logsQuery, MOCK_RECENT_LOGS);

  function toggleQuality(q: string) {
    setSelectedQualities((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q],
    );
  }

  function handleSubmit() {
    if (mood === null) return;

    const data: any = {
      log_type: showFullLog ? 'full' : 'quick',
      pain_intensity: pain,
      mood,
    };

    if (showFullLog) {
      data.esas = esasScores;
      data.pain_qualities = selectedQualities;
      data.notes = notes || undefined;
    }

    createLog.mutate(data, {
      onSuccess: () => {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setPain(0);
          setMood(null);
          setShowFullLog(false);
          setSelectedQualities([]);
          setNotes('');
          setEsasScores(Object.fromEntries(ESAS_SYMPTOMS.map((s) => [s.key, 0])));
        }, 3000);
      },
      onError: () => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      },
    });
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mt-12 rounded-2xl border border-sage/30 bg-sage/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-sage" />
          <p className="mt-3 font-heading text-xl font-bold text-sage-dark">
            Symptoms Logged!
          </p>
          <p className="mt-2 text-sm text-charcoal-light">
            Your care team has been updated. Thank you for sharing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">
          Log Symptoms
        </h1>
        <p className="text-sm text-charcoal-light">
          Share how you are feeling so your care team can help you better.
        </p>
      </div>

      {/* Quick Log Section */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
            <Activity className="h-5 w-5 text-teal" />
          </div>
          <h2 className="font-heading text-lg font-bold text-charcoal">
            Quick Check-in
          </h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-charcoal-light">
              Pain Level
            </label>
            <PainSlider value={pain} onChange={setPain} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-charcoal-light">
              Overall Mood
            </label>
            <MoodSelector value={mood} onChange={setMood} />
          </div>
        </div>
      </div>

      {/* Full ESAS-r Log (Expandable) */}
      <div className="rounded-2xl border border-sage-light/20 bg-white shadow-sm">
        <button
          onClick={() => setShowFullLog(!showFullLog)}
          className="flex w-full items-center justify-between p-5"
        >
          <div>
            <h3 className="text-sm font-bold text-charcoal">
              Full Symptom Assessment (ESAS-r)
            </h3>
            <p className="text-xs text-charcoal-light">
              Optional: rate additional symptoms for a complete picture
            </p>
          </div>
          {showFullLog ? (
            <ChevronUp className="h-5 w-5 text-charcoal-light" />
          ) : (
            <ChevronDown className="h-5 w-5 text-charcoal-light" />
          )}
        </button>

        {showFullLog && (
          <div className="space-y-5 border-t border-sage-light/20 p-5">
            {/* ESAS Symptom Sliders */}
            {ESAS_SYMPTOMS.map((symptom) => (
              <div key={symptom.key}>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-charcoal">
                    {symptom.label}
                  </label>
                  <span className="text-xs font-bold text-charcoal-light">
                    {esasScores[symptom.key]}/10
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={esasScores[symptom.key]}
                  onChange={(e) =>
                    setEsasScores((prev) => ({
                      ...prev,
                      [symptom.key]: Number(e.target.value),
                    }))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-sage-light/30"
                  style={{ accentColor: '#2A6B6B' }}
                />
              </div>
            ))}

            {/* Pain Qualities */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-charcoal-light">
                Pain Qualities (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {PAIN_QUALITIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => toggleQuality(q)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      selectedQualities.includes(q)
                        ? 'border-teal bg-teal/10 text-teal'
                        : 'border-sage-light/30 text-charcoal-light hover:border-sage',
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-charcoal-light">
                Additional Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else you'd like to share..."
                rows={3}
                className="w-full rounded-xl border border-sage-light/30 bg-cream/30 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={mood === null || createLog.isPending}
        className="w-full rounded-xl bg-gradient-to-r from-sage to-teal py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
      >
        {createLog.isPending ? 'Logging...' : 'Submit Symptoms'}
      </button>

      {/* Recent Logs */}
      <div>
        <h3 className="mb-3 font-heading text-lg font-bold text-charcoal">
          Recent Logs
        </h3>
        <div className="space-y-3">
          {(Array.isArray(recentLogs) ? recentLogs : MOCK_RECENT_LOGS).slice(0, 5).map((log: any) => (
            <div
              key={log.id}
              className="flex items-center gap-4 rounded-xl border border-sage-light/20 bg-white p-4"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: painColor(log.pain) }}
              >
                {log.pain}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-charcoal">
                    Pain: {log.pain}/10
                  </span>
                  <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-semibold text-sage-dark">
                    {log.type === 'full' ? 'Full Log' : 'Quick Log'}
                  </span>
                </div>
                <p className="text-xs text-charcoal-light">
                  Mood: {log.mood} &middot; {relativeTime(log.logged_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
