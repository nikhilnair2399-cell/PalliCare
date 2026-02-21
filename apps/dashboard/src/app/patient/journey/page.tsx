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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Journey</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Reflect, set intentions, and celebrate your milestones
        </p>
      </div>

      {/* Summary */}
      <p className="text-sm text-charcoal-light">
        {(journey.goals || []).length} goals &middot; {(journey.gratitude || []).length} gratitudes &middot; {(journey.milestones || []).length} milestones
      </p>

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
                  {item.date && (
                    <p className="mt-1 text-sm text-charcoal/40">
                      {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
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
