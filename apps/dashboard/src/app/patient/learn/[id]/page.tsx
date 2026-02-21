'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { useEducationModule, useUpdateEducationProgress } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_EDUCATION_MODULES } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LearnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const moduleQuery = useEducationModule(id);
  const markComplete = useUpdateEducationProgress();

  const fallbackModule = MOCK_EDUCATION_MODULES.find((m) => m.id === id) || MOCK_EDUCATION_MODULES[0];
  const { data: rawModule } = useWithFallback(moduleQuery, fallbackModule);
  const module = rawModule as any;

  return (
    <div className="space-y-6">
      <Link href="/patient/learn" className="inline-flex items-center gap-2 text-sm text-teal hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Modules
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Module Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
            <div className="border-b border-sage-light/20 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
                  <BookOpen className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-teal">{module.title}</h1>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[10px] font-semibold text-teal">
                      {module.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-charcoal-light">
                      <Clock className="h-3 w-3" />
                      {module.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-charcoal-light">{module.description}</p>

              {(module.sections || module.content || []).map((section: any, i: number) => (
                <div key={i} className="mt-6 border-t border-sage-light/10 pt-6">
                  <h3 className="text-base font-semibold text-charcoal">{section.title || `Section ${i + 1}`}</h3>
                  <div className="mt-3 text-sm leading-relaxed text-charcoal-light">
                    {section.body || section.content || section.text || ''}
                  </div>
                  {section.tips && (
                    <div className="mt-4 rounded-lg bg-cream p-4">
                      <p className="text-xs font-bold text-teal">Tips</p>
                      <ul className="mt-2 space-y-1">
                        {(Array.isArray(section.tips) ? section.tips : [section.tips]).map((tip: string, j: number) => (
                          <li key={j} className="text-xs text-charcoal-light">&bull; {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Progress + Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-charcoal">Module Progress</h3>
            {module.completed ? (
              <div className="mt-4 flex flex-col items-center">
                <CheckCircle2 className="h-10 w-10 text-sage" />
                <p className="mt-2 text-sm font-semibold text-sage-dark">Completed</p>
              </div>
            ) : (
              <>
                <div className="mt-3">
                  <div className="text-xs text-charcoal-light">{module.progress || 0}%</div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-sage-light/20">
                    <div className="h-full rounded-full bg-teal" style={{ width: `${module.progress || 0}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => markComplete.mutate({ id, progress: 100 })}
                  className="mt-4 w-full rounded-xl bg-teal py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal/90"
                >
                  Mark as Complete
                </button>
              </>
            )}
          </div>

          {module.key_takeaways && (
            <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-charcoal">Key Takeaways</h3>
              <ul className="mt-3 space-y-2">
                {module.key_takeaways.map((takeaway: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-charcoal-light">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-sage" />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
