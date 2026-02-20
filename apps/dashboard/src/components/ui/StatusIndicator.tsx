import { cn } from '@/lib/utils';
import { Wifi, WifiOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  StatusDot — small colored circle indicator                         */
/* ------------------------------------------------------------------ */

type DotStatus = 'online' | 'offline' | 'warning' | 'error' | 'idle';

const DOT_STYLES: Record<DotStatus, string> = {
  online: 'bg-alert-success',
  offline: 'bg-charcoal/30',
  warning: 'bg-amber',
  error: 'bg-alert-critical',
  idle: 'bg-charcoal/20',
};

export function StatusDot({
  status = 'idle',
  pulse = false,
  size = 'sm',
}: {
  status?: DotStatus;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
}) {
  const sizeClass = size === 'xs' ? 'h-1.5 w-1.5' : size === 'sm' ? 'h-2 w-2' : 'h-3 w-3';
  return (
    <span className="relative inline-flex">
      {pulse && status === 'online' && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            DOT_STYLES[status],
          )}
        />
      )}
      <span className={cn('relative inline-flex rounded-full', sizeClass, DOT_STYLES[status])} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ConnectionStatus — API connection indicator                        */
/* ------------------------------------------------------------------ */

type ConnState = 'connected' | 'connecting' | 'disconnected' | 'error';

const CONN_CONFIG: Record<
  ConnState,
  { icon: typeof Wifi; label: string; color: string; bgColor: string }
> = {
  connected: {
    icon: CheckCircle2,
    label: 'API Connected',
    color: 'text-alert-success',
    bgColor: 'bg-alert-success/10',
  },
  connecting: {
    icon: Loader2,
    label: 'Connecting...',
    color: 'text-amber',
    bgColor: 'bg-amber/10',
  },
  disconnected: {
    icon: WifiOff,
    label: 'Offline Mode',
    color: 'text-charcoal/50',
    bgColor: 'bg-charcoal/5',
  },
  error: {
    icon: AlertCircle,
    label: 'Connection Error',
    color: 'text-alert-critical',
    bgColor: 'bg-alert-critical/10',
  },
};

export function ConnectionStatus({ state = 'disconnected' }: { state?: ConnState }) {
  const config = CONN_CONFIG[state];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
        config.bgColor,
      )}
    >
      <Icon
        className={cn(
          'h-3.5 w-3.5',
          config.color,
          state === 'connecting' && 'animate-spin',
        )}
      />
      <span className={cn('text-[10px] font-semibold', config.color)}>
        {config.label}
      </span>
    </div>
  );
}
