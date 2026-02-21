'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Lightbulb, BookMarked, HelpCircle, GraduationCap } from 'lucide-react';
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

      {/* Sprint 58 — Reading Difficulty & Accessibility */}
      {(() => {
        const sections = module.sections || module.content || [];
        const allText = sections.map((s: any) => s.body || s.content || s.text || '').join(' ') + ' ' + (module.description || '');
        const words = allText.split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const sentences = allText.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length || 1;
        const avgWordsPerSentence = Math.round(wordCount / sentences);
        const longWords = words.filter((w: string) => w.length > 6).length;
        const longWordPct = wordCount > 0 ? Math.round((longWords / wordCount) * 100) : 0;

        const difficultyScore = Math.min(5, Math.max(1, Math.round((avgWordsPerSentence / 5) + (longWordPct / 15))));
        const diffLabel = difficultyScore <= 2 ? 'Easy' : difficultyScore <= 3 ? 'Moderate' : 'Advanced';
        const diffColor = difficultyScore <= 2 ? 'text-sage' : difficultyScore <= 3 ? 'text-amber' : 'text-terra';
        const diffBg = difficultyScore <= 2 ? 'bg-sage' : difficultyScore <= 3 ? 'bg-amber' : 'bg-terra';

        const hasImages = sections.some((s: any) => (s.body || s.content || s.text || '').includes('!['));
        const hasTips = sections.some((s: any) => s.tips);
        const hasTakeaways = !!(module.key_takeaways && module.key_takeaways.length > 0);
        const accessibilityFeatures = [
          { label: 'Plain Language', present: avgWordsPerSentence <= 15 },
          { label: 'Practical Tips', present: hasTips },
          { label: 'Key Takeaways', present: hasTakeaways },
          { label: 'Visual Aids', present: hasImages },
        ];
        const accessScore = accessibilityFeatures.filter((f) => f.present).length;

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Reading Level</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg font-bold ${diffColor}`}>{diffLabel}</span>
                  <span className="text-xs text-charcoal/40">({difficultyScore}/5)</span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${i < difficultyScore ? diffBg : 'bg-charcoal/10'}`}
                    />
                  ))}
                </div>
                <div className="space-y-1 text-xs text-charcoal/50">
                  <p>~{avgWordsPerSentence} words per sentence</p>
                  <p>{longWordPct}% complex vocabulary</p>
                  <p>{wordCount} total words</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal/50 mb-2">Accessibility Features</p>
                <div className="space-y-1.5">
                  {accessibilityFeatures.map((f) => (
                    <div key={f.label} className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${f.present ? 'bg-sage' : 'bg-charcoal/15'}`} />
                      <span className={`text-xs ${f.present ? 'text-charcoal' : 'text-charcoal/30'}`}>{f.label}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-charcoal/40">{accessScore}/4 features present</p>
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

      {/* Sprint 55 — Comprehension Self-Check */}
      {(() => {
        const QUIZZES: Record<string, { q: string; options: string[]; correct: number }[]> = {
          'Pain Management': [
            { q: 'What is the WHO pain ladder first step?', options: ['Non-opioid analgesics', 'Strong opioids', 'Nerve blocks'], correct: 0 },
            { q: 'When should you take breakthrough medication?', options: ['Only at night', 'When pain spikes above baseline', 'Every 2 hours'], correct: 1 },
          ],
          'Medication': [
            { q: 'Why is it important to take medications on schedule?', options: ['Keeps stable blood levels', 'Reduces cost', 'Makes doctors happy'], correct: 0 },
            { q: 'What should you do if you miss a dose?', options: ['Double the next dose', 'Skip it entirely', 'Take it soon and adjust schedule'], correct: 2 },
          ],
          'Comfort': [
            { q: 'Which breathing pattern helps with pain?', options: ['Fast shallow breaths', 'Slow diaphragmatic breathing', 'Holding breath'], correct: 1 },
            { q: 'What position often helps reduce pain?', options: ['Supported semi-upright', 'Flat on stomach', 'Standing straight'], correct: 0 },
          ],
        };
        const questions = QUIZZES[module.category] || [
          { q: 'What is the most important thing from this module?', options: ['Understanding my condition', 'Ignoring symptoms', 'Skipping medications'], correct: 0 },
          { q: 'When should you contact your care team?', options: ['Never', 'When symptoms change significantly', 'Only in emergencies'], correct: 1 },
        ];

        return (
          <div className="rounded-2xl bg-teal/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Quick Self-Check</h3>
              <span className="ml-auto text-xs text-charcoal/40">{questions.length} questions</span>
            </div>
            <div className="space-y-4">
              {questions.map((quiz, qi) => (
                <div key={qi}>
                  <p className="text-sm font-medium text-charcoal mb-2">{qi + 1}. {quiz.q}</p>
                  <div className="grid gap-1.5">
                    {quiz.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`rounded-xl px-4 py-2.5 text-sm cursor-default ${
                          oi === quiz.correct
                            ? 'bg-sage/15 text-sage-dark font-medium ring-1 ring-sage/20'
                            : 'bg-white text-charcoal/60'
                        }`}
                      >
                        {oi === quiz.correct && <span className="mr-1.5">✓</span>}
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              Review the correct answers above. Re-read the module if any were surprising.
            </p>
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
