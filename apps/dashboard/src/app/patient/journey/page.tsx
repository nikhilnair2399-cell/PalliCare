'use client';

import { useState } from 'react';
import { Sparkles, Target, Heart, Sun, Trophy, Plus, Flame, TrendingUp, CalendarDays, CheckCircle2 } from 'lucide-react';
import { useGoals, useCreateGoal, useGratitude, useSaveGratitude, useIntentions, useSaveIntention, useMilestones } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_GOALS, MOCK_GRATITUDE_ENTRIES, MOCK_MILESTONES } from '@/lib/patient-mock-data';
import { clsx } from 'clsx';

/* eslint-disable @typescript-eslint/no-explicit-any */

const TABS = [
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'gratitude', label: 'Gratitude', icon: Heart },
  { key: 'intentions', label: 'Intentions', icon: Sun },
  { key: 'milestones', label: 'Milestones', icon: Trophy },
];

export default function JourneyPage() {
  const [activeTab, setActiveTab] = useState('goals');
  const [newItem, setNewItem] = useState('');

  const goalsQuery = useGoals();
  const gratitudeQuery = useGratitude();
  const intentionsQuery = useIntentions();
  const milestonesQuery = useMilestones();
  const addGratitude = useSaveGratitude();
  const addGoal = useCreateGoal();
  const addIntention = useSaveIntention();

  const { data: rawGoals } = useWithFallback(goalsQuery, MOCK_GOALS);
  const { data: rawGratitude } = useWithFallback(gratitudeQuery, MOCK_GRATITUDE_ENTRIES);
  const { data: rawIntentions } = useWithFallback(intentionsQuery, []);
  const { data: rawMilestones } = useWithFallback(milestonesQuery, MOCK_MILESTONES);
  const journey: Record<string, any[]> = {
    goals: Array.isArray(rawGoals) ? rawGoals : MOCK_GOALS,
    gratitude: Array.isArray(rawGratitude) ? rawGratitude : MOCK_GRATITUDE_ENTRIES,
    intentions: Array.isArray(rawIntentions) ? rawIntentions : [],
    milestones: Array.isArray(rawMilestones) ? rawMilestones : MOCK_MILESTONES,
  };

  function handleAdd() {
    if (!newItem.trim()) return;
    if (activeTab === 'gratitude') addGratitude.mutate({ content: newItem.trim() });
    else if (activeTab === 'goals') addGoal.mutate({ title: newItem.trim() });
    else if (activeTab === 'intentions') addIntention.mutate(newItem.trim());
    setNewItem('');
  }

  const items: any[] = journey[activeTab] || [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Journey</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Reflect, set intentions, and celebrate your milestones
        </p>
      </div>

      {/* Journey Stats Banner */}
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Target className="mb-1 h-4 w-4 text-teal" />
          <span className="font-heading text-2xl font-bold text-charcoal">{(journey.goals || []).length}</span>
          <span className="text-xs text-charcoal-light">Goals</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Heart className="mb-1 h-4 w-4 text-terra" />
          <span className="font-heading text-2xl font-bold text-charcoal">{(journey.gratitude || []).length}</span>
          <span className="text-xs text-charcoal-light">Gratitudes</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Trophy className="mb-1 h-4 w-4 text-amber" />
          <span className="font-heading text-2xl font-bold text-charcoal">{(journey.milestones || []).length}</span>
          <span className="text-xs text-charcoal-light">Milestones</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Flame className="mb-1 h-4 w-4 text-amber" />
          <span className="font-heading text-2xl font-bold text-charcoal">
            {Math.max((journey.gratitude || []).length, 1)}
          </span>
          <span className="text-xs text-charcoal-light">Day Streak</span>
        </div>
      </div>

      {/* Encouragement */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-teal/5 to-sage/5 p-4">
        <TrendingUp className="h-5 w-5 flex-shrink-0 text-teal" />
        <p className="text-sm text-charcoal/70">
          {(journey.goals || []).filter((g: any) => g.completed).length > 0
            ? `You&apos;ve completed ${(journey.goals || []).filter((g: any) => g.completed).length} goals — every step forward matters.`
            : 'Start by setting a small, meaningful goal. Every journey begins with one step.'}
        </p>
      </div>

      {/* Sprint 39 — Weekly Reflection Prompt */}
      {(() => {
        const prompts = [
          'What small moment brought you comfort this week?',
          'What are you most grateful for today?',
          'What gave you strength this week?',
          'Who made you smile recently?',
          'What is one thing you want to let go of?',
          'What would you like your care team to know?',
          'What brings you peace right now?',
        ];
        const dayOfWeek = new Date().getDay();
        return (
          <div className="rounded-2xl bg-lavender/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="h-4 w-4 text-lavender" />
              <span className="text-xs font-bold text-lavender uppercase">Weekly Reflection</span>
            </div>
            <p className="text-base font-medium text-charcoal italic">&ldquo;{prompts[dayOfWeek]}&rdquo;</p>
            <p className="mt-2 text-xs text-charcoal/40">Tap Gratitude tab to write your reflection</p>
          </div>
        );
      })()}

      {/* Sprint 39 — Goal Completion Rate */}
      {(() => {
        const goals = journey.goals || [];
        const total = goals.length;
        const done = goals.filter((g: any) => g.completed).length;
        const rate = total > 0 ? Math.round((done / total) * 100) : 0;
        if (total === 0) return null;
        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sage" />
                <h3 className="text-sm font-bold text-charcoal">Goal Progress</h3>
              </div>
              <span className="text-sm font-bold text-sage">{rate}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-cream">
              <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${rate}%` }} />
            </div>
            <p className="mt-2 text-xs text-charcoal/40">{done} of {total} goals completed</p>
          </div>
        );
      })()}

      {/* Tabs */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-teal text-white'
                  : 'bg-cream text-charcoal-light hover:text-charcoal',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add Input */}
        {activeTab !== 'milestones' && (
          <div className="mt-5 flex items-center gap-3">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder={
                activeTab === 'goals' ? 'Add a new goal...' :
                activeTab === 'gratitude' ? 'What are you grateful for today?' :
                'Set an intention...'
              }
              className="h-12 flex-1 rounded-xl border border-charcoal/10 bg-cream/30 px-4 text-base text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
            <button
              onClick={handleAdd}
              disabled={!newItem.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal text-white transition-colors hover:bg-teal/90 disabled:opacity-40"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Items */}
        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-charcoal/15" />
              <p className="mt-2 text-sm text-charcoal/40">
                {activeTab === 'milestones' ? 'No milestones yet — keep going!' : `No ${activeTab} yet. Add your first one above.`}
              </p>
            </div>
          ) : (
            items.map((item: any, i: number) => (
              <div key={item.id || i} className="flex items-start gap-3 rounded-xl bg-cream/50 p-4">
                <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  activeTab === 'goals' ? 'bg-teal/10 text-teal' :
                  activeTab === 'gratitude' ? 'bg-terra/10 text-terra' :
                  activeTab === 'intentions' ? 'bg-amber/10 text-amber' :
                  'bg-sage/10 text-sage'
                }`}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base text-charcoal">{item.text || item.title || item.content}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {item.date && (
                      <span className="text-sm text-charcoal/40">
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {item.category && (
                      <span className={clsx(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        item.category === 'physical' ? 'bg-teal/10 text-teal' :
                        item.category === 'emotional' ? 'bg-terra/10 text-terra' :
                        item.category === 'spiritual' ? 'bg-lavender/10 text-lavender' :
                        'bg-sage/10 text-sage',
                      )}>
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
                {item.completed && (
                  <span className="rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-semibold text-sage">Done</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
