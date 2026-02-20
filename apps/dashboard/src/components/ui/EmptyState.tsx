import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/20">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-bold text-charcoal/60">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs text-charcoal/40 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
