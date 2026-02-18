'use client';

import { Dumbbell } from 'lucide-react';

export default function PrehabPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Dumbbell className="h-6 w-6 text-teal" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Perioperative Pathways
          </h1>
          <p className="text-sm text-charcoal-light">
            5-pillar prehabilitation management for surgical patients
          </p>
        </div>
      </div>

      {/* 5-Pillar Framework Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {[
          { pillar: 1, name: 'Analgesic Optimization', color: 'bg-sage' },
          { pillar: 2, name: 'Medical Optimization', color: 'bg-teal' },
          { pillar: 3, name: 'Psychosocial Assessment', color: 'bg-lavender' },
          { pillar: 4, name: 'Decision-Making Capacity', color: 'bg-amber' },
          { pillar: 5, name: 'Goal-Directed Planning', color: 'bg-terra' },
        ].map((p) => (
          <div
            key={p.pillar}
            className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm"
          >
            <div
              className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white ${p.color}`}
            >
              {p.pillar}
            </div>
            <h3 className="text-sm font-semibold text-charcoal">{p.name}</h3>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-12 text-center shadow-sm">
        <Dumbbell className="mx-auto h-12 w-12 text-sage-light" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-charcoal">
          Perioperative Pathway Dashboard
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Full surgical pathway management with prehab progress tracking,
          perioperative notes, post-op monitoring, and pre-op briefing
          generator.
        </p>
        <p className="mt-4 text-xs text-charcoal-light/60">
          Sprint 3: S3-4 &middot; Estimated 20 hours
        </p>
      </div>
    </div>
  );
}
