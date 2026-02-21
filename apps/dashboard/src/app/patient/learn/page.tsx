'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock, Star, ArrowRight, Flame, Filter, Timer, BarChart3 } from 'lucide-react';
import { useEducationModules } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_EDUCATION_MODULES } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LearnPage() {
  const modulesQuery = useEducationModules();
  const { data: rawModules } = useWithFallback(modulesQuery, MOCK_EDUCATION_MODULES);
  const modules: any[] = Array.isArray(rawModules) ? rawModules : MOCK_EDUCATION_MODULES;
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const completed = modules.filter((m: any) => m.completed).length;
  const total = modules.length;
  const categories = ['All', ...Array.from(new Set(modules.map((m: any) => m.category).filter(Boolean)))];
  const filteredModules = categoryFilter === 'All' ? modules : modules.filter((m: any) => m.category === categoryFilter);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Learn</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Understand and manage your care with these modules
        </p>
      </div>

      {/* Sprint 38 — Learning Streak Tracker */}
      {(() => {
        const streakDays = completed >= 5 ? 7 : completed >= 3 ? 4 : completed >= 1 ? 2 : 0;
        const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const today = new Date().getDay();
        return (
          <div className="rounded-2xl bg-teal/5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber" />
                <div>
                  <p className="text-base font-bold text-charcoal">{streakDays}-day streak!</p>
                  <p className="text-sm text-charcoal-light">Keep learning to maintain your streak</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {weekDays.map((d, i) => {
                  const dayIdx = ((today - 6 + i) % 7 + 7) % 7;
                  const isActive = i < streakDays;
                  const isToday = i === 6;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-charcoal/40">{d}</span>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isToday ? 'ring-2 ring-teal/30' : ''
                      } ${isActive ? 'bg-teal text-white' : 'bg-charcoal/5 text-charcoal/20'}`}>
                        {isActive ? '\u2713' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Progress Banner */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal-light">Your Progress</p>
            <p className="mt-1 font-heading text-3xl font-bold text-charcoal">
              {completed} <span className="text-lg font-normal text-charcoal-light">of {total}</span>
            </p>
            <p className="text-sm text-charcoal-light">modules completed</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/10">
            <BookOpen className="h-7 w-7 text-sage" />
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-teal transition-all"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Learning Time & Category Breakdown */}
      {modules.length >= 2 && (() => {
        const parseMins = (dur: string) => {
          const match = dur?.match(/(\d+)/);
          return match ? parseInt(match[1]) : 10;
        };
        const totalMins = modules.reduce((s: number, m: any) => s + parseMins(m.duration), 0);
        const completedMins = modules.filter((m: any) => m.completed).reduce((s: number, m: any) => s + parseMins(m.duration), 0);
        const remainingMins = totalMins - completedMins;

        const catBreakdown: Record<string, { total: number; done: number }> = {};
        modules.forEach((m: any) => {
          const cat = m.category || 'General';
          if (!catBreakdown[cat]) catBreakdown[cat] = { total: 0, done: 0 };
          catBreakdown[cat].total += 1;
          if (m.completed) catBreakdown[cat].done += 1;
        });

        const catColors: Record<string, string> = {
          'Pain Management': 'bg-terra', 'Medication': 'bg-teal', 'Comfort': 'bg-sage',
          'Nutrition': 'bg-amber', 'Emotional': 'bg-lavender', 'General': 'bg-charcoal/30',
        };

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Learning Overview</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-xl font-bold text-charcoal">{totalMins}m</p>
                <p className="text-xs text-charcoal/50">Total content</p>
              </div>
              <div className="rounded-xl bg-sage/10 p-3 text-center">
                <p className="font-heading text-xl font-bold text-sage-dark">{completedMins}m</p>
                <p className="text-xs text-charcoal/50">Completed</p>
              </div>
              <div className="rounded-xl bg-teal/10 p-3 text-center">
                <p className="font-heading text-xl font-bold text-teal">{remainingMins}m</p>
                <p className="text-xs text-charcoal/50">Remaining</p>
              </div>
            </div>
            <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">By Category</p>
            <div className="space-y-2">
              {Object.entries(catBreakdown).map(([cat, data]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full flex-shrink-0 ${catColors[cat] || 'bg-charcoal/20'}`} />
                  <span className="text-sm text-charcoal/70 w-28 truncate">{cat}</span>
                  <div className="flex-1 h-2 rounded-full bg-charcoal/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${catColors[cat] || 'bg-charcoal/20'}`}
                      style={{ width: `${(data.done / data.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-charcoal/40 w-10 text-right">{data.done}/{data.total}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Recommended Next */}
      {(() => {
        const inProgress = modules.find((m: any) => !m.completed && m.progress > 0);
        const nextNew = modules.find((m: any) => !m.completed && m.progress === 0);
        const recommended = inProgress || nextNew;
        if (!recommended) return null;
        return (
          <Link href={`/patient/learn/${recommended.id}`} className="block rounded-2xl bg-teal/5 p-5 transition-all hover:ring-2 hover:ring-teal/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-teal" />
              <span className="text-xs font-bold text-teal uppercase">{inProgress ? 'Continue Learning' : 'Recommended Next'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-charcoal">{recommended.title}</h3>
                <p className="mt-1 text-sm text-charcoal-light">
                  {recommended.progress > 0 ? `${recommended.progress}% complete — pick up where you left off` : `${recommended.duration} · ${recommended.category}`}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-teal" />
            </div>
          </Link>
        );
      })()}

      {/* Encouragement */}
      {completed > 0 && completed < total && (
        <p className="text-sm text-charcoal-light text-center">
          Great progress! You&apos;ve completed <strong className="text-teal">{completed}</strong> of {total} modules. Keep going!
        </p>
      )}
      {completed === total && total > 0 && (
        <p className="text-sm text-sage text-center font-medium">
          Congratulations — you&apos;ve completed all {total} learning modules!
        </p>
      )}

      {/* Sprint 38 — Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 flex-shrink-0 text-charcoal/30" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-teal text-white'
                : 'bg-cream text-charcoal-light hover:bg-charcoal/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Module Cards */}
      <div className="space-y-4">
        {filteredModules.map((module: any) => (
          <Link
            key={module.id}
            href={`/patient/learn/${module.id}`}
            className="block rounded-2xl bg-white p-5 transition-all hover:ring-2 hover:ring-teal/10"
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                module.completed ? 'bg-sage/10' : 'bg-teal/10'
              }`}>
                {module.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-sage" />
                ) : (
                  <BookOpen className="h-6 w-6 text-teal" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-charcoal">{module.title}</h3>
                  {module.completed && (
                    <span className="rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-semibold text-sage">
                      Done
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-charcoal-light line-clamp-2">{module.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
                    {module.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-charcoal/40">
                    <Clock className="h-3.5 w-3.5" />
                    {module.duration}
                  </span>
                </div>
                {!module.completed && module.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-charcoal/40">
                      <span>{module.progress}% complete</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream">
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
