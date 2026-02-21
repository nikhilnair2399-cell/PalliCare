'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Moon, Sun, Clock, TrendingUp, TrendingDown, Minus, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">Log Sleep</h1>
            <p className="mt-1 text-sm text-charcoal-light">How did you sleep last night?</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-lg border border-sage-light/30 px-3 py-1.5 text-xs font-medium text-charcoal-light">
            Cancel
          </button>
        </div>

        {/* Bedtime & Wake time */}
        <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-charcoal-light">
                <Moon className="h-4 w-4 text-teal" /> Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full rounded-lg border border-sage-light/30 px-3 py-2.5 text-base font-medium text-charcoal outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-charcoal-light">
                <Sun className="h-4 w-4 text-amber" /> Wake Up
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-lg border border-sage-light/30 px-3 py-2.5 text-base font-medium text-charcoal outline-none"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-teal/5 py-2">
            <Clock className="h-4 w-4 text-teal" />
            <span className="text-sm font-semibold text-teal">
              {calcHours(bedtime, wakeTime)} hours of sleep
            </span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <label className="mb-3 block text-sm font-semibold text-charcoal">
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
          <div className="mt-1 flex justify-between text-[10px] text-charcoal-light">
            <span>Very poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Disturbances */}
        <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-charcoal">What disturbed your sleep?</p>
          <div className="flex flex-wrap gap-2">
            {DISTURBANCE_OPTIONS.map((opt) => {
              const isSelected = disturbances.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleDisturbance(opt.id)}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    isSelected ? 'border-teal bg-teal/5 text-teal' : 'border-sage-light/30 bg-white text-charcoal-light',
                  )}
                >
                  <span>{opt.emoji}</span> {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sleep medication */}
        <div className="flex items-center justify-between rounded-xl border border-sage-light/20 bg-white px-4 py-3">
          <span className="text-sm font-semibold text-charcoal">Took sleep medication?</span>
          <button
            onClick={() => setSleepMed(!sleepMed)}
            className={clsx('relative h-6 w-11 rounded-full transition-colors', sleepMed ? 'bg-teal' : 'bg-sage-light/30')}
          >
            <span
              className={clsx(
                'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                sleepMed && 'translate-x-5',
              )}
            />
          </button>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-sage-light/20 bg-white p-4">
          <label className="mb-1.5 block text-xs font-semibold text-charcoal-light">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else about your sleep..."
            rows={2}
            className="w-full resize-y rounded-lg border border-sage-light/30 px-3 py-2 text-sm text-charcoal outline-none placeholder:text-charcoal-light/50"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-semibold text-white transition-all hover:shadow-md"
        >
          <CheckCircle2 className="h-4 w-4" /> Save Sleep Log
        </button>
      </div>
    );
  }

  /* ─────── HOME / DASHBOARD ─────── */
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">Sleep Tracker</h1>
          <p className="mt-1 text-sm text-charcoal-light">Track your sleep patterns to help manage symptoms</p>
        </div>
        <button
          onClick={() => setMode('log')}
          className="flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white"
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
            className="flex flex-col items-center rounded-xl border border-sage-light/20 bg-white p-3 shadow-sm"
          >
            <stat.icon className={clsx('mb-1 h-4 w-4', stat.textCls)} />
            <span className={clsx('font-mono text-lg font-bold', stat.textCls)}>{stat.value}</span>
            <span className="text-[10px] font-medium text-charcoal-light">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Top disturbance */}
      {topDisturbance && (
        <div className="flex items-center gap-3 rounded-xl border border-terra/15 bg-terra/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-terra" />
          <p className="text-xs text-charcoal-light">
            Most common sleep disturbance: <strong className="text-charcoal">{topDisturbance[0]}</strong> ({topDisturbance[1]} of {history.length} nights)
          </p>
        </div>
      )}

      {/* Sleep Quality Chart */}
      <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-charcoal">Sleep Quality (last 14 nights)</h2>
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
        <h2 className="mb-3 text-sm font-semibold text-charcoal">Recent Logs</h2>
        <div className="space-y-2">
          {history.slice(-7).reverse().map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl border border-sage-light/20 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className={clsx('flex h-9 w-9 items-center justify-center rounded-lg', qualityLightBg(h.quality))}>
                  <Moon className={clsx('h-4 w-4', qualityText(h.quality))} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {h.total_hours}h · Quality {h.quality}/10
                  </p>
                  <p className="text-xs text-charcoal-light">
                    {h.bedtime} → {h.wake_time}
                    {h.disturbances.length > 0 && ` · ${h.disturbances.join(', ')}`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-charcoal-light">{h.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" /> Sleep logged!
        </div>
      )}
    </div>
  );
}
