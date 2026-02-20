'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, X, AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlerts, useAlertCounts } from '@/lib/hooks';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Live alert data
  const alertCountsQuery = useAlertCounts();
  const alertsQuery = useAlerts({ status: 'active' });
  const alertCounts = alertCountsQuery.data as any;
  const alertData = alertsQuery.data as any;
  const recentAlerts: any[] = Array.isArray(alertData?.data || alertData) ? (alertData?.data || alertData).slice(0, 5) : [];
  const totalUnacknowledged = alertCounts?.unacknowledged ?? alertCounts?.total ?? recentAlerts.length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/patients?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  }

  const SEVERITY_ICON: Record<string, any> = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: Info,
  };
  const SEVERITY_COLOR: Record<string, string> = {
    critical: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-sage-light/30 bg-white/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search — functional, navigates to /patients?search= */}
        <form onSubmit={handleSearch} className="relative hidden w-96 sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            placeholder="Search patients, alerts, pathways..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-sage-light/50 bg-cream py-2 pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal-light/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </form>

        {/* Mobile search icon */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal sm:hidden"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile search bar (expanded) */}
      {showSearch && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-sage-light/30 bg-white p-4 shadow-lg sm:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-sage-light/50 bg-cream py-2 pl-10 pr-10 text-sm text-charcoal placeholder:text-charcoal-light/60 focus:border-teal focus:outline-none"
            />
            <button type="button" onClick={() => setShowSearch(false)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-charcoal/40" />
            </button>
          </form>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Notification Bell with Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-charcoal-light hover:bg-cream hover:text-teal"
          >
            <Bell className="h-5 w-5" />
            {totalUnacknowledged > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-alert-critical px-0.5 text-[9px] font-bold text-white">
                {totalUnacknowledged > 9 ? '9+' : totalUnacknowledged}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-sage-light/30 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-sage-light/20 px-4 py-3">
                <h3 className="text-sm font-bold text-charcoal">Recent Alerts</h3>
                {totalUnacknowledged > 0 && (
                  <span className="rounded-full bg-alert-critical/10 px-2 py-0.5 text-[10px] font-bold text-alert-critical">
                    {totalUnacknowledged} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert: any, i: number) => {
                    const severity = alert.severity || 'warning';
                    const SevIcon = SEVERITY_ICON[severity] || Info;
                    return (
                      <div key={alert.id || i} className="border-b border-sage-light/10 px-4 py-3 hover:bg-cream/50 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <SevIcon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', SEVERITY_COLOR[severity] || 'text-blue-500')} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-charcoal">
                              {alert.patient_name || alert.patient || 'Alert'}
                            </p>
                            <p className="mt-0.5 text-xs text-charcoal/60 line-clamp-2">
                              {alert.message || alert.description || ''}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-charcoal/40">
                              <Clock className="h-3 w-3" />
                              {alert.created_at
                                ? new Date(alert.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                                : (alert.time || '')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-charcoal/20" />
                    <p className="mt-2 text-xs text-charcoal/50">No recent alerts</p>
                  </div>
                )}
              </div>
              <div className="border-t border-sage-light/20 p-2">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    router.push('/alerts');
                  }}
                  className="w-full rounded-lg py-2 text-center text-xs font-semibold text-teal hover:bg-teal/5 transition-colors"
                >
                  View All Alerts &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date/Time */}
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
