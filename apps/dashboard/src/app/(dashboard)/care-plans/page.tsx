'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Stethoscope,
  ListTodo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-alert-success/10 text-alert-success',
  draft: 'bg-charcoal/10 text-charcoal/60',
  under_review: 'bg-amber/10 text-amber',
  completed: 'bg-teal/10 text-teal',
  archived: 'bg-charcoal/5 text-charcoal/40',
};

const CARE_PLANS = [
  {
    id: '1',
    patient: 'Ramesh Kumar',
    title: 'Palliative Care Plan - Pain Management Focus',
    status: 'active',
    version: 2,
    goalsOfCare: 'Optimize pain management, maintain quality of life, support family caregivers',
    goals: [
      { goal: 'Pain NRS ≤ 4/10', status: 'in_progress' },
      { goal: 'Improve sleep quality to >6h/night', status: 'pending' },
      { goal: 'Maintain current functional status (PPS 50%)', status: 'in_progress' },
    ],
    interventions: [
      { text: 'Opioid titration per WHO ladder protocol', assigned: 'Physician' },
      { text: 'Daily symptom monitoring via PalliCare app', assigned: 'Patient' },
      { text: 'Weekly psychosocial check-in', assigned: 'Psychologist' },
      { text: 'Caregiver support counselling', assigned: 'Social Worker' },
    ],
    reviewDate: '28 Feb 2026',
    createdBy: 'Dr. Nikhil Nair',
    lastUpdated: '20 Feb 2026',
  },
  {
    id: '2',
    patient: 'Sunita Devi',
    title: 'Palliative Care Plan - Symptom Control',
    status: 'active',
    version: 1,
    goalsOfCare: 'Symptom control, nausea management, emotional support',
    goals: [
      { goal: 'Nausea score ≤ 3/10', status: 'in_progress' },
      { goal: 'Complete Phase 2 education modules', status: 'pending' },
    ],
    interventions: [
      { text: 'Anti-emetic optimization', assigned: 'Physician' },
      { text: 'Dietary counselling', assigned: 'Dietitian' },
    ],
    reviewDate: '25 Feb 2026',
    createdBy: 'Dr. Nikhil Nair',
    lastUpdated: '18 Feb 2026',
  },
  {
    id: '3',
    patient: 'Arjun Singh',
    title: 'End-of-Life Care Plan',
    status: 'under_review',
    version: 3,
    goalsOfCare: 'Comfort-focused care, family preparation, spiritual support',
    goals: [
      { goal: 'Comfort measures as primary goal', status: 'in_progress' },
      { goal: 'Family meeting completed', status: 'completed' },
      { goal: 'Advance care directives documented', status: 'completed' },
    ],
    interventions: [
      { text: 'Continuous symptom assessment Q4H', assigned: 'Nurse' },
      { text: 'PRN medication protocol for pain & dyspnea', assigned: 'Physician' },
      { text: 'Spiritual care referral', assigned: 'Chaplain' },
      { text: 'Bereavement support planning', assigned: 'Social Worker' },
    ],
    reviewDate: '22 Feb 2026',
    createdBy: 'Dr. Nikhil Nair',
    lastUpdated: '19 Feb 2026',
  },
];

export default function CarePlansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(CARE_PLANS[0]?.id || null);

  const filteredPlans = CARE_PLANS.filter(
    (plan) =>
      !searchQuery ||
      plan.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activePlan = CARE_PLANS.find((p) => p.id === selectedPlan);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Care Plans
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Manage patient care plans, goals, and interventions
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90 transition-colors">
          <Plus className="h-4 w-4" />
          New Care Plan
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
        <input
          type="text"
          placeholder="Search care plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-sage-light/30 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: Plan List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all',
                selectedPlan === plan.id
                  ? 'border-teal bg-teal/5 shadow-md'
                  : 'border-sage-light/30 bg-white hover:shadow-sm',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-charcoal">{plan.patient}</span>
                <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase', STATUS_BADGE[plan.status])}>
                  {plan.status.replace('_', ' ')}
                </span>
              </div>
              <p className="mt-1 text-xs text-charcoal/60 truncate">{plan.title}</p>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-charcoal/40">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Review: {plan.reviewDate}
                </span>
                <span>v{plan.version}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Plan Detail */}
        {activePlan && (
          <div className="lg:col-span-3 space-y-4">
            {/* Plan Header */}
            <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-teal">{activePlan.title}</h2>
                  <div className="mt-1 flex items-center gap-3 text-xs text-charcoal/50">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {activePlan.patient}
                    </span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="h-3 w-3" /> {activePlan.createdBy}
                    </span>
                    <span>Version {activePlan.version}</span>
                  </div>
                </div>
                <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase', STATUS_BADGE[activePlan.status])}>
                  {activePlan.status.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-4 rounded-lg bg-teal/5 p-4">
                <p className="text-xs font-semibold text-teal uppercase">Goals of Care</p>
                <p className="mt-1 text-sm text-charcoal/70 leading-relaxed">{activePlan.goalsOfCare}</p>
              </div>
            </div>

            {/* Goals */}
            <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-teal">
                <Target className="h-4 w-4" />
                Goals
              </h3>
              <div className="mt-3 space-y-2">
                {activePlan.goals.map((goal, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-sage/10 p-3"
                  >
                    {goal.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-alert-success" />
                    ) : goal.status === 'in_progress' ? (
                      <Clock className="h-5 w-5 flex-shrink-0 text-amber" />
                    ) : (
                      <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-charcoal/20" />
                    )}
                    <span className={cn('text-sm', goal.status === 'completed' ? 'text-charcoal/50 line-through' : 'text-charcoal')}>
                      {goal.goal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interventions */}
            <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-teal">
                <ListTodo className="h-4 w-4" />
                Interventions
              </h3>
              <div className="mt-3 space-y-2">
                {activePlan.interventions.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between rounded-lg border border-sage/10 p-3"
                  >
                    <span className="text-sm text-charcoal/70">{item.text}</span>
                    <span className="ml-3 flex-shrink-0 rounded-full bg-sage/10 px-2.5 py-0.5 text-[10px] font-semibold text-charcoal/60">
                      {item.assigned}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Date & Actions */}
            <div className="flex items-center justify-between rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-charcoal/60">
                <Calendar className="h-4 w-4" />
                Next Review: <span className="font-semibold text-charcoal">{activePlan.reviewDate}</span>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-sage/30 px-4 py-2 text-xs font-semibold text-charcoal/70 hover:bg-sage/5">
                  Edit Plan
                </button>
                <button className="rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90">
                  New Version
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
