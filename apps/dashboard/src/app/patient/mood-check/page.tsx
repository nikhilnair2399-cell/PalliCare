'use client';

import { useState } from 'react';
import {
  Brain,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Shield,
  Phone,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ───── PHQ-9 Items ───── */
const PHQ9_ITEMS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure',
  'Trouble concentrating on things like reading or watching TV',
  'Moving or speaking so slowly that others could notice, or being fidgety/restless',
  'Thoughts that you would be better off dead, or of hurting yourself',
];

/* ───── GAD-7 Items ───── */
const GAD7_ITEMS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen',
];

const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Not at all', shortLabel: 'Never' },
  { value: 1, label: 'Several days', shortLabel: 'Sometimes' },
  { value: 2, label: 'More than half the days', shortLabel: 'Often' },
  { value: 3, label: 'Nearly every day', shortLabel: 'Daily' },
];

type ScreenType = 'select' | 'phq9' | 'gad7' | 'both';

interface ScreeningResult {
  type: 'phq9' | 'gad7';
  scores: number[];
  total: number;
  severity: string;
  color: string;
  date: string;
}

const MOCK_HISTORY: ScreeningResult[] = [
  { type: 'phq9', scores: [1,1,2,2,1,0,1,1,0], total: 9, severity: 'Mild', color: '#E8A838', date: '2024-02-14' },
  { type: 'gad7', scores: [1,2,1,1,0,1,1], total: 7, severity: 'Mild', color: '#E8A838', date: '2024-02-14' },
  { type: 'phq9', scores: [2,2,2,3,2,1,2,1,0], total: 15, severity: 'Moderately severe', color: '#D4856B', date: '2024-02-01' },
  { type: 'gad7', scores: [2,2,2,2,1,2,1], total: 12, severity: 'Moderate', color: '#D4856B', date: '2024-02-01' },
];

function getSeverity(type: 'phq9' | 'gad7', total: number): { label: string; color: string; advice: string } {
  if (type === 'phq9') {
    if (total <= 4) return { label: 'Minimal', color: '#7BA68C', advice: 'Your depression symptoms are minimal. Keep doing what you are doing!' };
    if (total <= 9) return { label: 'Mild', color: '#E8A838', advice: 'You have mild symptoms. Consider talking to your care team if these persist.' };
    if (total <= 14) return { label: 'Moderate', color: '#D4856B', advice: 'Moderate symptoms detected. We recommend discussing with your care team soon.' };
    if (total <= 19) return { label: 'Moderately severe', color: '#C25A45', advice: 'Your symptoms suggest moderately severe depression. Please talk to your care team.' };
    return { label: 'Severe', color: '#9E2B2B', advice: 'Severe symptoms detected. Please contact your care team as soon as possible.' };
  }
  // GAD-7
  if (total <= 4) return { label: 'Minimal', color: '#7BA68C', advice: 'Your anxiety levels are minimal. Well done on managing your wellbeing!' };
  if (total <= 9) return { label: 'Mild', color: '#E8A838', advice: 'Mild anxiety detected. Breathing exercises and mindfulness may help.' };
  if (total <= 14) return { label: 'Moderate', color: '#D4856B', advice: 'Moderate anxiety detected. Please discuss with your care team.' };
  return { label: 'Severe', color: '#C25A45', advice: 'Severe anxiety detected. Please reach out to your care team promptly.' };
}

export default function MoodCheckPage() {
  const [mode, setMode] = useState<'home' | 'screening' | 'result'>('home');
  const [screenType, setScreenType] = useState<ScreenType>('select');
  const [currentQ, setCurrentQ] = useState(0);
  const [phq9Scores, setPhq9Scores] = useState<number[]>(new Array(9).fill(-1));
  const [gad7Scores, setGad7Scores] = useState<number[]>(new Array(7).fill(-1));
  const [activeScreen, setActiveScreen] = useState<'phq9' | 'gad7'>('phq9');
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [history] = useState<ScreeningResult[]>(MOCK_HISTORY);

  const items = activeScreen === 'phq9' ? PHQ9_ITEMS : GAD7_ITEMS;
  const scores = activeScreen === 'phq9' ? phq9Scores : gad7Scores;
  const setScores = activeScreen === 'phq9' ? setPhq9Scores : setGad7Scores;

  function startScreening(type: ScreenType) {
    setScreenType(type);
    setPhq9Scores(new Array(9).fill(-1));
    setGad7Scores(new Array(7).fill(-1));
    setCurrentQ(0);
    setResults([]);
    setShowSafetyAlert(false);
    if (type === 'phq9' || type === 'both') {
      setActiveScreen('phq9');
    } else {
      setActiveScreen('gad7');
    }
    setMode('screening');
  }

  function selectAnswer(value: number) {
    const newScores = [...scores];
    newScores[currentQ] = value;
    setScores(newScores);

    // Check for suicidal ideation (PHQ-9 item 9)
    if (activeScreen === 'phq9' && currentQ === 8 && value > 0) {
      setShowSafetyAlert(true);
    }

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQ < items.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        finishCurrentScreen(newScores);
      }
    }, 300);
  }

  function finishCurrentScreen(finalScores: number[]) {
    const total = finalScores.reduce((a, b) => Math.max(0, a) + Math.max(0, b), 0);
    const sev = getSeverity(activeScreen, total);
    const newResult: ScreeningResult = {
      type: activeScreen,
      scores: finalScores,
      total,
      severity: sev.label,
      color: sev.color,
      date: new Date().toISOString().split('T')[0],
    };

    const allResults = [...results, newResult];
    setResults(allResults);

    // If doing both, switch to GAD-7 after PHQ-9
    if (screenType === 'both' && activeScreen === 'phq9') {
      setActiveScreen('gad7');
      setCurrentQ(0);
    } else {
      setMode('result');
    }
  }

  function getTrend(type: 'phq9' | 'gad7') {
    const current = results.find((r) => r.type === type);
    const prev = history.find((h) => h.type === type);
    if (!current || !prev) return null;
    const diff = current.total - prev.total;
    if (diff < -2) return { icon: TrendingDown, label: 'Improving', color: '#7BA68C' };
    if (diff > 2) return { icon: TrendingUp, label: 'Worsening', color: '#C25A45' };
    return { icon: Minus, label: 'Stable', color: '#E8A838' };
  }

  /* ─────── HOME ─────── */
  if (mode === 'home') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Mood Check</h1>
          <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>
            Validated screenings for depression &amp; anxiety — recommended every 2 weeks
          </p>
        </div>

        {/* Screening Options */}
        <div className="space-y-3">
          {[
            { type: 'phq9' as ScreenType, title: 'Depression Screen (PHQ-9)', desc: '9 questions · ~2 minutes', icon: '🧠', badge: 'PHQ-9' },
            { type: 'gad7' as ScreenType, title: 'Anxiety Screen (GAD-7)', desc: '7 questions · ~2 minutes', icon: '💭', badge: 'GAD-7' },
            { type: 'both' as ScreenType, title: 'Complete Screening', desc: 'Both PHQ-9 + GAD-7 · ~4 minutes', icon: '🔬', badge: 'Recommended' },
          ].map((opt) => (
            <button
              key={opt.type}
              onClick={() => startScreening(opt.type)}
              className="flex w-full items-center gap-4 rounded-xl bg-white p-4 text-left transition-all hover:shadow-md"
              style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <span className="text-2xl">{opt.icon}</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>{opt.title}</p>
                <p className="text-[12px]" style={{ color: '#4A4A4A' }}>{opt.desc}</p>
              </div>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: opt.type === 'both' ? 'rgba(42,107,107,0.08)' : 'rgba(168,203,181,0.15)',
                  color: opt.type === 'both' ? '#2A6B6B' : '#4A4A4A',
                }}
              >
                {opt.badge}
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#4A4A4A' }} />
            </button>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <h2 className="mb-3 font-heading text-[16px] font-bold" style={{ color: '#2D2D2D' }}>Past Screenings</h2>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                  style={{ border: '1px solid rgba(168,203,181,0.15)' }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: h.color }}
                    />
                    <div>
                      <span className="text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>
                        {h.type === 'phq9' ? 'PHQ-9' : 'GAD-7'}
                      </span>
                      <span className="ml-2 text-[12px]" style={{ color: '#4A4A4A' }}>{h.severity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[14px] font-bold" style={{ color: h.color }}>{h.total}</span>
                    <span className="text-[11px]" style={{ color: '#4A4A4A' }}>{h.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'rgba(42,107,107,0.04)', border: '1px solid rgba(42,107,107,0.1)' }}
        >
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#2A6B6B' }} />
            <div>
              <p className="text-[13px] font-semibold" style={{ color: '#2A6B6B' }}>Your privacy matters</p>
              <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#4A4A4A' }}>
                These validated screening tools help your care team understand your emotional wellbeing.
                Results are shared only with your palliative care team to provide better support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────── SCREENING ─────── */
  if (mode === 'screening') {
    const progress = ((currentQ + 1) / items.length) * 100;
    const screenLabel = activeScreen === 'phq9' ? 'Depression Screen (PHQ-9)' : 'Anxiety Screen (GAD-7)';
    const recall = 'Over the last 2 weeks, how often have you been bothered by:';

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Safety Alert Modal */}
        {showSafetyAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#FFF0E5' }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: '#C25A45' }} />
                </div>
                <h3 className="font-heading text-[16px] font-bold" style={{ color: '#2D2D2D' }}>
                  You Are Not Alone
                </h3>
              </div>
              <p className="mb-4 text-[13px] leading-relaxed" style={{ color: '#4A4A4A' }}>
                We noticed you may be having difficult thoughts. Your care team is here to support you.
                If you are in crisis, please reach out immediately.
              </p>
              <div className="mb-4 space-y-2">
                <a
                  href="tel:9152987821"
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ backgroundColor: 'rgba(212,133,107,0.08)', border: '1px solid rgba(212,133,107,0.2)' }}
                >
                  <Phone className="h-4 w-4" style={{ color: '#C25A45' }} />
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: '#C25A45' }}>iCall: 9152987821</p>
                    <p className="text-[11px]" style={{ color: '#4A4A4A' }}>Free counseling helpline (Mon-Sat, 8am-10pm)</p>
                  </div>
                </a>
                <a
                  href="tel:08046110007"
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ backgroundColor: 'rgba(42,107,107,0.04)', border: '1px solid rgba(42,107,107,0.1)' }}
                >
                  <Phone className="h-4 w-4" style={{ color: '#2A6B6B' }} />
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: '#2A6B6B' }}>NIMHANS: 080-46110007</p>
                    <p className="text-[11px]" style={{ color: '#4A4A4A' }}>24/7 mental health helpline</p>
                  </div>
                </a>
              </div>
              <button
                onClick={() => setShowSafetyAlert(false)}
                className="w-full rounded-xl py-2.5 text-[13px] font-semibold text-white"
                style={{ backgroundColor: '#2A6B6B' }}
              >
                I understand, continue
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-[20px] font-bold" style={{ color: '#2A6B6B' }}>{screenLabel}</h1>
            <p className="mt-1 text-[12px]" style={{ color: '#4A4A4A' }}>{recall}</p>
          </div>
          <button
            onClick={() => setMode('home')}
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
            style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}
          >
            Cancel
          </button>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold" style={{ color: '#2D2D2D' }}>
              Question {currentQ + 1} of {items.length}
            </span>
            {screenType === 'both' && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: 'rgba(42,107,107,0.08)', color: '#2A6B6B' }}>
                {activeScreen === 'phq9' ? 'Part 1/2' : 'Part 2/2'}
              </span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(168,203,181,0.2)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'linear-gradient(135deg, #7BA68C, #2A6B6B)' }}
            />
          </div>
        </div>

        {/* Question */}
        <div
          className="rounded-xl bg-white p-6"
          style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <p className="mb-6 text-[15px] font-medium leading-relaxed" style={{ color: '#2D2D2D' }}>
            {items[currentQ]}
            {activeScreen === 'phq9' && currentQ === 8 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: 'rgba(212,133,107,0.1)', color: '#C25A45' }}>
                <AlertTriangle className="h-3 w-3" /> Important
              </span>
            )}
          </p>

          <div className="space-y-2.5">
            {FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value)}
                className="flex w-full items-center gap-3 rounded-xl p-3.5 text-left transition-all"
                style={{
                  border: `1px solid ${scores[currentQ] === opt.value ? '#2A6B6B' : 'rgba(168,203,181,0.2)'}`,
                  backgroundColor: scores[currentQ] === opt.value ? 'rgba(42,107,107,0.04)' : 'white',
                }}
              >
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                  style={{
                    backgroundColor: scores[currentQ] === opt.value ? '#2A6B6B' : 'rgba(168,203,181,0.15)',
                    color: scores[currentQ] === opt.value ? 'white' : '#4A4A4A',
                  }}
                >
                  {opt.value}
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: scores[currentQ] === opt.value ? '#2A6B6B' : '#2D2D2D' }}>
                    {opt.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors disabled:opacity-30"
            style={{ color: '#4A4A4A' }}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          {currentQ < items.length - 1 && scores[currentQ] >= 0 && (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors"
              style={{ color: '#2A6B6B' }}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ─────── RESULTS ─────── */
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Your Results</h1>
        <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>Screening completed on {new Date().toLocaleDateString()}</p>
      </div>

      {results.map((r) => {
        const sev = getSeverity(r.type, r.total);
        const trend = getTrend(r.type);
        const maxScore = r.type === 'phq9' ? 27 : 21;
        const pct = (r.total / maxScore) * 100;

        return (
          <div
            key={r.type}
            className="rounded-xl bg-white p-5"
            style={{ border: `1px solid ${sev.color}30`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5" style={{ color: sev.color }} />
                <h2 className="font-heading text-[16px] font-bold" style={{ color: '#2D2D2D' }}>
                  {r.type === 'phq9' ? 'Depression (PHQ-9)' : 'Anxiety (GAD-7)'}
                </h2>
              </div>
              {trend && (
                <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: trend.color }}>
                  <trend.icon className="h-3.5 w-3.5" /> {trend.label}
                </span>
              )}
            </div>

            {/* Score */}
            <div className="mb-4 flex items-end gap-2">
              <span className="font-mono text-[36px] font-bold leading-none" style={{ color: sev.color }}>
                {r.total}
              </span>
              <span className="mb-1 text-[14px]" style={{ color: '#4A4A4A' }}>/ {maxScore}</span>
              <span
                className="mb-1.5 ml-2 rounded-full px-2.5 py-0.5 text-[12px] font-bold"
                style={{ backgroundColor: `${sev.color}15`, color: sev.color }}
              >
                {sev.label}
              </span>
            </div>

            {/* Bar */}
            <div className="mb-4 h-3 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(168,203,181,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: sev.color }}
              />
            </div>

            {/* Advice */}
            <p className="text-[13px] leading-relaxed" style={{ color: '#4A4A4A' }}>{sev.advice}</p>

            {/* Per-item breakdown */}
            <details className="mt-3">
              <summary className="cursor-pointer text-[12px] font-semibold" style={{ color: '#2A6B6B' }}>
                View item scores
              </summary>
              <div className="mt-2 space-y-1.5">
                {(r.type === 'phq9' ? PHQ9_ITEMS : GAD7_ITEMS).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]" style={{ color: '#4A4A4A' }}>
                    <div
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                      style={{ backgroundColor: r.scores[i] >= 2 ? '#D4856B' : r.scores[i] >= 1 ? '#E8A838' : '#7BA68C' }}
                    >
                      {r.scores[i]}
                    </div>
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      })}

      {/* Alert if high score */}
      {results.some((r) => r.total >= 10) && (
        <div
          className="flex items-start gap-3 rounded-xl p-4"
          style={{ backgroundColor: 'rgba(212,133,107,0.06)', border: '1px solid rgba(212,133,107,0.2)' }}
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: '#C25A45' }} />
          <div>
            <p className="text-[13px] font-semibold" style={{ color: '#C25A45' }}>Your care team has been notified</p>
            <p className="mt-1 text-[12px]" style={{ color: '#4A4A4A' }}>
              Based on your scores, a notification has been sent to your palliative care team.
              They will follow up with you to discuss additional support.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setMode('home'); setResults([]); }}
          className="flex-1 rounded-xl py-3 text-[14px] font-semibold text-white"
          style={{ backgroundColor: '#2A6B6B' }}
        >
          <CheckCircle2 className="mb-0.5 mr-2 inline h-4 w-4" />
          Done
        </button>
        <button
          onClick={() => startScreening('both')}
          className="rounded-xl px-5 py-3 text-[14px] font-medium"
          style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}
        >
          Retake
        </button>
      </div>
    </div>
  );
}
