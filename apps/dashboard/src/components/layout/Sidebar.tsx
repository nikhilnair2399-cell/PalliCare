'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  Users2,
  Activity,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  MessageSquare,
  ClipboardList,
  Pill,
} from 'lucide-react';
import { useAlertCounts, useUnreadMessageCount } from '@/lib/hooks';

/* eslint-disable @typescript-eslint/no-explicit-any */

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Alerts', href: '/alerts', icon: Bell, badgeKey: 'alerts' },
  { name: 'Clinical Notes', href: '/notes', icon: FileText },
  { name: 'Care Plans', href: '/care-plans', icon: ClipboardList },
  { name: 'Messages', href: '/messages', icon: MessageSquare, badgeKey: 'messages' },
  { name: 'MDT', href: '/mdt', icon: Users2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Med Reference', href: '/medication-db', icon: Pill },
];

const bottomNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Live alert counts from API
  const alertCountsQuery = useAlertCounts();
  const alertCount = (alertCountsQuery.data as any)?.critical ?? (alertCountsQuery.data as any)?.total ?? 3;

  // Live unread message count
  const unreadQuery = useUnreadMessageCount();
  const unreadMsgCount = (unreadQuery.data as any)?.count ?? 0;

  function handleSignOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      router.push('/login');
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sage-light/30 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sage-light/30 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal font-heading text-lg font-bold text-white">
          P
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-teal">
            PalliCare
          </h1>
          <p className="text-[10px] text-charcoal-light">AIIMS Bhopal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          // Resolve badge count
          let badgeCount = 0;
          if (item.badgeKey === 'alerts') badgeCount = alertCount;
          else if (item.badgeKey === 'messages') badgeCount = unreadMsgCount;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal/10 text-teal'
                  : 'text-charcoal-light hover:bg-cream hover:text-charcoal',
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
              {badgeCount > 0 && (
                <span className={clsx(
                  'ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white',
                  item.badgeKey === 'alerts' ? 'bg-alert-critical' : 'bg-teal',
                )}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
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
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-light hover:bg-cream hover:text-charcoal"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-light hover:bg-cream hover:text-alert-critical"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>

      {/* Clinician Info */}
      <div className="border-t border-sage-light/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">
            NN
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-charcoal">
              Dr. Nikhil Nair
            </p>
            <p className="truncate text-xs text-charcoal-light">
              Anaesthesiology
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
