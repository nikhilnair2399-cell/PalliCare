'use client';

import { Smile, Meh, Frown } from 'lucide-react';

type Mood = 'good' | 'okay' | 'bad';

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

const moods: {
  key: Mood;
  label: string;
  Icon: typeof Smile;
  activeBg: string;
  activeColor: string;
  activeBorder: string;
}[] = [
  { key: 'good', label: 'Good', Icon: Smile, activeBg: 'rgba(123,166,140,0.12)', activeColor: '#7BA68C', activeBorder: '#7BA68C' },
  { key: 'okay', label: 'Okay', Icon: Meh, activeBg: 'rgba(232,168,56,0.10)', activeColor: '#E8A838', activeBorder: '#E8A838' },
  { key: 'bad', label: 'Not Good', Icon: Frown, activeBg: 'rgba(212,133,107,0.10)', activeColor: '#D4856B', activeBorder: '#D4856B' },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex gap-3">
      {moods.map(({ key, label, Icon, activeBg, activeColor, activeBorder }) => {
        const isSelected = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-xl px-3 py-3 transition-all"
            style={{
              border: `2px solid ${isSelected ? activeBorder : 'rgba(168,203,181,0.3)'}`,
              backgroundColor: isSelected ? activeBg : 'transparent',
              color: isSelected ? activeColor : '#4A4A4A',
            }}
          >
            <Icon className="h-7 w-7" />
            <span className="text-[12px] font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
