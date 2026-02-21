'use client';

import { Bell, Menu } from 'lucide-react';
import { usePatientAuth } from '@/lib/patient-auth';

interface PatientHeaderProps {
  onMenuToggle?: () => void;
}

const encouragements = [
  'Every small step counts towards your wellbeing.',
  'You are doing wonderfully today.',
  'Take it one moment at a time.',
  'Your comfort matters to us.',
  'Remember to breathe and be gentle with yourself.',
];

export function PatientHeader({ onMenuToggle }: PatientHeaderProps) {
  const { user } = usePatientAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Pick a daily encouragement based on the day
  const dayIndex = new Date().getDate() % encouragements.length;
  const encouragement = encouragements[dayIndex];

  return (
    <header className="sticky top-0 z-40 flex h-auto items-center justify-between bg-cream/80 px-5 py-4 backdrop-blur-sm lg:px-8">
      {/* Left: hamburger + greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-xl p-2 text-charcoal-light hover:bg-white hover:text-teal lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-charcoal">
            {greeting}, {user?.name?.split(' ')[0] || 'there'}
          </h2>
          <p className="text-sm text-charcoal-light">
            {encouragement}
          </p>
        </div>
      </div>

      {/* Right: notification bell */}
      <button className="relative rounded-xl p-2.5 text-charcoal-light hover:bg-white hover:text-teal">
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}
