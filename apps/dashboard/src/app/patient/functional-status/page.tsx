'use client';

import { useState } from 'react';
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
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ───── Simplified PPS (Patient Self-Assessment) ───── */
interface FunctionalEntry {
  id: string;
  date: string;
  mobility: number; // 1-5
  selfCare: number; // 1-5
  eating: number; // 1-5
  awareness: number; // 1-5
  activity: number; // 1-5
  ppsEstimate: number; // 10-100 derived
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
  return Math.round(avg * 20); // 1-5 → 20-100
}

function getPPSCategory(pps: number): { label: string; color: string; desc: string } {
  if (pps >= 80) return { label: 'Good', color: '#7BA68C', desc: 'You are maintaining good functional ability' };
  if (pps >= 60) return { label: 'Moderate', color: '#E8A838', desc: 'Some functional limitations but still active' };
  if (pps >= 40) return { label: 'Limited', color: '#D4856B', desc: 'Significant limitations in daily activities' };
  return { label: 'Very Limited', color: '#C25A45', desc: 'Extensive support needed for daily activities' };
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
            <h1 className="font-heading text-[20px] font-bold" style={{ color: '#2A6B6B' }}>How Are You Doing?</h1>
            <p className="mt-1 text-[12px]" style={{ color: '#4A4A4A' }}>Tell us about your abilities this week</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-lg px-3 py-1.5 text-[12px] font-medium" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>Cancel</button>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold" style={{ color: '#2D2D2D' }}>
              {currentDomain + 1} of {DOMAINS.length}: {domain.label}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(168,203,181,0.2)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(135deg, #7BA68C, #2A6B6B)' }} />
          </div>
        </div>

        {/* Domain Question */}
        <div className="rounded-xl bg-white p-5" style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(42,107,107,0.08)' }}>
              <domain.icon className="h-5 w-5" style={{ color: '#2A6B6B' }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: '#2D2D2D' }}>{domain.label}</h2>
          </div>

          <div className="space-y-2.5">
            {domain.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectScore(opt.value)}
                className="flex w-full items-center gap-3 rounded-xl p-3.5 text-left transition-all"
                style={{
                  border: `1px solid ${scores[domain.key] === opt.value ? '#2A6B6B' : 'rgba(168,203,181,0.2)'}`,
                  backgroundColor: scores[domain.key] === opt.value ? 'rgba(42,107,107,0.04)' : 'white',
                }}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                  style={{
                    backgroundColor: scores[domain.key] === opt.value ? '#2A6B6B' : 'rgba(168,203,181,0.15)',
                    color: scores[domain.key] === opt.value ? 'white' : '#4A4A4A',
                  }}
                >
                  {opt.value}
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: scores[domain.key] === opt.value ? '#2A6B6B' : '#2D2D2D' }}>{opt.label}</p>
                  <p className="text-[11px]" style={{ color: '#4A4A4A' }}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Domain navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDomain(Math.max(0, currentDomain - 1))}
            disabled={currentDomain === 0}
            className="rounded-lg px-3 py-2 text-[13px] font-medium transition-colors disabled:opacity-30"
            style={{ color: '#4A4A4A' }}
          >
            ← Previous
          </button>
          <div className="flex gap-1.5">
            {DOMAINS.map((d, i) => (
              <button
                key={d.key}
                onClick={() => setCurrentDomain(i)}
                className="h-2.5 w-2.5 rounded-full transition-all"
                style={{
                  backgroundColor: scores[d.key] !== undefined ? '#2A6B6B' : i === currentDomain ? '#7BA68C' : 'rgba(168,203,181,0.3)',
                  transform: i === currentDomain ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          {currentDomain < DOMAINS.length - 1 ? (
            <button
              onClick={() => setCurrentDomain(currentDomain + 1)}
              className="rounded-lg px-3 py-2 text-[13px] font-medium"
              style={{ color: '#2A6B6B' }}
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
          <div className="space-y-3">
            <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)' }}>
              <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>Anything else? (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any changes you noticed this week..."
                rows={2}
                className="w-full rounded-lg px-3 py-2 text-[13px] outline-none"
                style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#2D2D2D', resize: 'vertical' }}
              />
            </div>

            {/* Preview */}
            <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(42,107,107,0.04)', border: '1px solid rgba(42,107,107,0.1)' }}>
              <p className="mb-2 text-[13px] font-semibold" style={{ color: '#2A6B6B' }}>
                Your Functional Score: {calculatePPS(scores)}%
              </p>
              <p className="text-[12px]" style={{ color: '#4A4A4A' }}>
                {getPPSCategory(calculatePPS(scores)).desc}
              </p>
            </div>

            <button
              onClick={handleSave}
              className="w-full rounded-xl py-3 text-[14px] font-semibold text-white"
              style={{ backgroundColor: '#2A6B6B' }}
            >
              <CheckCircle2 className="mb-0.5 mr-2 inline h-4 w-4" /> Save Assessment
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
          <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Functional Status</h1>
          <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>Track how you are doing with daily activities</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(!showHelp)} className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>
            <HelpCircle className="h-4 w-4" />
          </button>
          <button onClick={startAssessment} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white" style={{ backgroundColor: '#2A6B6B' }}>
            <PlusCircle className="h-4 w-4" /> Assess
          </button>
        </div>
      </div>

      {/* Help card */}
      {showHelp && (
        <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(42,107,107,0.04)', border: '1px solid rgba(42,107,107,0.1)' }}>
          <p className="text-[12px] leading-relaxed" style={{ color: '#4A4A4A' }}>
            This assessment helps your care team understand how you are managing daily activities.
            It covers 5 areas: mobility, self-care, eating, alertness, and activity level.
            We recommend completing this weekly. Your answers help tailor your care plan.
          </p>
        </div>
      )}

      {/* Current Score */}
      {latestEntry && (
        <div
          className="rounded-xl bg-white p-5 text-center"
          style={{ border: `1px solid ${ppsCat.color}25`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <p className="text-[12px] font-medium" style={{ color: '#4A4A4A' }}>Current Functional Score</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="font-mono text-[48px] font-bold leading-none" style={{ color: ppsCat.color }}>
              {currentPPS}%
            </span>
            <div className="text-left">
              <span className="rounded-full px-2.5 py-0.5 text-[12px] font-bold" style={{ backgroundColor: `${ppsCat.color}15`, color: ppsCat.color }}>
                {ppsCat.label}
              </span>
              <div className="mt-1 flex items-center gap-1 text-[11px]" style={{
                color: ppsTrend === 'improving' ? '#7BA68C' : ppsTrend === 'declining' ? '#C25A45' : '#E8A838',
              }}>
                {ppsTrend === 'improving' ? <TrendingUp className="h-3 w-3" /> : ppsTrend === 'declining' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                {ppsTrend === 'improving' ? 'Improving' : ppsTrend === 'declining' ? 'Declining' : 'Stable'}
              </div>
            </div>
          </div>
          <p className="mt-2 text-[12px]" style={{ color: '#4A4A4A' }}>{ppsCat.desc}</p>
          <p className="mt-1 text-[11px]" style={{ color: '#4A4A4A' }}>Last assessed: {latestEntry.date}</p>
        </div>
      )}

      {/* Decline alert */}
      {ppsTrend === 'declining' && (
        <div className="flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: 'rgba(212,133,107,0.06)', border: '1px solid rgba(212,133,107,0.15)' }}>
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: '#C25A45' }} />
          <div>
            <p className="text-[13px] font-semibold" style={{ color: '#C25A45' }}>Functional Decline Detected</p>
            <p className="mt-1 text-[12px]" style={{ color: '#4A4A4A' }}>
              Your care team has been notified about the change in your functional status. They will review your care plan.
            </p>
          </div>
        </div>
      )}

      {/* Domain Breakdown (latest) */}
      {latestEntry && (
        <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="mb-3 text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>Domain Breakdown</h2>
          <div className="space-y-2.5">
            {DOMAINS.map((d) => {
              const score = (latestEntry as any)[d.key] as number;
              const pct = (score / 5) * 100;
              const color = score >= 4 ? '#7BA68C' : score >= 3 ? '#E8A838' : '#D4856B';
              return (
                <div key={d.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[12px] font-medium" style={{ color: '#4A4A4A' }}>
                      <d.icon className="h-3.5 w-3.5" style={{ color }} /> {d.label}
                    </span>
                    <span className="text-[12px] font-bold" style={{ color }}>{score}/5</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(168,203,181,0.15)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h2 className="mb-3 text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>Assessment History</h2>
        <div className="space-y-2">
          {history.slice().reverse().map((h) => {
            const cat = getPPSCategory(h.ppsEstimate);
            return (
              <div key={h.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3" style={{ border: '1px solid rgba(168,203,181,0.15)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${cat.color}15` }}>
                    <span className="font-mono text-[14px] font-bold" style={{ color: cat.color }}>{h.ppsEstimate}</span>
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>{cat.label}</span>
                    {h.notes && <p className="text-[11px]" style={{ color: '#4A4A4A' }}>{h.notes}</p>}
                  </div>
                </div>
                <span className="text-[11px]" style={{ color: '#4A4A4A' }}>{h.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" /> Assessment saved!
        </div>
      )}
    </div>
  );
}
