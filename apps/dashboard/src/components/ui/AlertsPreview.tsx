'use client';

import { clsx } from 'clsx';
import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Alert {
  id: string;
  patientName: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    patientName: 'Ramesh K.',
    type: 'critical',
    message: 'Pain score 9/10 for 2+ hours',
    time: '12 min ago',
  },
  {
    id: '2',
    patientName: 'Fatima S.',
    type: 'critical',
    message: 'Breakthrough pain — 3 PRN doses in 4h',
    time: '28 min ago',
  },
  {
    id: '3',
    patientName: 'Arjun M.',
    type: 'warning',
    message: 'Gabapentin adherence dropped to 60% this week',
    time: '1 hr ago',
  },
  {
    id: '4',
    patientName: 'Sunita D.',
    type: 'warning',
    message: 'Mood reported as "Low" for 3 consecutive days',
    time: '2 hr ago',
  },
  {
    id: '5',
    patientName: 'Vikram P.',
    type: 'info',
    message: 'New symptom log submitted',
    time: '3 hr ago',
  },
];

const alertStyles = {
  critical: {
    bg: 'bg-alert-critical/5',
    border: 'border-l-alert-critical',
    dot: 'bg-alert-critical',
    text: 'text-alert-critical',
  },
  warning: {
    bg: 'bg-amber/5',
    border: 'border-l-amber',
    dot: 'bg-amber',
    text: 'text-amber',
  },
  info: {
    bg: 'bg-teal/5',
    border: 'border-l-teal',
    dot: 'bg-teal',
    text: 'text-teal',
  },
};

export function AlertsPreview() {
  return (
    <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-sage-light/20 px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-alert-critical" />
          <h2 className="font-heading text-base font-semibold text-charcoal">
            Active Alerts
          </h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-alert-critical px-1.5 text-[10px] font-bold text-white">
            {mockAlerts.filter((a) => a.type === 'critical').length}
          </span>
        </div>
        <Link
          href="/alerts"
          className="text-xs font-medium text-teal hover:text-teal-dark"
        >
          View all
        </Link>
      </div>
      <div className="divide-y divide-sage-light/10">
        {mockAlerts.map((alert) => {
          const style = alertStyles[alert.type];
          return (
            <div
              key={alert.id}
              className={clsx(
                'flex cursor-pointer items-start gap-3 border-l-3 px-5 py-3 transition-colors hover:bg-cream/50',
                style.border,
              )}
            >
              <div
                className={clsx(
                  'mt-1.5 h-2 w-2 flex-shrink-0 rounded-full',
                  style.dot,
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-charcoal">
                  {alert.patientName}
                </p>
                <p className="text-xs text-charcoal-light">{alert.message}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-charcoal-light/60">
                  <Clock className="h-3 w-3" />
                  {alert.time}
                </div>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-charcoal-light/40" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
