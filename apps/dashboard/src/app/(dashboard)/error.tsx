'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-alert-critical/10">
          <AlertTriangle className="h-8 w-8 text-alert-critical" />
        </div>
        <h2 className="mt-4 font-heading text-xl font-bold text-charcoal">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-charcoal/60">
          An unexpected error occurred. This has been logged for investigation.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-charcoal/30">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-sage-light/30 px-4 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-cream transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
