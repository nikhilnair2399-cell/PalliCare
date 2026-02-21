'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Lightbulb, BookMarked } from 'lucide-react';
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
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/patient/learn" className="inline-flex items-center gap-2 text-sm text-teal hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Modules
      </Link>

      {/* Module Header */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10">
            <BookOpen className="h-6 w-6 text-teal" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">{module.title}</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="rounded-full bg-teal/10 px-3 py-0.5 text-xs font-semibold text-teal">
                {module.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-charcoal-light">
                <Clock className="h-3.5 w-3.5" />
                {module.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        {module.completed ? (
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-sage/10 p-4">
            <CheckCircle2 className="h-6 w-6 text-sage" />
            <p className="text-base font-semibold text-sage-dark">Completed</p>
          </div>
        ) : (
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-light">{module.progress || 0}% complete</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-cream">
              <div className="h-full rounded-full bg-teal" style={{ width: `${module.progress || 0}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Module Content */}
      <div className="rounded-2xl bg-white p-6">
        <p className="text-base leading-relaxed text-charcoal-light">{module.description}</p>

        {(module.sections || module.content || []).map((section: any, i: number) => (
          <div key={i} className="mt-8 border-t border-charcoal/5 pt-8">
            <h3 className="text-lg font-semibold text-charcoal">{section.title || `Section ${i + 1}`}</h3>
            <div className="mt-3 text-base leading-relaxed text-charcoal-light">
              {section.body || section.content || section.text || ''}
            </div>
            {section.tips && (
              <div className="mt-4 rounded-xl bg-cream p-5">
                <p className="text-sm font-bold text-teal">Tips</p>
                <ul className="mt-2 space-y-1.5">
                  {(Array.isArray(section.tips) ? section.tips : [section.tips]).map((tip: string, j: number) => (
                    <li key={j} className="text-sm text-charcoal-light">&bull; {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Takeaways */}
      {module.key_takeaways && (
        <div className="rounded-2xl bg-cream p-6">
          <h3 className="text-lg font-semibold text-charcoal">Key Takeaways</h3>
          <ul className="mt-3 space-y-2">
            {module.key_takeaways.map((takeaway: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-base text-charcoal-light">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage" />
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reading Stats & Estimated Time */}
      {(() => {
        const sections = module.sections || module.content || [];
        const totalWords = sections.reduce((sum: number, s: any) => {
          const text = s.body || s.content || s.text || '';
          return sum + text.split(/\s+/).filter(Boolean).length;
        }, 0) + (module.description || '').split(/\s+/).filter(Boolean).length;
        const readingMins = Math.max(1, Math.ceil(totalWords / 200));
        const sectionCount = sections.length;
        const hasTips = sections.some((s: any) => s.tips);
        const hasTakeaways = !!(module.key_takeaways && module.key_takeaways.length > 0);

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Module Overview</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-xl font-bold text-charcoal">{readingMins}</p>
                <p className="text-xs text-charcoal/50">min read</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-xl font-bold text-charcoal">{sectionCount}</p>
                <p className="text-xs text-charcoal/50">sections</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-xl font-bold text-charcoal">{hasTips ? 'Yes' : 'No'}</p>
                <p className="text-xs text-charcoal/50">tips included</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-xl font-bold text-charcoal">{hasTakeaways ? 'Yes' : 'No'}</p>
                <p className="text-xs text-charcoal/50">takeaways</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Related Modules */}
      {(() => {
        const allModules: any[] = MOCK_EDUCATION_MODULES;
        const related = allModules
          .filter((m: any) => m.id !== id && m.category === module.category)
          .slice(0, 3);
        if (related.length === 0) return null;

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookMarked className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Related Modules</h3>
            </div>
            <div className="space-y-2">
              {related.map((rm: any) => (
                <Link
                  key={rm.id}
                  href={`/patient/learn/${rm.id}`}
                  className="flex items-center gap-3 rounded-xl bg-cream/50 p-3 transition-colors hover:bg-teal/5"
                >
                  <BookOpen className="h-4 w-4 flex-shrink-0 text-teal/60" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{rm.title}</p>
                    <p className="text-xs text-charcoal/40">{rm.duration} · {rm.completed ? 'Completed' : `${rm.progress || 0}%`}</p>
                  </div>
                  {rm.completed && <CheckCircle2 className="h-4 w-4 text-sage flex-shrink-0" />}
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Mark Complete */}
      {!module.completed && (
        <button
          onClick={() => markComplete.mutate({ id, progress: 100 })}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90"
        >
          Mark as Complete
        </button>
      )}
    </div>
  );
}
