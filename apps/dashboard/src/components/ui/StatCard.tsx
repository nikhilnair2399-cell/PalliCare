import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'alert' | 'info';
  icon: ReactNode;
}

const changeStyles = {
  increase: 'text-sage-dark bg-sage/10',
  decrease: 'text-sage-dark bg-sage/10',
  alert: 'text-alert-critical bg-alert-critical/10',
  info: 'text-teal bg-teal/10',
};

const iconBgStyles = {
  increase: 'bg-sage/10 text-sage',
  decrease: 'bg-sage/10 text-sage',
  alert: 'bg-alert-critical/10 text-alert-critical',
  info: 'bg-teal/10 text-teal',
};

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-charcoal-light">{title}</p>
          <p className="mt-1 font-heading text-3xl font-bold text-charcoal">
            {value}
          </p>
        </div>
        <div
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            iconBgStyles[changeType],
          )}
        >
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <span
          className={clsx(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            changeStyles[changeType],
          )}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
