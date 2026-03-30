'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Pill, Heart, Wind, Sparkles, CheckCircle2, AlertCircle, Bell,
  CalendarClock, Lightbulb, Gauge, BarChart3, Flame, ArrowRight,
  X, Check, Clock, Smile, Meh, Frown, Angry, Laugh,
  Phone, Droplets, Target, BookOpen, Activity, Brain,
  Moon, Stethoscope, MessageCircle, Salad, GlassWater,
} from 'lucide-react';
import { usePatientProfile, useWellnessSummary, usePatientMedications, useCreateSymptomLog, useLogMedicationAdherence } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PATIENT_PROFILE, MOCK_WELLNESS_SUMMARY, MOCK_MEDICATIONS, MOCK_GOALS, MOCK_EDUCATION_MODULES } from '@/lib/patient-mock-data';
import { painColor, cn } from '@/lib/utils';
import { InstallPrompt } from '@/components/patient/InstallPrompt';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Mood options (5-point) ──────────────────────────────────
const MOOD_OPTIONS = [
  { key: 'great' as const, icon: Laugh, label: 'Great', color: 'bg-sage/15 text-sage-dark border-sage/30' },
  { key: 'good' as const, icon: Smile, label: 'Good', color: 'bg-sage/10 text-sage border-sage/20' },
  { key: 'okay' as const, icon: Meh, label: 'Okay', color: 'bg-amber/10 text-amber border-amber/30' },
  { key: 'low' as const, icon: Frown, label: 'Low', color: 'bg-terra/10 text-terra border-terra/30' },
  { key: 'bad' as const, icon: Angry, label: 'Bad', color: 'bg-red-100 text-red-600 border-red-200' },
];

// ── 7-Day Medication Adherence ─────────────────────────────
const ADHERENCE_7DAY = [
  { day: 'Mon', taken: 4, total: 4 },
  { day: 'Tue', taken: 4, total: 4 },
  { day: 'Wed', taken: 3, total: 4 },
  { day: 'Thu', taken: 4, total: 4 },
  { day: 'Fri', taken: 2, total: 4 },
  { day: 'Sat', taken: 4, total: 4 },
  { day: 'Sun', taken: 3, total: 4 },
];

// ── Care Team Alerts ───────────────────────────────────────
const PATIENT_ALERTS = [
  { id: 'pa1', type: 'info' as const, text: 'Gabapentin dose increased to 300mg TDS — monitor for dizziness', time: '2h ago' },
  { id: 'pa2', type: 'reminder' as const, text: 'Physiotherapy session at 2:30 PM today', time: '4h ago' },
  { id: 'pa3', type: 'warning' as const, text: 'Your pain trend is rising — please log symptoms regularly', time: '1d ago' },
];

const ALERT_STYLE = {
  info: { bg: 'bg-teal/10', text: 'text-teal', dot: 'bg-teal' },
  reminder: { bg: 'bg-amber/10', text: 'text-amber', dot: 'bg-amber' },
  warning: { bg: 'bg-terra/10', text: 'text-terra', dot: 'bg-terra' },
};

// ── Quick Navigation Items ────────────────────────────────
const QUICK_NAV = [
  { href: '/patient/log', icon: Activity, label: 'Log Symptoms', color: 'bg-terra/10 text-terra' },
  { href: '/patient/medications', icon: Pill, label: 'Medications', color: 'bg-teal/10 text-teal' },
  { href: '/patient/breathe', icon: Wind, label: 'Breathe', color: 'bg-sage/10 text-sage-dark' },
  { href: '/patient/learn', icon: BookOpen, label: 'Learn', color: 'bg-lavender/10 text-lavender' },
  { href: '/patient/pain-diary', icon: Brain, label: 'Pain Diary', color: 'bg-amber/10 text-amber' },
  { href: '/patient/journey', icon: Sparkles, label: 'My Journey', color: 'bg-dusty-rose/10 text-dusty-rose' },
  { href: '/patient/sleep', icon: Moon, label: 'Sleep', color: 'bg-teal/10 text-teal' },
  { href: '/patient/nutrition', icon: Salad, label: 'Nutrition', color: 'bg-sage/10 text-sage' },
];

// ── 7-Day Pain Trend mock ─────────────────────────────────
const PAIN_TREND_7DAY = [
  { day: 'Mon', score: 5 },
  { day: 'Tue', score: 6 },
  { day: 'Wed', score: 4 },
  { day: 'Thu', score: 5 },
  { day: 'Fri', score: 3 },
  { day: 'Sat', score: 4 },
  { day: 'Sun', score: 3 },
];

// ── Circular Progress Ring ─────────────────────────────────
function ProgressRing({ percentage, size = 56, stroke = 5 }: { percentage: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? '#7BA68C' : percentage >= 50 ? '#E8A838' : '#D4856B';

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F0EBE4" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  );
}

export default function PatientHomePage() {
  const [painScore, setPainScore] = useState(3);
  const [mood, setMood] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const [medActions, setMedActions] = useState<Record<string, 'taken' | 'skipped'>>({});
  const [skipReason, setSkipReason] = useState<{ medId: string; show: boolean }>({ medId: '', show: false });
  const [waterGlasses, setWaterGlasses] = useState(3);
  const [goalChecks, setGoalChecks] = useState<Record<string, boolean>>({
    'goal-1': true, 'goal-2': false, 'goal-3': false,
  });

  const profileQuery = usePatientProfile();
  const wellnessQuery = useWellnessSummary();
  const medsQuery = usePatientMedications();
  const createLog = useCreateSymptomLog();
  const logAdherence = useLogMedicationAdherence();

  const { data: profile } = useWithFallback(profileQuery, MOCK_PATIENT_PROFILE);
  const { data: wellness } = useWithFallback(wellnessQuery, MOCK_WELLNESS_SUMMARY);
  const { data: rawMeds } = useWithFallback(medsQuery, MOCK_MEDICATIONS);

  const p = profile as any;
  const w = wellness as any;
  const meds: any[] = Array.isArray(rawMeds) ? rawMeds : MOCK_MEDICATIONS;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  // Calculate medication stats
  const medStats = useMemo(() => {
    const scheduled = meds.filter((m: any) => !m.is_prn);
    let totalDoses = 0;
    let takenDoses = 0;
    scheduled.forEach((m: any) => {
      (m.schedule || []).forEach((s: any) => {
        totalDoses++;
        if (s.status === 'taken' || medActions[m.id] === 'taken') takenDoses++;
      });
    });
    return { totalDoses, takenDoses, percentage: totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0 };
  }, [meds, medActions]);

  function handleQuickLog() {
    createLog.mutate(
      { esas_scores: { pain: painScore }, mood: mood || 'okay', notes: '' },
      {
        onSuccess: () => setLogged(true),
        onError: () => setLogged(true),
      },
    );
  }

  function handleMedAction(medId: string, action: 'taken' | 'skipped') {
    setMedActions((prev) => ({ ...prev, [medId]: action }));
    logAdherence.mutate({
      medicationId: medId,
      status: action,
      timeTaken: action === 'taken' ? new Date().toISOString() : undefined,
    });
    setSkipReason({ medId: '', show: false });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      {/* Hero Greeting Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-teal to-sage px-5 py-5 sm:p-8 text-white">
        <p className="text-xs sm:text-sm font-medium text-white/60">{dateStr}</p>
        <h1 className="mt-1 font-heading text-xl sm:text-3xl font-bold break-words">
          {timeGreeting}, {p.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-white/75 italic break-words">
          &ldquo;{w.todays_intention || 'I will find moments of peace and gratitude today.'}&rdquo;
        </p>
      </div>

      {/* Install PWA prompt */}
      <InstallPrompt />

      {/* Emergency SOS / Quick Call */}
      <div className="flex gap-2 sm:gap-3">
        <a
          href="tel:+911234567890"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-alert-critical/90 p-3 sm:p-4 text-white transition-all hover:bg-alert-critical active:scale-[0.98]"
        >
          <Phone className="h-5 w-5" />
          <div>
            <p className="text-sm sm:text-base font-bold">Call Care Team</p>
            <p className="text-[10px] sm:text-xs text-white/70">Dr. Nikhil Nair&apos;s team</p>
          </div>
        </a>
        <Link
          href="/patient/messages"
          className="flex items-center gap-2 rounded-2xl bg-white border border-charcoal/10 px-4 sm:px-5 transition-all hover:border-teal/30 hover:bg-teal/5 active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5 text-teal" />
          <span className="text-sm font-semibold text-charcoal hidden sm:inline">Message</span>
        </Link>
      </div>

      {/* Quick Navigation Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {QUICK_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
          >
            <div className={cn('flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl', item.color)}>
              <item.icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-charcoal/70 text-center leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* How Are You Feeling? — Quick Check-in */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
        <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">How are you feeling?</h2>
        <p className="mt-1 text-sm text-charcoal-light">A quick check-in helps your care team understand your comfort.</p>

        {logged ? (
          <div className="mt-6 flex flex-col items-center gap-3 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/15">
              <CheckCircle2 className="h-10 w-10 text-sage" />
            </div>
            <p className="text-base font-semibold text-sage-dark">Logged! Thank you.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setLogged(false); setMood(null); setPainScore(3); }}
                className="text-sm text-teal hover:underline"
              >
                Log again
              </button>
              <Link href="/patient/log" className="text-sm text-charcoal/40 hover:text-teal">
                Full symptom log →
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Pain Slider */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal">Pain Level</span>
                <span
                  className="rounded-full px-3 py-1 text-sm font-bold text-white"
                  style={{ backgroundColor: painColor(painScore) }}
                >
                  {painScore}/10
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={painScore}
                onChange={(e) => setPainScore(Number(e.target.value))}
                className="mt-3 w-full accent-teal"
              />
              <div className="mt-1 flex justify-between text-xs sm:text-sm text-charcoal-light">
                <span>No pain</span>
                <span>Worst pain</span>
              </div>
            </div>

            {/* Mood — 5-point */}
            <div className="mt-5">
              <p className="text-sm font-medium text-charcoal">Mood</p>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMood(m.key)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border p-2.5 sm:p-3 transition-all',
                      mood === m.key ? m.color : 'border-charcoal/5 bg-cream/50 text-charcoal-light',
                    )}
                  >
                    <m.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    <span className="text-[10px] sm:text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Log Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleQuickLog}
                disabled={createLog.isPending}
                className="flex h-12 sm:h-14 flex-1 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-sm sm:text-base font-bold text-white transition-all hover:bg-teal/90 active:scale-[0.98] disabled:opacity-50"
              >
                {createLog.isPending ? 'Saving...' : 'Log Quick Check'}
              </button>
              <Link
                href="/patient/log"
                className="flex h-12 sm:h-14 items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl border border-charcoal/10 px-4 text-sm font-medium text-charcoal/60 transition-all hover:border-teal/30 hover:text-teal"
              >
                Full
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Today's Medications — with Take/Skip */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ProgressRing percentage={medStats.percentage} size={48} stroke={4} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-charcoal">
              {medStats.percentage}%
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">Today&apos;s Medications</h2>
            <p className="text-xs sm:text-sm text-charcoal-light">
              {medStats.takenDoses} of {medStats.totalDoses} doses taken
            </p>
          </div>
          <Link href="/patient/medications" className="text-sm font-semibold text-teal hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 space-y-2.5">
          {meds.filter((m: any) => !m.is_prn).slice(0, 4).map((med: any, i: number) => {
            const nextDose = (med.schedule || []).find((s: any) => s.status === 'pending');
            const allTaken = (med.schedule || []).length > 0 && (med.schedule || []).every((s: any) => s.status === 'taken');
            const action = medActions[med.id];

            return (
              <div key={med.id || i} className="flex items-center gap-3 rounded-xl bg-cream/50 p-3 sm:p-4">
                <div className={cn(
                  'flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl',
                  action === 'taken' || allTaken ? 'bg-sage/15' : action === 'skipped' ? 'bg-charcoal/5' : 'bg-amber/15',
                )}>
                  {action === 'taken' || allTaken
                    ? <Check className="h-5 w-5 text-sage-dark" />
                    : action === 'skipped'
                    ? <X className="h-5 w-5 text-charcoal/30" />
                    : <Pill className="h-5 w-5 text-amber" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm sm:text-base font-semibold truncate',
                    action === 'skipped' ? 'text-charcoal/40 line-through' : 'text-charcoal',
                  )}>
                    {med.name}
                  </p>
                  <p className="text-xs sm:text-sm text-charcoal-light">
                    {med.dose}
                    {nextDose && !action && <> &middot; <Clock className="inline h-3 w-3" /> {nextDose.label}</>}
                  </p>
                </div>

                {/* Action buttons */}
                {!action && !allTaken ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleMedAction(med.id, 'taken')}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage/15 text-sage-dark transition-all hover:bg-sage/25 active:scale-90"
                      title="Mark as taken"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMedAction(med.id, 'skipped')}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal/5 text-charcoal/40 transition-all hover:bg-charcoal/10 active:scale-90"
                      title="Skip this dose"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    action === 'taken' || allTaken ? 'bg-sage/10 text-sage-dark' : 'bg-charcoal/5 text-charcoal/40',
                  )}>
                    {action === 'taken' || allTaken ? 'Taken' : 'Skipped'}
                  </span>
                )}
              </div>
            );
          })}

          {/* PRN medications */}
          {meds.filter((m: any) => m.is_prn).length > 0 && (
            <div className="pt-1">
              <p className="text-xs font-medium text-charcoal/40 mb-2">As needed</p>
              {meds.filter((m: any) => m.is_prn).slice(0, 2).map((med: any) => (
                <div key={med.id} className="flex items-center gap-3 rounded-xl bg-cream/30 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lavender/20">
                    <Pill className="h-4 w-4 text-lavender" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{med.name} {med.dose}</p>
                    <p className="text-xs text-charcoal/40">
                      {med.last_taken
                        ? `Last taken: ${new Date(med.last_taken).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                        : 'Not taken today'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMedAction(med.id, 'taken')}
                    className="rounded-lg bg-teal/10 px-3 py-1.5 text-xs font-medium text-teal hover:bg-teal/20 transition-colors"
                  >
                    Take
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Adherence Chart */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">This Week&apos;s Adherence</h2>
          <span className="rounded-full bg-sage/10 px-3 py-1 text-sm font-semibold text-sage-dark">
            {Math.round(ADHERENCE_7DAY.reduce((s, d) => s + d.taken, 0) / ADHERENCE_7DAY.reduce((s, d) => s + d.total, 0) * 100)}%
          </span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          {ADHERENCE_7DAY.map((d) => {
            const pct = d.total > 0 ? (d.taken / d.total) * 100 : 0;
            const isToday = d.day === ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()];
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative h-20 w-full flex items-end justify-center">
                  <div
                    className={cn(
                      'w-full max-w-[28px] rounded-t-lg transition-all',
                      pct === 100 ? 'bg-sage' : pct >= 50 ? 'bg-amber/70' : 'bg-terra/60',
                    )}
                    style={{ height: `${Math.max(pct, 8)}%` }}
                  />
                </div>
                <span className={cn('text-xs font-medium', isToday ? 'text-teal font-bold' : 'text-charcoal/40')}>
                  {d.day}
                </span>
                <span className="text-[10px] text-charcoal/30">{d.taken}/{d.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Care Team Updates */}
      {PATIENT_ALERTS.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal" />
            <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">From Your Care Team</h2>
          </div>
          <div className="mt-4 space-y-2.5">
            {PATIENT_ALERTS.map((alert) => {
              const style = ALERT_STYLE[alert.type];
              return (
                <div key={alert.id} className={cn('flex items-start gap-3 rounded-xl p-3 sm:p-4', style.bg)}>
                  <span className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', style.dot)} />
                  <div className="flex-1">
                    <p className={cn('text-sm font-medium', style.text)}>{alert.text}</p>
                    <p className="mt-0.5 text-xs text-charcoal/40">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hydration Tracker + Active Goals — side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Hydration Tracker */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GlassWater className="h-5 w-5 text-teal" />
              <h2 className="font-heading text-sm sm:text-base font-bold text-charcoal">Hydration</h2>
            </div>
            <span className="text-xs font-medium text-charcoal/40">{waterGlasses}/8 glasses</span>
          </div>
          <div className="grid grid-cols-8 gap-1.5 mb-3">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                onClick={() => setWaterGlasses(i + 1 === waterGlasses ? i : i + 1)}
                className={cn(
                  'flex items-center justify-center rounded-lg p-2 transition-all active:scale-90',
                  i < waterGlasses ? 'bg-teal/15 text-teal' : 'bg-charcoal/5 text-charcoal/20',
                )}
              >
                <Droplets className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-teal transition-all"
              style={{ width: `${(waterGlasses / 8) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-charcoal/40">
            {waterGlasses >= 8
              ? 'Well done! You have met your hydration goal today.'
              : waterGlasses >= 5
              ? `${8 - waterGlasses} more to go. Keep sipping!`
              : 'Staying hydrated helps with medication absorption and comfort.'}
          </p>
        </div>

        {/* Active Goals Checklist */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-sage" />
              <h2 className="font-heading text-sm sm:text-base font-bold text-charcoal">Today&apos;s Goals</h2>
            </div>
            <span className="text-xs font-medium text-charcoal/40">
              {Object.values(goalChecks).filter(Boolean).length}/{MOCK_GOALS.length}
            </span>
          </div>
          <div className="space-y-2">
            {MOCK_GOALS.map((goal: any) => {
              const checked = goalChecks[goal.id] ?? goal.completed_today;
              return (
                <button
                  key={goal.id}
                  onClick={() => setGoalChecks((prev) => ({ ...prev, [goal.id]: !checked }))}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all',
                    checked ? 'bg-sage/10' : 'bg-cream/50 hover:bg-cream',
                  )}
                >
                  <div className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all',
                    checked ? 'bg-sage border-sage text-white' : 'border-charcoal/20 bg-white',
                  )}>
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      checked ? 'text-charcoal/50 line-through' : 'text-charcoal',
                    )}>{goal.title}</p>
                    {goal.streak > 0 && (
                      <p className="text-[10px] text-charcoal/30">{goal.streak} day streak</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <Link
            href="/patient/journey"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
          >
            Manage goals <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Wellness Score */}
      {(() => {
        const adherenceScore = Math.round(ADHERENCE_7DAY.reduce((s, d) => s + d.taken, 0) / ADHERENCE_7DAY.reduce((s, d) => s + d.total, 0) * 100);
        const painControl = Math.max(0, 100 - (painScore * 10));
        const moodScore = mood === 'great' ? 95 : mood === 'good' ? 80 : mood === 'okay' ? 60 : mood === 'low' ? 35 : mood === 'bad' ? 15 : 70;
        const engagementScore = Math.min(100, ((w.breathe_sessions ?? 12) * 3 + (w.gratitude_count ?? 5) * 5));
        const composite = Math.round((adherenceScore * 0.3 + painControl * 0.3 + moodScore * 0.2 + engagementScore * 0.2));
        const dimensions = [
          { label: 'Medication', score: adherenceScore, weight: '30%', color: 'bg-teal' },
          { label: 'Pain Control', score: painControl, weight: '30%', color: 'bg-sage' },
          { label: 'Mood', score: moodScore, weight: '20%', color: 'bg-amber' },
          { label: 'Engagement', score: engagementScore, weight: '20%', color: 'bg-lavender' },
        ];
        const scoreColor = composite >= 75 ? 'text-sage-dark' : composite >= 50 ? 'text-amber' : 'text-terra';
        const scoreBg = composite >= 75 ? 'bg-sage/10' : composite >= 50 ? 'bg-amber/10' : 'bg-terra/10';
        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-teal" />
                <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">Wellness Score</h2>
              </div>
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', scoreBg)}>
                <span className={cn('font-heading text-xl font-bold', scoreColor)}>{composite}</span>
              </div>
            </div>
            <div className="space-y-3">
              {dimensions.map((dim) => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-charcoal/60">{dim.label} <span className="text-[10px] text-charcoal/30">({dim.weight})</span></span>
                    <span className="text-sm font-bold text-charcoal">{dim.score}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div className={cn('h-full rounded-full transition-all', dim.color)} style={{ width: `${dim.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-charcoal/40">
              {composite >= 75
                ? 'You are doing great! Your overall wellness is strong. Keep it up.'
                : composite >= 50
                ? 'Good progress. Focus on areas scoring lower to improve your overall comfort.'
                : 'Your care team is here to help. Please share how you feel with them at your next visit.'}
            </p>
          </div>
        );
      })()}

      {/* Logging Streak */}
      {(() => {
        const LOG_HISTORY = Array.from({ length: 21 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (20 - i));
          const didLog = Math.random() > 0.2;
          return { date: d.toISOString().split('T')[0], day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], logged: didLog };
        });
        let currentStreak = 0;
        for (let i = LOG_HISTORY.length - 1; i >= 0; i--) {
          if (LOG_HISTORY[i].logged) currentStreak++;
          else break;
        }
        let bestStreak = 0;
        let tempStreak = 0;
        LOG_HISTORY.forEach((d) => {
          if (d.logged) { tempStreak++; bestStreak = Math.max(bestStreak, tempStreak); }
          else tempStreak = 0;
        });
        const loggedDays = LOG_HISTORY.filter((d) => d.logged).length;
        const consistency = Math.round((loggedDays / LOG_HISTORY.length) * 100);

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-amber" />
              <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">Logging Streak</h2>
              <span className={cn(
                'ml-auto rounded-full px-3 py-1 text-xs font-bold',
                currentStreak >= 7 ? 'bg-sage/10 text-sage-dark' : currentStreak >= 3 ? 'bg-amber/10 text-amber' : 'bg-cream text-charcoal/40',
              )}>
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="text-center text-[9px] font-semibold text-charcoal/40">{d}</div>
              ))}
              {LOG_HISTORY.map((d, i) => {
                const isToday = i === LOG_HISTORY.length - 1;
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center justify-center rounded-lg p-1.5 text-[10px] font-bold',
                      d.logged ? 'bg-teal/20 text-teal' : 'bg-charcoal/5 text-charcoal/20',
                      isToday && 'ring-2 ring-teal',
                    )}
                  >
                    {new Date(d.date).getDate()}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="text-lg font-bold text-amber">{currentStreak}</p>
                <p className="text-[10px] text-charcoal/40">current streak</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="text-lg font-bold text-sage-dark">{bestStreak}</p>
                <p className="text-[10px] text-charcoal/40">best streak</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className={cn('text-lg font-bold', consistency >= 80 ? 'text-sage-dark' : consistency >= 50 ? 'text-amber' : 'text-terra')}>{consistency}%</p>
                <p className="text-[10px] text-charcoal/40">consistency</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 7-Day Pain Trend */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-terra" />
            <h2 className="font-heading text-base sm:text-xl font-bold text-charcoal">Pain Trend</h2>
          </div>
          <Link href="/patient/pain-diary" className="text-xs font-semibold text-teal hover:underline">
            Full diary →
          </Link>
        </div>
        {/* Sparkline chart */}
        <div className="flex items-end gap-2">
          {PAIN_TREND_7DAY.map((d, i) => {
            const isToday = d.day === ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()];
            const barColor = d.score >= 7 ? 'bg-alert-critical/70' : d.score >= 4 ? 'bg-amber/70' : 'bg-sage';
            const prev = i > 0 ? PAIN_TREND_7DAY[i - 1].score : d.score;
            const diff = d.score - prev;
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-charcoal/50">{d.score}</span>
                <div className="relative h-20 w-full flex items-end justify-center">
                  <div
                    className={cn('w-full max-w-[28px] rounded-t-lg transition-all', barColor)}
                    style={{ height: `${Math.max(d.score * 10, 8)}%` }}
                  />
                </div>
                <span className={cn('text-xs font-medium', isToday ? 'text-teal font-bold' : 'text-charcoal/40')}>
                  {d.day}
                </span>
                {i > 0 && (
                  <span className={cn(
                    'text-[9px] font-medium',
                    diff < 0 ? 'text-sage-dark' : diff > 0 ? 'text-terra' : 'text-charcoal/20',
                  )}>
                    {diff < 0 ? `↓${Math.abs(diff)}` : diff > 0 ? `↑${diff}` : '—'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {(() => {
          const avg = PAIN_TREND_7DAY.reduce((s, d) => s + d.score, 0) / PAIN_TREND_7DAY.length;
          const latest = PAIN_TREND_7DAY[PAIN_TREND_7DAY.length - 1].score;
          const first = PAIN_TREND_7DAY[0].score;
          const trend = latest < first ? 'improving' : latest > first ? 'rising' : 'stable';
          return (
            <div className={cn(
              'mt-4 rounded-xl px-4 py-2.5 text-sm font-medium',
              trend === 'improving' ? 'bg-sage/10 text-sage-dark' : trend === 'rising' ? 'bg-terra/10 text-terra' : 'bg-cream text-charcoal/60',
            )}>
              {trend === 'improving'
                ? `Your pain has been improving this week. Average: ${avg.toFixed(1)}/10. Keep it up!`
                : trend === 'rising'
                ? `Your pain is trending up (avg ${avg.toFixed(1)}/10). Consider discussing with your care team.`
                : `Pain is stable at ${avg.toFixed(1)}/10 this week.`}
            </div>
          );
        })()}
      </div>

      {/* Next Appointment */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10">
            <CalendarClock className="h-6 w-6 text-teal" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase text-charcoal/40">Next Appointment</p>
            <p className="mt-0.5 text-base font-bold text-charcoal">
              {w.next_appointment_date || '25 Feb 2026'} at {w.next_appointment_time || '10:30 AM'}
            </p>
            <p className="text-sm text-charcoal-light">
              {w.next_appointment_doctor || p.primary_clinician || 'Dr. Nikhil Nair'} &middot; {w.next_appointment_type || 'Follow-up Review'}
            </p>
          </div>
        </div>
        {(() => {
          const apptDate = new Date(w.next_appointment_date || '2026-02-25');
          const daysUntil = Math.max(0, Math.ceil((apptDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          if (daysUntil <= 3 && daysUntil > 0) return (
            <p className="mt-3 rounded-xl bg-amber/10 px-4 py-2 text-sm font-medium text-amber">
              Coming up in {daysUntil} day{daysUntil !== 1 ? 's' : ''} — remember to log your symptoms before visiting
            </p>
          );
          if (daysUntil === 0) return (
            <p className="mt-3 rounded-xl bg-teal/10 px-4 py-2 text-sm font-medium text-teal">
              Your appointment is today! Review your pain diary before you go.
            </p>
          );
          return null;
        })()}
      </div>

      {/* Daily Wellness Tip */}
      {(() => {
        const tips = [
          'Gentle stretching for 5 minutes can help ease stiffness and improve your mood.',
          'Stay hydrated — aim for 6-8 glasses of water. It helps with medication absorption too.',
          'Deep breathing for 2 minutes can reduce pain perception. Try the Breathe section.',
          'Writing one thing you are grateful for today can shift your focus and improve wellbeing.',
          'Taking medications at the same time each day helps maintain steady pain control.',
          'A short walk, even around the room, supports circulation and reduces fatigue.',
          'Listening to calming music can reduce anxiety and help with sleep quality.',
        ];
        const dayIndex = today.getDay();
        const tip = tips[dayIndex];
        return (
          <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-sage/5 to-teal/5 p-4 sm:p-5">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
            <div>
              <p className="text-xs font-bold uppercase text-sage-dark">Daily Wellness Tip</p>
              <p className="mt-1 text-sm text-charcoal/70">{tip}</p>
            </div>
          </div>
        );
      })()}

      {/* Continue Learning */}
      {(() => {
        const eduModules = MOCK_EDUCATION_MODULES as any[];
        const inProgress = eduModules.filter((m) => m.progress > 0 && m.progress < 100);
        const notStarted = eduModules.filter((m) => m.progress === 0);
        const suggested = inProgress.length > 0 ? inProgress[0] : notStarted[0];
        if (!suggested) return null;
        const catColor: Record<string, string> = {
          'Pain Management': 'bg-terra/10 text-terra',
          'Emotional Wellness': 'bg-lavender/10 text-lavender',
          'Wellness': 'bg-sage/10 text-sage-dark',
          'Life & Meaning': 'bg-dusty-rose/10 text-dusty-rose',
          'Symptom Management': 'bg-terra/10 text-terra',
          'Safety': 'bg-alert-critical/10 text-alert-critical',
          'Communication': 'bg-teal/10 text-teal',
          'Spiritual Care': 'bg-lavender/10 text-lavender',
          'Family & Caregiving': 'bg-amber/10 text-amber',
          'Nutrition': 'bg-amber/10 text-amber',
        };
        return (
          <Link href={`/patient/learn/${suggested.id}`} className="block overflow-hidden rounded-2xl bg-white transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lavender/10">
                  <BookOpen className="h-5 w-5 text-lavender" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase text-charcoal/40">
                    {suggested.progress > 0 ? 'Continue Learning' : 'Recommended For You'}
                  </p>
                  <p className="mt-0.5 text-sm sm:text-base font-bold text-charcoal truncate">{suggested.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', catColor[suggested.category] || 'bg-charcoal/5 text-charcoal/40')}>
                      {suggested.category}
                    </span>
                    <span className="text-[10px] text-charcoal/40">{suggested.duration}</span>
                  </div>
                </div>
                <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-charcoal/30" />
              </div>
              {suggested.progress > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-charcoal/40 mb-1">
                    <span>{suggested.progress}% complete</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-lavender transition-all" style={{ width: `${suggested.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      })()}

      {/* Wellness Stats — 2 cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Link href="/patient/journey" className="block overflow-hidden rounded-2xl bg-white p-3 sm:p-6 transition-all hover:-translate-y-0.5">
          <Heart className="h-6 w-6 text-terra" />
          <p className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-charcoal">
            {w.gratitude_streak ?? w.streak ?? 5}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-charcoal-light">Day gratitude streak</p>
        </Link>
        <Link href="/patient/breathe" className="block overflow-hidden rounded-2xl bg-white p-3 sm:p-6 transition-all hover:-translate-y-0.5">
          <Wind className="h-6 w-6 text-sage" />
          <p className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-charcoal">
            {w.breathe_sessions ?? w.total_sessions ?? 12}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-charcoal-light">Breathe sessions</p>
        </Link>
      </div>

      {/* Journey Summary */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber" />
          <h3 className="text-base font-semibold text-charcoal">Your Journey</h3>
        </div>
        <p className="mt-3 text-sm text-charcoal-light">
          You&apos;ve set {w.goals_count ?? 3} goals and logged {w.gratitude_count ?? w.gratitude_streak ?? 5} gratitude entries.
          Keep going &mdash; every moment of reflection matters.
        </p>
        <Link
          href="/patient/journey"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
        >
          Visit your journey <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
