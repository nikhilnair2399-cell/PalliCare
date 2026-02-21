'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BreatheCircleProps {
  /** Inhale duration in seconds */
  inhale: number;
  /** Hold duration in seconds */
  hold: number;
  /** Exhale duration in seconds */
  exhale: number;
  /** Whether the exercise is running */
  isRunning: boolean;
  /** Total elapsed seconds */
  elapsed: number;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle';

const phaseConfig: Record<Phase, { label: string; color: string }> = {
  inhale: { label: 'Breathe In', color: 'text-sage' },
  hold: { label: 'Hold', color: 'text-amber' },
  exhale: { label: 'Breathe Out', color: 'text-teal' },
  idle: { label: 'Ready', color: 'text-charcoal-light' },
};

export function BreatheCircle({
  inhale,
  hold,
  exhale,
  isRunning,
  elapsed,
}: BreatheCircleProps) {
  const cycleLength = inhale + hold + exhale;
  const positionInCycle = isRunning ? elapsed % cycleLength : 0;

  let phase: Phase = 'idle';
  let phaseProgress = 0;

  if (isRunning) {
    if (positionInCycle < inhale) {
      phase = 'inhale';
      phaseProgress = positionInCycle / inhale;
    } else if (positionInCycle < inhale + hold) {
      phase = 'hold';
      phaseProgress = (positionInCycle - inhale) / hold;
    } else {
      phase = 'exhale';
      phaseProgress = (positionInCycle - inhale - hold) / exhale;
    }
  }

  // Scale: 0.6 when exhaled, 1.0 when inhaled
  let scale = 0.6;
  if (phase === 'inhale') scale = 0.6 + 0.4 * phaseProgress;
  else if (phase === 'hold') scale = 1.0;
  else if (phase === 'exhale') scale = 1.0 - 0.4 * phaseProgress;

  const config = phaseConfig[phase];

  // Phase countdown
  let countdown = 0;
  if (phase === 'inhale') countdown = Math.ceil(inhale - positionInCycle);
  else if (phase === 'hold') countdown = Math.ceil(inhale + hold - positionInCycle);
  else if (phase === 'exhale') countdown = Math.ceil(cycleLength - positionInCycle);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Animated Circle */}
      <div className="relative flex h-56 w-56 items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-sage/20 to-teal/20 blur-xl transition-transform"
          style={{
            transform: `scale(${scale * 1.1})`,
            transitionDuration: '0.3s',
          }}
        />
        {/* Main circle */}
        <div
          className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-sage via-teal to-teal-dark shadow-lg transition-transform"
          style={{
            transform: `scale(${scale})`,
            transitionDuration: '0.3s',
          }}
        >
          <div className="text-center text-white">
            <p className="text-3xl font-bold">
              {isRunning ? countdown : ''}
            </p>
            <p className={cn('mt-1 text-sm font-medium text-white/80')}>
              {config.label}
            </p>
          </div>
        </div>
      </div>

      {/* Phase indicators */}
      {isRunning && (
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className={cn(phase === 'inhale' ? 'text-sage font-bold' : 'text-charcoal/30')}>
            In ({inhale}s)
          </span>
          <span className="text-charcoal/20">&bull;</span>
          <span className={cn(phase === 'hold' ? 'text-amber font-bold' : 'text-charcoal/30')}>
            Hold ({hold}s)
          </span>
          <span className="text-charcoal/20">&bull;</span>
          <span className={cn(phase === 'exhale' ? 'text-teal font-bold' : 'text-charcoal/30')}>
            Out ({exhale}s)
          </span>
        </div>
      )}
    </div>
  );
}
