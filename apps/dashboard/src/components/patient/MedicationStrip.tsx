'use client';

import { Check, Clock, X, Pill } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface MedicationStripProps {
  medications: any[];
}

const statusConfig: Record<string, { bg: string; color: string; icon: typeof Check; label: string }> = {
  taken:   { bg: 'rgba(123,166,140,0.08)', color: '#7BA68C', icon: Check, label: 'Taken' },
  pending: { bg: 'rgba(232,168,56,0.08)',  color: '#E8A838', icon: Clock, label: 'Pending' },
  skipped: { bg: 'rgba(212,133,107,0.08)', color: '#D4856B', icon: X,     label: 'Skipped' },
};

export function MedicationStrip({ medications }: MedicationStripProps) {
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

  const order = { pending: 0, prn: 1, taken: 2, skipped: 3 };
  doses.sort(
    (a, b) =>
      (order[a.status as keyof typeof order] ?? 4) -
      (order[b.status as keyof typeof order] ?? 4),
  );

  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
      {doses.map((dose) => {
        const config = statusConfig[dose.status] || statusConfig.pending;
        const StatusIcon = config?.icon || Clock;

        return (
          <div
            key={dose.id}
            className="flex min-w-[148px] flex-shrink-0 flex-col rounded-xl bg-white p-3.5"
            style={{
              border: dose.is_prn
                ? '1px solid rgba(217,212,231,0.4)'
                : '1px solid rgba(168,203,181,0.2)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-center gap-2">
              <Pill className="h-3.5 w-3.5" style={{ color: '#4A4A4A' }} />
              <span className="truncate text-[12px] font-semibold" style={{ color: '#2D2D2D' }}>
                {dose.name}
              </span>
            </div>
            <span className="mt-1 text-[11px]" style={{ color: '#4A4A4A' }}>
              {dose.dose} &middot; {dose.time}
            </span>
            {!dose.is_prn && (
              <div
                className="mt-2.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: config.bg, color: config.color }}
              >
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </div>
            )}
            {dose.is_prn && (
              <div
                className="mt-2.5 rounded-full px-2 py-0.5 text-center text-[10px] font-semibold"
                style={{ backgroundColor: 'rgba(217,212,231,0.25)', color: '#4A4A4A' }}
              >
                PRN
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
