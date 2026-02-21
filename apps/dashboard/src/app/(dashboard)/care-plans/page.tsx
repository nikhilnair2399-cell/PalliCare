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
  Loader2,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carePlansApi, patientsApi } from '@/lib/api';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-alert-success/10 text-alert-success',
  draft: 'bg-charcoal/10 text-charcoal/60',
  under_review: 'bg-amber/10 text-amber',
  completed: 'bg-teal/10 text-teal',
  archived: 'bg-charcoal/5 text-charcoal/40',
};

// ── Care Plan Templates ──────────────────────────────────────────────
const CARE_PLAN_TEMPLATES = [
  {
    id: 'pain',
    name: 'Pain Management',
    icon: '🎯',
    description: 'WHO ladder-based pain control with opioid titration, breakthrough protocols, and side-effect management',
    title: 'Palliative Care Plan — Pain Management Focus',
    goalsOfCare: 'Optimize pain control using WHO analgesic ladder, reduce NRS to ≤4/10, minimize opioid side effects, maintain functional status',
    goals: [
      'Pain NRS ≤ 4/10 at rest and ≤ 6/10 on movement',
      'Breakthrough pain episodes < 3 per day',
      'Adequate sleep quality (> 6 hours/night)',
      'Maintain current PPS / functional status',
    ],
    interventions: [
      { text: 'Opioid titration per WHO analgesic ladder protocol', assigned: 'Physician' },
      { text: 'Non-pharmacological pain management (heat, positioning, TENS)', assigned: 'Physiotherapist' },
      { text: 'Daily pain diary monitoring via PalliCare app', assigned: 'Patient' },
      { text: 'Opioid side-effect screening (constipation, nausea, sedation)', assigned: 'Nurse' },
      { text: 'Breakthrough pain PRN protocol and dose adjustment review', assigned: 'Physician' },
      { text: 'Weekly psychosocial check-in for pain-related distress', assigned: 'Psychologist' },
    ],
  },
  {
    id: 'eol',
    name: 'End-of-Life Care',
    icon: '🕊️',
    description: 'Comfort-focused care with symptom control, family support, spiritual needs, and bereavement planning',
    title: 'End-of-Life Comfort Care Plan',
    goalsOfCare: 'Comfort-focused care prioritizing dignity, symptom control, family preparation, spiritual support, and preferred place of death',
    goals: [
      'Comfort measures established as primary goal of care',
      'Advance care directive documented and communicated',
      'Family meeting completed — prognosis and plan understood',
      'Preferred place of death arranged and logistics in place',
      'Spiritual and cultural needs assessed and addressed',
    ],
    interventions: [
      { text: 'Symptom assessment every 4 hours (pain, dyspnea, secretions, agitation)', assigned: 'Nurse' },
      { text: 'PRN medication protocol for pain, dyspnea, and terminal restlessness', assigned: 'Physician' },
      { text: 'Family support and communication updates', assigned: 'Social Worker' },
      { text: 'Spiritual care assessment and support', assigned: 'Chaplain' },
      { text: 'Bereavement support planning and referral', assigned: 'Social Worker' },
      { text: 'Discontinue non-essential medications and investigations', assigned: 'Physician' },
    ],
  },
  {
    id: 'symptom',
    name: 'Symptom Management',
    icon: '📋',
    description: 'Systematic multi-symptom control with ESAS tracking, nutrition, nausea, fatigue, and functional optimization',
    title: 'Palliative Care Plan — Symptom Management',
    goalsOfCare: 'Systematic symptom control across all domains, quality of life optimization, nutritional support, and functional maintenance',
    goals: [
      'Symptom burden reduced by ≥ 30% on ESAS',
      'Nausea episodes ≤ 2 per day',
      'Nutritional intake > 1200 kcal/day',
      'Functional status (PPS) maintained or improved',
    ],
    interventions: [
      { text: 'Daily ESAS symptom assessment and documentation', assigned: 'Nurse' },
      { text: 'Anti-emetic protocol optimization', assigned: 'Physician' },
      { text: 'Dietary counselling and calorie-intake monitoring', assigned: 'Dietitian' },
      { text: 'Physiotherapy and early mobilization programme', assigned: 'Physiotherapist' },
      { text: 'Psychological screening (PHQ-9, GAD-7) at intake and weekly', assigned: 'Psychologist' },
      { text: 'Medication review to minimize polypharmacy burden', assigned: 'Physician' },
    ],
  },
  {
    id: 'caregiver',
    name: 'Caregiver Support',
    icon: '🤝',
    description: 'Caregiver wellbeing, burnout prevention, skills training, respite coordination, and emotional support',
    title: 'Caregiver Support and Wellbeing Plan',
    goalsOfCare: 'Support primary caregiver wellbeing, prevent burnout, build care skills, arrange respite, and connect with community resources',
    goals: [
      'Caregiver distress score < 5/10 on monthly screening',
      'Complete hands-on care skills training programme',
      'Respite care arrangement in place (≥ 1 day/week)',
      'Connected with caregiver support group or peer network',
    ],
    interventions: [
      { text: 'Monthly caregiver distress screening (Zarit Burden Interview)', assigned: 'Social Worker' },
      { text: 'Hands-on care skills training (medication, wound, PEG, positioning)', assigned: 'Nurse' },
      { text: 'Respite care coordination and scheduling', assigned: 'Social Worker' },
      { text: 'Individual psychological support for anticipatory grief', assigned: 'Psychologist' },
      { text: 'Financial counselling and government scheme navigation', assigned: 'Social Worker' },
      { text: 'Peer caregiver support group referral', assigned: 'Social Worker' },
    ],
  },
];

const MOCK_CARE_PLANS = [
  {
    id: '1',
    patient: 'Ramesh Kumar',
    patientId: '1',
    title: 'Palliative Care Plan - Pain Management Focus',
    status: 'active',
    version: 2,
    goalsOfCare: 'Optimize pain management, maintain quality of life, support family caregivers',
    goals: [
      { goal: 'Pain NRS \u2264 4/10', status: 'in_progress' },
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
    patientId: '2',
    title: 'Palliative Care Plan - Symptom Control',
    status: 'active',
    version: 1,
    goalsOfCare: 'Symptom control, nausea management, emotional support',
    goals: [
      { goal: 'Nausea score \u2264 3/10', status: 'in_progress' },
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
    patientId: '3',
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

function mapApiCarePlan(cp: any) {
  return {
    id: cp.id,
    patient: cp.patient_name || cp.patient || 'Unknown',
    patientId: cp.patient_id || cp.patientId || '',
    title: cp.title || 'Untitled Plan',
    status: cp.status || 'draft',
    version: cp.version ?? 1,
    goalsOfCare: cp.goals_of_care || cp.goalsOfCare || '',
    goals: Array.isArray(cp.goals) ? cp.goals.map((g: any) => ({
      goal: typeof g === 'string' ? g : (g.goal || g.description || g.text || ''),
      status: typeof g === 'string' ? 'pending' : (g.status || 'pending'),
    })) : [],
    interventions: Array.isArray(cp.interventions) ? cp.interventions.map((i: any) => ({
      text: typeof i === 'string' ? i : (i.text || i.description || ''),
      assigned: typeof i === 'string' ? '' : (i.assigned || i.assigned_to || ''),
    })) : [],
    reviewDate: cp.review_date
      ? new Date(cp.review_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : (cp.reviewDate || ''),
    createdBy: cp.created_by_name || cp.createdBy || '',
    lastUpdated: cp.updated_at
      ? new Date(cp.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : (cp.lastUpdated || ''),
  };
}

// ── New Care Plan Modal ──────────────────────────────────────────────
function NewCarePlanModal({ onClose, onCreated, isFromApi }: {
  onClose: () => void;
  onCreated: (plan: any) => void;
  isFromApi: boolean;
}) {
  const [step, setStep] = useState<'template' | 'form'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [title, setTitle] = useState('');
  const [goalsOfCare, setGoalsOfCare] = useState('');
  const [goals, setGoals] = useState<string[]>(['']);
  const [interventions, setInterventions] = useState<{ text: string; assigned: string }[]>([{ text: '', assigned: 'Physician' }]);
  const [reviewDate, setReviewDate] = useState('');
  const [saving, setSaving] = useState(false);

  const ROLES = ['Physician', 'Nurse', 'Patient', 'Psychologist', 'Social Worker', 'Dietitian', 'Chaplain', 'Physiotherapist'];

  function applyTemplate(templateId: string) {
    const tpl = CARE_PLAN_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setSelectedTemplate(templateId);
    setTitle(tpl.title);
    setGoalsOfCare(tpl.goalsOfCare);
    setGoals(tpl.goals);
    setInterventions(tpl.interventions.map((iv) => ({ text: iv.text, assigned: iv.assigned })));
    setStep('form');
  }

  function startBlank() {
    setSelectedTemplate(null);
    setTitle('');
    setGoalsOfCare('');
    setGoals(['']);
    setInterventions([{ text: '', assigned: 'Physician' }]);
    setStep('form');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientName.trim() || !title.trim()) return;

    setSaving(true);
    const newPlan = {
      id: `local-${Date.now()}`,
      patient: patientName.trim(),
      patientId: '',
      title: title.trim(),
      status: 'draft',
      version: 1,
      goalsOfCare: goalsOfCare.trim(),
      goals: goals.filter(g => g.trim()).map(g => ({ goal: g.trim(), status: 'pending' })),
      interventions: interventions.filter(i => i.text.trim()).map(i => ({ text: i.text.trim(), assigned: i.assigned })),
      reviewDate: reviewDate ? new Date(reviewDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
      createdBy: 'Dr. Nikhil Nair',
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    // If API is available, try to create on server
    if (isFromApi) {
      try {
        // Use first patient ID or search — for now, just create locally
        // The API expects a patient_id which we'd need to resolve
        // carePlansApi.create(patientId, { ... })
      } catch {
        // Fall through to local
      }
    }

    setTimeout(() => {
      setSaving(false);
      onCreated(newPlan);
    }, 300);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-sage-light/20 px-6 py-4">
          <h2 className="font-heading text-xl font-bold text-teal">
            {step === 'template' ? 'Choose a Template' : 'New Care Plan'}
          </h2>
          <div className="flex items-center gap-2">
            {step === 'form' && (
              <button onClick={() => setStep('template')} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/5">
                ← Templates
              </button>
            )}
            <button onClick={onClose} className="rounded-lg p-2 text-charcoal/40 hover:bg-cream hover:text-charcoal">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Template Picker Step ── */}
        {step === 'template' && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-charcoal/60">
              Start from a clinically-validated template or build from scratch.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CARE_PLAN_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => applyTemplate(tpl.id)}
                  className="group rounded-xl border border-sage-light/30 bg-white p-4 text-left transition-all hover:border-teal hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tpl.icon}</span>
                    <span className="text-sm font-bold text-charcoal group-hover:text-teal">{tpl.name}</span>
                  </div>
                  <p className="mt-2 text-xs text-charcoal/50 leading-relaxed">{tpl.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-charcoal/40">
                    <span>{tpl.goals.length} goals</span>
                    <span>&middot;</span>
                    <span>{tpl.interventions.length} interventions</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={startBlank}
              className="w-full rounded-xl border-2 border-dashed border-sage-light/40 p-4 text-sm font-semibold text-charcoal/50 hover:border-teal hover:text-teal transition-colors"
            >
              + Start from Blank
            </button>
          </div>
        )}

        {/* ── Form Step ── */}
        {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Template badge */}
          {selectedTemplate && (
            <div className="flex items-center gap-2 rounded-lg bg-teal/5 px-3 py-2">
              <span className="text-sm">{CARE_PLAN_TEMPLATES.find(t => t.id === selectedTemplate)?.icon}</span>
              <span className="text-xs font-semibold text-teal">
                Using: {CARE_PLAN_TEMPLATES.find(t => t.id === selectedTemplate)?.name} Template
              </span>
              <span className="text-[10px] text-charcoal/40 ml-auto">All fields are editable</span>
            </div>
          )}

          {/* Patient Name */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Patient Name *</label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full rounded-xl border border-sage-light/30 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
            />
          </div>

          {/* Plan Title */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Plan Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Palliative Care Plan — Pain Management Focus"
              className="w-full rounded-xl border border-sage-light/30 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
            />
          </div>

          {/* Goals of Care */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Goals of Care</label>
            <textarea
              rows={2}
              value={goalsOfCare}
              onChange={(e) => setGoalsOfCare(e.target.value)}
              placeholder="e.g. Optimize pain management, maintain quality of life, support family caregivers"
              className="w-full resize-none rounded-xl border border-sage-light/30 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
            />
          </div>

          {/* Goals */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Goals</label>
            {goals.map((goal, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => { const g = [...goals]; g[i] = e.target.value; setGoals(g); }}
                  placeholder={`Goal ${i + 1}, e.g. Pain NRS ≤ 4/10`}
                  className="flex-1 rounded-lg border border-sage-light/30 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none"
                />
                {goals.length > 1 && (
                  <button type="button" onClick={() => setGoals(goals.filter((_, j) => j !== i))} className="text-charcoal/30 hover:text-alert-critical">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setGoals([...goals, ''])} className="text-xs font-semibold text-teal hover:underline">
              + Add Goal
            </button>
          </div>

          {/* Interventions */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Interventions</label>
            {interventions.map((iv, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={iv.text}
                  onChange={(e) => { const arr = [...interventions]; arr[i] = { ...arr[i], text: e.target.value }; setInterventions(arr); }}
                  placeholder={`Intervention ${i + 1}`}
                  className="flex-1 rounded-lg border border-sage-light/30 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none"
                />
                <select
                  value={iv.assigned}
                  onChange={(e) => { const arr = [...interventions]; arr[i] = { ...arr[i], assigned: e.target.value }; setInterventions(arr); }}
                  className="w-36 rounded-lg border border-sage-light/30 bg-white px-2 py-2 text-xs text-charcoal focus:border-teal focus:outline-none"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {interventions.length > 1 && (
                  <button type="button" onClick={() => setInterventions(interventions.filter((_, j) => j !== i))} className="text-charcoal/30 hover:text-alert-critical">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setInterventions([...interventions, { text: '', assigned: 'Physician' }])} className="text-xs font-semibold text-teal hover:underline">
              + Add Intervention
            </button>
          </div>

          {/* Review Date */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Next Review Date</label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="rounded-xl border border-sage-light/30 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-teal focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-sage-light/20 pt-5">
            <button type="button" onClick={onClose} className="rounded-xl border border-sage/30 px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-sage/5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !patientName.trim() || !title.trim()}
              className="flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Create Plan
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function CarePlansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(MOCK_CARE_PLANS[0]?.id || null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [localPlans, setLocalPlans] = useState<any[]>([]);
  const [mockGoalOverrides, setMockGoalOverrides] = useState<Record<string, { goal: string; status: string }[]>>({});
  const [editingGoal, setEditingGoal] = useState<{ planId: string; goalIdx: number } | null>(null);

  // API: fetch all care plans — we'll try a general query
  // The API is patient-scoped, so we fetch for each known patient
  // For now, we merge local created plans with mock data
  const allPlans = [
    ...localPlans,
    ...MOCK_CARE_PLANS.map(p => mockGoalOverrides[p.id] ? { ...p, goals: mockGoalOverrides[p.id] } : p),
  ];

  const filteredPlans = allPlans.filter(
    (plan) =>
      !searchQuery ||
      plan.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activePlan = allPlans.find((p) => p.id === selectedPlan);

  function handlePlanCreated(plan: any) {
    setLocalPlans(prev => [plan, ...prev]);
    setSelectedPlan(plan.id);
    setShowNewModal(false);
  }

  function cycleGoalStatus(planId: string, goalIdx: number) {
    const statusOrder = ['pending', 'in_progress', 'completed'];
    const isLocalPlan = localPlans.find(p => p.id === planId);
    if (isLocalPlan) {
      setLocalPlans(prev => prev.map(p => {
        if (p.id !== planId) return p;
        const goals = [...p.goals];
        const current = goals[goalIdx].status;
        const nextIdx = (statusOrder.indexOf(current) + 1) % statusOrder.length;
        goals[goalIdx] = { ...goals[goalIdx], status: statusOrder[nextIdx] };
        return { ...p, goals };
      }));
    } else {
      // Mock plan — use overrides
      const mockPlan = MOCK_CARE_PLANS.find(p => p.id === planId);
      if (!mockPlan) return;
      const currentGoals = mockGoalOverrides[planId] || mockPlan.goals.map(g => ({ ...g }));
      const current = currentGoals[goalIdx].status;
      const nextIdx = (statusOrder.indexOf(current) + 1) % statusOrder.length;
      const updatedGoals = currentGoals.map((g, i) =>
        i === goalIdx ? { ...g, status: statusOrder[nextIdx] } : { ...g }
      );
      setMockGoalOverrides(prev => ({ ...prev, [planId]: updatedGoals }));
    }
  }

  // Count stats
  const totalActive = allPlans.filter(p => p.status === 'active').length;
  const totalDraft = allPlans.filter(p => p.status === 'draft').length;
  const totalReview = allPlans.filter(p => p.status === 'under_review').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Care Plans
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {allPlans.length} plans &middot; {totalActive} active &middot; {totalDraft} draft &middot; {totalReview} under review
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90 transition-colors"
        >
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
                <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase', STATUS_BADGE[plan.status] || STATUS_BADGE.draft)}>
                  {plan.status.replace('_', ' ')}
                </span>
              </div>
              <p className="mt-1 text-xs text-charcoal/60 truncate">{plan.title}</p>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-charcoal/40">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Review: {plan.reviewDate || 'TBD'}
                </span>
                <span>v{plan.version}</span>
                {plan.goals?.length > 0 && (
                  <span>{plan.goals.filter((g: any) => g.status === 'completed').length}/{plan.goals.length} goals</span>
                )}
              </div>
            </button>
          ))}

          {filteredPlans.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-sage-light/40 bg-cream/30 p-8 text-center">
              <ClipboardList className="mx-auto h-8 w-8 text-charcoal/20" />
              <p className="mt-2 text-sm text-charcoal/50">No care plans found</p>
            </div>
          )}
        </div>

        {/* Right: Plan Detail */}
        {activePlan ? (
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
                <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase', STATUS_BADGE[activePlan.status] || STATUS_BADGE.draft)}>
                  {activePlan.status.replace('_', ' ')}
                </span>
              </div>
              {activePlan.goalsOfCare && (
                <div className="mt-4 rounded-lg bg-teal/5 p-4">
                  <p className="text-xs font-semibold text-teal uppercase">Goals of Care</p>
                  <p className="mt-1 text-sm text-charcoal/70 leading-relaxed">{activePlan.goalsOfCare}</p>
                </div>
              )}
            </div>

            {/* Goals — with clickable status toggle */}
            {activePlan.goals?.length > 0 && (
              <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 font-heading text-base font-bold text-teal">
                  <Target className="h-4 w-4" />
                  Goals
                  <span className="ml-auto text-xs font-normal text-charcoal/40">
                    {activePlan.goals.filter((g: any) => g.status === 'completed').length}/{activePlan.goals.length} completed
                  </span>
                </h3>
                <div className="mt-3 space-y-2">
                  {activePlan.goals.map((goal: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => cycleGoalStatus(activePlan.id, i)}
                      className="flex w-full items-center gap-3 rounded-lg border border-sage/10 p-3 text-left transition-colors hover:bg-cream/50 cursor-pointer"
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
                      <span className={cn(
                        'ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize',
                        goal.status === 'completed' ? 'bg-alert-success/10 text-alert-success' :
                        goal.status === 'in_progress' ? 'bg-amber/10 text-amber' :
                        'bg-charcoal/5 text-charcoal/40',
                      )}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interventions */}
            {activePlan.interventions?.length > 0 && (
              <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 font-heading text-base font-bold text-teal">
                  <ListTodo className="h-4 w-4" />
                  Interventions
                </h3>
                <div className="mt-3 space-y-2">
                  {activePlan.interventions.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start justify-between rounded-lg border border-sage/10 p-3"
                    >
                      <span className="text-sm text-charcoal/70">{item.text}</span>
                      {item.assigned && (
                        <span className="ml-3 flex-shrink-0 rounded-full bg-sage/10 px-2.5 py-0.5 text-[10px] font-semibold text-charcoal/60">
                          {item.assigned}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Date & Actions */}
            <div className="flex items-center justify-between rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-charcoal/60">
                <Calendar className="h-4 w-4" />
                Next Review: <span className="font-semibold text-charcoal">{activePlan.reviewDate || 'Not set'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const statusOrder = ['draft', 'active', 'under_review', 'completed', 'archived'];
                    if (localPlans.find(p => p.id === activePlan.id)) {
                      setLocalPlans(prev => prev.map(p => {
                        if (p.id !== activePlan.id) return p;
                        const nextIdx = (statusOrder.indexOf(p.status) + 1) % statusOrder.length;
                        return { ...p, status: statusOrder[nextIdx] };
                      }));
                    }
                    // For mock plans, promote to local to enable status changes
                    const mockPlan = MOCK_CARE_PLANS.find(p => p.id === activePlan.id);
                    if (mockPlan && !localPlans.find(p => p.id === activePlan.id)) {
                      const currentGoals = mockGoalOverrides[mockPlan.id] || mockPlan.goals;
                      const nextIdx = (statusOrder.indexOf(mockPlan.status) + 1) % statusOrder.length;
                      setLocalPlans(prev => [{ ...mockPlan, goals: currentGoals, status: statusOrder[nextIdx] }, ...prev]);
                    }
                  }}
                  className="rounded-lg border border-sage/30 px-4 py-2 text-xs font-semibold text-charcoal/70 hover:bg-sage/5"
                >
                  Change Status
                </button>
                <button
                  onClick={() => {
                    // Create a new version
                    const newPlan = {
                      ...activePlan,
                      id: `local-${Date.now()}`,
                      version: (activePlan.version || 1) + 1,
                      status: 'draft',
                      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    };
                    setLocalPlans(prev => [newPlan, ...prev]);
                    setSelectedPlan(newPlan.id);
                  }}
                  className="rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90"
                >
                  New Version
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-sage-light/40 bg-cream/30 p-12">
            <div className="text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-charcoal/20" />
              <p className="mt-3 text-sm font-medium text-charcoal/50">Select a care plan to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* New Care Plan Modal */}
      {showNewModal && (
        <NewCarePlanModal
          onClose={() => setShowNewModal(false)}
          onCreated={handlePlanCreated}
          isFromApi={false}
        />
      )}
    </div>
  );
}
