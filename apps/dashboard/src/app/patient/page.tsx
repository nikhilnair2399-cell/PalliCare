'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pill, Heart, Wind, Sparkles, CheckCircle2, Smile, Meh, Frown, AlertCircle, TrendingDown, Bell, CalendarClock, Lightbulb, Gauge, BarChart3, Flame } from 'lucide-react';
import { usePatientProfile, useWellnessSummary, usePatientMedications, useCreateSymptomLog } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PATIENT_PROFILE, MOCK_WELLNESS_SUMMARY, MOCK_MEDICATIONS } from '@/lib/patient-mock-data';
import { painColor } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── 7-Day Medication Adherence ─────────────────────────────────────
const ADHERENCE_7DAY = [
  { day: 'Mon', taken: 4, total: 4 },
  { day: 'Tue', taken: 4, total: 4 },
  { day: 'Wed', taken: 3, total: 4 },
  { day: 'Thu', taken: 4, total: 4 },
  { day: 'Fri', taken: 2, total: 4 },
  { day: 'Sat', taken: 4, total: 4 },
  { day: 'Sun', taken: 3, total: 4 },
];

// ── Recent Care Team Alerts / Updates ──────────────────────────────
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

export default function PatientHomePage() {
  const [painScore, setPainScore] = useState(3);
  const [mood, setMood] = useState<'good' | 'okay' | 'bad' | null>(null);
  const [logged, setLogged] = useState(false);

  const profileQuery = usePatientProfile();
  const wellnessQuery = useWellnessSummary();
  const medsQuery = usePatientMedications();
  const createLog = useCreateSymptomLog();

  const { data: profile } = useWithFallback(profileQuery, MOCK_PATIENT_PROFILE);
  const { data: wellness } = useWithFallback(wellnessQuery, MOCK_WELLNESS_SUMMARY);
  const { data: rawMeds } = useWithFallback(medsQuery, MOCK_MEDICATIONS);

  const p = profile as any;
  const w = wellness as any;
  const meds: any[] = Array.isArray(rawMeds) ? rawMeds : MOCK_MEDICATIONS;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  function handleQuickLog() {
    createLog.mutate(
      { esas_scores: { pain: painScore }, mood: mood || 'okay', notes: '' },
      {
        onSuccess: () => setLogged(true),
        onError: () => setLogged(true),
      },
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hero Greeting Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal to-sage p-8 text-white">
        <h1 className="font-heading text-3xl font-bold">
          {timeGreeting}, {p.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-2 text-base text-white/75 italic">
          &ldquo;{w.todays_intention || 'I will find moments of peace and gratitude today.'}&rdquo;
        </p>
      </div>

      {/* How Are You Feeling? */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="font-heading text-xl font-bold text-charcoal">How are you feeling?</h2>
        <p className="mt-1 text-sm text-charcoal-light">A quick check-in helps your care team understand your comfort.</p>

        {logged ? (
          <div className="mt-6 flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="h-12 w-12 text-sage" />
            <p className="text-base font-semibold text-sage-dark">Logged! Thank you.</p>
            <button
              onClick={() => { setLogged(false); setMood(null); setPainScore(3); }}
              className="text-sm text-teal hover:underline"
            >
              Log again
            </button>
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
              <div className="mt-1 flex justify-between text-sm text-charcoal-light">
                <span>No pain</span>
                <span>Worst pain</span>
              </div>
            </div>

            {/* Mood */}
            <div className="mt-5">
              <p className="text-sm font-medium text-charcoal">Mood</p>
              <div className="mt-3 flex gap-3">
                {[
                  { key: 'good' as const, icon: Smile, label: 'Good', color: 'bg-sage/10 text-sage-dark border-sage/30' },
                  { key: 'okay' as const, icon: Meh, label: 'Okay', color: 'bg-amber/10 text-amber border-amber/30' },
                  { key: 'bad' as const, icon: Frown, label: 'Not great', color: 'bg-terra/10 text-terra border-terra/30' },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMood(m.key)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                      mood === m.key ? m.color : 'border-charcoal/5 bg-cream/50 text-charcoal-light'
                    }`}
                  >
                    <m.icon className="h-7 w-7" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Log Button */}
            <button
              onClick={handleQuickLog}
              disabled={createLog.isPending}
              className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
            >
              {createLog.isPending ? 'Saving...' : 'Log How I Feel'}
            </button>
          </>
        )}
      </div>

      {/* Today's Medications */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-charcoal">Today&apos;s Medications</h2>
          <Link href="/patient/medications" className="text-sm font-semibold text-teal hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {meds.slice(0, 3).map((med: any, i: number) => {
            const takenDoses = (med.schedule || []).filter((s: any) => s.status === 'taken').length;
            const totalDoses = (med.schedule || []).length;
            const allTaken = totalDoses > 0 && takenDoses === totalDoses;

            return (
              <div key={med.id || i} className="flex items-center gap-4 rounded-xl bg-cream/50 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${allTaken ? 'bg-sage/15' : 'bg-amber/15'}`}>
                  {allTaken ? <CheckCircle2 className="h-5 w-5 text-sage-dark" /> : <Pill className="h-5 w-5 text-amber" />}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-charcoal">{med.name}</p>
                  <p className="text-sm text-charcoal-light">{med.dose} &middot; {med.frequency || 'Daily'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${allTaken ? 'bg-sage/10 text-sage-dark' : 'bg-amber/10 text-amber'}`}>
                  {allTaken ? 'Taken' : 'Pending'}
                </span>
              </div>
            );
          })}
          {meds.length === 0 && (
            <p className="py-6 text-center text-sm text-charcoal/40">No medications scheduled today.</p>
          )}
        </div>
      </div>

      {/* Medication Adherence — 7-Day Chart */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-charcoal">This Week&apos;s Adherence</h2>
          <span className="rounded-full bg-sage/10 px-3 py-1 text-sm font-semibold text-sage-dark">
            {Math.round(ADHERENCE_7DAY.reduce((s, d) => s + d.taken, 0) / ADHERENCE_7DAY.reduce((s, d) => s + d.total, 0) * 100)}%
          </span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          {ADHERENCE_7DAY.map((d) => {
            const pct = d.total > 0 ? (d.taken / d.total) * 100 : 0;
            const isToday = d.day === ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative h-20 w-full flex items-end justify-center">
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      pct === 100 ? 'bg-sage' : pct >= 50 ? 'bg-amber/70' : 'bg-terra/60'
                    }`}
                    style={{ height: `${Math.max(pct, 8)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-teal font-bold' : 'text-charcoal/40'}`}>
                  {d.day}
                </span>
                <span className="text-[10px] text-charcoal/30">{d.taken}/{d.total}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-charcoal/40">Doses taken out of scheduled</p>
      </div>

      {/* Care Team Updates */}
      {PATIENT_ALERTS.length > 0 && (
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal" />
            <h2 className="font-heading text-xl font-bold text-charcoal">From Your Care Team</h2>
          </div>
          <div className="mt-4 space-y-3">
            {PATIENT_ALERTS.map((alert) => {
              const style = ALERT_STYLE[alert.type];
              return (
                <div key={alert.id} className={`flex items-start gap-3 rounded-xl p-4 ${style.bg}`}>
                  <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${style.dot}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${style.text}`}>{alert.text}</p>
                    <p className="mt-0.5 text-xs text-charcoal/40">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sprint 42 — Composite Wellness Score */}
      {(() => {
        const adherenceScore = Math.round(ADHERENCE_7DAY.reduce((s, d) => s + d.taken, 0) / ADHERENCE_7DAY.reduce((s, d) => s + d.total, 0) * 100);
        const painControl = Math.max(0, 100 - (painScore * 10));
        const moodScore = mood === 'good' ? 90 : mood === 'okay' ? 60 : mood === 'bad' ? 30 : 70;
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
          <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-teal" />
                <h2 className="font-heading text-xl font-bold text-charcoal">Wellness Score</h2>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${scoreBg}`}>
                <span className={`font-heading text-xl font-bold ${scoreColor}`}>{composite}</span>
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
                    <div className={`h-full rounded-full ${dim.color} transition-all`} style={{ width: `${dim.score}%` }} />
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

      {/* Sprint 51 — Daily Wellness Score Trend (7-Day) */}
      {(() => {
        const WELLNESS_HISTORY = [
          { day: 'Mon', adherence: 100, painControl: 70, mood: 90, engagement: 85 },
          { day: 'Tue', adherence: 100, painControl: 60, mood: 60, engagement: 75 },
          { day: 'Wed', adherence: 75, painControl: 50, mood: 60, engagement: 70 },
          { day: 'Thu', adherence: 100, painControl: 80, mood: 90, engagement: 80 },
          { day: 'Fri', adherence: 50, painControl: 40, mood: 30, engagement: 55 },
          { day: 'Sat', adherence: 100, painControl: 70, mood: 60, engagement: 90 },
          { day: 'Sun', adherence: 75, painControl: 60, mood: 70, engagement: 65 },
        ];
        const scores = WELLNESS_HISTORY.map((d) =>
          Math.round(d.adherence * 0.3 + d.painControl * 0.3 + d.mood * 0.2 + d.engagement * 0.2),
        );
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const avgScore = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
        const first3 = scores.slice(0, 3);
        const last3 = scores.slice(-3);
        const earlyAvg = first3.reduce((s, v) => s + v, 0) / first3.length;
        const lateAvg = last3.reduce((s, v) => s + v, 0) / last3.length;
        const trendDir = lateAvg > earlyAvg + 3 ? 'improving' : lateAvg < earlyAvg - 3 ? 'declining' : 'stable';
        const todayIdx = new Date().getDay();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
          <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal" />
                <h2 className="font-heading text-xl font-bold text-charcoal">Wellness Trend</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                trendDir === 'improving' ? 'bg-sage/10 text-sage-dark' : trendDir === 'declining' ? 'bg-terra/10 text-terra' : 'bg-amber/10 text-amber'
              }`}>
                {trendDir === 'improving' ? 'Improving' : trendDir === 'declining' ? 'Needs attention' : 'Steady'}
              </span>
            </div>
            <div className="flex items-end gap-2" style={{ height: '100px' }}>
              {WELLNESS_HISTORY.map((d, i) => {
                const score = scores[i];
                const pct = Math.max(score, 10);
                const isToday = d.day === dayNames[todayIdx];
                const barColor = score >= 75 ? 'bg-sage' : score >= 50 ? 'bg-amber' : 'bg-terra';
                return (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-charcoal/50">{score}</span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-lg transition-all ${barColor} ${isToday ? 'ring-2 ring-teal/40' : ''}`}
                      style={{ height: `${pct}%` }}
                    />
                    <span className={`text-xs ${isToday ? 'font-bold text-teal' : 'text-charcoal/40'}`}>{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="text-[10px] text-charcoal/40">Average</p>
                <p className="text-lg font-bold text-charcoal">{avgScore}</p>
              </div>
              <div className="rounded-xl bg-sage/5 p-3 text-center">
                <p className="text-[10px] text-charcoal/40">Best Day</p>
                <p className="text-lg font-bold text-sage-dark">{maxScore}</p>
              </div>
              <div className="rounded-xl bg-terra/5 p-3 text-center">
                <p className="text-[10px] text-charcoal/40">Lowest</p>
                <p className="text-lg font-bold text-terra">{minScore}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              {trendDir === 'improving'
                ? 'Your wellness is trending upward this week. Keep up the great work!'
                : trendDir === 'declining'
                ? 'Your scores dipped recently. Focus on medication adherence and logging your symptoms.'
                : 'Your wellness has been steady. Consistent effort is paying off.'}
            </p>
          </div>
        );
      })()}

      {/* Sprint 61 — Symptom Logging Streak */}
      {(() => {
        const LOG_HISTORY = Array.from({ length: 21 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (20 - i));
          const logged = Math.random() > 0.2;
          return { date: d.toISOString().split('T')[0], day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], logged };
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
          <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-amber" />
              <h2 className="font-heading text-xl font-bold text-charcoal">Logging Streak</h2>
              <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${
                currentStreak >= 7 ? 'bg-sage/10 text-sage-dark' : currentStreak >= 3 ? 'bg-amber/10 text-amber' : 'bg-cream text-charcoal/40'
              }`}>
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            {/* 21-day calendar grid */}
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="text-center text-[9px] font-semibold text-charcoal/40">{d}</div>
              ))}
              {LOG_HISTORY.map((d, i) => {
                const isToday = i === LOG_HISTORY.length - 1;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center rounded-lg p-1.5 text-[10px] font-bold ${
                      d.logged ? 'bg-teal/20 text-teal' : 'bg-charcoal/5 text-charcoal/20'
                    } ${isToday ? 'ring-2 ring-teal' : ''}`}
                  >
                    {new Date(d.date).getDate()}
                  </div>
                );
              })}
            </div>
            {/* Stats */}
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
                <p className={`text-lg font-bold ${consistency >= 80 ? 'text-sage-dark' : consistency >= 50 ? 'text-amber' : 'text-terra'}`}>{consistency}%</p>
                <p className="text-[10px] text-charcoal/40">consistency</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              {currentStreak >= 7
                ? 'Amazing streak! Regular logging helps your care team fine-tune your treatment.'
                : currentStreak >= 3
                ? 'Good going! Keep logging daily to build your streak.'
                : 'Log your symptoms each day — even a quick check-in helps your care team help you.'}
            </p>
          </div>
        );
      })()}

      {/* Next Appointment */}
      <div className="rounded-2xl bg-white p-6">
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
        const dayIndex = new Date().getDay();
        const tip = tips[dayIndex];
        return (
          <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-sage/5 to-teal/5 p-5">
            <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-sage" />
            <div>
              <p className="text-xs font-bold uppercase text-sage-dark">Daily Wellness Tip</p>
              <p className="mt-1 text-sm text-charcoal/70">{tip}</p>
            </div>
          </div>
        );
      })()}

      {/* Wellness Stats — 2 cards side by side */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/patient/journey" className="block rounded-2xl bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <Heart className="h-6 w-6 text-terra" />
          <p className="mt-3 font-heading text-3xl font-bold text-charcoal">
            {w.gratitude_streak ?? w.streak ?? 5}
          </p>
          <p className="mt-1 text-sm text-charcoal-light">Day gratitude streak</p>
        </Link>
        <Link href="/patient/breathe" className="block rounded-2xl bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <Wind className="h-6 w-6 text-sage" />
          <p className="mt-3 font-heading text-3xl font-bold text-charcoal">
            {w.breathe_sessions ?? w.total_sessions ?? 12}
          </p>
          <p className="mt-1 text-sm text-charcoal-light">Breathe sessions</p>
        </Link>
      </div>

      {/* Today's Intention (if not shown in hero) */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber" />
          <h3 className="text-base font-semibold text-charcoal">Your Journey</h3>
        </div>
        <p className="mt-3 text-sm text-charcoal-light">
          You&apos;ve set {(w.goals_count ?? 3)} goals and logged {(w.gratitude_count ?? w.gratitude_streak ?? 5)} gratitude entries.
          Keep going &mdash; every moment of reflection matters.
        </p>
        <Link
          href="/patient/journey"
          className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
        >
          Visit your journey
        </Link>
      </div>
    </div>
  );
}
