'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  Home,
  Activity,
  Pill,
  TrendingUp,
  Wind,
  BookOpen,
  Sparkles,
  MessageCircle,
  Settings,
  LogOut,
  Leaf,
  Brain,
  Moon,
  Apple,
  Footprints,
  Heart,
} from 'lucide-react';
import { usePatientAuth } from '@/lib/patient-auth';

interface PatientNavProps {
  onNavigate?: () => void;
}

const navigation = [
  { name: 'Home', href: '/patient', icon: Home },
  { name: 'Log Symptoms', href: '/patient/log', icon: Activity },
  { name: 'Medications', href: '/patient/medications', icon: Pill },
  { name: 'Pain Diary', href: '/patient/pain-diary', icon: TrendingUp },
  { name: 'Mood Check', href: '/patient/mood-check', icon: Brain },
  { name: 'Sleep', href: '/patient/sleep', icon: Moon },
  { name: 'Nutrition', href: '/patient/nutrition', icon: Apple },
  { name: 'Functional Status', href: '/patient/functional-status', icon: Footprints },
  { name: 'My Wishes', href: '/patient/my-wishes', icon: Heart },
  { name: 'Breathe', href: '/patient/breathe', icon: Wind },
  { name: 'Learn', href: '/patient/learn', icon: BookOpen },
  { name: 'Journey', href: '/patient/journey', icon: Sparkles },
  { name: 'Messages', href: '/patient/messages', icon: MessageCircle },
];

const bottomNav = [
  { name: 'Settings', href: '/patient/settings', icon: Settings },
];

export function PatientNav({ onNavigate }: PatientNavProps) {
  const pathname = usePathname();
  const { user, logout } = usePatientAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sage-light/30 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sage-light/30 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal font-heading text-lg font-bold text-white">
          <Leaf className="h-4 w-4" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-teal">
            PalliCare
          </h1>
          <p className="text-[10px] text-charcoal-light">Your Wellness Companion</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/patient' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal/10 text-teal'
                  : 'text-charcoal-light hover:bg-cream hover:text-charcoal',
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sage-light/30 px-3 py-4">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-teal/10 text-teal'
                : 'text-charcoal-light hover:bg-cream hover:text-charcoal',
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-light hover:bg-cream hover:text-alert-critical"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="border-t border-sage-light/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">
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
