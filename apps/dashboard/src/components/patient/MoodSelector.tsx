'use client';

import { Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mood = 'good' | 'okay' | 'bad';

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

const moods: { key: Mood; label: string; Icon: typeof Smile; activeClass: string }[] = [
  { key: 'good', label: 'Good', Icon: Smile, activeClass: 'bg-sage/20 text-sage border-sage' },
  { key: 'okay', label: 'Okay', Icon: Meh, activeClass: 'bg-amber/20 text-amber border-amber' },
  { key: 'bad', label: 'Not Good', Icon: Frown, activeClass: 'bg-terra/20 text-terra border-terra' },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex gap-3">
      {moods.map(({ key, label, Icon, activeClass }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            'flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 transition-all',
            value === key
              ? activeClass
              : 'border-sage-light/30 text-charcoal-light hover:border-sage-light hover:bg-cream',
          )}
        >
          <Icon className="h-7 w-7" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
