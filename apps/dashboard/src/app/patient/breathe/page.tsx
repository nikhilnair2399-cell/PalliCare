'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Clock, TrendingUp, Lightbulb, History, BarChart3, Award } from 'lucide-react';
import { BreatheCircle } from '@/components/patient/BreatheCircle';
import { useLogBreatheSession, useBreatheStats } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_BREATHE_STATS } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Technique {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
}

const techniques: Technique[] = [
  { id: '478', name: '4-7-8 Breathing', description: 'Calming technique for sleep and anxiety', inhale: 4, hold: 7, exhale: 8 },
  { id: 'box', name: 'Box Breathing', description: 'Equal timing for focus and calm', inhale: 4, hold: 4, exhale: 4 },
  { id: 'deep', name: 'Deep Belly Breathing', description: 'Slow, deep breaths for relaxation', inhale: 5, hold: 2, exhale: 6 },
  { id: 'triangle', name: 'Triangle Breathing', description: 'Three-phase for gentle relaxation', inhale: 3, hold: 3, exhale: 3 },
];

const TECHNIQUE_BENEFITS: Record<string, { benefit: string; bestFor: string }> = {
  '478': { benefit: 'Activates your parasympathetic nervous system, helping you feel deeply calm', bestFor: 'Sleep, anxiety, panic' },
  'box': { benefit: 'Balances your autonomic system, improving focus and emotional regulation', bestFor: 'Focus, stress management' },
  'deep': { benefit: 'Increases oxygen, reduces heart rate, and eases muscle tension', bestFor: 'Pain relief, general relaxation' },
  'triangle': { benefit: 'Gentle rhythm that is easy to follow even when feeling unwell', bestFor: 'Nausea, fatigue, breathlessness' },
};

export default function BreathePage() {
  const [selectedTechnique, setSelectedTechnique] = useState<Technique>(techniques[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [rating, setRating] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const logSession = useLogBreatheSession();
  const statsQuery = useBreatheStats();
  const { data: stats } = useWithFallback(statsQuery, MOCK_BREATHE_STATS);
  const s = stats as any;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  function handleStartPause() {
    if (sessionComplete) return;
    setIsRunning(!isRunning);
  }

  function handleStop() {
    setIsRunning(false);
    if (elapsed >= 10) {
      setSessionComplete(true);
    } else {
      setElapsed(0);
    }
  }

  function handleSaveSession() {
    logSession.mutate(
      { technique: selectedTechnique.name, duration: elapsed, rating: rating || undefined },
      { onSuccess: () => resetSession(), onError: () => resetSession() },
    );
  }

  function resetSession() {
    setIsRunning(false);
    setElapsed(0);
    setSessionComplete(false);
    setRating(0);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-teal">Breathe</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Find calm and comfort through guided breathing
        </p>
      </div>

      {/* Hero: Breathing Circle */}
      <div className="flex flex-col items-center rounded-2xl bg-white py-10">
        <BreatheCircle
          inhale={selectedTechnique.inhale}
          hold={selectedTechnique.hold}
          exhale={selectedTechnique.exhale}
          isRunning={isRunning}
          elapsed={elapsed}
        />

        {/* Timer */}
        <p className="mt-6 font-mono text-2xl text-charcoal">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
        <p className="mt-1 text-sm text-charcoal-light">{selectedTechnique.name}</p>

        {/* Controls */}
        {!sessionComplete && (
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleStartPause}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-white shadow-lg transition-all hover:shadow-xl"
            >
              {isRunning ? <Pause className="h-7 w-7" /> : <Play className="ml-0.5 h-7 w-7" />}
            </button>
            {elapsed > 0 && (
              <button
                onClick={handleStop}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-charcoal-light transition-colors hover:bg-charcoal/5"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Session Complete */}
      {sessionComplete && (
        <div className="rounded-2xl bg-white p-8 text-center">
          <p className="font-heading text-2xl font-bold text-sage-dark">Session Complete!</p>
          <p className="mt-2 text-base text-charcoal-light">
            {minutes} min {seconds}s of mindful breathing
          </p>
          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-charcoal-light">How do you feel?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-all"
                  style={{ color: star <= rating ? '#E8A838' : 'rgba(45,45,45,0.15)' }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleSaveSession}
              className="rounded-2xl bg-teal px-8 py-4 text-base font-bold text-white transition-colors hover:bg-teal/90"
            >
              Save Session
            </button>
            <button
              onClick={resetSession}
              className="rounded-2xl bg-cream px-8 py-4 text-base font-medium text-charcoal-light transition-colors hover:bg-charcoal/5"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Weekly Stats Banner */}
      {!isRunning && !sessionComplete && (
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-2xl bg-white p-4">
            <TrendingUp className="mb-1 h-4 w-4 text-teal" />
            <span className="font-heading text-2xl font-bold text-charcoal">{s.total_sessions ?? 12}</span>
            <span className="text-xs text-charcoal-light">Total Sessions</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-4">
            <Clock className="mb-1 h-4 w-4 text-sage" />
            <span className="font-heading text-2xl font-bold text-charcoal">{s.total_minutes ?? 48}</span>
            <span className="text-xs text-charcoal-light">Minutes Breathed</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-4">
            <Flame className="mb-1 h-4 w-4 text-amber" />
            <span className="font-heading text-2xl font-bold text-charcoal">{s.streak ?? s.current_streak ?? 3}</span>
            <span className="text-xs text-charcoal-light">Day Streak</span>
          </div>
        </div>
      )}

      {/* Technique Tip */}
      {!isRunning && !sessionComplete && TECHNIQUE_BENEFITS[selectedTechnique.id] && (
        <div className="flex items-start gap-3 rounded-2xl bg-teal/5 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal" />
          <div>
            <p className="text-sm font-medium text-charcoal">{TECHNIQUE_BENEFITS[selectedTechnique.id].benefit}</p>
            <p className="mt-1 text-xs text-charcoal-light">Best for: {TECHNIQUE_BENEFITS[selectedTechnique.id].bestFor}</p>
          </div>
        </div>
      )}

      {/* Technique Selector */}
      {!isRunning && !sessionComplete && (
        <div className="rounded-2xl bg-white p-6">
          <h2 className="font-heading text-xl font-bold text-charcoal">Choose a Technique</h2>
          <div className="mt-4 space-y-3">
            {techniques.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedTechnique(t); setElapsed(0); }}
                className={`w-full rounded-xl p-4 text-left transition-all ${
                  selectedTechnique.id === t.id
                    ? 'bg-teal/5 ring-2 ring-teal/20'
                    : 'bg-cream/50 hover:bg-cream'
                }`}
              >
                <p className="text-base font-semibold text-charcoal">{t.name}</p>
                <p className="mt-1 text-sm text-charcoal-light">{t.description}</p>
                <p className="mt-2 text-sm font-medium text-teal">
                  {t.inhale}s in &middot; {t.hold}s hold &middot; {t.exhale}s out
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sprint 41 — Technique Usage Breakdown + Mindfulness Milestones */}
      {!isRunning && !sessionComplete && (() => {
        const recentSessions = (s.recent_sessions || s.sessions || [
          { technique: '4-7-8 Breathing', duration: 300, rating: 5, date: '2026-02-21T09:00:00' },
          { technique: 'Box Breathing', duration: 240, rating: 4, date: '2026-02-20T14:30:00' },
          { technique: 'Deep Belly Breathing', duration: 180, rating: 4, date: '2026-02-19T20:00:00' },
          { technique: '4-7-8 Breathing', duration: 360, rating: 5, date: '2026-02-18T08:15:00' },
          { technique: 'Triangle Breathing', duration: 150, rating: 3, date: '2026-02-17T21:00:00' },
          { technique: 'Box Breathing', duration: 200, rating: 4, date: '2026-02-16T10:00:00' },
          { technique: '4-7-8 Breathing', duration: 420, rating: 5, date: '2026-02-15T08:30:00' },
          { technique: 'Deep Belly Breathing', duration: 260, rating: 4, date: '2026-02-14T19:00:00' },
          { technique: 'Box Breathing', duration: 180, rating: 3, date: '2026-02-13T14:00:00' },
          { technique: '4-7-8 Breathing', duration: 300, rating: 5, date: '2026-02-12T09:00:00' },
          { technique: 'Triangle Breathing', duration: 120, rating: 3, date: '2026-02-11T21:30:00' },
          { technique: 'Deep Belly Breathing', duration: 240, rating: 4, date: '2026-02-10T17:00:00' },
        ]) as any[];
        const usageMap: Record<string, { count: number; totalMin: number; avgRating: number; ratings: number[] }> = {};
        recentSessions.forEach((sess: any) => {
          const name = sess.technique || 'Unknown';
          if (!usageMap[name]) usageMap[name] = { count: 0, totalMin: 0, avgRating: 0, ratings: [] };
          usageMap[name].count += 1;
          usageMap[name].totalMin += Math.round((sess.duration || 0) / 60);
          if (sess.rating) usageMap[name].ratings.push(sess.rating);
        });
        const usageEntries = Object.entries(usageMap).map(([name, data]) => ({
          name,
          count: data.count,
          totalMin: data.totalMin,
          avgRating: data.ratings.length > 0 ? Math.round(data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length * 10) / 10 : 0,
        })).sort((a, b) => b.count - a.count);
        const maxCount = Math.max(...usageEntries.map(e => e.count), 1);
        const totalMindfulMin = s.total_minutes ?? recentSessions.reduce((a: number, sess: any) => a + Math.round((sess.duration || 0) / 60), 0);
        const colors = ['bg-teal', 'bg-sage', 'bg-amber', 'bg-lavender'];

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-teal" />
                <h3 className="text-sm font-bold text-charcoal">Technique Breakdown</h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1">
                <Award className="h-3.5 w-3.5 text-teal" />
                <span className="text-xs font-bold text-teal">{totalMindfulMin} min total</span>
              </div>
            </div>
            <div className="space-y-3">
              {usageEntries.map((entry, i) => (
                <div key={entry.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-charcoal">{entry.name}</span>
                    <span className="text-xs text-charcoal/50">{entry.count} sessions · {entry.totalMin}m · {entry.avgRating > 0 ? `${entry.avgRating}★` : '—'}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-cream">
                    <div
                      className={`h-full rounded-full ${colors[i % colors.length]} transition-all`}
                      style={{ width: `${(entry.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {usageEntries.length > 0 && (
              <p className="mt-3 text-xs text-charcoal/40">
                Favourite: {usageEntries[0].name} — used {usageEntries[0].count} times with {usageEntries[0].avgRating}★ avg rating
              </p>
            )}
          </div>
        );
      })()}

      {/* Recent Sessions Log */}
      {!isRunning && !sessionComplete && (
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-teal" />
            <h2 className="font-heading text-xl font-bold text-charcoal">Recent Sessions</h2>
          </div>
          {(() => {
            const recentSessions = (s.recent_sessions || s.sessions || [
              { technique: '4-7-8 Breathing', duration: 300, rating: 5, date: '2026-02-21T09:00:00' },
              { technique: 'Box Breathing', duration: 240, rating: 4, date: '2026-02-20T14:30:00' },
              { technique: 'Deep Belly Breathing', duration: 180, rating: 4, date: '2026-02-19T20:00:00' },
              { technique: '4-7-8 Breathing', duration: 360, rating: 5, date: '2026-02-18T08:15:00' },
              { technique: 'Triangle Breathing', duration: 150, rating: 3, date: '2026-02-17T21:00:00' },
            ]) as any[];
            if (recentSessions.length === 0) return (
              <p className="py-4 text-center text-sm text-charcoal/40">No sessions yet. Start your first session above!</p>
            );
            return (
              <div className="space-y-2">
                {recentSessions.slice(0, 5).map((session: any, i: number) => {
                  const dur = session.duration || 0;
                  const mins = Math.floor(dur / 60);
                  const secs = dur % 60;
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-cream/50 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-xs font-bold text-teal">
                        {mins}m
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal">{session.technique}</p>
                        <p className="text-xs text-charcoal/40">
                          {session.date ? new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                          {secs > 0 ? ` · ${mins}m ${secs}s` : ` · ${mins} min`}
                        </p>
                      </div>
                      {session.rating && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: session.rating }, (_, j) => (
                            <span key={j} className="text-xs text-amber">★</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
