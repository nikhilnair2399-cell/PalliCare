'use client';

import { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { BreatheCircle } from '@/components/patient/BreatheCircle';
import { useLogBreatheSession, useBreatheStats } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_BREATHE_STATS } from '@/lib/patient-mock-data';
import { StatCard } from '@/components/ui/StatCard';

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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Breathe</h1>
        <p className="text-sm text-charcoal-light">
          Guided breathing exercises for comfort and calm
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sessions"
          value={String(s.total_sessions ?? 0)}
          change="Breathing sessions completed"
          changeType="increase"
          icon={<Wind className="h-5 w-5" />}
        />
        <StatCard
          title="Total Minutes"
          value={String(s.total_minutes ?? 0)}
          change="Minutes of mindful breathing"
          changeType="info"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="This Week"
          value={String(s.week_sessions ?? 0)}
          change="Sessions this week"
          changeType="info"
          icon={<Wind className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Rating"
          value={s.avg_rating ? String(s.avg_rating.toFixed(1)) : '-'}
          change="Average session rating"
          changeType="increase"
          icon={<Wind className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Technique Selector — 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Technique Cards */}
          {!isRunning && !sessionComplete && (
            <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
              <div className="border-b border-sage-light/20 px-5 py-4">
                <h2 className="font-heading text-lg font-bold text-teal">Choose a Technique</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                {techniques.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTechnique(t); setElapsed(0); }}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      selectedTechnique.id === t.id
                        ? 'border-teal bg-teal/5'
                        : 'border-sage-light/20 hover:border-sage-light/40'
                    }`}
                  >
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="mt-1 text-xs text-charcoal-light">{t.description}</p>
                    <p className="mt-2 text-[10px] font-medium text-teal">
                      {t.inhale}s in &middot; {t.hold}s hold &middot; {t.exhale}s out
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Session Complete */}
          {sessionComplete && (
            <div className="rounded-xl border border-sage/30 bg-sage/5 p-8 text-center">
              <p className="font-heading text-xl font-bold text-sage-dark">Session Complete!</p>
              <p className="mt-2 text-sm text-charcoal-light">
                {minutes} min {seconds}s of mindful breathing
              </p>
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-charcoal-light">How do you feel?</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl transition-all"
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
                  className="rounded-xl bg-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal/90"
                >
                  Save Session
                </button>
                <button
                  onClick={resetSession}
                  className="rounded-xl border border-sage-light/30 px-6 py-2.5 text-sm font-medium text-charcoal-light transition-colors hover:bg-cream"
                >
                  Skip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Breathing Circle + Controls — 1 col */}
        <div className="space-y-6">
          <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <BreatheCircle
                inhale={selectedTechnique.inhale}
                hold={selectedTechnique.hold}
                exhale={selectedTechnique.exhale}
                isRunning={isRunning}
                elapsed={elapsed}
              />
              <p className="mt-4 font-mono text-lg text-charcoal">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
              <p className="text-xs text-charcoal-light">{selectedTechnique.name}</p>
            </div>

            {/* Controls */}
            {!sessionComplete && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={handleStartPause}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-lg transition-all hover:shadow-xl"
                >
                  {isRunning ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
                </button>
                {elapsed > 0 && (
                  <button
                    onClick={handleStop}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-light/30 text-charcoal-light transition-colors hover:bg-cream"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
