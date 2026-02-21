'use client';

import { useState } from 'react';
import { Sparkles, Target, Heart, Sun, Trophy, Plus } from 'lucide-react';
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
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Journey</h1>
        <p className="text-sm text-charcoal-light">
          Reflect, set intentions, and celebrate your milestones
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
          <Target className="h-5 w-5 text-teal" />
          <p className="mt-2 font-heading text-2xl font-bold text-charcoal">{(journey.goals || []).length}</p>
          <p className="text-xs text-charcoal-light">Goals Set</p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
          <Heart className="h-5 w-5 text-terra" />
          <p className="mt-2 font-heading text-2xl font-bold text-charcoal">{(journey.gratitude || []).length}</p>
          <p className="text-xs text-charcoal-light">Gratitudes</p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
          <Sun className="h-5 w-5 text-amber" />
          <p className="mt-2 font-heading text-2xl font-bold text-charcoal">{(journey.intentions || []).length}</p>
          <p className="text-xs text-charcoal-light">Intentions</p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
          <Trophy className="h-5 w-5 text-sage" />
          <p className="mt-2 font-heading text-2xl font-bold text-charcoal">{(journey.milestones || []).length}</p>
          <p className="text-xs text-charcoal-light">Milestones</p>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        <div className="flex border-b border-sage-light/20">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-teal text-teal'
                  : 'border-transparent text-charcoal-light hover:text-charcoal',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'milestones' && (
          <div className="flex items-center gap-3 border-b border-sage-light/10 px-5 py-3">
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
              className="flex-1 rounded-lg border border-sage-light/30 bg-cream/30 px-4 py-2 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
            <button
              onClick={handleAdd}
              disabled={!newItem.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal text-white transition-colors hover:bg-teal/90 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="divide-y divide-sage-light/10">
          {items.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-charcoal/15" />
              <p className="mt-2 text-sm text-charcoal/40">
                {activeTab === 'milestones' ? 'No milestones yet — keep going!' : `No ${activeTab} yet. Add your first one above.`}
              </p>
            </div>
          ) : (
            items.map((item: any, i: number) => (
              <div key={item.id || i} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-cream/20">
                <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  activeTab === 'goals' ? 'bg-teal/10 text-teal' :
                  activeTab === 'gratitude' ? 'bg-terra/10 text-terra' :
                  activeTab === 'intentions' ? 'bg-amber/10 text-amber' :
                  'bg-sage/10 text-sage'
                }`}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-charcoal">{item.text || item.title || item.content}</p>
                  {item.date && (
                    <p className="mt-0.5 text-[10px] text-charcoal/40">
                      {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
                {item.completed && (
                  <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-semibold text-sage">Done</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
