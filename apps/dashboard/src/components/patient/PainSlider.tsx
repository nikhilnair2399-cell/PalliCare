'use client';

import { painColor } from '@/lib/utils';

interface PainSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function PainSlider({ value, onChange }: PainSliderProps) {
  const color = painColor(value);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium" style={{ color: '#4A4A4A' }}>No Pain</span>
        <span
          className="rounded-full px-3 py-1 text-[13px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {value}/10
        </span>
        <span className="text-[12px] font-medium" style={{ color: '#4A4A4A' }}>Worst Pain</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: 'linear-gradient(to right, #7BA68C 0%, #E8D86A 40%, #E8A838 60%, #D4856B 80%, #A83232 100%)',
          accentColor: color,
        }}
      />
      <div className="flex justify-between px-0.5">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} className="text-[9px]" style={{ color: 'rgba(45,45,45,0.3)' }}>
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
