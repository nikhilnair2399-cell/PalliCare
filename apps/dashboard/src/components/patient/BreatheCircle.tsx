'use client';

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle';

interface BreatheCircleProps {
  inhale: number;
  hold: number;
  exhale: number;
  isRunning: boolean;
  elapsed: number;
}

const phaseConfig: Record<Phase, { label: string; color: string }> = {
  inhale: { label: 'Breathe In', color: '#7BA68C' },
  hold:   { label: 'Hold',       color: '#E8A838' },
  exhale: { label: 'Breathe Out', color: '#2A6B6B' },
  idle:   { label: 'Ready',      color: '#4A4A4A' },
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

  let scale = 0.6;
  if (phase === 'inhale') scale = 0.6 + 0.4 * phaseProgress;
  else if (phase === 'hold') scale = 1.0;
  else if (phase === 'exhale') scale = 1.0 - 0.4 * phaseProgress;

  const config = phaseConfig[phase];

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
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(123,166,140,0.2), rgba(42,107,107,0.2))',
            transform: `scale(${scale * 1.1})`,
            transition: 'transform 0.3s ease',
          }}
        />
        {/* Main circle */}
        <div
          className="relative flex h-48 w-48 items-center justify-center rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #7BA68C, #2A6B6B, #1A4A4A)',
            transform: `scale(${scale})`,
            transition: 'transform 0.3s ease',
          }}
        >
          <div className="text-center text-white">
            <p className="text-3xl font-bold">
              {isRunning ? countdown : ''}
            </p>
            <p className="mt-1 text-[14px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {config.label}
            </p>
          </div>
        </div>
      </div>

      {/* Phase indicators */}
      {isRunning && (
        <div className="flex items-center gap-4 text-[12px] font-medium">
          <span style={{ color: phase === 'inhale' ? '#7BA68C' : 'rgba(45,45,45,0.25)', fontWeight: phase === 'inhale' ? 700 : 400 }}>
            In ({inhale}s)
          </span>
          <span style={{ color: 'rgba(45,45,45,0.15)' }}>&bull;</span>
          <span style={{ color: phase === 'hold' ? '#E8A838' : 'rgba(45,45,45,0.25)', fontWeight: phase === 'hold' ? 700 : 400 }}>
            Hold ({hold}s)
          </span>
          <span style={{ color: 'rgba(45,45,45,0.15)' }}>&bull;</span>
          <span style={{ color: phase === 'exhale' ? '#2A6B6B' : 'rgba(45,45,45,0.25)', fontWeight: phase === 'exhale' ? 700 : 400 }}>
            Out ({exhale}s)
          </span>
        </div>
      )}
    </div>
  );
}
