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
} from 'lucide-react';
import { usePatientAuth } from '@/lib/patient-auth';
import { usePatientUnreadCount, useUnseenMilestonesCount } from '@/lib/patient-hooks';

/* eslint-disable @typescript-eslint/no-explicit-any */

const navigation = [
  { name: 'Home', href: '/patient', icon: Home },
  { name: 'Log Symptoms', href: '/patient/log', icon: Activity },
  { name: 'Medications', href: '/patient/medications', icon: Pill },
  { name: 'Pain Diary', href: '/patient/pain-diary', icon: TrendingUp },
  { name: 'Breathe', href: '/patient/breathe', icon: Wind },
  { name: 'Learn', href: '/patient/learn', icon: BookOpen },
  { name: 'Journey', href: '/patient/journey', icon: Sparkles, badgeKey: 'milestones' as const },
  { name: 'Messages', href: '/patient/messages', icon: MessageCircle, badgeKey: 'messages' as const },
];

const bottomNav = [
  { name: 'Settings', href: '/patient/settings', icon: Settings },
];

export function PatientNav() {
  const pathname = usePathname();
  const { user, logout } = usePatientAuth();

  const unreadQuery = usePatientUnreadCount();
  const milestonesQuery = useUnseenMilestonesCount();

  const unreadCount = (unreadQuery.data as any)?.count ?? 0;
  const unseenMilestones = (milestonesQuery.data as any)?.count ?? 0;

  return (
    <aside className="flex h-full w-72 flex-col border-r border-sage-light/20 bg-white/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sage-light/20 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sage to-teal font-heading text-xl font-bold text-white">
          P
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-teal">PalliCare</h1>
          <p className="text-[10px] text-charcoal-light">Your Wellness Companion</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/patient' && pathname.startsWith(item.href));

          let badgeCount = 0;
          if (item.badgeKey === 'messages') badgeCount = unreadCount;
          else if (item.badgeKey === 'milestones') badgeCount = unseenMilestones;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-sage/15 to-teal/10 text-teal shadow-sm'
                  : 'text-charcoal-light hover:bg-cream hover:text-charcoal',
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
              {badgeCount > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber px-1.5 text-[10px] font-bold text-white">
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sage-light/20 px-4 py-4">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-charcoal-light hover:bg-cream hover:text-charcoal"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-charcoal-light hover:bg-alert-critical/10 hover:text-alert-critical"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>

      {/* Patient Info */}
      {user && (
        <div className="border-t border-sage-light/20 bg-gradient-to-br from-lavender-light/50 to-sage-light/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-lavender to-sage text-sm font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-charcoal">
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
