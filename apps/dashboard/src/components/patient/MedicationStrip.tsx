'use client';

import { cn } from '@/lib/utils';
import { Check, Clock, X, Pill } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface MedicationStripProps {
  medications: any[];
}

const statusConfig: Record<string, { color: string; icon: typeof Check; label: string }> = {
  taken: { color: 'bg-sage/10 text-sage border-sage/30', icon: Check, label: 'Taken' },
  pending: { color: 'bg-amber/10 text-amber border-amber/30', icon: Clock, label: 'Pending' },
  skipped: { color: 'bg-terra/10 text-terra border-terra/30', icon: X, label: 'Skipped' },
};

export function MedicationStrip({ medications }: MedicationStripProps) {
  // Flatten into individual dose cards
  const doses: any[] = [];
  medications.forEach((med) => {
    if (med.is_prn) {
      doses.push({
        id: `${med.id}-prn`,
        name: med.name,
        dose: med.dose,
        time: 'As needed',
        status: 'prn',
        is_prn: true,
      });
    } else {
      (med.schedule || []).forEach((s: any, i: number) => {
        doses.push({
          id: `${med.id}-${i}`,
          name: med.name,
          dose: med.dose,
          time: s.label || s.time,
          status: s.status,
        });
      });
    }
  });

  // Sort: pending first, then taken, then skipped
  const order = { pending: 0, prn: 1, taken: 2, skipped: 3 };
  doses.sort((a, b) => (order[a.status as keyof typeof order] ?? 4) - (order[b.status as keyof typeof order] ?? 4));

  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
      {doses.map((dose) => {
        const config = statusConfig[dose.status] || statusConfig.pending;
        const StatusIcon = config?.icon || Clock;

        return (
          <div
            key={dose.id}
            className={cn(
              'flex min-w-[140px] flex-shrink-0 flex-col rounded-xl border bg-white p-3 shadow-sm',
              dose.is_prn ? 'border-lavender/50' : 'border-sage-light/20',
            )}
          >
            <div className="flex items-center gap-2">
              <Pill className="h-3.5 w-3.5 text-charcoal-light" />
              <span className="truncate text-xs font-semibold text-charcoal">
                {dose.name}
              </span>
            </div>
            <span className="mt-1 text-[11px] text-charcoal-light">
              {dose.dose} &middot; {dose.time}
            </span>
            {!dose.is_prn && (
              <div className={cn('mt-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', config.color)}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </div>
            )}
            {dose.is_prn && (
              <div className="mt-2 rounded-full bg-lavender/30 px-2 py-0.5 text-center text-[10px] font-semibold text-charcoal-light">
                PRN
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
