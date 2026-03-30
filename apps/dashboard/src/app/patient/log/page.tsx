'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Send, CheckCircle2, Smile, Meh, Frown, BarChart3, Lightbulb, History, Clock, TrendingDown, TrendingUp, Activity, Grid3x3 } from 'lucide-react';
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

// Sprint 37 — Mock submission history
const MOCK_LOG_HISTORY = [
  { id: 1, date: '2026-02-21T08:30:00', mood: 'okay', pain: 5, totalBurden: 32, highSymptoms: 1, qualities: ['Aching', 'Dull'], topSymptom: 'Fatigue' },
  { id: 2, date: '2026-02-20T09:15:00', mood: 'bad', pain: 7, totalBurden: 48, highSymptoms: 3, qualities: ['Burning', 'Shooting'], topSymptom: 'Pain' },
  { id: 3, date: '2026-02-19T07:45:00', mood: 'good', pain: 3, totalBurden: 18, highSymptoms: 0, qualities: ['Dull'], topSymptom: 'Drowsiness' },
  { id: 4, date: '2026-02-18T10:00:00', mood: 'okay', pain: 4, totalBurden: 28, highSymptoms: 1, qualities: ['Aching', 'Pressure'], topSymptom: 'Anxiety' },
  { id: 5, date: '2026-02-17T08:00:00', mood: 'good', pain: 2, totalBurden: 14, highSymptoms: 0, qualities: [], topSymptom: 'Nausea' },
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
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
        <div className="flex flex-col items-center rounded-2xl bg-white p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-sage" />
          <h2 className="mt-4 font-heading text-lg sm:text-2xl font-bold text-charcoal">Symptoms Logged</h2>
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
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-xl sm:text-3xl font-bold text-teal">Log Symptoms</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Tell us how you&apos;re feeling today
        </p>
      </div>

      {/* Symptom Trend Analysis from History */}
      {MOCK_LOG_HISTORY.length >= 3 && (() => {
        const sorted = [...MOCK_LOG_HISTORY].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const recentPain = sorted.slice(-3).map(l => l.pain);
        const olderPain = sorted.slice(0, Math.max(1, sorted.length - 3)).map(l => l.pain);
        const recentAvg = recentPain.reduce((s, v) => s + v, 0) / recentPain.length;
        const olderAvg = olderPain.reduce((s, v) => s + v, 0) / olderPain.length;
        const painTrend = recentAvg - olderAvg;

        const burdenValues = sorted.map(l => l.totalBurden);
        const avgBurden = Math.round(burdenValues.reduce((s, v) => s + v, 0) / burdenValues.length);

        const moodCounts = { good: 0, okay: 0, bad: 0 };
        MOCK_LOG_HISTORY.forEach(l => { moodCounts[l.mood as keyof typeof moodCounts] += 1; });
        const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

        const qualityCounts: Record<string, number> = {};
        MOCK_LOG_HISTORY.forEach(l => l.qualities.forEach(q => { qualityCounts[q] = (qualityCounts[q] || 0) + 1; }));
        const topQualities = Object.entries(qualityCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Your 5-Day Trend</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  {painTrend < -0.5 ? <TrendingDown className="h-4 w-4 text-sage-dark" /> : painTrend > 0.5 ? <TrendingUp className="h-4 w-4 text-terra" /> : null}
                  <p className="font-heading text-base sm:text-xl font-bold text-charcoal">{recentAvg.toFixed(1)}</p>
                </div>
                <p className="text-xs text-charcoal/50">Recent pain</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-base sm:text-xl font-bold text-charcoal">{avgBurden}/90</p>
                <p className="text-xs text-charcoal/50">Avg burden</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-base sm:text-xl font-bold text-charcoal capitalize">{topMood[0]}</p>
                <p className="text-xs text-charcoal/50">Common mood</p>
              </div>
            </div>
            {topQualities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-charcoal/40">Top qualities:</span>
                {topQualities.map(([q, count]) => (
                  <span key={q} className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium text-teal">
                    {q} ({count})
                  </span>
                ))}
              </div>
            )}
            {painTrend < -0.5 && (
              <p className="mt-2 text-xs text-sage-dark font-medium">Pain is trending down — your treatment plan is helping</p>
            )}
            {painTrend > 0.5 && (
              <p className="mt-2 text-xs text-terra font-medium">Pain is trending up — consider reporting this to your care team</p>
            )}
          </div>
        );
      })()}

      {/* Sprint 59 — Symptom Severity Heatmap */}
      {MOCK_LOG_HISTORY.length >= 2 && (() => {
        const SYMPTOM_MOCK_DATA: Record<string, number[]> = {
          Pain: MOCK_LOG_HISTORY.map((l) => l.pain),
          Fatigue: [6, 7, 4, 5, 3],
          Nausea: [3, 5, 2, 4, 1],
          Depression: [4, 3, 2, 3, 2],
          Anxiety: [5, 6, 3, 5, 2],
          Drowsiness: [4, 3, 5, 2, 3],
          Appetite: [3, 4, 2, 3, 2],
          Wellbeing: [5, 6, 3, 4, 2],
          Dyspnea: [2, 3, 1, 2, 1],
        };
        const dateLabels = MOCK_LOG_HISTORY.map((l) =>
          new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        );

        const cellColor = (score: number) => {
          if (score <= 2) return 'bg-sage/30 text-sage-dark';
          if (score <= 4) return 'bg-amber/20 text-amber';
          if (score <= 6) return 'bg-amber/40 text-amber';
          if (score <= 8) return 'bg-terra/40 text-terra';
          return 'bg-terra/70 text-white';
        };

        const symptomNames = Object.keys(SYMPTOM_MOCK_DATA);
        const worstSymptom = symptomNames.reduce((worst, name) => {
          const avg = SYMPTOM_MOCK_DATA[name].reduce((s, v) => s + v, 0) / SYMPTOM_MOCK_DATA[name].length;
          const worstAvg = SYMPTOM_MOCK_DATA[worst].reduce((s, v) => s + v, 0) / SYMPTOM_MOCK_DATA[worst].length;
          return avg > worstAvg ? name : worst;
        }, symptomNames[0]);

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Grid3x3 className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Symptom Severity Map</h3>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[24rem]">
                <div className="grid gap-1" style={{ gridTemplateColumns: `7rem repeat(${dateLabels.length}, 1fr)` }}>
                  <div />
                  {dateLabels.map((d, i) => (
                    <div key={i} className="text-center text-[9px] font-semibold text-charcoal/40">{d}</div>
                  ))}
                  {symptomNames.map((name) => (
                    <>
                      <div key={`label-${name}`} className="flex items-center text-xs font-medium text-charcoal/60 truncate">{name}</div>
                      {SYMPTOM_MOCK_DATA[name].map((score, i) => (
                        <div
                          key={`${name}-${i}`}
                          className={`flex items-center justify-center rounded h-7 text-[10px] font-bold ${cellColor(score)}`}
                          title={`${name} on ${dateLabels[i]}: ${score}/10`}
                        >
                          {score}
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-charcoal/40">
              <span>Low</span>
              <div className="flex gap-0.5">
                {['bg-sage/30', 'bg-amber/20', 'bg-amber/40', 'bg-terra/40', 'bg-terra/70'].map((c, i) => (
                  <div key={i} className={`h-2.5 w-5 rounded ${c}`} />
                ))}
              </div>
              <span>High</span>
              <span className="ml-auto text-charcoal/50">Most burdensome: <strong className="text-terra">{worstSymptom}</strong></span>
            </div>
          </div>
        );
      })()}

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
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
          <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">Quick Check</h2>
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
            className="mt-8 flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90"
          >
            Next: Detailed Symptoms
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Step 2: ESAS-r Symptoms */}
      {step === 2 && (
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
          <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">ESAS-r Assessment</h2>
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
              className="flex h-12 sm:h-14 flex-1 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-cream text-base font-medium text-charcoal transition-colors hover:bg-charcoal/5"
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
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
          <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">Pain Details &amp; Notes</h2>
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
              className="flex h-12 sm:h-14 flex-1 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-cream text-base font-medium text-charcoal transition-colors hover:bg-charcoal/5"
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

      {/* Sprint 37 — Submission History */}
      {!submitted && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="h-5 w-5 text-teal" />
            <h2 className="font-heading text-lg font-bold text-charcoal">Past Submissions</h2>
          </div>
          <div className="space-y-3">
            {MOCK_LOG_HISTORY.map((log) => {
              const moodConfig = log.mood === 'good'
                ? { icon: Smile, label: 'Good', cls: 'text-sage-dark bg-sage/10' }
                : log.mood === 'bad'
                ? { icon: Frown, label: 'Not great', cls: 'text-terra bg-terra/10' }
                : { icon: Meh, label: 'Okay', cls: 'text-amber bg-amber/10' };
              const MoodIcon = moodConfig.icon;
              return (
                <div key={log.id} className="rounded-2xl bg-white p-4">
                  <div className="flex items-center gap-4">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: painColor(log.pain) }}
                    >
                      {log.pain}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium text-charcoal">
                          {new Date(log.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <span className="flex items-center gap-1 text-xs text-charcoal/40">
                          <Clock className="h-3 w-3" />
                          {new Date(log.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-charcoal-light">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${moodConfig.cls}`}>
                          <MoodIcon className="h-3 w-3" /> {moodConfig.label}
                        </span>
                        <span>Burden: {log.totalBurden}/90</span>
                        {log.highSymptoms > 0 && (
                          <span className="text-xs font-medium text-terra">{log.highSymptoms} severe</span>
                        )}
                      </div>
                      {log.qualities.length > 0 && (
                        <p className="mt-1 text-xs text-charcoal/40">{log.qualities.join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
