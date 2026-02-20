import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Variants                                                            */
/* ------------------------------------------------------------------ */

const VARIANT_STYLES = {
  // Severity
  critical: 'bg-alert-critical/10 text-alert-critical',
  warning: 'bg-amber/10 text-amber',
  success: 'bg-alert-success/10 text-alert-success',
  info: 'bg-teal/10 text-teal',

  // Status
  active: 'bg-alert-success/10 text-alert-success',
  inactive: 'bg-charcoal/10 text-charcoal/50',
  draft: 'bg-charcoal/10 text-charcoal/50',
  archived: 'bg-charcoal/5 text-charcoal/40',
  pending: 'bg-amber/10 text-amber',
  completed: 'bg-alert-success/10 text-alert-success',

  // Roles
  physician: 'bg-teal/10 text-teal',
  nurse: 'bg-amber/10 text-amber',
  caregiver: 'bg-sage/20 text-sage',
  patient: 'bg-terra/10 text-terra',

  // Category
  opioid: 'bg-alert-critical/10 text-alert-critical',
  nlem: 'bg-alert-success/10 text-alert-success',
  neuropathic: 'bg-teal/10 text-teal',

  // Neutral
  default: 'bg-charcoal/5 text-charcoal/60',
  teal: 'bg-teal/10 text-teal',
  outline: 'bg-transparent border border-sage-light/30 text-charcoal/60',
} as const;

type BadgeVariant = keyof typeof VARIANT_STYLES;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  icon,
  className,
  dot,
}: BadgeProps) {
  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold uppercase whitespace-nowrap',
        VARIANT_STYLES[variant],
        sizeStyles[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'critical' ? 'bg-alert-critical' :
            variant === 'warning' ? 'bg-amber' :
            variant === 'success' || variant === 'active' ? 'bg-alert-success' :
            variant === 'info' || variant === 'teal' ? 'bg-teal' :
            'bg-charcoal/40',
          )}
        />
      )}
      {icon}
      {children}
    </span>
  );
}
