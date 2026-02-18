'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PatientRow {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  painScore: number;
  painTrend: 'up' | 'down' | 'stable';
  lastLog: string;
  status: 'stable' | 'monitoring' | 'critical';
}

const mockPatients: PatientRow[] = [
  {
    id: 'p1',
    name: 'Ramesh Kumar',
    age: 58,
    diagnosis: 'Lung CA, bone mets',
    painScore: 9,
    painTrend: 'up',
    lastLog: '12 min ago',
    status: 'critical',
  },
  {
    id: 'p2',
    name: 'Fatima Sheikh',
    age: 45,
    diagnosis: 'RA, chronic pain',
    painScore: 7,
    painTrend: 'up',
    lastLog: '28 min ago',
    status: 'critical',
  },
  {
    id: 'p3',
    name: 'Arjun Mehta',
    age: 62,
    diagnosis: 'Gastric CA',
    painScore: 5,
    painTrend: 'down',
    lastLog: '1 hr ago',
    status: 'monitoring',
  },
  {
    id: 'p4',
    name: 'Sunita Devi',
    age: 55,
    diagnosis: 'Breast CA (Stage IV)',
    painScore: 4,
    painTrend: 'stable',
    lastLog: '2 hr ago',
    status: 'monitoring',
  },
  {
    id: 'p5',
    name: 'Vikram Patel',
    age: 70,
    diagnosis: 'COPD, chest pain',
    painScore: 3,
    painTrend: 'down',
    lastLog: '3 hr ago',
    status: 'stable',
  },
  {
    id: 'p6',
    name: 'Meera Joshi',
    age: 48,
    diagnosis: 'Colorectal CA',
    painScore: 4,
    painTrend: 'down',
    lastLog: '4 hr ago',
    status: 'stable',
  },
];

function PainBadge({ score }: { score: number }) {
  const colors: Record<string, string> = {
    low: 'bg-sage/20 text-sage-dark',
    moderate: 'bg-amber/20 text-amber',
    high: 'bg-terra/20 text-terra',
    severe: 'bg-alert-critical/20 text-alert-critical',
  };

  let level = 'low';
  if (score >= 7) level = 'severe';
  else if (score >= 5) level = 'high';
  else if (score >= 3) level = 'moderate';

  return (
    <span
      className={clsx(
        'inline-flex min-w-[2.5rem] items-center justify-center rounded-full px-2 py-0.5 text-sm font-bold',
        colors[level],
      )}
    >
      {score}
    </span>
  );
}

function StatusDot({ status }: { status: PatientRow['status'] }) {
  const styles = {
    stable: 'bg-sage',
    monitoring: 'bg-amber',
    critical: 'bg-alert-critical animate-pulse',
  };
  return <div className={clsx('h-2.5 w-2.5 rounded-full', styles[status])} />;
}

function TrendIcon({ trend }: { trend: PatientRow['painTrend'] }) {
  if (trend === 'up')
    return <TrendingUp className="h-4 w-4 text-alert-critical" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-sage" />;
  return <Minus className="h-4 w-4 text-charcoal-light" />;
}

export function PatientListPreview() {
  return (
    <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-sage-light/20 px-5 py-4">
        <h2 className="font-heading text-base font-semibold text-charcoal">
          Patient Overview
        </h2>
        <Link
          href="/patients"
          className="text-xs font-medium text-teal hover:text-teal-dark"
        >
          View all 24 patients
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sage-light/20 bg-cream/50 text-left text-xs font-medium uppercase tracking-wider text-charcoal-light">
              <th className="px-5 py-3">Status</th>
              <th className="px-3 py-3">Patient</th>
              <th className="px-3 py-3">Diagnosis</th>
              <th className="px-3 py-3 text-center">Pain</th>
              <th className="px-3 py-3 text-center">Trend</th>
              <th className="px-3 py-3">Last Log</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-light/10">
            {mockPatients.map((patient) => (
              <tr
                key={patient.id}
                className="cursor-pointer transition-colors hover:bg-cream/30"
              >
                <td className="px-5 py-3">
                  <StatusDot status={patient.status} />
                </td>
                <td className="px-3 py-3">
                  <p className="text-sm font-medium text-charcoal">
                    {patient.name}
                  </p>
                  <p className="text-xs text-charcoal-light">
                    {patient.age}y
                  </p>
                </td>
                <td className="px-3 py-3 text-sm text-charcoal-light">
                  {patient.diagnosis}
                </td>
                <td className="px-3 py-3 text-center">
                  <PainBadge score={patient.painScore} />
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex justify-center">
                    <TrendIcon trend={patient.painTrend} />
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-charcoal-light">
                  {patient.lastLog}
                </td>
                <td className="px-3 py-3">
                  <ChevronRight className="h-4 w-4 text-charcoal-light/40" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
