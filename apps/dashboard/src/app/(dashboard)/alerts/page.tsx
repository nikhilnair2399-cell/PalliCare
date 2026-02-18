'use client';

import { Bell } from 'lucide-react';

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-alert-critical" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Clinical Alerts
          </h1>
          <p className="text-sm text-charcoal-light">
            3 critical &middot; 5 warning &middot; 12 info
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-12 text-center shadow-sm">
        <Bell className="mx-auto h-12 w-12 text-sage-light" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-charcoal">
          Alert Management
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          4-tier alert system with acknowledgement, escalation chains, quiet
          hours, and configurable thresholds per patient.
        </p>
        <p className="mt-4 text-xs text-charcoal-light/60">
          Sprint 4: S4-3 &middot; Estimated 12 hours
        </p>
      </div>
    </div>
  );
}
