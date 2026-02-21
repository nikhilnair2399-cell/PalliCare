'use client';

import { useState } from 'react';
import {
  Apple,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  PlusCircle,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Utensils,
  Coffee,
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ───── Types ───── */
interface NutritionEntry {
  id: string;
  date: string;
  weight?: number;
  appetite: number; // 0-10
  oral_intake: 'normal' | 'reduced' | 'minimal' | 'nil';
  fluid_intake: number; // glasses (approx 250ml each)
  meals_eaten: number; // 0-3
  nausea_affected: boolean;
  mouth_problems: boolean;
  notes: string;
}

/* ───── Mock Data ───── */
const BASELINE_WEIGHT = 62; // kg

const MOCK_NUTRITION: NutritionEntry[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const weightDelta = -0.1 * i + (Math.random() - 0.5) * 0.5;
  return {
    id: `nut-${i}`,
    date: d.toISOString().split('T')[0],
    weight: i % 3 === 0 ? Math.round((BASELINE_WEIGHT + weightDelta) * 10) / 10 : undefined,
    appetite: Math.max(0, Math.min(10, Math.round(5 + (Math.random() - 0.4) * 6))),
    oral_intake: ['normal', 'reduced', 'reduced', 'minimal'][Math.floor(Math.random() * 4)] as any,
    fluid_intake: Math.floor(3 + Math.random() * 6),
    meals_eaten: Math.floor(1 + Math.random() * 3),
    nausea_affected: Math.random() > 0.6,
    mouth_problems: Math.random() > 0.8,
    notes: '',
  };
});

const INTAKE_OPTIONS = [
  { value: 'normal', label: 'Normal', desc: 'Eating regular meals', color: '#7BA68C' },
  { value: 'reduced', label: 'Reduced', desc: 'Eating less than usual', color: '#E8A838' },
  { value: 'minimal', label: 'Minimal', desc: 'Only a few mouthfuls', color: '#D4856B' },
  { value: 'nil', label: 'Nothing', desc: 'Unable to eat', color: '#C25A45' },
];

function getMUSTRisk(bmi: number, weightLossPct: number): { level: string; color: string; advice: string } {
  let bmiScore = 0;
  if (bmi < 18.5) bmiScore = 2;
  else if (bmi <= 20) bmiScore = 1;

  let wlScore = 0;
  if (weightLossPct > 10) wlScore = 2;
  else if (weightLossPct >= 5) wlScore = 1;

  const total = bmiScore + wlScore;
  if (total === 0) return { level: 'Low Risk', color: '#7BA68C', advice: 'Continue routine monitoring. Log your nutrition weekly.' };
  if (total === 1) return { level: 'Medium Risk', color: '#E8A838', advice: 'Monitor your food intake closely. Aim for small, frequent meals.' };
  return { level: 'High Risk', color: '#C25A45', advice: 'Your nutrition needs attention. Your care team has been notified.' };
}

export default function NutritionPage() {
  const [history, setHistory] = useState(MOCK_NUTRITION);
  const [mode, setMode] = useState<'home' | 'log'>('home');
  const [weight, setWeight] = useState('');
  const [appetite, setAppetite] = useState(5);
  const [oralIntake, setOralIntake] = useState<string>('normal');
  const [fluidIntake, setFluidIntake] = useState(4);
  const [mealsEaten, setMealsEaten] = useState(2);
  const [nauseaAffected, setNauseaAffected] = useState(false);
  const [mouthProblems, setMouthProblems] = useState(false);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  // Compute stats
  const weightsRecorded = history.filter((h) => h.weight !== undefined).map((h) => ({ date: h.date, weight: h.weight! }));
  const currentWeight = weightsRecorded.length > 0 ? weightsRecorded[weightsRecorded.length - 1].weight : BASELINE_WEIGHT;
  const firstWeight = weightsRecorded.length > 0 ? weightsRecorded[0].weight : BASELINE_WEIGHT;
  const weightChange = currentWeight - firstWeight;
  const weightChangePct = Math.abs(Math.round((weightChange / firstWeight) * 1000) / 10);
  const bmi = Math.round((currentWeight / (1.68 * 1.68)) * 10) / 10; // assume 168cm height
  const mustRisk = getMUSTRisk(bmi, weightChangePct);
  const avgAppetite = history.length > 0 ? Math.round((history.reduce((s, h) => s + h.appetite, 0) / history.length) * 10) / 10 : 0;
  const avgFluids = history.length > 0 ? Math.round((history.reduce((s, h) => s + h.fluid_intake, 0) / history.length) * 10) / 10 : 0;

  function handleSave() {
    const entry: NutritionEntry = {
      id: `nut-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weight: weight ? parseFloat(weight) : undefined,
      appetite,
      oral_intake: oralIntake as any,
      fluid_intake: fluidIntake,
      meals_eaten: mealsEaten,
      nausea_affected: nauseaAffected,
      mouth_problems: mouthProblems,
      notes,
    };
    setHistory((prev) => [...prev, entry]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setMode('home'); }, 2000);
  }

  function getAppetiteColor(a: number): string {
    if (a <= 3) return '#C25A45';
    if (a <= 5) return '#D4856B';
    if (a <= 7) return '#E8A838';
    return '#7BA68C';
  }

  /* ─────── LOG ─────── */
  if (mode === 'log') {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Log Nutrition</h1>
            <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>How was your eating and drinking today?</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-lg px-3 py-1.5 text-[12px] font-medium" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>Cancel</button>
        </div>

        {/* Weight (optional) */}
        <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <label className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>
            <Scale className="h-4 w-4" style={{ color: '#7BA68C' }} /> Weight (optional, kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={`Last: ${currentWeight} kg`}
            className="w-full rounded-lg px-3 py-2.5 text-[15px] font-medium outline-none"
            style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#2D2D2D' }}
          />
        </div>

        {/* Appetite */}
        <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <label className="mb-3 block text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>
            Appetite: <span style={{ color: getAppetiteColor(appetite) }}>{appetite}/10</span>
          </label>
          <input type="range" min={0} max={10} value={appetite} onChange={(e) => setAppetite(Number(e.target.value))} className="w-full accent-teal" />
          <div className="mt-1 flex justify-between text-[10px]" style={{ color: '#4A4A4A' }}>
            <span>No appetite</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Oral Intake */}
        <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <p className="mb-3 text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>Food Intake Today</p>
          <div className="grid grid-cols-2 gap-2">
            {INTAKE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setOralIntake(opt.value)}
                className="rounded-xl p-3 text-left transition-all"
                style={{
                  border: `1px solid ${oralIntake === opt.value ? opt.color : 'rgba(168,203,181,0.2)'}`,
                  backgroundColor: oralIntake === opt.value ? `${opt.color}10` : 'white',
                }}
              >
                <p className="text-[13px] font-semibold" style={{ color: oralIntake === opt.value ? opt.color : '#2D2D2D' }}>{opt.label}</p>
                <p className="text-[11px]" style={{ color: '#4A4A4A' }}>{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Meals & Fluids */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)' }}>
            <label className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>
              <Utensils className="h-3.5 w-3.5" style={{ color: '#E8A838' }} /> Meals Eaten
            </label>
            <div className="flex items-center justify-between">
              <button onClick={() => setMealsEaten(Math.max(0, mealsEaten - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>−</button>
              <span className="font-mono text-[20px] font-bold" style={{ color: '#2D2D2D' }}>{mealsEaten}</span>
              <button onClick={() => setMealsEaten(Math.min(6, mealsEaten + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>+</button>
            </div>
          </div>
          <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)' }}>
            <label className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>
              <Droplets className="h-3.5 w-3.5" style={{ color: '#6B9BD2' }} /> Glasses of Water
            </label>
            <div className="flex items-center justify-between">
              <button onClick={() => setFluidIntake(Math.max(0, fluidIntake - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>−</button>
              <span className="font-mono text-[20px] font-bold" style={{ color: '#2D2D2D' }}>{fluidIntake}</span>
              <button onClick={() => setFluidIntake(Math.min(15, fluidIntake + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold" style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#4A4A4A' }}>+</button>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          {[
            { label: 'Nausea affected eating?', value: nauseaAffected, set: setNauseaAffected },
            { label: 'Mouth sores or dry mouth?', value: mouthProblems, set: setMouthProblems },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
              style={{ border: '1px solid rgba(168,203,181,0.2)' }}
            >
              <span className="text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>{item.label}</span>
              <button
                onClick={() => item.set(!item.value)}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ backgroundColor: item.value ? '#D4856B' : 'rgba(168,203,181,0.3)' }}
              >
                <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" style={{ left: item.value ? '22px' : '2px' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)' }}>
          <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: '#4A4A4A' }}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you eat today?"
            rows={2}
            className="w-full rounded-lg px-3 py-2 text-[13px] outline-none"
            style={{ border: '1px solid rgba(168,203,181,0.3)', color: '#2D2D2D', resize: 'vertical' }}
          />
        </div>

        <button onClick={handleSave} className="w-full rounded-xl py-3 text-[14px] font-semibold text-white transition-all hover:shadow-md" style={{ backgroundColor: '#2A6B6B' }}>
          <CheckCircle2 className="mb-0.5 mr-2 inline h-4 w-4" /> Save Nutrition Log
        </button>
      </div>
    );
  }

  /* ─────── HOME ─────── */
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Nutrition</h1>
          <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>Track your eating, drinking, and weight</p>
        </div>
        <button onClick={() => setMode('log')} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white" style={{ backgroundColor: '#2A6B6B' }}>
          <PlusCircle className="h-4 w-4" /> Log Today
        </button>
      </div>

      {/* MUST Risk Banner */}
      <div
        className="flex items-start gap-3 rounded-xl p-4"
        style={{ backgroundColor: `${mustRisk.color}08`, border: `1px solid ${mustRisk.color}25` }}
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: mustRisk.color }} />
        <div>
          <p className="text-[13px] font-semibold" style={{ color: mustRisk.color }}>
            Nutrition Risk: {mustRisk.level}
          </p>
          <p className="mt-1 text-[12px]" style={{ color: '#4A4A4A' }}>{mustRisk.advice}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Current Weight', value: `${currentWeight} kg`, sub: `BMI ${bmi}`, icon: Scale, color: '#2A6B6B' },
          {
            label: 'Weight Change',
            value: `${weightChange >= 0 ? '+' : ''}${Math.round(weightChange * 10) / 10} kg`,
            sub: `${weightChangePct}% ${weightChange >= 0 ? 'gained' : 'lost'}`,
            icon: weightChange < -1 ? TrendingDown : weightChange > 1 ? TrendingUp : Minus,
            color: weightChange < -2 ? '#C25A45' : weightChange < 0 ? '#D4856B' : '#7BA68C',
          },
          { label: 'Avg Appetite', value: `${avgAppetite}/10`, sub: 'Last 14 days', icon: Apple, color: getAppetiteColor(avgAppetite) },
          { label: 'Avg Fluids', value: `${avgFluids}`, sub: 'Glasses/day', icon: Droplets, color: avgFluids >= 6 ? '#7BA68C' : '#D4856B' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-3"
            style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              <span className="text-[11px] font-medium" style={{ color: '#4A4A4A' }}>{stat.label}</span>
            </div>
            <p className="font-mono text-[18px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px]" style={{ color: '#4A4A4A' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Weight Trend (dots) */}
      {weightsRecorded.length > 1 && (
        <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="mb-3 text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>Weight Trend</h2>
          <div className="flex items-end gap-2" style={{ height: '80px' }}>
            {weightsRecorded.map((w) => {
              const min = Math.min(...weightsRecorded.map((x) => x.weight)) - 1;
              const max = Math.max(...weightsRecorded.map((x) => x.weight)) + 1;
              const pct = ((w.weight - min) / (max - min)) * 100;
              return (
                <div key={w.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[9px] font-bold" style={{ color: '#2D2D2D' }}>{w.weight}</span>
                  <div style={{ height: `${pct}%` }} className="flex items-end">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#2A6B6B' }} />
                  </div>
                  <span className="text-[8px]" style={{ color: '#4A4A4A' }}>{new Date(w.date).getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appetite Chart */}
      <div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <h2 className="mb-3 text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>Appetite (last 14 days)</h2>
        <div className="flex items-end gap-1.5" style={{ height: '100px' }}>
          {history.slice(-14).map((h) => {
            const pct = (h.appetite / 10) * 100;
            return (
              <div key={h.id} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-bold" style={{ color: getAppetiteColor(h.appetite) }}>{h.appetite}</span>
                <div className="w-full overflow-hidden rounded-t" style={{ height: `${pct}%`, backgroundColor: getAppetiteColor(h.appetite), minHeight: '4px', opacity: 0.8 }} />
                <span className="text-[8px]" style={{ color: '#4A4A4A' }}>{new Date(h.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Logs */}
      <div>
        <h2 className="mb-3 text-[14px] font-semibold" style={{ color: '#2D2D2D' }}>Recent Logs</h2>
        <div className="space-y-2">
          {history.slice(-5).reverse().map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3" style={{ border: '1px solid rgba(168,203,181,0.15)' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${getAppetiteColor(h.appetite)}15` }}>
                  <Coffee className="h-4 w-4" style={{ color: getAppetiteColor(h.appetite) }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>
                    Appetite {h.appetite}/10 · {h.meals_eaten} meals · {h.fluid_intake} glasses
                  </p>
                  <p className="text-[11px]" style={{ color: '#4A4A4A' }}>
                    Intake: {h.oral_intake}{h.weight ? ` · ${h.weight} kg` : ''}
                    {h.nausea_affected ? ' · Nausea' : ''}
                    {h.mouth_problems ? ' · Mouth issues' : ''}
                  </p>
                </div>
              </div>
              <span className="text-[11px]" style={{ color: '#4A4A4A' }}>{h.date}</span>
            </div>
          ))}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" /> Nutrition logged!
        </div>
      )}
    </div>
  );
}
