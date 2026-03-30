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
  Smile,
  Meh,
  Frown,
  Wind,
  Heart,
  Sparkles,
  Calendar,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

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
  const [quickMood, setQuickMood] = useState<string | null>(null);

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
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
        <div>
          <h1 className="font-heading text-xl sm:text-3xl font-bold text-teal">Mood Check</h1>
          <p className="mt-1 text-base text-charcoal-light">
            Validated screenings for depression &amp; anxiety — recommended every 2 weeks
          </p>
        </div>

        {/* Quick Daily Mood Check */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
          <h2 className="text-base font-semibold text-charcoal">How are you feeling right now?</h2>
          <p className="mt-1 text-sm text-charcoal-light">A quick check-in — no quiz needed</p>
          <div className="mt-4 flex gap-3">
            {([
              { key: 'good', icon: Smile, label: 'Good', color: 'bg-sage/10 text-sage-dark border-sage/30' },
              { key: 'okay', icon: Meh, label: 'Okay', color: 'bg-amber/10 text-amber border-amber/30' },
              { key: 'low', icon: Frown, label: 'Low', color: 'bg-terra/10 text-terra border-terra/30' },
            ] as const).map((m) => (
              <button
                key={m.key}
                onClick={() => setQuickMood(m.key)}
                className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                  quickMood === m.key ? m.color : 'border-charcoal/5 bg-cream/50 text-charcoal-light'
                }`}
              >
                <m.icon className="h-7 w-7" />
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
          {quickMood && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-cream/50 p-3">
              <CheckCircle2 className="h-4 w-4 text-sage" />
              <p className="text-sm text-charcoal/70">
                {quickMood === 'good' ? 'Glad to hear! Keep doing what helps you feel well.' :
                 quickMood === 'okay' ? 'That is okay. Small moments of peace add up.' :
                 'Your care team is here for you. Consider the full screening below, or try breathing exercises.'}
              </p>
            </div>
          )}
        </div>

        {/* Wellbeing Resources */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/patient/breathe" className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Wind className="h-6 w-6 text-sage" />
            <div>
              <p className="text-sm font-semibold text-charcoal">Breathe</p>
              <p className="text-xs text-charcoal-light">Guided exercises</p>
            </div>
          </Link>
          <Link href="/patient/journey" className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Heart className="h-6 w-6 text-terra" />
            <div>
              <p className="text-sm font-semibold text-charcoal">Journey</p>
              <p className="text-xs text-charcoal-light">Gratitude & goals</p>
            </div>
          </Link>
        </div>

        {/* Sprint 52 — 14-Day Mood Log Pattern */}
        {(() => {
          const MOOD_LOG = Array.from({ length: 14 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            const moods = ['good', 'good', 'okay', 'okay', 'okay', 'low', 'good', 'okay', 'good', 'low', 'okay', 'good', 'good', 'okay'];
            return { date: d.toISOString().split('T')[0], day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], mood: moods[i] };
          });
          const moodValue: Record<string, number> = { good: 3, okay: 2, low: 1 };
          const moodColor: Record<string, string> = { good: 'bg-sage', okay: 'bg-amber', low: 'bg-terra' };
          const moodEmoji: Record<string, string> = { good: '😊', okay: '😐', low: '😔' };
          const counts = { good: 0, okay: 0, low: 0 };
          MOOD_LOG.forEach((m) => { counts[m.mood as keyof typeof counts] += 1; });
          const avgVal = MOOD_LOG.reduce((s, m) => s + moodValue[m.mood], 0) / MOOD_LOG.length;
          const first7 = MOOD_LOG.slice(0, 7);
          const last7 = MOOD_LOG.slice(7);
          const firstAvg = first7.reduce((s, m) => s + moodValue[m.mood], 0) / first7.length;
          const lastAvg = last7.reduce((s, m) => s + moodValue[m.mood], 0) / last7.length;
          const trendDir = lastAvg > firstAvg + 0.2 ? 'improving' : lastAvg < firstAvg - 0.2 ? 'declining' : 'stable';
          return (
            <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-lavender" />
                <h3 className="text-base font-semibold text-charcoal">14-Day Mood Pattern</h3>
                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  trendDir === 'improving' ? 'bg-sage/10 text-sage-dark' : trendDir === 'declining' ? 'bg-terra/10 text-terra' : 'bg-amber/10 text-amber'
                }`}>
                  {trendDir === 'improving' ? 'Improving' : trendDir === 'declining' ? 'Needs attention' : 'Steady'}
                </span>
              </div>
              {/* Grid of mood dots */}
              <div className="flex gap-1 mb-3">
                {MOOD_LOG.map((m, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${moodColor[m.mood]}/20`}>
                      {moodEmoji[m.mood]}
                    </div>
                    <span className="text-[8px] text-charcoal/40">{new Date(m.date).getDate()}</span>
                  </div>
                ))}
              </div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-2">
                {(['good', 'okay', 'low'] as const).map((m) => (
                  <div key={m} className={`rounded-xl p-2.5 text-center ${moodColor[m]}/10`}>
                    <span className="text-lg">{moodEmoji[m]}</span>
                    <p className="text-sm font-bold text-charcoal">{counts[m]}</p>
                    <p className="text-[10px] text-charcoal/40 capitalize">{m} days</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-charcoal/40">
                {avgVal >= 2.5
                  ? 'Your mood has been predominantly positive. Keep up your wellbeing practices!'
                  : avgVal >= 1.8
                  ? 'Mixed mood patterns. Consider the full PHQ-9 screening if low days persist.'
                  : 'Several low-mood days detected. Please talk to your care team or try the full screening below.'}
              </p>
            </div>
          );
        })()}

        {/* Sprint 60 — Mood Pattern Insights */}
        {(() => {
          const MOOD_LOG_RAW = Array.from({ length: 28 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (27 - i));
            const moods = ['good','okay','okay','low','good','good','okay','good','okay','low','okay','good','good','okay','low','good','good','okay','okay','good','low','okay','good','good','okay','good','okay','good'];
            return { date: d, day: d.getDay(), mood: moods[i] };
          });
          const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
          const moodVal: Record<string, number> = { good: 3, okay: 2, low: 1 };
          const dayStats = dayNames.map((name, di) => {
            const dayEntries = MOOD_LOG_RAW.filter((m) => m.day === di);
            const avg = dayEntries.length > 0 ? dayEntries.reduce((s, m) => s + moodVal[m.mood], 0) / dayEntries.length : 0;
            const goodPct = dayEntries.length > 0 ? Math.round((dayEntries.filter((m) => m.mood === 'good').length / dayEntries.length) * 100) : 0;
            return { name, avg: Math.round(avg * 10) / 10, goodPct, count: dayEntries.length };
          });
          const bestDay = dayStats.reduce((best, d) => d.avg > best.avg ? d : best, dayStats[0]);
          const worstDay = dayStats.reduce((worst, d) => d.avg < worst.avg && d.count > 0 ? d : worst, dayStats[0]);
          const weekdays = MOOD_LOG_RAW.filter((m) => m.day >= 1 && m.day <= 5);
          const weekends = MOOD_LOG_RAW.filter((m) => m.day === 0 || m.day === 6);
          const weekdayAvg = weekdays.length > 0 ? weekdays.reduce((s, m) => s + moodVal[m.mood], 0) / weekdays.length : 0;
          const weekendAvg = weekends.length > 0 ? weekends.reduce((s, m) => s + moodVal[m.mood], 0) / weekends.length : 0;
          const maxAvg = Math.max(...dayStats.map((d) => d.avg));

          return (
            <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-lavender" />
                <h3 className="text-base font-semibold text-charcoal">Mood Pattern Insights</h3>
                <span className="ml-auto text-[10px] text-charcoal/40">28 days</span>
              </div>
              {/* Day-of-week bars */}
              <div className="flex items-end gap-2 mb-4" style={{ height: '80px' }}>
                {dayStats.map((d) => {
                  const heightPct = maxAvg > 0 ? (d.avg / maxAvg) * 100 : 0;
                  const color = d.avg >= 2.5 ? 'bg-sage/60' : d.avg >= 1.8 ? 'bg-amber/60' : 'bg-terra/60';
                  return (
                    <div key={d.name} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-charcoal/50">{d.avg}</span>
                      <div
                        className={`w-full rounded-t ${color} ${d.name === bestDay.name ? 'ring-1 ring-sage' : ''}`}
                        style={{ height: `${heightPct}%`, minHeight: '4px' }}
                      />
                      <span className={`text-[9px] ${d.name === bestDay.name ? 'font-bold text-sage-dark' : 'text-charcoal/40'}`}>{d.name}</span>
                    </div>
                  );
                })}
              </div>
              {/* Insights grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-xl bg-sage/10 p-3 text-center">
                  <p className="text-xs text-charcoal/50">Best Day</p>
                  <p className="text-sm font-bold text-sage-dark">{bestDay.name}s</p>
                  <p className="text-[10px] text-charcoal/40">{bestDay.goodPct}% good moods</p>
                </div>
                <div className="rounded-xl bg-terra/10 p-3 text-center">
                  <p className="text-xs text-charcoal/50">Hardest Day</p>
                  <p className="text-sm font-bold text-terra">{worstDay.name}s</p>
                  <p className="text-[10px] text-charcoal/40">{worstDay.goodPct}% good moods</p>
                </div>
              </div>
              {/* Weekday vs Weekend */}
              <div className="flex items-center gap-3 rounded-xl bg-cream/50 p-3">
                <div className="flex-1">
                  <p className="text-xs text-charcoal/50">Weekdays</p>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream">
                    <div className={`h-full rounded-full ${weekdayAvg >= 2.5 ? 'bg-sage' : weekdayAvg >= 1.8 ? 'bg-amber' : 'bg-terra'}`} style={{ width: `${(weekdayAvg / 3) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-charcoal/40">vs</span>
                <div className="flex-1">
                  <p className="text-xs text-charcoal/50">Weekends</p>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream">
                    <div className={`h-full rounded-full ${weekendAvg >= 2.5 ? 'bg-sage' : weekendAvg >= 1.8 ? 'bg-amber' : 'bg-terra'}`} style={{ width: `${(weekendAvg / 3) * 100}%` }} />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-charcoal/40">
                {weekendAvg > weekdayAvg + 0.3
                  ? 'You tend to feel better on weekends. Consider what weekday routines might be adding stress.'
                  : weekdayAvg > weekendAvg + 0.3
                  ? 'Weekdays seem easier for you. Social engagement during the week may be helping.'
                  : 'Your mood is fairly consistent throughout the week. This stability is a positive sign.'}
              </p>
            </div>
          );
        })()}

        {/* Emotional Wellness Pattern */}
        {history.length >= 2 && (() => {
          const phq9s = history.filter(h => h.type === 'phq9');
          const gad7s = history.filter(h => h.type === 'gad7');
          const latestPhq9 = phq9s[0];
          const latestGad7 = gad7s[0];
          const prevPhq9 = phq9s[1];
          const prevGad7 = gad7s[1];

          const itemLabels: Record<string, string[]> = {
            phq9: ['Interest', 'Mood', 'Sleep', 'Energy', 'Appetite', 'Self-image', 'Focus', 'Restlessness', 'Thoughts'],
            gad7: ['Nervous', 'Worry Control', 'Over-worry', 'Relaxing', 'Restless', 'Irritable', 'Fearful'],
          };

          // Find the worst items from latest screenings
          const topConcerns: { label: string; score: number; screen: string }[] = [];
          if (latestPhq9) {
            latestPhq9.scores.forEach((s, i) => {
              if (s >= 2) topConcerns.push({ label: itemLabels.phq9[i], score: s, screen: 'PHQ-9' });
            });
          }
          if (latestGad7) {
            latestGad7.scores.forEach((s, i) => {
              if (s >= 2) topConcerns.push({ label: itemLabels.gad7[i], score: s, screen: 'GAD-7' });
            });
          }
          topConcerns.sort((a, b) => b.score - a.score);

          return (
            <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-lavender" />
                <h3 className="text-base font-semibold text-charcoal">Emotional Wellness Pattern</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl bg-lavender/10 p-3 text-center">
                  <p className="text-xs text-charcoal/50 mb-1">Depression</p>
                  <p className="font-heading text-base sm:text-xl font-bold text-charcoal">{latestPhq9?.total ?? '—'}/27</p>
                  {prevPhq9 && latestPhq9 && (
                    <p className={`text-xs font-medium mt-1 ${latestPhq9.total < prevPhq9.total ? 'text-sage-dark' : latestPhq9.total > prevPhq9.total ? 'text-terra' : 'text-charcoal/40'}`}>
                      {latestPhq9.total < prevPhq9.total ? `↓ ${prevPhq9.total - latestPhq9.total} from last` : latestPhq9.total > prevPhq9.total ? `↑ ${latestPhq9.total - prevPhq9.total} from last` : 'Stable'}
                    </p>
                  )}
                </div>
                <div className="rounded-xl bg-amber/10 p-3 text-center">
                  <p className="text-xs text-charcoal/50 mb-1">Anxiety</p>
                  <p className="font-heading text-base sm:text-xl font-bold text-charcoal">{latestGad7?.total ?? '—'}/21</p>
                  {prevGad7 && latestGad7 && (
                    <p className={`text-xs font-medium mt-1 ${latestGad7.total < prevGad7.total ? 'text-sage-dark' : latestGad7.total > prevGad7.total ? 'text-terra' : 'text-charcoal/40'}`}>
                      {latestGad7.total < prevGad7.total ? `↓ ${prevGad7.total - latestGad7.total} from last` : latestGad7.total > prevGad7.total ? `↑ ${latestGad7.total - prevGad7.total} from last` : 'Stable'}
                    </p>
                  )}
                </div>
              </div>
              {topConcerns.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">Areas Needing Attention</p>
                  <div className="flex flex-wrap gap-2">
                    {topConcerns.slice(0, 4).map((c, i) => (
                      <span key={i} className="rounded-full bg-terra/10 px-2.5 py-0.5 text-xs font-medium text-terra">
                        {c.label} ({c.score}/3)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Full Screening Options */}
        <h2 className="text-base font-semibold text-charcoal">Full Screening</h2>
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

        {/* Sprint 39 — Screening Score Trend */}
        {history.length >= 2 && (() => {
          const phq9History = history.filter(h => h.type === 'phq9');
          const gad7History = history.filter(h => h.type === 'gad7');
          const maxScore = 27;
          return (
            <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
              <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-teal">
                <TrendingDown className="h-5 w-5" /> Score Trend
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'PHQ-9 (Depression)', data: phq9History, max: 27, color: 'bg-lavender' },
                  { label: 'GAD-7 (Anxiety)', data: gad7History, max: 21, color: 'bg-amber' },
                ].filter(s => s.data.length > 0).map(series => (
                  <div key={series.label}>
                    <p className="text-xs font-semibold text-charcoal/50 mb-2">{series.label}</p>
                    <div className="flex items-end gap-3">
                      {series.data.map((h, i) => {
                        const pct = (h.total / series.max) * 100;
                        const sev = getSeverity(h.type, h.total);
                        return (
                          <div key={i} className="flex flex-1 flex-col items-center gap-1">
                            <span className={`text-xs font-bold ${sev.cls}`}>{h.total}</span>
                            <div className="w-full rounded-t overflow-hidden bg-cream" style={{ height: '48px' }}>
                              <div className={`w-full rounded-t ${series.color} opacity-70`} style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
                            </div>
                            <span className="text-[9px] text-charcoal/40">{h.date.slice(5)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-charcoal/40">Lower scores = better. Complete regular screenings to see your trend.</p>
            </div>
          );
        })()}

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
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
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
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-teal">{screenLabel}</h1>
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
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-heading text-xl sm:text-3xl font-bold text-teal">Your Results</h1>
        <p className="text-base text-charcoal-light">Screening completed on {new Date().toLocaleDateString()}</p>
      </div>

      {results.map((r) => {
        const sev = getSeverity(r.type, r.total);
        const trend = getTrend(r.type);
        const maxScore = r.type === 'phq9' ? 27 : 21;
        const pct = (r.total / maxScore) * 100;

        return (
          <div key={r.type} className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
