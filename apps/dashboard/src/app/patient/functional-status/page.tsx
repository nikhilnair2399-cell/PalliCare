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
  BarChart3,
  Target,
  Award,
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

      {/* Sprint 50 — Domain-Level Trend Analysis */}
      {history.length >= 2 && (
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-teal" />
            <h2 className="text-base font-semibold text-charcoal">Domain Trends</h2>
          </div>
          <div className="space-y-3">
            {DOMAINS.map((d) => {
              const scores = history.map((h) => (h as any)[d.key] as number);
              const first = scores[0];
              const last = scores[scores.length - 1];
              const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length * 10) / 10;
              const diff = last - first;
              const maxScore = Math.max(...scores);
              const minScore = Math.min(...scores);
              return (
                <div key={d.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-charcoal/70">
                      <d.icon className="h-3.5 w-3.5 text-charcoal/40" /> {d.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-charcoal/40">avg {avg}</span>
                      <span className={clsx(
                        'text-xs font-bold',
                        diff > 0 ? 'text-sage' : diff < 0 ? 'text-terra' : 'text-charcoal/30',
                      )}>
                        {diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {scores.map((sc, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className={clsx('w-full rounded', domainBg(sc))}
                          style={{ height: `${Math.max(4, (sc / 5) * 20)}px`, opacity: 0.6 + (i / scores.length) * 0.4 }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[8px] text-charcoal/30">range: {minScore}–{maxScore}</span>
                    <span className="text-[8px] text-charcoal/30">{scores.length} assessments</span>
                  </div>
                </div>
              );
            })}
          </div>
          {(() => {
            const improving = DOMAINS.filter(d => {
              const sc = history.map(h => (h as any)[d.key] as number);
              return sc[sc.length - 1] > sc[0];
            });
            const declining = DOMAINS.filter(d => {
              const sc = history.map(h => (h as any)[d.key] as number);
              return sc[sc.length - 1] < sc[0];
            });
            return (
              <div className="mt-3 flex items-center gap-3 text-[10px] border-t border-charcoal/5 pt-2">
                {improving.length > 0 && (
                  <span className="text-sage">
                    {improving.map(d => d.label).join(', ')} improving
                  </span>
                )}
                {declining.length > 0 && (
                  <span className="text-terra">
                    {declining.map(d => d.label).join(', ')} declining
                  </span>
                )}
                {improving.length === 0 && declining.length === 0 && (
                  <span className="text-charcoal/40">All domains stable</span>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Sprint 57 — Functional Goal Tracker */}
      {latestEntry && (() => {
        const DOMAIN_GOALS: Record<string, { low: string; mid: string; high: string }> = {
          mobility: { low: 'Sit up in bed for 10 minutes daily', mid: 'Walk to the bathroom independently', high: 'Take a short walk outside daily' },
          selfCare: { low: 'Brush teeth independently', mid: 'Bathe with minimal assistance', high: 'Complete all self-care independently' },
          eating: { low: 'Take 3-4 sips of fluid every hour', mid: 'Eat at least one small meal daily', high: 'Eat regular balanced meals' },
          awareness: { low: 'Stay alert for family visits', mid: 'Read or watch TV for 30 minutes', high: 'Engage in conversations throughout day' },
          activity: { low: 'Listen to music or radio daily', mid: 'Do a light hobby for 20 minutes', high: 'Resume a favourite activity regularly' },
        };
        const goals = DOMAINS.map((d) => {
          const score = (latestEntry as any)[d.key] as number;
          const goalMap = DOMAIN_GOALS[d.key];
          const goal = score <= 2 ? goalMap.low : score <= 3 ? goalMap.mid : goalMap.high;
          const achieved = score >= 4;
          const prevScore = prevEntry ? (prevEntry as any)[d.key] as number : score;
          const improving = score > prevScore;
          return { domain: d, score, goal, achieved, improving };
        });
        const achievedCount = goals.filter((g) => g.achieved).length;
        const improvingCount = goals.filter((g) => g.improving).length;

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-teal" />
                <h2 className="text-base font-semibold text-charcoal">Your Functional Goals</h2>
              </div>
              <span className="text-xs text-charcoal/40">{achievedCount}/{goals.length} achieved</span>
            </div>
            <div className="space-y-2.5">
              {goals.map((g) => (
                <div
                  key={g.domain.key}
                  className={clsx(
                    'rounded-xl border p-3 transition-colors',
                    g.achieved ? 'border-sage/20 bg-sage/5' : 'border-charcoal/5 bg-white',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <g.domain.icon className={clsx('h-3.5 w-3.5', g.achieved ? 'text-sage' : 'text-charcoal/40')} />
                    <span className="text-xs font-semibold text-charcoal/60">{g.domain.label}</span>
                    {g.achieved && <CheckCircle2 className="h-3.5 w-3.5 text-sage ml-auto" />}
                    {!g.achieved && g.improving && <TrendingUp className="h-3.5 w-3.5 text-amber ml-auto" />}
                  </div>
                  <p className={clsx('text-sm', g.achieved ? 'text-sage-dark font-medium' : 'text-charcoal/70')}>{g.goal}</p>
                  {!g.achieved && (
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream">
                      <div
                        className={clsx('h-full rounded-full', g.improving ? 'bg-amber' : 'bg-charcoal/15')}
                        style={{ width: `${(g.score / 5) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] border-t border-charcoal/5 pt-2">
              <span className="text-sage">{achievedCount} goal{achievedCount !== 1 ? 's' : ''} achieved</span>
              {improvingCount > 0 && <span className="text-amber">{improvingCount} improving</span>}
              <span className="text-charcoal/30 ml-auto">Goals adjust based on your scores</span>
            </div>
          </div>
        );
      })()}

      {/* Sprint 64 — Functional Independence Score */}
      {latestEntry && (() => {
        const weights: Record<string, number> = { mobility: 0.25, selfCare: 0.25, eating: 0.20, awareness: 0.15, activity: 0.15 };
        const weightedScore = DOMAINS.reduce((sum, d) => {
          const score = (latestEntry as any)[d.key] as number;
          return sum + score * (weights[d.key] || 0.2);
        }, 0);
        const fisPercent = Math.round((weightedScore / 5) * 100);
        const prevFIS = prevEntry ? Math.round(
          (DOMAINS.reduce((sum, d) => sum + ((prevEntry as any)[d.key] as number) * (weights[d.key] || 0.2), 0) / 5) * 100
        ) : null;
        const fisDiff = prevFIS !== null ? fisPercent - prevFIS : 0;
        const level = fisPercent >= 80 ? { label: 'High Independence', color: 'text-sage', ring: 'stroke-sage', bg: 'bg-sage/10' }
          : fisPercent >= 60 ? { label: 'Moderate Independence', color: 'text-amber', ring: 'stroke-amber', bg: 'bg-amber/10' }
          : fisPercent >= 40 ? { label: 'Low Independence', color: 'text-terra', ring: 'stroke-terra', bg: 'bg-terra/10' }
          : { label: 'Dependent', color: 'text-alert-critical', ring: 'stroke-alert-critical', bg: 'bg-alert-critical/10' };

        const domainContributions = DOMAINS.map((d) => {
          const score = (latestEntry as any)[d.key] as number;
          const contribution = Math.round((score * (weights[d.key] || 0.2) / weightedScore) * 100);
          return { label: d.label, key: d.key, score, weight: weights[d.key], contribution, Icon: d.icon };
        }).sort((a, b) => b.contribution - a.contribution);

        const strongestDomain = domainContributions[0];
        const weakestDomain = domainContributions[domainContributions.length - 1];

        // Arc for ring gauge
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const strokeDash = (fisPercent / 100) * circumference;

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className={clsx('h-4 w-4', level.color)} />
              <h2 className="text-base font-semibold text-charcoal">Functional Independence Score</h2>
            </div>
            <div className="flex items-center gap-6">
              {/* Ring gauge */}
              <div className="relative flex-shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" className="stroke-cream" />
                  <circle
                    cx="50" cy="50" r={radius} fill="none" strokeWidth="8"
                    className={level.ring}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - strokeDash}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={clsx('text-xl font-bold', level.color)}>{fisPercent}</span>
                  <span className="text-[8px] text-charcoal/40">/ 100</span>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1">
                <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-bold', level.bg, level.color)}>
                  {level.label}
                </span>
                {prevFIS !== null && (
                  <p className={clsx('mt-1.5 text-xs font-semibold',
                    fisDiff > 0 ? 'text-sage' : fisDiff < 0 ? 'text-terra' : 'text-charcoal/40'
                  )}>
                    {fisDiff > 0 ? `+${fisDiff}` : fisDiff < 0 ? `${fisDiff}` : '±0'} pts from last assessment
                  </p>
                )}
                <p className="mt-1 text-xs text-charcoal/50">
                  Weighted composite of all 5 functional domains
                </p>
              </div>
            </div>
            {/* Domain contribution breakdown */}
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-semibold text-charcoal/40 uppercase">Domain Contributions</p>
              {domainContributions.map((dc) => (
                <div key={dc.key} className="flex items-center gap-2">
                  <dc.Icon className="h-3.5 w-3.5 text-charcoal/40 flex-shrink-0" />
                  <span className="text-xs text-charcoal/60 w-28">{dc.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-cream overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', domainBg(dc.score))}
                      style={{ width: `${dc.contribution}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-charcoal/50 w-8 text-right">{dc.contribution}%</span>
                  <span className="text-[9px] text-charcoal/30 w-6 text-right">×{dc.weight}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] border-t border-charcoal/5 pt-2">
              <span className="text-sage">Strongest: {strongestDomain.label}</span>
              <span className="text-terra">Focus area: {weakestDomain.label}</span>
              <span className="text-charcoal/30 ml-auto">Mobility & self-care weighted highest</span>
            </div>
          </div>
        );
      })()}

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
