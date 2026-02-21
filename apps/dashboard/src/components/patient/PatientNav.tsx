'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
  Heart,
  Moon,
  Apple,
  Footprints,
} from 'lucide-react';
import { usePatientAuth } from '@/lib/patient-auth';

/* eslint-disable @typescript-eslint/no-explicit-any */

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

export function PatientNav({ onNavigate }: PatientNavProps) {
  const pathname = usePathname();
  const { user, logout } = usePatientAuth();

  return (
    <aside className="flex h-full flex-col bg-white" style={{ borderRight: '1px solid rgba(168,203,181,0.2)' }}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6" style={{ borderBottom: '1px solid rgba(168,203,181,0.2)' }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: '#2A6B6B' }}>
          <Leaf className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold" style={{ color: '#2A6B6B' }}>
            PalliCare
          </h1>
          <p className="text-[10px] font-medium" style={{ color: '#4A4A4A' }}>
            Your Wellness Companion
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/patient' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors',
              )}
              style={{
                backgroundColor: isActive ? 'rgba(42,107,107,0.06)' : 'transparent',
                color: isActive ? '#2A6B6B' : '#4A4A4A',
              }}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Sign Out */}
      <div className="px-3 pb-2" style={{ borderTop: '1px solid rgba(168,203,181,0.15)' }}>
        <div className="pt-2">
          <Link
            href="/patient/settings"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors"
            style={{
              color: pathname === '/patient/settings' ? '#2A6B6B' : '#4A4A4A',
              backgroundColor: pathname === '/patient/settings' ? 'rgba(42,107,107,0.06)' : 'transparent',
            }}
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors"
            style={{ color: '#C25A45' }}
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </div>

      {/* User info footer */}
      {user && (
        <div className="px-4 py-3.5" style={{ borderTop: '1px solid rgba(168,203,181,0.15)', backgroundColor: '#FAFCFB' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{ backgroundColor: '#7BA68C' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold" style={{ color: '#2D2D2D' }}>
                {user.name}
              </p>
              <p className="truncate text-[11px]" style={{ color: '#4A4A4A' }}>
                {user.uhid}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
