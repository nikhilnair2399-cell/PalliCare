'use client';

import { useState } from 'react';
import { Moon, Sun, Clock, TrendingUp, TrendingDown, Minus, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ───── Mock Sleep History (30 days) ───── */
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

  // Most common disturbance
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

  function getQualityColor(q: number): string {
    if (q <= 3) return '#C25A45';
    if (q <= 5) return '#D4856B';
    if (q <= 7) return '#E8A838';
    return '#7BA68C';
  }

  /* ─────── LOG NEW ENTRY ─────── */
  if (mode === 'log') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Log Sleep</h1>
            <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>How did you sleep last night?</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-lg px-3 py-1.5 text-[12px] font-medium" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>
            Cancel
          </button>
        </div>

        {/* Bedtime & Wake time */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>
                <Moon className="h-4 w-4" style={{ color: '#6B7DB3' }} /> Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-[15px] font-medium outline-none"
                style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#2D2D2D' }}
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>
                <Sun className="h-4 w-4" style={{ color: '#E8A838' }} /> Wake Up
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-[15px] font-medium outline-none"
                style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#2D2D2D' }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg py-2" style={{ backgroundColor: 'rgba(42,107,107,0.04)' }}>
            <Clock className="h-4 w-4" style={{ color: '#2A6B6B' }} />
            <span className="text-[13px] font-semibold" style={{ color: '#2A6B6B' }}>
              {calcHours(bedtime, wakeTime)} hours of sleep
            </span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <label className="mb-3 block text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>
            Sleep Quality: <span style={{ color: getQualityColor(quality) }}>{quality}/10</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-teal"
          />
          <div className="mt-1 flex justify-between text-[10px]" style={{ color: '#4A4A4A' }}>
            <span>Very poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Disturbances */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="mb-3 text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>What disturbed your sleep?</p>
          <div className="flex flex-wrap gap-2">
            {DISTURBANCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleDisturbance(opt.id)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all"
                style={{
                  border: `1px solid ${disturbances.includes(opt.id) ? '#2A6B6B' : 'rgba(168,203,181,0.3)'}`,
                  backgroundColor: disturbances.includes(opt.id) ? 'rgba(42,107,107,0.06)' : 'white',
                  color: disturbances.includes(opt.id) ? '#2A6B6B' : '#4A4A4A',
                }}
              >
                <span>{opt.emoji}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep medication */}
        <div
          className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
          style={{ border: '1px solid rgba(168,203,181,0.2)' }}
        >
          <span className="text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>Took sleep medication?</span>
          <button
            onClick={() => setSleepMed(!sleepMed)}
            className="relative h-6 w-11 rounded-full transition-colors"
            style={{ backgroundColor: sleepMed ? '#2A6B6B' : 'rgba(168,203,181,0.3)' }}
          >
            <span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
              style={{ left: sleepMed ? '22px' : '2px' }}
            />
          </button>
        </div>

        {/* Notes */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: '1px solid rgba(168,203,181,0.2)' }}
        >
          <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else about your sleep..."
            rows={2}
            className="w-full rounded-lg px-3 py-2 text-[13px] outline-none"
            style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#2D2D2D', resize: 'vertical' }}
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full rounded-xl py-3 text-[14px] font-semibold text-white transition-all hover:shadow-md"
          style={{ backgroundColor: '#2A6B6B' }}
        >
          <CheckCircle2 className="mb-0.5 mr-2 inline h-4 w-4" /> Save Sleep Log
        </button>
      </div>
    );
  }

  /* ─────── HOME / DASHBOARD ─────── */
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Sleep Tracker</h1>
          <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>Track your sleep patterns to help manage symptoms</p>
        </div>
        <button
          onClick={() => setMode('log')}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white"
          style={{ backgroundColor: '#2A6B6B' }}
        >
          <PlusCircle className="h-4 w-4" /> Log Sleep
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Avg Quality', value: `${avgQuality}/10`, color: getQualityColor(avgQuality), icon: Moon },
          { label: 'Avg Duration', value: `${avgHours}h`, color: avgHours >= 6 ? '#7BA68C' : '#D4856B', icon: Clock },
          {
            label: 'Trend',
            value: trend === 'improving' ? 'Better' : trend === 'worsening' ? 'Worse' : 'Stable',
            color: trend === 'improving' ? '#7BA68C' : trend === 'worsening' ? '#C25A45' : '#E8A838',
            icon: trend === 'improving' ? TrendingUp : trend === 'worsening' ? TrendingDown : Minus,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-xl bg-white p-3"
            style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <stat.icon className="mb-1 h-4 w-4" style={{ color: stat.color }} />
            <span className="font-mono text-[18px] font-bold" style={{ color: stat.color }}>{stat.value}</span>
            <span className="text-[10px] font-medium" style={{ color: '#4A4A4A' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Top disturbance */}
      {topDisturbance && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ backgroundColor: 'rgba(212,133,107,0.06)', border: '1px solid rgba(212,133,107,0.15)' }}
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: '#D4856B' }} />
          <p className="text-[12px]" style={{ color: '#4A4A4A' }}>
            Most common sleep disturbance: <strong style={{ color: '#2D2D2D' }}>{topDisturbance[0]}</strong> ({topDisturbance[1]} of {history.length} nights)
          </p>
        </div>
      )}

      {/* Sleep Quality Chart (simple bar chart) */}
      <div
        className="rounded-xl bg-white p-4"
        style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <h2 className="mb-3 text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>Sleep Quality (last 14 nights)</h2>
        <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
          {history.slice(-14).map((h) => {
            const pct = (h.quality / 10) * 100;
            return (
              <div key={h.id} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-bold" style={{ color: getQualityColor(h.quality) }}>{h.quality}</span>
                <div className="w-full overflow-hidden rounded-t" style={{ height: `${pct}%`, backgroundColor: getQualityColor(h.quality), minHeight: '4px', opacity: 0.8 }} />
                <span className="text-[8px]" style={{ color: '#4A4A4A' }}>{new Date(h.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <h2 className="mb-3 text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>Recent Logs</h2>
        <div className="space-y-2">
          {history.slice(-7).reverse().map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
              style={{ border: '1px solid rgba(168,203,181,0.15)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${getQualityColor(h.quality)}15` }}
                >
                  <Moon className="h-4 w-4" style={{ color: getQualityColor(h.quality) }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>
                    {h.total_hours}h · Quality {h.quality}/10
                  </p>
                  <p className="text-[11px]" style={{ color: '#4A4A4A' }}>
                    {h.bedtime} → {h.wake_time}
                    {h.disturbances.length > 0 && ` · ${h.disturbances.join(', ')}`}
                  </p>
                </div>
              </div>
              <span className="text-[11px]" style={{ color: '#4A4A4A' }}>{h.date}</span>
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
