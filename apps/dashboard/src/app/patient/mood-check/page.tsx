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
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

type ScreenType = 'select' | 'phq9' | 'gad7' | 'both';

interface ScreeningResult {
  type: 'phq9' | 'gad7';
  scores: number[];
  total: number;
  severity: string;
  colorClass: string;
  date: string;
}

const MOCK_HISTORY: ScreeningResult[] = [
  { type: 'phq9', scores: [1,1,2,2,1,0,1,1,0], total: 9, severity: 'Mild', colorClass: 'text-amber bg-amber/10', date: '2024-02-14' },
  { type: 'gad7', scores: [1,2,1,1,0,1,1], total: 7, severity: 'Mild', colorClass: 'text-amber bg-amber/10', date: '2024-02-14' },
  { type: 'phq9', scores: [2,2,2,3,2,1,2,1,0], total: 15, severity: 'Moderately severe', colorClass: 'text-terra bg-terra/10', date: '2024-02-01' },
  { type: 'gad7', scores: [2,2,2,2,1,2,1], total: 12, severity: 'Moderate', colorClass: 'text-terra bg-terra/10', date: '2024-02-01' },
];

function getSeverity(type: 'phq9' | 'gad7', total: number) {
  if (type === 'phq9') {
    if (total <= 4) return { label: 'Minimal', cls: 'text-sage-dark', bgCls: 'bg-sage/10', advice: 'Your depression symptoms are minimal. Keep doing what you are doing!' };
    if (total <= 9) return { label: 'Mild', cls: 'text-amber', bgCls: 'bg-amber/10', advice: 'You have mild symptoms. Consider talking to your care team if these persist.' };
    if (total <= 14) return { label: 'Moderate', cls: 'text-terra', bgCls: 'bg-terra/10', advice: 'Moderate symptoms detected. We recommend discussing with your care team soon.' };
    if (total <= 19) return { label: 'Moderately severe', cls: 'text-alert-critical', bgCls: 'bg-alert-critical/10', advice: 'Your symptoms suggest moderately severe depression. Please talk to your care team.' };
    return { label: 'Severe', cls: 'text-alert-critical', bgCls: 'bg-alert-critical/10', advice: 'Severe symptoms detected. Please contact your care team as soon as possible.' };
  }
  if (total <= 4) return { label: 'Minimal', cls: 'text-sage-dark', bgCls: 'bg-sage/10', advice: 'Your anxiety levels are minimal. Well done on managing your wellbeing!' };
  if (total <= 9) return { label: 'Mild', cls: 'text-amber', bgCls: 'bg-amber/10', advice: 'Mild anxiety detected. Breathing exercises and mindfulness may help.' };
  if (total <= 14) return { label: 'Moderate', cls: 'text-terra', bgCls: 'bg-terra/10', advice: 'Moderate anxiety detected. Please discuss with your care team.' };
  return { label: 'Severe', cls: 'text-alert-critical', bgCls: 'bg-alert-critical/10', advice: 'Severe anxiety detected. Please reach out to your care team promptly.' };
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
  const [history] = useState(MOCK_HISTORY);

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
    setActiveScreen(type === 'gad7' ? 'gad7' : 'phq9');
    setMode('screening');
  }

  function selectAnswer(value: number) {
    const newScores = [...scores];
    newScores[currentQ] = value;
    setScores(newScores);
    if (activeScreen === 'phq9' && currentQ === 8 && value > 0) setShowSafetyAlert(true);
    setTimeout(() => {
      if (currentQ < items.length - 1) setCurrentQ(currentQ + 1);
      else finishCurrentScreen(newScores);
    }, 300);
  }

  function finishCurrentScreen(finalScores: number[]) {
    const total = finalScores.reduce((a, b) => Math.max(0, a) + Math.max(0, b), 0);
    const sev = getSeverity(activeScreen, total);
    const newResult: ScreeningResult = {
      type: activeScreen, scores: finalScores, total, severity: sev.label,
      colorClass: `${sev.cls} ${sev.bgCls}`, date: new Date().toISOString().split('T')[0],
    };
    const allResults = [...results, newResult];
    setResults(allResults);
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
    if (diff < -2) return { icon: TrendingDown, label: 'Improving', cls: 'text-sage-dark' };
    if (diff > 2) return { icon: TrendingUp, label: 'Worsening', cls: 'text-alert-critical' };
    return { icon: Minus, label: 'Stable', cls: 'text-amber' };
  }

  /* ─── HOME ─── */
  if (mode === 'home') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-teal">Mood Check</h1>
          <p className="mt-1 text-base text-charcoal-light">
            Validated screenings for depression &amp; anxiety — recommended every 2 weeks
          </p>
        </div>

        <div className="space-y-3">
          {([
            { type: 'phq9' as ScreenType, title: 'Depression Screen (PHQ-9)', desc: '9 questions · ~2 minutes', badge: 'PHQ-9' },
            { type: 'gad7' as ScreenType, title: 'Anxiety Screen (GAD-7)', desc: '7 questions · ~2 minutes', badge: 'GAD-7' },
            { type: 'both' as ScreenType, title: 'Complete Screening', desc: 'Both PHQ-9 + GAD-7 · ~4 minutes', badge: 'Recommended' },
          ]).map((opt) => (
            <button
              key={opt.type}
              onClick={() => startScreening(opt.type)}
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left transition-all hover:bg-white/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lavender/20">
                <Brain className="h-5 w-5 text-charcoal" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-charcoal">{opt.title}</p>
                <p className="text-sm text-charcoal-light">{opt.desc}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${opt.type === 'both' ? 'bg-teal/10 text-teal' : 'bg-sage/10 text-charcoal-light'}`}>
                {opt.badge}
              </span>
              <ChevronRight className="h-4 w-4 text-charcoal-light" />
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <div className="rounded-2xl bg-white">
            <div className="px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-teal">Past Screenings</h2>
            </div>
            <div className="divide-y divide-charcoal/5">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${h.colorClass}`}>
                      {h.type === 'phq9' ? 'PHQ-9' : 'GAD-7'}
                    </span>
                    <span className="text-sm text-charcoal-light">{h.severity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-charcoal">{h.total}</span>
                    <span className="text-sm text-charcoal-light">{h.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-2xl bg-teal/5 p-5">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal" />
          <p className="text-sm leading-relaxed text-charcoal-light">
            These validated screening tools help your care team understand your emotional wellbeing.
            Results are shared only with your palliative care team.
          </p>
        </div>
      </div>
    );
  }

  /* ─── SCREENING ─── */
  if (mode === 'screening') {
    const progress = ((currentQ + 1) / items.length) * 100;
    const screenLabel = activeScreen === 'phq9' ? 'Depression Screen (PHQ-9)' : 'Anxiety Screen (GAD-7)';

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Safety Alert */}
        {showSafetyAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-alert-critical/10">
                  <AlertTriangle className="h-5 w-5 text-alert-critical" />
                </div>
                <h3 className="font-heading text-lg font-bold text-charcoal">You Are Not Alone</h3>
              </div>
              <p className="mb-4 text-base leading-relaxed text-charcoal-light">
                We noticed you may be having difficult thoughts. Your care team is here to support you.
              </p>
              <div className="mb-4 space-y-2">
                <a href="tel:9152987821" className="flex items-center gap-3 rounded-2xl bg-alert-critical/5 p-4">
                  <Phone className="h-4 w-4 text-alert-critical" />
                  <div>
                    <p className="text-base font-semibold text-alert-critical">iCall: 9152987821</p>
                    <p className="text-sm text-charcoal-light">Free counseling helpline (Mon-Sat, 8am-10pm)</p>
                  </div>
                </a>
                <a href="tel:08046110007" className="flex items-center gap-3 rounded-2xl bg-teal/5 p-4">
                  <Phone className="h-4 w-4 text-teal" />
                  <div>
                    <p className="text-base font-semibold text-teal">NIMHANS: 080-46110007</p>
                    <p className="text-sm text-charcoal-light">24/7 mental health helpline</p>
                  </div>
                </a>
              </div>
              <button onClick={() => setShowSafetyAlert(false)} className="w-full rounded-2xl bg-teal py-3.5 text-base font-semibold text-white">
                I understand, continue
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">{screenLabel}</h1>
            <p className="mt-1 text-sm text-charcoal-light">Over the last 2 weeks, how often have you been bothered by:</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-xl bg-cream px-4 py-2 text-sm font-medium text-charcoal-light hover:bg-charcoal/5">
            Cancel
          </button>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-charcoal">Question {currentQ + 1} of {items.length}</span>
            {screenType === 'both' && (
              <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-medium text-teal">
                {activeScreen === 'phq9' ? 'Part 1/2' : 'Part 2/2'}
              </span>
            )}
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-gradient-to-r from-sage to-teal transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl bg-white p-6">
          <p className="mb-6 text-base font-medium leading-relaxed text-charcoal">
            {items[currentQ]}
            {activeScreen === 'phq9' && currentQ === 8 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-alert-critical/10 px-2 py-0.5 text-[10px] font-semibold text-alert-critical">
                <AlertTriangle className="h-3 w-3" /> Important
              </span>
            )}
          </p>
          <div className="space-y-2.5">
            {FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  scores[currentQ] === opt.value
                    ? 'border-teal bg-teal/5'
                    : 'border-charcoal/10 hover:border-charcoal/20'
                }`}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  scores[currentQ] === opt.value ? 'bg-teal text-white' : 'bg-cream text-charcoal-light'
                }`}>
                  {opt.value}
                </div>
                <span className={`text-base font-medium ${scores[currentQ] === opt.value ? 'text-teal' : 'text-charcoal'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="flex items-center gap-1 text-base font-medium text-charcoal-light disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          {currentQ < items.length - 1 && scores[currentQ] >= 0 && (
            <button onClick={() => setCurrentQ(currentQ + 1)} className="flex items-center gap-1 text-base font-medium text-teal">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ─── RESULTS ─── */
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Your Results</h1>
        <p className="text-base text-charcoal-light">Screening completed on {new Date().toLocaleDateString()}</p>
      </div>

      {results.map((r) => {
        const sev = getSeverity(r.type, r.total);
        const trend = getTrend(r.type);
        const maxScore = r.type === 'phq9' ? 27 : 21;
        const pct = (r.total / maxScore) * 100;

        return (
          <div key={r.type} className="rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-charcoal">
                <Brain className={`h-5 w-5 ${sev.cls}`} />
                {r.type === 'phq9' ? 'Depression (PHQ-9)' : 'Anxiety (GAD-7)'}
              </h2>
              {trend && (
                <span className={`flex items-center gap-1 text-sm font-medium ${trend.cls}`}>
                  <trend.icon className="h-3.5 w-3.5" /> {trend.label}
                </span>
              )}
            </div>

            <div className="mb-4 flex items-end gap-2">
              <span className={`font-mono text-4xl font-bold ${sev.cls}`}>{r.total}</span>
              <span className="mb-1 text-base text-charcoal-light">/ {maxScore}</span>
              <span className={`mb-1.5 ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${sev.bgCls} ${sev.cls}`}>{sev.label}</span>
            </div>

            <div className="mb-4 h-3 overflow-hidden rounded-full bg-cream">
              <div className={`h-full rounded-full transition-all duration-500 ${sev.cls === 'text-sage-dark' ? 'bg-sage' : sev.cls === 'text-amber' ? 'bg-amber' : sev.cls === 'text-terra' ? 'bg-terra' : 'bg-alert-critical'}`} style={{ width: `${pct}%` }} />
            </div>

            <p className="text-base leading-relaxed text-charcoal-light">{sev.advice}</p>

            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-teal">View item scores</summary>
              <div className="mt-2 space-y-1.5">
                {(r.type === 'phq9' ? PHQ9_ITEMS : GAD7_ITEMS).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-charcoal-light">
                    <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${r.scores[i] >= 2 ? 'bg-terra' : r.scores[i] >= 1 ? 'bg-amber' : 'bg-sage'}`}>
                      {r.scores[i]}
                    </span>
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      })}

      {results.some((r) => r.total >= 10) && (
        <div className="flex items-start gap-3 rounded-2xl bg-alert-critical/5 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-alert-critical" />
          <div>
            <p className="text-base font-semibold text-alert-critical">Your care team has been notified</p>
            <p className="mt-1 text-sm text-charcoal-light">
              Based on your scores, a notification has been sent to your palliative care team.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={() => { setMode('home'); setResults([]); }} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-teal py-4 text-base font-semibold text-white hover:bg-teal/90">
          <CheckCircle2 className="h-5 w-5" /> Done
        </button>
        <button onClick={() => startScreening('both')} className="rounded-2xl bg-cream px-6 py-4 text-base font-medium text-charcoal-light hover:bg-charcoal/5">
          Retake
        </button>
      </div>
    </div>
  );
}
