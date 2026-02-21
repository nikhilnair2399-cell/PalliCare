'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  HelpCircle,
  Footprints,
  Hand,
  Utensils,
  Brain,
  Lightbulb,
  Heart,
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ───── Domain Score Color Helpers ───── */
function domainText(score: number): string {
  if (score >= 4) return 'text-sage';
  if (score >= 3) return 'text-amber';
  return 'text-terra';
}

function domainBg(score: number): string {
  if (score >= 4) return 'bg-sage';
  if (score >= 3) return 'bg-amber';
  return 'bg-terra';
}

/* ───── PPS Category ───── */
function getPPSCategory(pps: number) {
  if (pps >= 80) return { label: 'Good', text: 'text-sage', bg: 'bg-sage', lightBg: 'bg-sage/10', border: 'border-sage/20', desc: 'You are maintaining good functional ability' };
  if (pps >= 60) return { label: 'Moderate', text: 'text-amber', bg: 'bg-amber', lightBg: 'bg-amber/10', border: 'border-amber/20', desc: 'Some functional limitations but still active' };
  if (pps >= 40) return { label: 'Limited', text: 'text-terra', bg: 'bg-terra', lightBg: 'bg-terra/10', border: 'border-terra/20', desc: 'Significant limitations in daily activities' };
  return { label: 'Very Limited', text: 'text-alert-critical', bg: 'bg-alert-critical', lightBg: 'bg-alert-critical/10', border: 'border-alert-critical/20', desc: 'Extensive support needed for daily activities' };
}

/* ───── Simplified PPS (Patient Self-Assessment) ───── */
interface FunctionalEntry {
  id: string;
  date: string;
  mobility: number;
  selfCare: number;
  eating: number;
  awareness: number;
  activity: number;
  ppsEstimate: number;
  notes: string;
}

const DOMAINS = [
  {
    key: 'mobility',
    label: 'Getting Around',
    icon: Footprints,
    options: [
      { value: 5, label: 'Walking freely', desc: 'I can walk outside and do normal activities' },
      { value: 4, label: 'Walking with rest', desc: 'I walk but need to rest often' },
      { value: 3, label: 'Mostly sitting', desc: 'I spend most of the day in a chair' },
      { value: 2, label: 'Mostly in bed', desc: 'I am in bed most of the day but can sit up' },
      { value: 1, label: 'Bed-bound', desc: 'I cannot get out of bed' },
    ],
  },
  {
    key: 'selfCare',
    label: 'Taking Care of Myself',
    icon: Hand,
    options: [
      { value: 5, label: 'Fully independent', desc: 'I can bathe, dress, and groom myself' },
      { value: 4, label: 'Mostly independent', desc: 'I need a little help sometimes' },
      { value: 3, label: 'Need regular help', desc: 'I need help with bathing or dressing' },
      { value: 2, label: 'Need a lot of help', desc: 'I need help with most personal care' },
      { value: 1, label: 'Total care needed', desc: 'I need full help with everything' },
    ],
  },
  {
    key: 'eating',
    label: 'Eating & Drinking',
    icon: Utensils,
    options: [
      { value: 5, label: 'Normal eating', desc: 'I eat regular meals without problems' },
      { value: 4, label: 'Slightly reduced', desc: 'I eat less than usual but still eating' },
      { value: 3, label: 'Reduced intake', desc: 'I can only eat small amounts' },
      { value: 2, label: 'Sips only', desc: 'I can only take small sips of fluid' },
      { value: 1, label: 'Mouth care only', desc: 'I cannot eat or drink' },
    ],
  },
  {
    key: 'awareness',
    label: 'Thinking & Alertness',
    icon: Brain,
    options: [
      { value: 5, label: 'Fully alert', desc: 'I am alert and can think clearly' },
      { value: 4, label: 'Mostly alert', desc: 'I am usually alert, sometimes drowsy' },
      { value: 3, label: 'Often drowsy', desc: 'I feel drowsy or confused at times' },
      { value: 2, label: 'Very drowsy', desc: 'I am drowsy most of the time' },
      { value: 1, label: 'Unresponsive', desc: 'I am barely awake' },
    ],
  },
  {
    key: 'activity',
    label: 'Daily Activities',
    icon: Activity,
    options: [
      { value: 5, label: 'Normal activities', desc: 'I can do my usual activities and hobbies' },
      { value: 4, label: 'Light activities', desc: 'I can do some light activities with effort' },
      { value: 3, label: 'Very limited', desc: 'I can only do a little, like reading or watching TV' },
      { value: 2, label: 'Minimal', desc: 'I am too tired for most activities' },
      { value: 1, label: 'None', desc: 'I cannot do any activities' },
    ],
  },
];

function calculatePPS(scores: Record<string, number>): number {
  const avg = Object.values(scores).reduce((s, v) => s + v, 0) / Object.values(scores).length;
  return Math.round(avg * 20);
}

/* ───── Mock History ───── */
const MOCK_HISTORY: FunctionalEntry[] = [
  { id: 'fs-1', date: '2024-02-07', mobility: 4, selfCare: 4, eating: 4, awareness: 5, activity: 3, ppsEstimate: 80, notes: '' },
  { id: 'fs-2', date: '2024-02-14', mobility: 3, selfCare: 4, eating: 3, awareness: 4, activity: 3, ppsEstimate: 68, notes: 'Feeling more tired this week' },
  { id: 'fs-3', date: '2024-02-21', mobility: 3, selfCare: 3, eating: 4, awareness: 4, activity: 3, ppsEstimate: 68, notes: '' },
];

export default function FunctionalStatusPage() {
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [mode, setMode] = useState<'home' | 'assess'>('home');
  const [currentDomain, setCurrentDomain] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const prevEntry = history.length > 1 ? history[history.length - 2] : null;
  const currentPPS = latestEntry?.ppsEstimate || 0;
  const ppsCat = getPPSCategory(currentPPS);
  const ppsTrend = latestEntry && prevEntry
    ? latestEntry.ppsEstimate > prevEntry.ppsEstimate + 5 ? 'improving' :
      latestEntry.ppsEstimate < prevEntry.ppsEstimate - 5 ? 'declining' : 'stable'
    : 'stable';

  function startAssessment() {
    setScores({});
    setCurrentDomain(0);
    setNotes('');
    setMode('assess');
  }

  function selectScore(value: number) {
    const domain = DOMAINS[currentDomain];
    const newScores = { ...scores, [domain.key]: value };
    setScores(newScores);

    setTimeout(() => {
      if (currentDomain < DOMAINS.length - 1) {
        setCurrentDomain(currentDomain + 1);
      }
    }, 300);
  }

  function handleSave() {
    const pps = calculatePPS(scores);
    const entry: FunctionalEntry = {
      id: `fs-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mobility: scores.mobility || 3,
      selfCare: scores.selfCare || 3,
      eating: scores.eating || 3,
      awareness: scores.awareness || 3,
      activity: scores.activity || 3,
      ppsEstimate: pps,
      notes,
    };
    setHistory((prev) => [...prev, entry]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setMode('home'); }, 2000);
  }

  const allAnswered = DOMAINS.every((d) => scores[d.key] !== undefined);

  /* ─────── ASSESSMENT ─────── */
  if (mode === 'assess') {
    const domain = DOMAINS[currentDomain];
    const progress = ((currentDomain + 1) / DOMAINS.length) * 100;

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">How Are You Doing?</h1>
            <p className="mt-1 text-sm text-charcoal-light">Tell us about your abilities this week</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-xl bg-cream px-4 py-2 text-sm font-medium text-charcoal-light hover:bg-charcoal/5">Cancel</button>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-charcoal">
              {currentDomain + 1} of {DOMAINS.length}: {domain.label}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage to-teal transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Domain Question */}
        <div className="rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10">
              <domain.icon className="h-5 w-5 text-teal" />
            </div>
            <h2 className="text-lg font-bold text-charcoal">{domain.label}</h2>
          </div>

          <div className="space-y-2.5">
            {domain.options.map((opt) => {
              const isSelected = scores[domain.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectScore(opt.value)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                    isSelected ? 'border-teal bg-teal/5' : 'border-charcoal/10 bg-white',
                  )}
                >
                  <div
                    className={clsx(
                      'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      isSelected ? 'bg-teal text-white' : 'bg-cream text-charcoal-light',
                    )}
                  >
                    {opt.value}
                  </div>
                  <div>
                    <p className={clsx('text-base font-semibold', isSelected ? 'text-teal' : 'text-charcoal')}>{opt.label}</p>
                    <p className="text-sm text-charcoal-light">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Domain navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDomain(Math.max(0, currentDomain - 1))}
            disabled={currentDomain === 0}
            className="rounded-lg px-3 py-2 text-base font-medium text-charcoal-light transition-colors disabled:opacity-30"
          >
            ← Previous
          </button>
          <div className="flex gap-1.5">
            {DOMAINS.map((d, i) => (
              <button
                key={d.key}
                onClick={() => setCurrentDomain(i)}
                className={clsx(
                  'h-2.5 w-2.5 rounded-full transition-all',
                  scores[d.key] !== undefined ? 'bg-teal' : i === currentDomain ? 'bg-sage' : 'bg-charcoal/15',
                  i === currentDomain && 'scale-125',
                )}
              />
            ))}
          </div>
          {currentDomain < DOMAINS.length - 1 ? (
            <button
              onClick={() => setCurrentDomain(currentDomain + 1)}
              className="rounded-lg px-3 py-2 text-base font-medium text-teal"
            >
              Next →
            </button>
          ) : allAnswered ? (
            <div />
          ) : (
            <div className="w-16" />
          )}
        </div>

        {/* Submit when all answered */}
        {allAnswered && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5">
              <label className="mb-1.5 block text-sm font-semibold text-charcoal-light">Anything else? (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any changes you noticed this week..."
                rows={2}
                className="w-full resize-y rounded-xl border border-charcoal/10 px-4 py-3 text-base text-charcoal outline-none placeholder:text-charcoal/30 focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>

            {/* Preview */}
            <div className="rounded-2xl bg-teal/5 p-5">
              <p className="mb-2 text-base font-semibold text-teal">
                Your Functional Score: {calculatePPS(scores)}%
              </p>
              <p className="text-sm text-charcoal-light">
                {getPPSCategory(calculatePPS(scores)).desc}
              </p>
            </div>

            <button
              onClick={handleSave}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90"
            >
              <CheckCircle2 className="h-5 w-5" /> Save Assessment
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─────── HOME ─────── */
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-teal">Functional Status</h1>
          <p className="mt-1 text-base text-charcoal-light">Track how you are doing with daily activities</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(!showHelp)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-charcoal-light">
            <HelpCircle className="h-4 w-4" />
          </button>
          <button onClick={startAssessment} className="flex items-center gap-1.5 rounded-2xl bg-teal px-5 py-3 text-base font-semibold text-white">
            <PlusCircle className="h-4 w-4" /> Assess
          </button>
        </div>
      </div>

      {/* Help card */}
      {showHelp && (
        <div className="rounded-2xl bg-teal/5 p-5">
          <p className="text-sm leading-relaxed text-charcoal-light">
            This assessment helps your care team understand how you are managing daily activities.
            It covers 5 areas: mobility, self-care, eating, alertness, and activity level.
            We recommend completing this weekly. Your answers help tailor your care plan.
          </p>
        </div>
      )}

      {/* Current Score */}
      {latestEntry && (
        <div className="rounded-2xl bg-white p-6 text-center">
          <p className="text-sm font-medium text-charcoal-light">Current Functional Score</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className={clsx('font-mono text-5xl font-bold leading-none', ppsCat.text)}>
              {currentPPS}%
            </span>
            <div className="text-left">
              <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-bold', ppsCat.lightBg, ppsCat.text)}>
                {ppsCat.label}
              </span>
              <div className={clsx(
                'mt-1 flex items-center gap-1 text-sm',
                ppsTrend === 'improving' ? 'text-sage' : ppsTrend === 'declining' ? 'text-alert-critical' : 'text-amber',
              )}>
                {ppsTrend === 'improving' ? <TrendingUp className="h-3 w-3" /> : ppsTrend === 'declining' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                {ppsTrend === 'improving' ? 'Improving' : ppsTrend === 'declining' ? 'Declining' : 'Stable'}
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-charcoal-light">{ppsCat.desc}</p>
          <p className="mt-1 text-sm text-charcoal-light">Last assessed: {latestEntry.date}</p>
        </div>
      )}

      {/* Decline alert */}
      {ppsTrend === 'declining' && (
        <div className="flex items-start gap-3 rounded-2xl bg-alert-critical/5 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-alert-critical" />
          <div>
            <p className="text-base font-semibold text-alert-critical">Functional Decline Detected</p>
            <p className="mt-1 text-sm text-charcoal-light">
              Your care team has been notified about the change in your functional status. They will review your care plan.
            </p>
          </div>
        </div>
      )}

      {/* Domain Breakdown (latest) */}
      {latestEntry && (
        <div className="rounded-2xl bg-white p-5">
          <h2 className="mb-3 text-base font-semibold text-charcoal">Domain Breakdown</h2>
          <div className="space-y-3">
            {DOMAINS.map((d) => {
              const score = (latestEntry as any)[d.key] as number;
              const pct = (score / 5) * 100;
              return (
                <div key={d.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-charcoal-light">
                      <d.icon className={clsx('h-3.5 w-3.5', domainText(score))} /> {d.label}
                    </span>
                    <span className={clsx('text-sm font-bold', domainText(score))}>{score}/5</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-cream">
                    <div
                      className={clsx('h-full rounded-full transition-all', domainBg(score))}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sprint 43 — Domain Change Comparison (latest vs previous) */}
      {latestEntry && prevEntry && (
        <div className="rounded-2xl bg-white p-5">
          <h2 className="mb-3 text-base font-semibold text-charcoal">Week-over-Week Change</h2>
          <div className="space-y-2.5">
            {DOMAINS.map((d) => {
              const curr = (latestEntry as any)[d.key] as number;
              const prev = (prevEntry as any)[d.key] as number;
              const diff = curr - prev;
              return (
                <div key={d.key} className="flex items-center gap-3">
                  <d.icon className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
                  <span className="text-sm text-charcoal/60 w-32">{d.label}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-charcoal/40 w-6 text-right">{prev}</span>
                    <div className="flex-1 h-2 bg-cream rounded-full relative overflow-hidden">
                      <div className={clsx('h-full rounded-full', domainBg(curr))} style={{ width: `${(curr / 5) * 100}%` }} />
                    </div>
                    <span className={clsx('text-xs font-bold w-6', domainText(curr))}>{curr}</span>
                  </div>
                  <span className={clsx(
                    'text-xs font-bold min-w-[32px] text-right',
                    diff > 0 ? 'text-sage' : diff < 0 ? 'text-terra' : 'text-charcoal/30',
                  )}>
                    {diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
          {(() => {
            const improved = DOMAINS.filter(d => (latestEntry as any)[d.key] > (prevEntry as any)[d.key]).length;
            const declined = DOMAINS.filter(d => (latestEntry as any)[d.key] < (prevEntry as any)[d.key]).length;
            return (
              <p className="mt-3 text-xs text-charcoal/40">
                {improved > 0 && `${improved} domain${improved > 1 ? 's' : ''} improved`}
                {improved > 0 && declined > 0 && ' · '}
                {declined > 0 && `${declined} domain${declined > 1 ? 's' : ''} declined`}
                {improved === 0 && declined === 0 && 'No change across domains'}
              </p>
            );
          })()}
        </div>
      )}

      {/* PPS Trend Mini-Chart */}
      {history.length >= 2 && (
        <div className="rounded-2xl bg-white p-5">
          <h2 className="mb-3 text-base font-semibold text-charcoal">PPS Trend</h2>
          <div className="flex items-end gap-2" style={{ height: '100px' }}>
            {history.map((h) => {
              const cat = getPPSCategory(h.ppsEstimate);
              const pct = h.ppsEstimate;
              return (
                <div key={h.id} className="flex flex-1 flex-col items-center gap-1">
                  <span className={clsx('text-[10px] font-bold', cat.text)}>{h.ppsEstimate}%</span>
                  <div
                    className={clsx('w-full rounded-t-lg transition-all', cat.bg)}
                    style={{ height: `${pct}%`, minHeight: '4px' }}
                  />
                  <span className="text-[8px] text-charcoal-light">
                    {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
          {history.length >= 3 && (() => {
            const first = history[0].ppsEstimate;
            const last = history[history.length - 1].ppsEstimate;
            const diff = last - first;
            return (
              <p className={clsx('mt-3 text-center text-xs font-medium',
                diff > 5 ? 'text-sage' : diff < -5 ? 'text-terra' : 'text-charcoal/50'
              )}>
                {diff > 5 ? `+${diff}% overall improvement` : diff < -5 ? `${diff}% overall decline` : 'Overall stable trend'}
                {' '}across {history.length} assessments
              </p>
            );
          })()}
        </div>
      )}

      {/* Encouragement & Tips */}
      {latestEntry && (
        <div className="rounded-2xl bg-teal/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-teal" />
            <h2 className="text-base font-semibold text-charcoal">Tips for You</h2>
          </div>
          <div className="space-y-2">
            {[
              ppsTrend === 'improving' && 'Your function is improving — keep up the great work!',
              ppsTrend === 'stable' && 'Maintaining stability is a positive sign. Consistency matters.',
              (latestEntry as any).mobility <= 2 && 'Gentle bed exercises can help maintain muscle strength. Ask your physiotherapist.',
              (latestEntry as any).selfCare <= 2 && 'It is okay to accept help. Focus your energy on things that bring you joy.',
              (latestEntry as any).eating <= 2 && 'Small sips and soft foods can help. Your dietitian can suggest options.',
              (latestEntry as any).awareness <= 3 && 'Drowsiness can be a medication effect. Mention this to your care team.',
              (latestEntry as any).activity <= 2 && 'Even light activities like listening to music or talking with family are meaningful.',
              currentPPS >= 60 && 'Your functional level allows for light activities. Gentle walks can boost mood.',
            ].filter(Boolean).slice(0, 3).map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <Heart className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-teal" />
                <p className="text-sm text-charcoal/70">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-charcoal">Assessment History</h2>
        <div className="space-y-3">
          {history.slice().reverse().map((h) => {
            const cat = getPPSCategory(h.ppsEstimate);
            return (
              <div key={h.id} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', cat.lightBg)}>
                    <span className={clsx('font-mono text-sm font-bold', cat.text)}>{h.ppsEstimate}</span>
                  </div>
                  <div>
                    <span className="text-base font-semibold text-charcoal">{cat.label}</span>
                    {h.notes && <p className="text-sm text-charcoal-light">{h.notes}</p>}
                  </div>
                </div>
                <span className="text-sm text-charcoal-light">{h.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-2xl bg-teal px-5 py-3 text-base font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" /> Assessment saved!
        </div>
      )}
    </div>
  );
}
