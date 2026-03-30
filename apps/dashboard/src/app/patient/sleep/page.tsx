'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Moon, Sun, Clock, TrendingUp, TrendingDown, Minus, PlusCircle, AlertCircle, CheckCircle2, Lightbulb, Activity, Layers, Grid3x3 } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ───── Quality Color Helpers ───── */
function qualityText(q: number): string {
  if (q <= 3) return 'text-alert-critical';
  if (q <= 5) return 'text-terra';
  if (q <= 7) return 'text-amber';
  return 'text-sage';
}

function qualityBg(q: number): string {
  if (q <= 3) return 'bg-alert-critical';
  if (q <= 5) return 'bg-terra';
  if (q <= 7) return 'bg-amber';
  return 'bg-sage';
}

function qualityLightBg(q: number): string {
  if (q <= 3) return 'bg-alert-critical/10';
  if (q <= 5) return 'bg-terra/10';
  if (q <= 7) return 'bg-amber/10';
  return 'bg-sage/10';
}

/* ───── Mock Sleep History (14 days) ───── */
const MOCK_SLEEP_HISTORY = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const bedH = 21 + Math.floor(Math.random() * 3);
  const bedM = Math.floor(Math.random() * 60);
  const wakeH = 5 + Math.floor(Math.random() * 3);
  const wakeM = Math.floor(Math.random() * 60);
  const quality = Math.max(1, Math.min(10, Math.round(5 + (Math.random() - 0.5) * 6)));
  const disturbances: string[] = [];
  if (Math.random() > 0.5) disturbances.push('Pain');
  if (Math.random() > 0.6) disturbances.push('Nausea');
  if (Math.random() > 0.7) disturbances.push('Anxiety');
  if (Math.random() > 0.8) disturbances.push('Bathroom');
  const totalHours = ((24 - bedH + wakeH) * 60 + (wakeM - bedM)) / 60;
  return {
    id: `sleep-${i}`,
    date: d.toISOString().split('T')[0],
    bedtime: `${bedH.toString().padStart(2, '0')}:${bedM.toString().padStart(2, '0')}`,
    wake_time: `${wakeH.toString().padStart(2, '0')}:${wakeM.toString().padStart(2, '0')}`,
    quality,
    total_hours: Math.round(totalHours * 10) / 10,
    disturbances,
    sleep_med: Math.random() > 0.7,
    notes: '',
  };
});

const DISTURBANCE_OPTIONS = [
  { id: 'pain', label: 'Pain', emoji: '🔥' },
  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'bathroom', label: 'Bathroom', emoji: '🚻' },
  { id: 'breathing', label: 'Breathing', emoji: '😤' },
  { id: 'noise', label: 'Noise', emoji: '🔊' },
  { id: 'temperature', label: 'Temperature', emoji: '🌡️' },
  { id: 'nightmares', label: 'Nightmares', emoji: '😱' },
];

export default function SleepPage() {
  const [history, setHistory] = useState(MOCK_SLEEP_HISTORY);
  const [mode, setMode] = useState<'home' | 'log'>('home');
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [quality, setQuality] = useState(5);
  const [disturbances, setDisturbances] = useState<string[]>([]);
  const [sleepMed, setSleepMed] = useState(false);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const avgQuality = history.length > 0 ? Math.round((history.reduce((s, h) => s + h.quality, 0) / history.length) * 10) / 10 : 0;
  const avgHours = history.length > 0 ? Math.round((history.reduce((s, h) => s + h.total_hours, 0) / history.length) * 10) / 10 : 0;
  const recentWeek = history.slice(-7);
  const prevWeek = history.slice(-14, -7);
  const recentAvg = recentWeek.length > 0 ? recentWeek.reduce((s, h) => s + h.quality, 0) / recentWeek.length : 0;
  const prevAvg = prevWeek.length > 0 ? prevWeek.reduce((s, h) => s + h.quality, 0) / prevWeek.length : 0;
  const trend = recentAvg > prevAvg + 0.5 ? 'improving' : recentAvg < prevAvg - 0.5 ? 'worsening' : 'stable';

  const distCounts: Record<string, number> = {};
  history.forEach((h) => h.disturbances.forEach((d) => { distCounts[d] = (distCounts[d] || 0) + 1; }));
  const topDisturbance = Object.entries(distCounts).sort((a, b) => b[1] - a[1])[0];

  function toggleDisturbance(id: string) {
    setDisturbances((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  }

  function calcHours(bed: string, wake: string): number {
    const [bH, bM] = bed.split(':').map(Number);
    const [wH, wM] = wake.split(':').map(Number);
    let mins = (wH * 60 + wM) - (bH * 60 + bM);
    if (mins < 0) mins += 24 * 60;
    return Math.round((mins / 60) * 10) / 10;
  }

  function handleSave() {
    const entry = {
      id: `sleep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wake_time: wakeTime,
      quality,
      total_hours: calcHours(bedtime, wakeTime),
      disturbances,
      sleep_med: sleepMed,
      notes,
    };
    setHistory((prev) => [...prev, entry]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setMode('home'); }, 2000);
  }

  /* ─────── LOG NEW ENTRY ─────── */
  if (mode === 'log') {
    return (
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl sm:text-3xl font-bold text-teal">Log Sleep</h1>
            <p className="mt-1 text-base text-charcoal-light">How did you sleep last night?</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-xl bg-cream px-4 py-2 text-sm font-medium text-charcoal-light hover:bg-charcoal/5">
            Cancel
          </button>
        </div>

        {/* Bedtime & Wake time */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-charcoal-light">
                <Moon className="h-4 w-4 text-teal" /> Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full rounded-xl border border-charcoal/10 px-4 py-3 text-base font-medium text-charcoal outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-charcoal-light">
                <Sun className="h-4 w-4 text-amber" /> Wake Up
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-xl border border-charcoal/10 px-4 py-3 text-base font-medium text-charcoal outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-teal/5 py-3">
            <Clock className="h-4 w-4 text-teal" />
            <span className="text-base font-semibold text-teal">
              {calcHours(bedtime, wakeTime)} hours of sleep
            </span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
          <label className="mb-3 block text-base font-semibold text-charcoal">
            Sleep Quality: <span className={qualityText(quality)}>{quality}/10</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-teal"
          />
          <div className="mt-1 flex justify-between text-xs text-charcoal-light">
            <span>Very poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Disturbances */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
          <p className="mb-3 text-base font-semibold text-charcoal">What disturbed your sleep?</p>
          <div className="flex flex-wrap gap-2">
            {DISTURBANCE_OPTIONS.map((opt) => {
              const isSelected = disturbances.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleDisturbance(opt.id)}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all',
                    isSelected ? 'border-teal bg-teal/5 text-teal' : 'border-charcoal/10 bg-white text-charcoal-light',
                  )}
                >
                  <span>{opt.emoji}</span> {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sleep medication */}
        <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
          <span className="text-base font-semibold text-charcoal">Took sleep medication?</span>
          <button
            onClick={() => setSleepMed(!sleepMed)}
            className={clsx('relative h-6 w-10 sm:h-7 sm:w-12 rounded-full transition-colors', sleepMed ? 'bg-teal' : 'bg-charcoal/20')}
          >
            <span
              className={clsx(
                'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                sleepMed && 'translate-x-5',
              )}
            />
          </button>
        </div>

        {/* Notes */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
          <label className="mb-1.5 block text-sm font-semibold text-charcoal-light">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else about your sleep..."
            rows={2}
            className="w-full resize-y rounded-xl border border-charcoal/10 px-4 py-3 text-base text-charcoal outline-none placeholder:text-charcoal/30 focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90"
        >
          <CheckCircle2 className="h-5 w-5" /> Save Sleep Log
        </button>
      </div>
    );
  }

  /* ─────── HOME / DASHBOARD ─────── */
  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-3xl font-bold text-teal">Sleep Tracker</h1>
          <p className="mt-1 text-base text-charcoal-light">Track your sleep patterns to help manage symptoms</p>
        </div>
        <button
          onClick={() => setMode('log')}
          className="flex items-center gap-1.5 rounded-2xl bg-teal px-5 py-3 text-base font-semibold text-white"
        >
          <PlusCircle className="h-4 w-4" /> Log Sleep
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Avg Quality', value: `${avgQuality}/10`, textCls: qualityText(avgQuality), icon: Moon },
          { label: 'Avg Duration', value: `${avgHours}h`, textCls: avgHours >= 6 ? 'text-sage' : 'text-terra', icon: Clock },
          {
            label: 'Trend',
            value: trend === 'improving' ? 'Better' : trend === 'worsening' ? 'Worse' : 'Stable',
            textCls: trend === 'improving' ? 'text-sage' : trend === 'worsening' ? 'text-alert-critical' : 'text-amber',
            icon: trend === 'improving' ? TrendingUp : trend === 'worsening' ? TrendingDown : Minus,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl bg-white p-4"
          >
            <stat.icon className={clsx('mb-1 h-4 w-4', stat.textCls)} />
            <span className={clsx('font-mono text-xl font-bold', stat.textCls)}>{stat.value}</span>
            <span className="text-xs font-medium text-charcoal-light">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Top disturbance */}
      {topDisturbance && (
        <div className="flex items-center gap-3 rounded-2xl bg-terra/5 px-5 py-4">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-terra" />
          <p className="text-sm text-charcoal-light">
            Most common sleep disturbance: <strong className="text-charcoal">{topDisturbance[0]}</strong> ({topDisturbance[1]} of {history.length} nights)
          </p>
        </div>
      )}

      {/* Sprint 41 — Sleep vs Pain Correlation Insight */}
      {(() => {
        const painNights = history.filter((h) => h.disturbances.includes('Pain'));
        const noPainNights = history.filter((h) => !h.disturbances.includes('Pain'));
        if (painNights.length === 0 || noPainNights.length === 0) return null;
        const avgPainQ = Math.round(painNights.reduce((s, h) => s + h.quality, 0) / painNights.length * 10) / 10;
        const avgNoPainQ = Math.round(noPainNights.reduce((s, h) => s + h.quality, 0) / noPainNights.length * 10) / 10;
        const avgPainH = Math.round(painNights.reduce((s, h) => s + h.total_hours, 0) / painNights.length * 10) / 10;
        const avgNoPainH = Math.round(noPainNights.reduce((s, h) => s + h.total_hours, 0) / noPainNights.length * 10) / 10;
        const qualityDiff = Math.round((avgNoPainQ - avgPainQ) * 10) / 10;
        const hoursDiff = Math.round((avgNoPainH - avgPainH) * 10) / 10;
        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-terra" />
              <h2 className="text-base font-semibold text-charcoal">Pain vs Sleep Correlation</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-terra/5 p-4 text-center">
                <p className="text-xs font-semibold text-terra uppercase mb-1">Nights with Pain</p>
                <p className="text-lg font-bold text-charcoal">{avgPainQ}/10</p>
                <p className="text-xs text-charcoal/50">quality · {avgPainH}h avg</p>
                <p className="text-[10px] text-charcoal/40 mt-1">{painNights.length} nights</p>
              </div>
              <div className="rounded-xl bg-sage/5 p-4 text-center">
                <p className="text-xs font-semibold text-sage-dark uppercase mb-1">Pain-Free Nights</p>
                <p className="text-lg font-bold text-charcoal">{avgNoPainQ}/10</p>
                <p className="text-xs text-charcoal/50">quality · {avgNoPainH}h avg</p>
                <p className="text-[10px] text-charcoal/40 mt-1">{noPainNights.length} nights</p>
              </div>
            </div>
            {/* Visual comparison bars */}
            <div className="mt-4 space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-charcoal/50">Quality comparison</span>
                  <span className={clsx('font-bold', qualityDiff > 0 ? 'text-sage' : 'text-terra')}>
                    {qualityDiff > 0 ? '+' : ''}{qualityDiff} without pain
                  </span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-terra/60" style={{ width: `${avgPainQ * 10}%` }} />
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-sage/60" style={{ width: `${avgNoPainQ * 10}%` }} />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-charcoal/50">Duration comparison</span>
                  <span className={clsx('font-bold', hoursDiff > 0 ? 'text-sage' : 'text-terra')}>
                    {hoursDiff > 0 ? '+' : ''}{hoursDiff}h without pain
                  </span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-terra/60" style={{ width: `${Math.min(avgPainH / 10 * 100, 100)}%` }} />
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-sage/60" style={{ width: `${Math.min(avgNoPainH / 10 * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              {qualityDiff > 1
                ? 'Pain significantly impacts your sleep quality. Share this with your care team to discuss pain management before bed.'
                : qualityDiff > 0
                ? 'Pain has a moderate effect on your sleep. Pre-bedtime pain medication may help.'
                : 'Pain does not appear to significantly affect your sleep quality — great resilience!'}
            </p>
          </div>
        );
      })()}

      {/* Week-over-Week Comparison */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
        <h2 className="mb-3 text-base font-semibold text-charcoal">This Week vs Last Week</h2>
        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const thisWeekAvgQ = recentWeek.length > 0 ? Math.round(recentWeek.reduce((a, h) => a + h.quality, 0) / recentWeek.length * 10) / 10 : 0;
            const lastWeekAvgQ = prevWeek.length > 0 ? Math.round(prevWeek.reduce((a, h) => a + h.quality, 0) / prevWeek.length * 10) / 10 : 0;
            const thisWeekAvgH = recentWeek.length > 0 ? Math.round(recentWeek.reduce((a, h) => a + h.total_hours, 0) / recentWeek.length * 10) / 10 : 0;
            const lastWeekAvgH = prevWeek.length > 0 ? Math.round(prevWeek.reduce((a, h) => a + h.total_hours, 0) / prevWeek.length * 10) / 10 : 0;
            const qDiff = Math.round((thisWeekAvgQ - lastWeekAvgQ) * 10) / 10;
            const hDiff = Math.round((thisWeekAvgH - lastWeekAvgH) * 10) / 10;
            return (
              <>
                <div className="rounded-xl bg-cream/50 p-4 text-center">
                  <p className="text-xs text-charcoal-light">Avg Quality</p>
                  <p className={clsx('text-xl font-bold', qualityText(thisWeekAvgQ))}>{thisWeekAvgQ}/10</p>
                  <p className={clsx('text-xs font-semibold', qDiff > 0 ? 'text-sage' : qDiff < 0 ? 'text-terra' : 'text-charcoal/40')}>
                    {qDiff > 0 ? '+' : ''}{qDiff} from last week
                  </p>
                </div>
                <div className="rounded-xl bg-cream/50 p-4 text-center">
                  <p className="text-xs text-charcoal-light">Avg Hours</p>
                  <p className={clsx('text-xl font-bold', thisWeekAvgH >= 6 ? 'text-sage' : 'text-terra')}>{thisWeekAvgH}h</p>
                  <p className={clsx('text-xs font-semibold', hDiff > 0 ? 'text-sage' : hDiff < 0 ? 'text-terra' : 'text-charcoal/40')}>
                    {hDiff > 0 ? '+' : ''}{hDiff}h from last week
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Sprint 51 — Sleep Architecture Breakdown */}
      {(() => {
        const recent7 = history.slice(-7);
        if (recent7.length < 3) return null;
        const archData = recent7.map((h) => {
          const total = h.total_hours;
          const qNorm = h.quality / 10;
          const hasPain = h.disturbances.includes('Pain');
          const hasAnxiety = h.disturbances.includes('Anxiety');
          const rem = Math.max(0.5, total * (0.20 + qNorm * 0.05 - (hasPain ? 0.04 : 0) - (hasAnxiety ? 0.03 : 0)));
          const deep = Math.max(0.3, total * (0.15 + qNorm * 0.05 - (hasPain ? 0.05 : 0)));
          const light = Math.max(0.5, total - rem - deep - 0.3);
          const awake = Math.max(0.1, total - light - deep - rem);
          return {
            date: h.date,
            day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(h.date).getDay()],
            total,
            rem: Math.round(rem * 10) / 10,
            deep: Math.round(deep * 10) / 10,
            light: Math.round(light * 10) / 10,
            awake: Math.round(awake * 10) / 10,
          };
        });
        const avgRem = Math.round(archData.reduce((s, d) => s + d.rem, 0) / archData.length * 10) / 10;
        const avgDeep = Math.round(archData.reduce((s, d) => s + d.deep, 0) / archData.length * 10) / 10;
        const avgLight = Math.round(archData.reduce((s, d) => s + d.light, 0) / archData.length * 10) / 10;
        const avgAwake = Math.round(archData.reduce((s, d) => s + d.awake, 0) / archData.length * 10) / 10;
        const maxH = Math.max(...archData.map((d) => d.total));
        const stages = [
          { label: 'Deep', avg: avgDeep, color: 'bg-teal', ideal: '1.5-2h', key: 'deep' as const },
          { label: 'REM', avg: avgRem, color: 'bg-lavender', ideal: '1.5-2h', key: 'rem' as const },
          { label: 'Light', avg: avgLight, color: 'bg-sage', ideal: '3-4h', key: 'light' as const },
          { label: 'Awake', avg: avgAwake, color: 'bg-terra/60', ideal: '<0.5h', key: 'awake' as const },
        ];
        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-4 w-4 text-teal" />
              <h2 className="text-base font-semibold text-charcoal">Sleep Architecture</h2>
              <span className="ml-auto text-[10px] text-charcoal/40">Estimated from quality & duration</span>
            </div>
            {/* Stacked bar chart */}
            <div className="flex items-end gap-2" style={{ height: '110px' }}>
              {archData.map((d) => {
                const scale = maxH > 0 ? 100 / maxH : 1;
                return (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-charcoal/40">{d.total}h</span>
                    <div className="flex w-full max-w-[24px] flex-col overflow-hidden rounded-t-md">
                      <div className="bg-terra/50" style={{ height: `${d.awake * scale}px` }} />
                      <div className="bg-sage" style={{ height: `${d.light * scale}px` }} />
                      <div className="bg-lavender" style={{ height: `${d.rem * scale}px` }} />
                      <div className="bg-teal" style={{ height: `${d.deep * scale}px` }} />
                    </div>
                    <span className="text-[9px] text-charcoal-light">{d.day}</span>
                  </div>
                );
              })}
            </div>
            {/* Legend + averages */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stages.map((st) => (
                <div key={st.key} className="flex items-center gap-2 rounded-xl bg-cream/50 p-2.5">
                  <span className={clsx('h-3 w-3 rounded-sm flex-shrink-0', st.color)} />
                  <div>
                    <p className="text-xs font-semibold text-charcoal">{st.label}</p>
                    <p className="text-[10px] text-charcoal/50">{st.avg}h avg · ideal {st.ideal}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              {avgDeep < 1.0
                ? 'Your deep sleep is below ideal. Pre-bed pain management and reducing screen time may help.'
                : avgRem < 1.0
                ? 'REM sleep appears low. Anxiety management and consistent bedtimes can improve dream sleep.'
                : 'Your sleep stages look balanced. Keep maintaining good sleep habits!'}
            </p>
          </div>
        );
      })()}

      {/* Sprint 61 — Disturbance Frequency Heatmap */}
      {history.length >= 7 && (() => {
        const distTypes = ['Pain', 'Nausea', 'Anxiety', 'Bathroom', 'Breathing'];
        const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const grid: Record<string, Record<string, number>> = {};
        distTypes.forEach((dt) => {
          grid[dt] = {};
          dayNames.forEach((dn) => { grid[dt][dn] = 0; });
        });
        history.forEach((h) => {
          const dayIdx = new Date(h.date).getDay();
          const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayIdx];
          if (dayNames.includes(dayName)) {
            h.disturbances.forEach((d) => {
              if (grid[d]) grid[d][dayName] = (grid[d][dayName] || 0) + 1;
            });
          }
        });
        const maxCount = Math.max(1, ...distTypes.flatMap((dt) => dayNames.map((dn) => grid[dt][dn])));
        const totalDist = history.reduce((s, h) => s + h.disturbances.length, 0);
        const distFreeNights = history.filter((h) => h.disturbances.length === 0).length;

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Grid3x3 className="h-4 w-4 text-terra" />
              <h2 className="text-base font-semibold text-charcoal">Disturbance Heatmap</h2>
              <span className="ml-auto text-[10px] text-charcoal/40">{distFreeNights}/{history.length} undisturbed</span>
            </div>
            {/* Heatmap grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[320px]">
                {/* Day headers */}
                <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                  <div />
                  {dayNames.map((dn) => (
                    <div key={dn} className="text-center text-[9px] font-semibold text-charcoal/40">{dn}</div>
                  ))}
                </div>
                {/* Rows */}
                {distTypes.map((dt) => (
                  <div key={dt} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                    <span className="text-[10px] font-medium text-charcoal truncate self-center">{dt}</span>
                    {dayNames.map((dn) => {
                      const count = grid[dt][dn];
                      const intensity = maxCount > 0 ? count / maxCount : 0;
                      const bg = count === 0
                        ? 'bg-cream/50'
                        : intensity > 0.6
                        ? 'bg-terra/70'
                        : intensity > 0.3
                        ? 'bg-terra/40'
                        : 'bg-terra/20';
                      return (
                        <div
                          key={dn}
                          className={clsx('flex items-center justify-center rounded-md p-1.5', bg)}
                          title={`${dt} on ${dn}: ${count}`}
                        >
                          <span className={clsx('text-[9px] font-bold', count > 0 ? 'text-charcoal/70' : 'text-charcoal/15')}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="flex gap-3 mt-3 text-[10px] text-charcoal/40">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-cream/50" /> None</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-terra/20" /> Low</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-terra/40" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-terra/70" /> High</span>
            </div>
            <p className="mt-2 text-xs text-charcoal/40">
              {totalDist > history.length
                ? 'Multiple disturbances per night are common. Discuss a bedtime comfort plan with your care team.'
                : distFreeNights > history.length / 2
                ? 'Most nights are undisturbed — great progress on sleep hygiene!'
                : 'Some patterns may emerge over time. Keep logging to identify your triggers.'}
            </p>
          </div>
        );
      })()}

      {/* Sleep Hygiene Tips */}
      <div className="rounded-2xl bg-teal/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-teal" />
          <h2 className="text-base font-semibold text-charcoal">Sleep Tips for You</h2>
        </div>
        <div className="space-y-2">
          {[
            topDisturbance?.[0] === 'Pain' && 'Take your pain medication 30 min before bed. A warm compress can help.',
            topDisturbance?.[0] === 'Anxiety' && 'Try the 4-7-8 breathing exercise before bed. It can calm your mind.',
            topDisturbance?.[0] === 'Nausea' && 'Elevate your head with an extra pillow. Avoid eating within 2 hours of bed.',
            avgHours < 6 && 'Aim for a consistent bedtime. Even resting with eyes closed helps your body recover.',
            avgQuality < 5 && 'Reduce screen time 1 hour before bed. A dark, cool room improves sleep quality.',
            'Keep a regular sleep schedule — your body loves routine.',
          ].filter(Boolean).slice(0, 3).map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal flex-shrink-0" />
              <p className="text-sm text-charcoal/70">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bedtime Consistency */}
      {(() => {
        const bedtimes = history.slice(-7).map((h) => {
          const [bH, bM] = h.bedtime.split(':').map(Number);
          return bH * 60 + bM;
        });
        if (bedtimes.length < 3) return null;
        const avgBedMin = Math.round(bedtimes.reduce((s, b) => s + b, 0) / bedtimes.length);
        const variance = Math.round(Math.sqrt(bedtimes.reduce((s, b) => s + (b - avgBedMin) ** 2, 0) / bedtimes.length));
        const avgBedHour = Math.floor(avgBedMin / 60);
        const avgBedMinute = avgBedMin % 60;
        const isConsistent = variance < 45;
        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-base font-semibold text-charcoal">Bedtime Consistency</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal-light">Average bedtime</p>
                <p className="text-xl font-bold text-charcoal">
                  {avgBedHour > 12 ? avgBedHour - 12 : avgBedHour}:{String(avgBedMinute).padStart(2, '0')} {avgBedHour >= 12 ? 'PM' : 'AM'}
                </p>
              </div>
              <div className={clsx('rounded-full px-3 py-1 text-xs font-bold', isConsistent ? 'bg-sage/10 text-sage-dark' : 'bg-amber/10 text-amber')}>
                {isConsistent ? 'Consistent' : 'Variable'}
              </div>
            </div>
            <p className="mt-2 text-xs text-charcoal/50">
              {isConsistent
                ? 'Great job! A regular bedtime helps your body maintain a healthy sleep-wake cycle.'
                : `Your bedtime varies by ~${variance} min. Try to go to bed within 30 min of the same time each night.`}
            </p>
          </div>
        );
      })()}

      {/* Sleep Quality Chart */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
        <h2 className="mb-3 text-base font-semibold text-charcoal">Sleep Quality (last 14 nights)</h2>
        <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
          {history.slice(-14).map((h) => {
            const pct = (h.quality / 10) * 100;
            return (
              <div key={h.id} className="flex flex-1 flex-col items-center gap-1">
                <span className={clsx('text-[9px] font-bold', qualityText(h.quality))}>{h.quality}</span>
                <div
                  className={clsx('w-full overflow-hidden rounded-t opacity-80', qualityBg(h.quality))}
                  style={{ height: `${pct}%`, minHeight: '4px' }}
                />
                <span className="text-[8px] text-charcoal-light">{new Date(h.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-charcoal">Recent Logs</h2>
        <div className="space-y-3">
          {history.slice(-7).reverse().map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', qualityLightBg(h.quality))}>
                  <Moon className={clsx('h-4 w-4', qualityText(h.quality))} />
                </div>
                <div>
                  <p className="text-base font-semibold text-charcoal">
                    {h.total_hours}h · Quality {h.quality}/10
                  </p>
                  <p className="text-sm text-charcoal-light">
                    {h.bedtime} → {h.wake_time}
                    {h.disturbances.length > 0 && ` · ${h.disturbances.join(', ')}`}
                  </p>
                </div>
              </div>
              <span className="text-sm text-charcoal-light">{h.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-2xl bg-teal px-5 py-3 text-base font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" /> Sleep logged!
        </div>
      )}
    </div>
  );
}
