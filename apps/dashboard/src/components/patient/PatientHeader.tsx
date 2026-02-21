'use client';

import { Bell, Menu } from 'lucide-react';
import { usePatientAuth } from '@/lib/patient-auth';

interface PatientHeaderProps {
  onMenuToggle?: () => void;
}

export function PatientHeader({ onMenuToggle }: PatientHeaderProps) {
  const { user } = usePatientAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-sage-light/30 bg-white/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Left: hamburger + greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-sm font-semibold text-charcoal">
            {greeting}, {user?.name?.split(' ')[0] || 'there'}
          </h2>
          <p className="text-xs text-charcoal-light">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button className="relative rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal">
          <Bell className="h-5 w-5" />
        </button>

        <div className="hidden text-right text-sm sm:block">
          <p className="font-medium text-charcoal">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </p>
          <p className="text-xs text-charcoal-light">AIIMS Bhopal</p>
        </div>
      </div>
    </header>
  );
}
