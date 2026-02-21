'use client';

import { use } from 'react';
import { ArrowLeft, CheckCircle2, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEducationModule, useUpdateEducationProgress } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_EDUCATION_MODULES } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LearnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const moduleQuery = useEducationModule(id);
  const updateProgress = useUpdateEducationProgress();

  const fallbackModule = MOCK_EDUCATION_MODULES.find((m) => m.id === id) || MOCK_EDUCATION_MODULES[0];
  const { data: rawModule } = useWithFallback(moduleQuery, fallbackModule);
  const module = rawModule as any;

  function handleMarkComplete() {
    updateProgress.mutate(
      { id, progress: 100 },
      { onError: () => {} },
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/patient/learn"
        className="inline-flex items-center gap-1 text-sm text-teal hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Modules
      </Link>

      {/* Module Header */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10">
            <BookOpen className="h-6 w-6 text-teal" />
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-bold text-charcoal">
              {module.title}
            </h1>
            <p className="mt-2 text-sm text-charcoal-light">
              {module.description}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                {module.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-charcoal/40">
                <Clock className="h-3 w-3" />
                {module.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-charcoal-light">
            <span>{module.progress ?? 0}% complete</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-sage-light/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage to-teal transition-all"
              style={{ width: `${module.progress ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module Content Placeholder */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-6 shadow-sm">
        <div className="prose prose-sm max-w-none">
          <h2 className="font-heading text-lg font-bold text-teal">
            About This Module
          </h2>
          <p className="text-charcoal-light">
            {module.description}
          </p>

          <div className="my-6 flex h-48 items-center justify-center rounded-xl bg-cream/50 border border-sage-light/20">
            <p className="text-sm text-charcoal-light">
              Video / interactive content area
            </p>
          </div>

          <h3 className="font-heading text-base font-bold text-charcoal">
            Key Takeaways
          </h3>
          <ul className="space-y-2 text-sm text-charcoal-light">
            <li>Understanding the basics of this topic is important for your care.</li>
            <li>Always consult your care team if you have questions.</li>
            <li>Practice what you learn for better outcomes.</li>
          </ul>
        </div>
      </div>

      {/* Mark Complete Button */}
      {!module.completed ? (
        <button
          onClick={handleMarkComplete}
          disabled={updateProgress.isPending}
          className="w-full rounded-xl bg-gradient-to-r from-sage to-teal py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
        >
          {updateProgress.isPending ? 'Saving...' : 'Mark as Complete'}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-sage/30 bg-sage/5 py-3.5">
          <CheckCircle2 className="h-5 w-5 text-sage" />
          <span className="text-sm font-bold text-sage-dark">
            Module Completed
          </span>
        </div>
      )}
    </div>
  );
}
