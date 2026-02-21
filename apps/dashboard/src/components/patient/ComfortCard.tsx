import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ComfortCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'sage' | 'teal' | 'lavender' | 'amber' | 'terra';
}

const colorMap = {
  sage: {
    bg: 'bg-sage/10',
    icon: 'bg-sage/20 text-sage',
    value: 'text-sage-dark',
  },
  teal: {
    bg: 'bg-teal/10',
    icon: 'bg-teal/20 text-teal',
    value: 'text-teal',
  },
  lavender: {
    bg: 'bg-lavender/20',
    icon: 'bg-lavender text-charcoal',
    value: 'text-charcoal',
  },
  amber: {
    bg: 'bg-amber/10',
    icon: 'bg-amber/20 text-amber',
    value: 'text-amber',
  },
  terra: {
    bg: 'bg-terra/10',
    icon: 'bg-terra/20 text-terra',
    value: 'text-terra',
  },
};

export function ComfortCard({
  title,
  value,
  subtitle,
  icon,
  color = 'sage',
}: ComfortCardProps) {
  const styles = colorMap[color];

  return (
    <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-charcoal-light">{title}</p>
          <p className={cn('mt-1 font-heading text-2xl font-bold', styles.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-charcoal-light">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            styles.icon,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
