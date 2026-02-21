'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
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

/* ───── Appetite Color Helpers ───── */
function appetiteText(a: number): string {
  if (a <= 3) return 'text-alert-critical';
  if (a <= 5) return 'text-terra';
  if (a <= 7) return 'text-amber';
  return 'text-sage';
}

function appetiteBg(a: number): string {
  if (a <= 3) return 'bg-alert-critical';
  if (a <= 5) return 'bg-terra';
  if (a <= 7) return 'bg-amber';
  return 'bg-sage';
}

function appetiteLightBg(a: number): string {
  if (a <= 3) return 'bg-alert-critical/10';
  if (a <= 5) return 'bg-terra/10';
  if (a <= 7) return 'bg-amber/10';
  return 'bg-sage/10';
}

/* ───── Types ───── */
interface NutritionEntry {
  id: string;
  date: string;
  weight?: number;
  appetite: number;
  oral_intake: 'normal' | 'reduced' | 'minimal' | 'nil';
  fluid_intake: number;
  meals_eaten: number;
  nausea_affected: boolean;
  mouth_problems: boolean;
  notes: string;
}

/* ───── Mock Data ───── */
const BASELINE_WEIGHT = 62;

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
  { value: 'normal', label: 'Normal', desc: 'Eating regular meals', text: 'text-sage', border: 'border-sage', lightBg: 'bg-sage/10' },
  { value: 'reduced', label: 'Reduced', desc: 'Eating less than usual', text: 'text-amber', border: 'border-amber', lightBg: 'bg-amber/10' },
  { value: 'minimal', label: 'Minimal', desc: 'Only a few mouthfuls', text: 'text-terra', border: 'border-terra', lightBg: 'bg-terra/10' },
  { value: 'nil', label: 'Nothing', desc: 'Unable to eat', text: 'text-alert-critical', border: 'border-alert-critical', lightBg: 'bg-alert-critical/10' },
];

function getMUSTRisk(bmi: number, weightLossPct: number) {
  let bmiScore = 0;
  if (bmi < 18.5) bmiScore = 2;
  else if (bmi <= 20) bmiScore = 1;

  let wlScore = 0;
  if (weightLossPct > 10) wlScore = 2;
  else if (weightLossPct >= 5) wlScore = 1;

  const total = bmiScore + wlScore;
  if (total === 0) return { level: 'Low Risk', text: 'text-sage', lightBg: 'bg-sage/5', border: 'border-sage/20', advice: 'Continue routine monitoring. Log your nutrition weekly.' };
  if (total === 1) return { level: 'Medium Risk', text: 'text-amber', lightBg: 'bg-amber/5', border: 'border-amber/20', advice: 'Monitor your food intake closely. Aim for small, frequent meals.' };
  return { level: 'High Risk', text: 'text-alert-critical', lightBg: 'bg-alert-critical/5', border: 'border-alert-critical/20', advice: 'Your nutrition needs attention. Your care team has been notified.' };
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

  const weightsRecorded = history.filter((h) => h.weight !== undefined).map((h) => ({ date: h.date, weight: h.weight! }));
  const currentWeight = weightsRecorded.length > 0 ? weightsRecorded[weightsRecorded.length - 1].weight : BASELINE_WEIGHT;
  const firstWeight = weightsRecorded.length > 0 ? weightsRecorded[0].weight : BASELINE_WEIGHT;
  const weightChange = currentWeight - firstWeight;
  const weightChangePct = Math.abs(Math.round((weightChange / firstWeight) * 1000) / 10);
  const bmi = Math.round((currentWeight / (1.68 * 1.68)) * 10) / 10;
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

  /* ─────── LOG ─────── */
  if (mode === 'log') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-teal">Log Nutrition</h1>
            <p className="mt-1 text-base text-charcoal-light">How was your eating and drinking today?</p>
          </div>
          <button onClick={() => setMode('home')} className="rounded-xl bg-cream px-4 py-2 text-sm font-medium text-charcoal-light hover:bg-charcoal/5">Cancel</button>
        </div>

        {/* Weight (optional) */}
        <div className="rounded-2xl bg-white p-5">
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-charcoal-light">
            <Scale className="h-4 w-4 text-sage" /> Weight (optional, kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={`Last: ${currentWeight} kg`}
            className="w-full rounded-xl border border-charcoal/10 px-4 py-3 text-base font-medium text-charcoal outline-none placeholder:text-charcoal/30 focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        {/* Appetite */}
        <div className="rounded-2xl bg-white p-5">
          <label className="mb-3 block text-base font-semibold text-charcoal">
            Appetite: <span className={appetiteText(appetite)}>{appetite}/10</span>
          </label>
          <input type="range" min={0} max={10} value={appetite} onChange={(e) => setAppetite(Number(e.target.value))} className="w-full accent-teal" />
          <div className="mt-1 flex justify-between text-xs text-charcoal-light">
            <span>No appetite</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Oral Intake */}
        <div className="rounded-2xl bg-white p-5">
          <p className="mb-3 text-base font-semibold text-charcoal">Food Intake Today</p>
          <div className="grid grid-cols-2 gap-2">
            {INTAKE_OPTIONS.map((opt) => {
              const isSelected = oralIntake === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setOralIntake(opt.value)}
                  className={clsx(
                    'rounded-xl border p-3.5 text-left transition-all',
                    isSelected ? clsx(opt.border, opt.lightBg) : 'border-charcoal/10 bg-white',
                  )}
                >
                  <p className={clsx('text-base font-semibold', isSelected ? opt.text : 'text-charcoal')}>{opt.label}</p>
                  <p className="text-sm text-charcoal-light">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Meals & Fluids */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-5">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-charcoal-light">
              <Utensils className="h-3.5 w-3.5 text-amber" /> Meals Eaten
            </label>
            <div className="flex items-center justify-between">
              <button onClick={() => setMealsEaten(Math.max(0, mealsEaten - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-lg font-bold text-charcoal-light">−</button>
              <span className="font-mono text-2xl font-bold text-charcoal">{mealsEaten}</span>
              <button onClick={() => setMealsEaten(Math.min(6, mealsEaten + 1))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-lg font-bold text-charcoal-light">+</button>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-charcoal-light">
              <Droplets className="h-3.5 w-3.5 text-teal" /> Glasses of Water
            </label>
            <div className="flex items-center justify-between">
              <button onClick={() => setFluidIntake(Math.max(0, fluidIntake - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-lg font-bold text-charcoal-light">−</button>
              <span className="font-mono text-2xl font-bold text-charcoal">{fluidIntake}</span>
              <button onClick={() => setFluidIntake(Math.min(15, fluidIntake + 1))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-lg font-bold text-charcoal-light">+</button>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { label: 'Nausea affected eating?', value: nauseaAffected, set: setNauseaAffected },
            { label: 'Mouth sores or dry mouth?', value: mouthProblems, set: setMouthProblems },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-4"
            >
              <span className="text-base font-semibold text-charcoal">{item.label}</span>
              <button
                onClick={() => item.set(!item.value)}
                className={clsx('relative h-7 w-12 rounded-full transition-colors', item.value ? 'bg-terra' : 'bg-charcoal/20')}
              >
                <span
                  className={clsx(
                    'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                    item.value && 'translate-x-5',
                  )}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-white p-5">
          <label className="mb-1.5 block text-sm font-semibold text-charcoal-light">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you eat today?"
            rows={2}
            className="w-full resize-y rounded-xl border border-charcoal/10 px-4 py-3 text-base text-charcoal outline-none placeholder:text-charcoal/30 focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        <button onClick={handleSave} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90">
          <CheckCircle2 className="h-5 w-5" /> Save Nutrition Log
        </button>
      </div>
    );
  }

  /* ─────── HOME ─────── */
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-teal">Nutrition</h1>
          <p className="mt-1 text-base text-charcoal-light">Track your eating, drinking, and weight</p>
        </div>
        <button onClick={() => setMode('log')} className="flex items-center gap-1.5 rounded-2xl bg-teal px-5 py-3 text-base font-semibold text-white">
          <PlusCircle className="h-4 w-4" /> Log Today
        </button>
      </div>

      {/* MUST Risk Banner */}
      <div className={clsx('flex items-start gap-3 rounded-2xl p-5', mustRisk.lightBg)}>
        <AlertTriangle className={clsx('mt-0.5 h-5 w-5 flex-shrink-0', mustRisk.text)} />
        <div>
          <p className={clsx('text-base font-semibold', mustRisk.text)}>
            Nutrition Risk: {mustRisk.level}
          </p>
          <p className="mt-1 text-sm text-charcoal-light">{mustRisk.advice}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Current Weight', value: `${currentWeight} kg`, sub: `BMI ${bmi}`, icon: Scale, textCls: 'text-teal' },
          {
            label: 'Weight Change',
            value: `${weightChange >= 0 ? '+' : ''}${Math.round(weightChange * 10) / 10} kg`,
            sub: `${weightChangePct}% ${weightChange >= 0 ? 'gained' : 'lost'}`,
            icon: weightChange < -1 ? TrendingDown : weightChange > 1 ? TrendingUp : Minus,
            textCls: weightChange < -2 ? 'text-alert-critical' : weightChange < 0 ? 'text-terra' : 'text-sage',
          },
          { label: 'Avg Appetite', value: `${avgAppetite}/10`, sub: 'Last 14 days', icon: Apple, textCls: appetiteText(avgAppetite) },
          { label: 'Avg Fluids', value: `${avgFluids}`, sub: 'Glasses/day', icon: Droplets, textCls: avgFluids >= 6 ? 'text-sage' : 'text-terra' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className={clsx('h-4 w-4', stat.textCls)} />
              <span className="text-sm font-medium text-charcoal-light">{stat.label}</span>
            </div>
            <p className={clsx('font-mono text-xl font-bold', stat.textCls)}>{stat.value}</p>
            <p className="text-xs text-charcoal-light">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Weight Trend (dots) */}
      {weightsRecorded.length > 1 && (
        <div className="rounded-2xl bg-white p-5">
          <h2 className="mb-3 text-base font-semibold text-charcoal">Weight Trend</h2>
          <div className="flex items-end gap-2" style={{ height: '80px' }}>
            {weightsRecorded.map((w) => {
              const min = Math.min(...weightsRecorded.map((x) => x.weight)) - 1;
              const max = Math.max(...weightsRecorded.map((x) => x.weight)) + 1;
              const pct = ((w.weight - min) / (max - min)) * 100;
              return (
                <div key={w.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-charcoal">{w.weight}</span>
                  <div style={{ height: `${pct}%` }} className="flex items-end">
                    <div className="h-3 w-3 rounded-full bg-teal" />
                  </div>
                  <span className="text-[8px] text-charcoal-light">{new Date(w.date).getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appetite Chart */}
      <div className="rounded-2xl bg-white p-5">
        <h2 className="mb-3 text-base font-semibold text-charcoal">Appetite (last 14 days)</h2>
        <div className="flex items-end gap-1.5" style={{ height: '100px' }}>
          {history.slice(-14).map((h) => {
            const pct = (h.appetite / 10) * 100;
            return (
              <div key={h.id} className="flex flex-1 flex-col items-center gap-1">
                <span className={clsx('text-[9px] font-bold', appetiteText(h.appetite))}>{h.appetite}</span>
                <div
                  className={clsx('w-full overflow-hidden rounded-t opacity-80', appetiteBg(h.appetite))}
                  style={{ height: `${pct}%`, minHeight: '4px' }}
                />
                <span className="text-[8px] text-charcoal-light">{new Date(h.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Logs */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-charcoal">Recent Logs</h2>
        <div className="space-y-3">
          {history.slice(-5).reverse().map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', appetiteLightBg(h.appetite))}>
                  <Coffee className={clsx('h-4 w-4', appetiteText(h.appetite))} />
                </div>
                <div>
                  <p className="text-base font-semibold text-charcoal">
                    Appetite {h.appetite}/10 · {h.meals_eaten} meals · {h.fluid_intake} glasses
                  </p>
                  <p className="text-sm text-charcoal-light">
                    Intake: {h.oral_intake}{h.weight ? ` · ${h.weight} kg` : ''}
                    {h.nausea_affected ? ' · Nausea' : ''}
                    {h.mouth_problems ? ' · Mouth issues' : ''}
                  </p>
                </div>
              </div>
              <span className="text-sm text-charcoal-light">{h.date}</span>
            </div>
          ))}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-2xl bg-teal px-5 py-3 text-base font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" /> Nutrition logged!
        </div>
      )}
    </div>
  );
}
