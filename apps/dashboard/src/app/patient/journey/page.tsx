'use client';

import { useState } from 'react';
import { Sparkles, Target, Heart, Sun, Trophy, Plus, Flame, TrendingUp, CalendarDays, CheckCircle2, PieChart, Tags } from 'lucide-react';
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
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-heading text-xl sm:text-3xl font-bold text-teal">Journey</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Reflect, set intentions, and celebrate your milestones
        </p>
      </div>

      {/* Journey Stats Banner */}
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Target className="mb-1 h-4 w-4 text-teal" />
          <span className="font-heading text-lg sm:text-2xl font-bold text-charcoal">{(journey.goals || []).length}</span>
          <span className="text-xs text-charcoal-light">Goals</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Heart className="mb-1 h-4 w-4 text-terra" />
          <span className="font-heading text-lg sm:text-2xl font-bold text-charcoal">{(journey.gratitude || []).length}</span>
          <span className="text-xs text-charcoal-light">Gratitudes</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Trophy className="mb-1 h-4 w-4 text-amber" />
          <span className="font-heading text-lg sm:text-2xl font-bold text-charcoal">{(journey.milestones || []).length}</span>
          <span className="text-xs text-charcoal-light">Milestones</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4">
          <Flame className="mb-1 h-4 w-4 text-amber" />
          <span className="font-heading text-lg sm:text-2xl font-bold text-charcoal">
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
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
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

      {/* Sprint 54 — Journey Engagement Summary */}
      {(() => {
        const goals = journey.goals || [];
        const gratitudes = journey.gratitude || [];
        const milestones = journey.milestones || [];
        const intentions = journey.intentions || [];
        const sections = [
          { label: 'Goals', count: goals.length, active: goals.filter((g: any) => !g.completed).length, icon: '🎯', color: 'bg-teal' },
          { label: 'Gratitude', count: gratitudes.length, active: gratitudes.length, icon: '❤️', color: 'bg-terra' },
          { label: 'Milestones', count: milestones.length, active: milestones.filter((m: any) => m.achieved).length, icon: '🏆', color: 'bg-amber' },
          { label: 'Intentions', count: intentions.length, active: intentions.length, icon: '☀️', color: 'bg-lavender' },
        ];
        const totalEntries = sections.reduce((s, sec) => s + sec.count, 0);
        const maxEntries = Math.max(...sections.map((s) => s.count), 1);
        const streakDays = gratitudes.length >= 5 ? 7 : gratitudes.length >= 3 ? 4 : gratitudes.length >= 1 ? 2 : 0;
        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="h-4 w-4 text-teal" />
              <h3 className="text-sm font-bold text-charcoal">Journey Engagement</h3>
              <span className="ml-auto rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal">{totalEntries} entries</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {sections.map((sec) => (
                <div key={sec.label} className="flex items-center gap-2 rounded-xl bg-cream/50 p-3">
                  <span className="text-lg">{sec.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-charcoal">{sec.label}</p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-charcoal/5">
                      <div className={clsx('h-full rounded-full', sec.color)} style={{ width: `${(sec.count / maxEntries) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-charcoal/60">{sec.count}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-charcoal/40">
              {streakDays >= 5
                ? 'Amazing engagement! Your consistent journaling supports your emotional wellbeing.'
                : totalEntries >= 10
                ? 'Good activity across your journey. Try adding gratitude entries daily to build a streak.'
                : 'Start adding to your journey — even one entry a day makes a difference.'}
            </p>
          </div>
        );
      })()}

      {/* Milestone Timeline & Category Breakdown */}
      {(() => {
        const milestones: any[] = journey.milestones || [];
        const goals: any[] = journey.goals || [];
        const gratitudes: any[] = journey.gratitude || [];

        if (milestones.length === 0 && goals.length === 0) return null;

        // Category breakdown across all journey items
        const catCounts: Record<string, number> = {};
        [...milestones, ...goals].forEach((item: any) => {
          const cat = item.category || 'general';
          catCounts[cat] = (catCounts[cat] || 0) + 1;
        });
        const catColors: Record<string, string> = {
          physical: 'bg-teal', emotional: 'bg-terra', spiritual: 'bg-lavender',
          social: 'bg-amber', general: 'bg-sage',
        };
        const totalCat = Object.values(catCounts).reduce((s, v) => s + v, 0);

        // Time between milestones
        const sortedMs = milestones
          .filter((m: any) => m.date)
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const gaps: number[] = [];
        for (let i = 1; i < sortedMs.length; i++) {
          const diff = new Date(sortedMs[i].date).getTime() - new Date(sortedMs[i - 1].date).getTime();
          gaps.push(Math.round(diff / 86400000));
        }
        const avgGapDays = gaps.length > 0 ? Math.round(gaps.reduce((s, v) => s + v, 0) / gaps.length) : null;

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Journey Analytics</h3>
            </div>

            {/* Category distribution bar */}
            {totalCat > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">Category Focus</p>
                <div className="flex h-3 overflow-hidden rounded-full">
                  {Object.entries(catCounts).map(([cat, count]) => (
                    <div
                      key={cat}
                      className={`${catColors[cat] || 'bg-charcoal/20'} first:rounded-l-full last:rounded-r-full`}
                      style={{ width: `${(count / totalCat) * 100}%` }}
                      title={`${cat}: ${count}`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  {Object.entries(catCounts).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-1.5 text-xs text-charcoal/60">
                      <span className={`h-2 w-2 rounded-full ${catColors[cat] || 'bg-charcoal/20'}`} />
                      {cat} ({count})
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-base sm:text-xl font-bold text-charcoal">{gratitudes.length}</p>
                <p className="text-xs text-charcoal/50">Total reflections</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-base sm:text-xl font-bold text-charcoal">
                  {goals.filter((g: any) => g.completed).length}/{goals.length}
                </p>
                <p className="text-xs text-charcoal/50">Goals achieved</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3 text-center">
                <p className="font-heading text-base sm:text-xl font-bold text-charcoal">
                  {avgGapDays !== null ? `${avgGapDays}d` : '—'}
                </p>
                <p className="text-xs text-charcoal/50">Avg milestone gap</p>
              </div>
            </div>

            {/* Milestone timeline */}
            {sortedMs.length >= 2 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">Milestone Timeline</p>
                <div className="relative pl-4 border-l-2 border-teal/20 space-y-3">
                  {sortedMs.slice(-5).map((ms: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.3rem] top-1 h-2.5 w-2.5 rounded-full bg-teal" />
                      <p className="text-sm font-medium text-charcoal">{ms.text || ms.title || ms.content}</p>
                      <p className="text-xs text-charcoal/40">
                        {new Date(ms.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {ms.category && <span className="ml-2 text-charcoal/30">· {ms.category}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Sprint 64 — Gratitude Themes Analysis */}
      {(() => {
        const gratitudes: any[] = journey.gratitude || [];
        if (gratitudes.length < 2) return null;

        const THEME_KEYWORDS: Record<string, string[]> = {
          'Family & Love': ['family', 'wife', 'husband', 'son', 'daughter', 'children', 'love', 'visit', 'visited', 'together', 'support'],
          'Health & Relief': ['pain', 'better', 'relief', 'improved', 'comfortable', 'strength', 'sleep', 'rest', 'treatment', 'medication', 'doctor'],
          'Kindness': ['kind', 'kindness', 'help', 'helped', 'neighbour', 'friend', 'care', 'food', 'brought', 'gift', 'generous'],
          'Peace & Hope': ['peace', 'calm', 'grateful', 'hope', 'faith', 'prayer', 'blessed', 'thankful', 'content', 'happy', 'joy'],
          'Small Joys': ['book', 'read', 'music', 'garden', 'walk', 'tea', 'sunshine', 'morning', 'smile', 'laugh', 'nature', 'bird'],
          'Care Team': ['doctor', 'nurse', 'team', 'explained', 'understood', 'listened', 'appointment', 'hospital', 'clinic'],
        };

        const themeCounts: Record<string, { count: number; examples: string[] }> = {};
        Object.keys(THEME_KEYWORDS).forEach((theme) => {
          themeCounts[theme] = { count: 0, examples: [] };
        });

        gratitudes.forEach((g: any) => {
          const text = (g.content || g.text || '').toLowerCase();
          Object.entries(THEME_KEYWORDS).forEach(([theme, keywords]) => {
            if (keywords.some((kw) => text.includes(kw))) {
              themeCounts[theme].count++;
              if (themeCounts[theme].examples.length < 1) {
                themeCounts[theme].examples.push(g.content || g.text || '');
              }
            }
          });
        });

        const sorted = Object.entries(themeCounts)
          .filter(([, v]) => v.count > 0)
          .sort((a, b) => b[1].count - a[1].count);

        if (sorted.length === 0) return null;

        const maxCount = sorted[0][1].count;
        const THEME_COLORS: Record<string, string> = {
          'Family & Love': 'bg-terra',
          'Health & Relief': 'bg-teal',
          'Kindness': 'bg-amber',
          'Peace & Hope': 'bg-lavender',
          'Small Joys': 'bg-sage',
          'Care Team': 'bg-teal/60',
        };
        const THEME_ICONS: Record<string, string> = {
          'Family & Love': '❤️',
          'Health & Relief': '💊',
          'Kindness': '🤝',
          'Peace & Hope': '🕊️',
          'Small Joys': '☀️',
          'Care Team': '🩺',
        };

        const topTheme = sorted[0][0];

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tags className="h-4 w-4 text-lavender" />
              <h3 className="text-sm font-bold text-charcoal">Gratitude Themes</h3>
              <span className="ml-auto text-[10px] text-charcoal/40">from {gratitudes.length} entries</span>
            </div>
            <div className="space-y-2.5">
              {sorted.slice(0, 5).map(([theme, data]) => (
                <div key={theme}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{THEME_ICONS[theme] || '✨'}</span>
                    <span className="text-xs font-semibold text-charcoal/70 flex-1">{theme}</span>
                    <span className="text-xs font-bold text-charcoal/50">{data.count}×</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div
                      className={clsx('h-full rounded-full transition-all', THEME_COLORS[theme] || 'bg-charcoal/20')}
                      style={{ width: `${(data.count / maxCount) * 100}%` }}
                    />
                  </div>
                  {data.examples[0] && (
                    <p className="mt-1 text-[10px] text-charcoal/40 italic truncate">
                      &ldquo;{data.examples[0].length > 60 ? data.examples[0].slice(0, 60) + '...' : data.examples[0]}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-lavender/5 p-3">
              <p className="text-xs text-charcoal/60">
                <span className="font-semibold">{topTheme}</span> is your most frequent gratitude theme.
                {sorted.length >= 3
                  ? ' Your gratitude spans multiple areas of life — a sign of rich emotional awareness.'
                  : ' Try noticing small joys throughout your day to broaden your themes.'}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Tabs */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
