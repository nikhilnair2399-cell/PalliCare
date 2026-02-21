'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { useEducationModules } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_EDUCATION_MODULES } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LearnPage() {
  const modulesQuery = useEducationModules();
  const { data: rawModules } = useWithFallback(modulesQuery, MOCK_EDUCATION_MODULES);
  const modules: any[] = Array.isArray(rawModules) ? rawModules : MOCK_EDUCATION_MODULES;

  const completed = modules.filter((m: any) => m.completed).length;
  const total = modules.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Learn</h1>
        <p className="text-sm text-charcoal-light">
          Education modules to help you understand and manage your care
        </p>
      </div>

      {/* Progress Overview */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal-light">Your Progress</p>
            <p className="mt-1 font-heading text-3xl font-bold text-sage-dark">
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
            className="h-full rounded-full bg-teal transition-all"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module: any) => (
          <Link
            key={module.id}
            href={`/patient/learn/${module.id}`}
            className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                module.completed ? 'bg-sage/10' : 'bg-teal/10'
              }`}>
                {module.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-sage" />
                ) : (
                  <BookOpen className="h-5 w-5 text-teal" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-charcoal">{module.title}</h3>
                  {module.completed && (
                    <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-semibold text-sage">
                      Done
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-charcoal-light">{module.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-semibold text-teal">
                    {module.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-charcoal/40">
                    <Clock className="h-3 w-3" />
                    {module.duration}
                  </span>
                </div>
                {!module.completed && module.progress > 0 && (
                  <div className="mt-3">
                    <div className="text-[10px] text-charcoal/40">{module.progress}% complete</div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sage-light/20">
                      <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${module.progress}%` }} />
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
