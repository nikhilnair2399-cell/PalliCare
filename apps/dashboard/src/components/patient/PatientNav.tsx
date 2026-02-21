'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  Home,
  Activity,
  Pill,
  Wind,
  Sparkles,
  BookOpen,
  MessageCircle,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react';
import { usePatientAuth } from '@/lib/patient-auth';

interface PatientNavProps {
  onNavigate?: () => void;
}

const navGroups = [
  {
    label: 'Daily',
    items: [
      { name: 'Home', href: '/patient', icon: Home },
      { name: 'Log Symptoms', href: '/patient/log', icon: Activity },
      { name: 'Medications', href: '/patient/medications', icon: Pill },
    ],
  },
  {
    label: 'Wellness',
    items: [
      { name: 'Breathe', href: '/patient/breathe', icon: Wind },
      { name: 'Journey', href: '/patient/journey', icon: Sparkles },
      { name: 'Learn', href: '/patient/learn', icon: BookOpen },
    ],
  },
  {
    label: 'Connect',
    items: [
      { name: 'Messages', href: '/patient/messages', icon: MessageCircle },
      { name: 'Settings', href: '/patient/settings', icon: Settings },
    ],
  },
];

export function PatientNav({ onNavigate }: PatientNavProps) {
  const pathname = usePathname();
  const { user, logout } = usePatientAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-teal">PalliCare</h1>
          <p className="text-[11px] text-charcoal-light">Your Wellness Companion</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal/30">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/patient' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavigate}
                    className={clsx(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-teal/8 text-teal'
                        : 'text-charcoal-light hover:bg-cream hover:text-charcoal',
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-light transition-colors hover:bg-cream hover:text-alert-critical"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 rounded-xl bg-cream p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-charcoal">
                {user.name}
              </p>
              <p className="truncate text-xs text-charcoal-light">
                {user.uhid}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
