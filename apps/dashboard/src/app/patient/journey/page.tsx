'use client';

import { useState } from 'react';
import {
  Target,
  Heart,
  Sun,
  Award,
  Plus,
  Check,
  Flame,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useGoals,
  useLogGoal,
  useCreateGoal,
  useGratitude,
  useSaveGratitude,
  useGratitudeStreak,
  useTodayIntention,
  useSaveIntention,
  useCompleteIntention,
  useMilestones,
  useMarkMilestoneSeen,
} from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import {
  MOCK_GOALS,
  MOCK_GRATITUDE_ENTRIES,
  MOCK_TODAY_INTENTION,
  MOCK_MILESTONES,
} from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Tab = 'goals' | 'gratitude' | 'intentions' | 'milestones';

const tabs: { key: Tab; label: string; Icon: typeof Target }[] = [
  { key: 'goals', label: 'Goals', Icon: Target },
  { key: 'gratitude', label: 'Gratitude', Icon: Heart },
  { key: 'intentions', label: 'Intentions', Icon: Sun },
  { key: 'milestones', label: 'Milestones', Icon: Award },
];

export default function JourneyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('goals');

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">
          Your Journey
        </h1>
        <p className="text-sm text-charcoal-light">
          Track goals, express gratitude, set intentions, and celebrate milestones
        </p>
      </div>

      {/* Tab Bar */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
              activeTab === key
                ? 'bg-gradient-to-r from-sage/15 to-teal/10 text-teal shadow-sm'
                : 'bg-white text-charcoal-light hover:bg-cream border border-sage-light/20',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'goals' && <GoalsTab />}
      {activeTab === 'gratitude' && <GratitudeTab />}
      {activeTab === 'intentions' && <IntentionsTab />}
      {activeTab === 'milestones' && <MilestonesTab />}
    </div>
  );
}

/* ── Goals Tab ── */
function GoalsTab() {
  const goalsQuery = useGoals();
  const logGoal = useLogGoal();
  const createGoal = useCreateGoal();
  const { data: rawGoals } = useWithFallback(goalsQuery, MOCK_GOALS);
  const goals: any[] = Array.isArray(rawGoals) ? rawGoals : MOCK_GOALS;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  function handleToggleGoal(goalId: string, completed: boolean) {
    logGoal.mutate({
      goalId,
      date: new Date().toISOString().split('T')[0],
      completed: !completed,
    });
  }

  function handleAddGoal() {
    if (!newGoalTitle.trim()) return;
    createGoal.mutate(
      { title: newGoalTitle.trim(), frequency: 'daily' },
      {
        onSuccess: () => {
          setNewGoalTitle('');
          setShowAddForm(false);
        },
        onError: () => {
          setNewGoalTitle('');
          setShowAddForm(false);
        },
      },
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal: any) => (
        <div
          key={goal.id}
          className="flex items-center gap-4 rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm"
        >
          <button
            onClick={() => handleToggleGoal(goal.id, goal.completed_today)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
              goal.completed_today
                ? 'border-sage bg-sage text-white'
                : 'border-sage-light/40 hover:border-sage',
            )}
          >
            {goal.completed_today && <Check className="h-4 w-4" />}
          </button>
          <div className="flex-1">
            <p className={cn(
              'text-sm font-semibold',
              goal.completed_today ? 'text-charcoal/50 line-through' : 'text-charcoal',
            )}>
              {goal.title}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Flame className="h-3 w-3 text-amber" />
              <span className="text-[11px] text-charcoal-light">
                {goal.streak} day streak
              </span>
              <span className="text-[11px] text-charcoal/30">&middot;</span>
              <span className="text-[11px] text-charcoal-light">
                {goal.frequency}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Add Goal */}
      {showAddForm ? (
        <div className="rounded-xl border border-teal/30 bg-teal/5 p-4">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            placeholder="What would you like to achieve?"
            className="w-full rounded-lg border border-sage-light/30 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none"
            autoFocus
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleAddGoal}
              className="rounded-lg bg-teal px-4 py-1.5 text-xs font-bold text-white"
            >
              Add Goal
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg px-4 py-1.5 text-xs font-medium text-charcoal-light hover:bg-cream"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sage-light/30 py-3 text-sm font-medium text-charcoal-light hover:border-sage hover:text-charcoal"
        >
          <Plus className="h-4 w-4" />
          Add New Goal
        </button>
      )}
    </div>
  );
}

/* ── Gratitude Tab ── */
function GratitudeTab() {
  const [entry, setEntry] = useState('');
  const gratitudeQuery = useGratitude();
  const streakQuery = useGratitudeStreak();
  const saveGratitude = useSaveGratitude();
  const { data: rawEntries } = useWithFallback(gratitudeQuery, MOCK_GRATITUDE_ENTRIES);
  const entries: any[] = Array.isArray(rawEntries) ? rawEntries : (rawEntries as any)?.data ?? MOCK_GRATITUDE_ENTRIES;
  const streak = (streakQuery.data as any)?.streak ?? 7;

  function handleSave() {
    if (!entry.trim()) return;
    saveGratitude.mutate(
      { content: entry.trim() },
      {
        onSuccess: () => setEntry(''),
        onError: () => setEntry(''),
      },
    );
  }

  return (
    <div className="space-y-4">
      {/* Streak */}
      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-lavender-light/50 to-sage-light/30 p-4">
        <Flame className="h-6 w-6 text-amber" />
        <div>
          <p className="text-sm font-bold text-charcoal">{streak} Day Streak!</p>
          <p className="text-xs text-charcoal-light">Keep expressing gratitude</p>
        </div>
      </div>

      {/* Today's Entry */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-bold text-charcoal">
          What are you grateful for today?
        </h3>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Today I am grateful for..."
          rows={3}
          className="w-full rounded-xl border border-sage-light/30 bg-cream/30 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
        <button
          onClick={handleSave}
          disabled={!entry.trim() || saveGratitude.isPending}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-sage to-teal py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saveGratitude.isPending ? 'Saving...' : 'Save Gratitude'}
        </button>
      </div>

      {/* Past Entries */}
      <div className="space-y-3">
        {entries.slice(0, 7).map((e: any, i: number) => (
          <div
            key={e.id || i}
            className="rounded-xl border border-sage-light/20 bg-white p-4"
          >
            <p className="text-sm text-charcoal">{e.content}</p>
            <p className="mt-2 text-[10px] text-charcoal/40">
              {new Date(e.date).toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Intentions Tab ── */
function IntentionsTab() {
  const [newIntention, setNewIntention] = useState('');
  const intentionQuery = useTodayIntention();
  const saveIntention = useSaveIntention();
  const completeIntention = useCompleteIntention();
  const { data: rawIntention } = useWithFallback(intentionQuery, MOCK_TODAY_INTENTION);
  const intention = rawIntention as any;

  function handleSave() {
    if (!newIntention.trim()) return;
    saveIntention.mutate(newIntention.trim(), {
      onSuccess: () => setNewIntention(''),
      onError: () => setNewIntention(''),
    });
  }

  function handleComplete() {
    completeIntention.mutate({
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    });
  }

  return (
    <div className="space-y-4">
      {intention?.content ? (
        <div className="rounded-2xl border border-sage-light/20 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Sun className="mt-0.5 h-6 w-6 text-amber" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-charcoal">
                Today&apos;s Intention
              </h3>
              <p className="mt-2 text-sm text-charcoal-light">
                {intention.content}
              </p>
              <div className="mt-4">
                {intention.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-3 py-1.5 text-xs font-semibold text-sage">
                    <Check className="h-3.5 w-3.5" />
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="rounded-xl bg-gradient-to-r from-sage to-teal px-4 py-2 text-xs font-bold text-white"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-sage-light/20 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-bold text-charcoal">
            Set Today&apos;s Intention
          </h3>
          <p className="mb-3 text-xs text-charcoal-light">
            What would you like to focus on today?
          </p>
          <textarea
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            placeholder="Today I will..."
            rows={2}
            className="w-full rounded-xl border border-sage-light/30 bg-cream/30 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
          <button
            onClick={handleSave}
            disabled={!newIntention.trim()}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-sage to-teal py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            Set Intention
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Milestones Tab ── */
function MilestonesTab() {
  const milestonesQuery = useMilestones();
  const markSeen = useMarkMilestoneSeen();
  const { data: rawMilestones } = useWithFallback(milestonesQuery, MOCK_MILESTONES);
  const milestones: any[] = Array.isArray(rawMilestones)
    ? rawMilestones
    : (rawMilestones as any)?.data ?? MOCK_MILESTONES;

  const iconMap: Record<string, string> = {
    heart: '❤️',
    star: '⭐',
    trophy: '🏆',
    flame: '🔥',
  };

  return (
    <div className="space-y-3">
      {milestones.length === 0 ? (
        <div className="rounded-2xl border border-sage-light/20 bg-white p-8 text-center">
          <Award className="mx-auto h-12 w-12 text-charcoal/20" />
          <p className="mt-3 text-sm font-medium text-charcoal-light">
            No milestones yet
          </p>
          <p className="mt-1 text-xs text-charcoal/40">
            Keep logging and engaging to earn achievements!
          </p>
        </div>
      ) : (
        milestones.map((m: any) => (
          <div
            key={m.id}
            className={cn(
              'rounded-2xl border bg-white p-5 shadow-sm transition-all',
              !m.seen
                ? 'border-amber/30 bg-amber/5 shadow-amber/10'
                : 'border-sage-light/20',
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber/20 to-sage/20 text-2xl">
                {iconMap[m.icon] || '🏅'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-charcoal">
                    {m.title}
                  </h3>
                  {!m.seen && (
                    <span className="rounded-full bg-amber px-2 py-0.5 text-[9px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-charcoal-light">
                  {m.description}
                </p>
                <p className="mt-2 text-[10px] text-charcoal/40">
                  {new Date(m.achieved_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {!m.seen && (
                <button
                  onClick={() => markSeen.mutate(m.id)}
                  className="rounded-lg p-1.5 text-charcoal/30 hover:bg-cream hover:text-charcoal"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
