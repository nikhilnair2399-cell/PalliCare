'use client';

import { Bell, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-sage-light/30 bg-white/80 px-6 backdrop-blur-sm">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
        <input
          type="text"
          placeholder="Search patients, alerts, pathways..."
          className="w-full rounded-lg border border-sage-light/50 bg-cream py-2 pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal-light/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert-critical opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-alert-critical" />
          </span>
        </button>

        {/* Date/Time */}
        <div className="text-right text-sm">
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
