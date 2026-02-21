'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { useEducationModules } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_EDUCATION_MODULES } from '@/lib/patient-mock-data';
import { cn } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const categoryColors: Record<string, string> = {
  Medications: 'bg-terra/10 text-terra',
  'Symptom Management': 'bg-amber/10 text-amber',
  Safety: 'bg-alert-critical/10 text-alert-critical',
  Wellness: 'bg-sage/10 text-sage-dark',
  Nutrition: 'bg-teal/10 text-teal',
};

export default function LearnPage() {
  const modulesQuery = useEducationModules();
  const { data: rawModules } = useWithFallback(modulesQuery, MOCK_EDUCATION_MODULES);
  const modules: any[] = Array.isArray(rawModules) ? rawModules : MOCK_EDUCATION_MODULES;

  const completed = modules.filter((m: any) => m.completed).length;
  const total = modules.length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Learn</h1>
        <p className="text-sm text-charcoal-light">
          Education modules to help you understand and manage your care
        </p>
      </div>

      {/* Progress Overview */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal-light">Your Progress</p>
            <p className="mt-1 font-heading text-2xl font-bold text-sage-dark">
              {completed} of {total}
            </p>
            <p className="text-xs text-charcoal-light">modules completed</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/10">
            <BookOpen className="h-7 w-7 text-sage" />
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-sage-light/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage to-teal transition-all"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-3">
        {modules.map((module: any) => (
          <Link
            key={module.id}
            href={`/patient/learn/${module.id}`}
            className="block rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                module.completed ? 'bg-sage/10' : 'bg-teal/10',
              )}>
                {module.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-sage" />
                ) : (
                  <BookOpen className="h-5 w-5 text-teal" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-charcoal">
                    {module.title}
                  </h3>
                  {module.completed && (
                    <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-semibold text-sage">
                      Completed
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-charcoal-light line-clamp-2">
                  {module.description}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    categoryColors[module.category] || 'bg-sage/10 text-sage-dark',
                  )}>
                    {module.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-charcoal/40">
                    <Clock className="h-3 w-3" />
                    {module.duration}
                  </span>
                </div>

                {/* Progress bar */}
                {!module.completed && module.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-charcoal/40">
                      <span>{module.progress}% complete</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sage-light/20">
                      <div
                        className="h-full rounded-full bg-teal transition-all"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
