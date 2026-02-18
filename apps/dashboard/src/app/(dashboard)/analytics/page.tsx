'use client';

import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-teal" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Analytics &amp; Research
          </h1>
          <p className="text-sm text-charcoal-light">
            Department metrics, pain analytics, medication outcomes
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-12 text-center shadow-sm">
        <BarChart3 className="mx-auto h-12 w-12 text-sage-light" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-charcoal">
          Research Analytics Dashboard
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Pain distribution charts, ESAS trend analysis, medication efficacy
          tracking, adherence patterns, and de-identified FHIR export for
          research.
        </p>
        <p className="mt-4 text-xs text-charcoal-light/60">
          Phase 3 Feature &middot; Months 9-12
        </p>
      </div>
    </div>
  );
}
