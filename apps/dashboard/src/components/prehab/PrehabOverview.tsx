'use client';

import { Dumbbell, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface PrehabPatient {
  id: string;
  name: string;
  surgeryDate: string;
  daysUntil: number;
  readinessScore: number; // 0-100
  exerciseCompliance: number; // percentage
  nutritionCompliance: number; // percentage
}

const mockPrehabPatients: PrehabPatient[] = [
  {
    id: 'p4',
    name: 'Sunita D.',
    surgeryDate: '21 Feb',
    daysUntil: 3,
    readinessScore: 72,
    exerciseCompliance: 85,
    nutritionCompliance: 70,
  },
  {
    id: 'p3',
    name: 'Arjun M.',
    surgeryDate: '26 Feb',
    daysUntil: 8,
    readinessScore: 58,
    exerciseCompliance: 40,
    nutritionCompliance: 65,
  },
  {
    id: 'p7',
    name: 'Priya R.',
    surgeryDate: '03 Mar',
    daysUntil: 13,
    readinessScore: 85,
    exerciseCompliance: 92,
    nutritionCompliance: 88,
  },
];

function ReadinessMeter({ score }: { score: number }) {
  let color = 'text-alert-critical';
  if (score >= 80) color = 'text-sage';
  else if (score >= 60) color = 'text-amber';

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-sage-light/30">
        <div
          className={clsx('h-full rounded-full', {
            'bg-sage': score >= 80,
            'bg-amber': score >= 60 && score < 80,
            'bg-alert-critical': score < 60,
          })}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={clsx('text-xs font-bold', color)}>{score}%</span>
    </div>
  );
}

export function PrehabOverview() {
  return (
    <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-sage-light/20 px-5 py-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-teal" />
          <h2 className="font-heading text-base font-semibold text-charcoal">
            Prehab Pathways
          </h2>
        </div>
        <Link
          href="/prehab"
          className="text-xs font-medium text-teal hover:text-teal-dark"
        >
          View all
        </Link>
      </div>
      <div className="divide-y divide-sage-light/10">
        {mockPrehabPatients.map((patient) => (
          <div
            key={patient.id}
            className="flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-cream/30"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-charcoal">
                  {patient.name}
                </p>
                <span
                  className={clsx(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                    patient.daysUntil <= 5
                      ? 'bg-alert-critical/10 text-alert-critical'
                      : 'bg-teal/10 text-teal',
                  )}
                >
                  T-{patient.daysUntil}d
                </span>
              </div>
              <div className="mt-1">
                <ReadinessMeter score={patient.readinessScore} />
              </div>
              <div className="mt-1 flex gap-3 text-[10px] text-charcoal-light">
                <span>Exercise: {patient.exerciseCompliance}%</span>
                <span>Nutrition: {patient.nutritionCompliance}%</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-charcoal-light/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
