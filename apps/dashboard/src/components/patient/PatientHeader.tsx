'use client';

import { Menu, Bell } from 'lucide-react';
import { usePatientAuth } from '@/lib/patient-auth';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface PatientHeaderProps {
  onMenuToggle?: () => void;
}

export function PatientHeader({ onMenuToggle }: PatientHeaderProps) {
  const { user } = usePatientAuth();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sage-light/20 bg-white/70 px-4 backdrop-blur-md lg:px-6">
      {/* Left: Menu + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm font-medium text-charcoal-light">
          {greeting}{firstName ? `, ${firstName}` : ''}
        </p>
      </div>

      {/* Right: Date + Notifications */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm sm:block">
          <p className="font-medium text-charcoal">
            {now.toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </p>
        </div>
        <button className="relative rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
