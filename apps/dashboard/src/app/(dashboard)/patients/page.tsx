'use client';

import { Users } from 'lucide-react';

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-teal" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Patient Management
          </h1>
          <p className="text-sm text-charcoal-light">
            24 active patients &middot; 3 critical alerts
          </p>
        </div>
      </div>

      {/* Placeholder — full implementation in Sprint 4 */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-12 text-center shadow-sm">
        <Users className="mx-auto h-12 w-12 text-sage-light" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-charcoal">
          Full Patient List
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Comprehensive patient management with search, filters, triage view,
          pain analytics, and clinical decision support.
        </p>
        <p className="mt-4 text-xs text-charcoal-light/60">
          Sprint 4: S4-1 &middot; Estimated 20 hours
        </p>
      </div>
    </div>
  );
}
