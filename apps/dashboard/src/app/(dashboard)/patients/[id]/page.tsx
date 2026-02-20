'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Heart,
  Pill,
  Activity,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  User,
  Phone,
  FileText,
  MessageSquare,
  Calendar,
  Flag,
  TrendingUp,
  Droplets,
  Moon,
  Brain,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  ClipboardList,
  Users,
  BookOpen,
  Target,
  CheckCircle2,
  ListTodo,
  GraduationCap,
  Wind,
  Sparkles,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// -- Pain color helper --------------------------------------------------------
const PAIN_COLORS: Record<number, string> = {
  0: '#7BA68C',
  1: '#8DB89A',
  2: '#A0C9A8',
  3: '#C5D68E',
  4: '#E8D86A',
  5: '#E8C44A',
  6: '#E8A838',
  7: '#E08830',
  8: '#D4856B',
  9: '#C25A45',
  10: '#A83232',
};

// -- Mock data ----------------------------------------------------------------
const PATIENT = {
  id: '1',
  name: 'Ramesh Kumar',
  age: 58,
  gender: 'M',
  diagnosis: 'Lung Ca (Stage IIIB) with bone metastases',
  ppsScore: 50,
  ecogStatus: 2,
  phaseOfIllness: 'Deteriorating',
  abhaId: 'XXXX-XXXX-7834',
  codeStatus: 'DNR',
  caregiver: {
    name: 'Sunita Kumar (Wife)',
    phone: '+91 98765 43210',
    relationship: 'Spouse',
  },
};

const PAIN_DATA = {
  currentNRS: 7,
  trendDirection: 'worsening' as 'worsening' | 'improving' | 'stable',
  trendMagnitude: '+2 from 72h ago',
  weeklySparkline: [4, 5, 6, 5, 7, 8, 7],
  breakthroughCount: 5,
  breakthroughAvgIntensity: 8.2,
  painQualities: ['Burning', 'Aching', 'Shooting'],
  aggravators: ['Movement', 'Coughing', 'Night-time'],
};

const PAIN_TREND_30D = [
  5, 4, 5, 6, 5, 4, 5, 6, 7, 6, 5, 6, 7, 7, 6,
  7, 8, 7, 6, 7, 8, 7, 7, 8, 7, 6, 7, 8, 7, 7,
];

const MEDICATIONS = {
  medd: 220,
  current: [
    { name: 'Morphine SR', dose: '60mg', frequency: 'q12h', adherence: 92, type: 'opioid' },
    { name: 'Morphine IR', dose: '15mg', frequency: 'q4h PRN', adherence: 100, type: 'opioid-prn' },
    { name: 'Gabapentin', dose: '300mg', frequency: 'TID', adherence: 78, type: 'adjuvant' },
    { name: 'Dexamethasone', dose: '4mg', frequency: 'BID', adherence: 88, type: 'adjuvant' },
    { name: 'Pantoprazole', dose: '40mg', frequency: 'OD', adherence: 95, type: 'supportive' },
    { name: 'Ondansetron', dose: '4mg', frequency: 'PRN', adherence: 100, type: 'supportive' },
  ],
  prnUsage: { last24h: 5, avgPerDay: 2.1 },
  sideEffects: ['Constipation (moderate)', 'Drowsiness (mild)', 'Nausea (resolved)'],
};

const SYMPTOMS = {
  top3: [
    { name: 'Pain', score: 7, maxScore: 10 },
    { name: 'Fatigue', score: 6, maxScore: 10 },
    { name: 'Appetite Loss', score: 5, maxScore: 10 },
  ],
  moodTrend: { emoji: 'low', days: 3, label: 'Low mood 3 days' },
  sleepAvg: 4.2,
  caregiverDistress: { level: 'Moderate', score: 6 },
  dataQuality: {
    timeliness: 85,
    completeness: 72,
    adherence: 88,
  },
};

const PATIENT_ALERTS: PatientAlert[] = [
  {
    id: 'pa1',
    severity: 'critical',
    message: 'MEDD reached 220 mg/day -- exceeds 200mg safety threshold',
    time: '45 min ago',
    status: 'active',
  },
  {
    id: 'pa2',
    severity: 'warning',
    message: '5 breakthrough doses in 24 hours (avg was 2/day)',
    time: '3 hrs ago',
    status: 'active',
  },
  {
    id: 'pa3',
    severity: 'warning',
    message: 'Gabapentin adherence dropped to 78% this week',
    time: '1 day ago',
    status: 'acknowledged',
  },
];

const CLINICAL_NOTES = [
  {
    id: 'cn1',
    author: 'Dr. Nikhil N.',
    role: 'Palliative Medicine',
    date: '17 Feb 2026',
    content:
      'Reviewed pain trajectory. Bone mets causing somatic and neuropathic pain. Increased Morphine SR from 40mg to 60mg q12h. Added Gabapentin 300mg TID for neuropathic component. Monitor for sedation.',
  },
  {
    id: 'cn2',
    author: 'Sr. Meena R.',
    role: 'Palliative Nurse',
    date: '16 Feb 2026',
    content:
      'Patient reports increased pain on movement. Breakthrough doses being used 4-5 times daily. Caregiver trained on positioning and PRN administration timing.',
  },
  {
    id: 'cn3',
    author: 'Dr. Anil K.',
    role: 'Oncology',
    date: '14 Feb 2026',
    content:
      'CT scan confirms progressive disease with new T10 vertebral metastasis. Radiation oncology referral placed for palliative RT to spine. Continue current systemic therapy.',
  },
];

const CARE_PLAN = {
  goals: 'Comfort-focused care. Pain control to NRS < 4. Maintain independence for ADLs. Support caregiver coping.',
  currentInterventions: [
    'Opioid titration with breakthrough doses',
    'Neuropathic pain adjuvant (Gabapentin)',
    'Palliative radiotherapy referral (T10 met)',
    'Weekly MDT review',
    'Caregiver support counselling',
  ],
};

// -- Extended data for tabs ---------------------------------------------------
const ACTIVE_CARE_PLAN = {
  title: 'Palliative Care Plan \u2014 Pain Management Focus',
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
};

const CAREGIVERS_DATA = [
  { name: 'Sunita Kumar', relationship: 'Spouse', phone: '+91 98765 43210', isPrimary: true, lastActive: '1h ago', distress: 6 },
  { name: 'Rahul Kumar', relationship: 'Son', phone: '+91 87654 32109', isPrimary: false, lastActive: '2d ago', distress: 4 },
];

const CARE_SCHEDULE = [
  { day: 'Mon', shift: 'Morning', caregiver: 'Sunita Kumar', tasks: 'Medication admin, meal prep, symptom log' },
  { day: 'Mon', shift: 'Evening', caregiver: 'Rahul Kumar', tasks: 'Wound care, mobility exercises' },
  { day: 'Tue', shift: 'Morning', caregiver: 'Sunita Kumar', tasks: 'Medication admin, doctor appointment' },
  { day: 'Tue', shift: 'Evening', caregiver: 'Sunita Kumar', tasks: 'Breathing exercises, symptom log' },
  { day: 'Wed', shift: 'Morning', caregiver: 'Sunita Kumar', tasks: 'Medication admin, meal prep' },
];

const EDUCATION_PROGRESS = [
  { module: 'Understanding Your Pain', phase: 1, progress: 100, status: 'completed' },
  { module: 'Medication Management', phase: 1, progress: 100, status: 'completed' },
  { module: 'Breathing for Comfort', phase: 2, progress: 75, status: 'in_progress' },
  { module: 'Sleep Hygiene', phase: 2, progress: 30, status: 'in_progress' },
  { module: 'Caregiver Wellness', phase: 3, progress: 0, status: 'locked' },
];

const WELLNESS_DATA = {
  breatheSessions: { total: 12, thisWeek: 3, avgDuration: '8 min', favouriteExercise: '4-7-8 Breathing' },
  gratitude: { streak: 5, totalEntries: 15 },
  goals: [
    { text: 'Walk in the garden daily', category: 'physical', progress: 60 },
    { text: 'Complete pain education module', category: 'learning', progress: 75 },
    { text: 'Video call with grandchildren weekly', category: 'social', progress: 100 },
  ],
  milestones: [
    { title: 'First Week Logged', achieved: true, date: '10 Feb' },
    { title: '7-Day Streak', achieved: true, date: '17 Feb' },
    { title: 'First Breathe Session', achieved: true, date: '12 Feb' },
    { title: '30-Day Warrior', achieved: false, date: null },
  ],
};

const RECENT_MESSAGES = [
  { sender: 'Nurse Priya', content: 'Pain score has been consistently above 6 for the past 3 days.', time: '10 min ago', role: 'nurse' },
  { sender: 'Dr. Nikhil Nair', content: 'Let\'s increase the SR morphine to 45mg BD. Please reassess in 24h.', time: '25 min ago', role: 'physician' },
  { sender: 'Sunita Kumar', content: 'He is not sleeping well. The pain wakes him up at night.', time: '2h ago', role: 'caregiver' },
];

type DetailTab = 'care_plan' | 'caregivers' | 'education' | 'messages';

// -- Alert type ---------------------------------------------------------------
interface PatientAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

// -- Severity helpers ---------------------------------------------------------
const SEVERITY_CONFIG = {
  critical: { icon: AlertTriangle, bg: 'bg-red-50', border: 'border-l-red-500', badge: 'bg-red-100 text-red-700', label: 'Critical' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-l-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Warning' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-l-blue-400', badge: 'bg-blue-100 text-blue-600', label: 'Info' },
};

// -- Component ----------------------------------------------------------------
export default function PatientDetailPage() {
  const params = useParams();
  const [painRange, setPainRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [alertStates, setAlertStates] = useState(PATIENT_ALERTS);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('care_plan');

  // Pain trend data filtered by range
  const trendData = (() => {
    if (painRange === '7d') return PAIN_TREND_30D.slice(-7);
    if (painRange === '30d') return PAIN_TREND_30D;
    return PAIN_TREND_30D;
  })();

  const maxPain = Math.max(...trendData);

  function acknowledgeAlert(id: string) {
    setAlertStates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' as const } : a))
    );
  }

  function resolveAlert(id: string) {
    setAlertStates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header Bar ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/patients"
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-sage/10 text-teal hover:bg-sage/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-2xl font-bold text-teal">
                  {PATIENT.name}
                </h1>
                <span className="rounded-full bg-teal/10 px-3 py-0.5 text-xs font-semibold text-teal">
                  {PATIENT.age}y / {PATIENT.gender}
                </span>
                <span className="rounded-full bg-alert-critical/10 px-3 py-0.5 text-xs font-semibold text-alert-critical">
                  {PATIENT.codeStatus}
                </span>
              </div>
              <p className="mt-1 text-sm text-charcoal/70">{PATIENT.diagnosis}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-charcoal/60">
            <div className="text-center">
              <p className="font-semibold text-charcoal">PPS</p>
              <p className="mt-0.5 text-lg font-bold text-teal">{PATIENT.ppsScore}%</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-charcoal">ECOG</p>
              <p className="mt-0.5 text-lg font-bold text-amber">{PATIENT.ecogStatus}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-charcoal">Phase</p>
              <p className="mt-0.5 text-sm font-bold text-alert-critical">{PATIENT.phaseOfIllness}</p>
            </div>
          </div>
        </div>

        {/* Sub-info row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-sage/10 pt-3 text-xs text-charcoal/60">
          <span className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5" />
            ABHA: {PATIENT.abhaId}
          </span>
          <span className="h-3 w-px bg-sage/20" />
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            Caregiver: {PATIENT.caregiver.name}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {PATIENT.caregiver.phone}
          </span>
        </div>
      </div>

      {/* ── 3-Column Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── LEFT: Pain Panel ── */}
        <div className="space-y-4">
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
              <Activity className="h-5 w-5" />
              Pain Assessment
            </h2>

            {/* Current NRS */}
            <div className="mt-4 flex items-center gap-4">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold"
                style={{
                  backgroundColor: PAIN_COLORS[PAIN_DATA.currentNRS] || '#ccc',
                  color: PAIN_DATA.currentNRS >= 6 ? '#fff' : '#2D2D2D',
                }}
              >
                {PAIN_DATA.currentNRS}
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">Current NRS</p>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  {PAIN_DATA.trendDirection === 'worsening' && (
                    <ArrowUpRight className="h-4 w-4 text-alert-critical" />
                  )}
                  {PAIN_DATA.trendDirection === 'improving' && (
                    <ArrowDownRight className="h-4 w-4 text-alert-success" />
                  )}
                  {PAIN_DATA.trendDirection === 'stable' && (
                    <Minus className="h-4 w-4 text-charcoal/40" />
                  )}
                  <span className={cn(
                    'font-medium',
                    PAIN_DATA.trendDirection === 'worsening' ? 'text-alert-critical' :
                    PAIN_DATA.trendDirection === 'improving' ? 'text-alert-success' : 'text-charcoal/60'
                  )}>
                    {PAIN_DATA.trendMagnitude}
                  </span>
                </div>
              </div>
            </div>

            {/* 7-day sparkline */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">7-Day Trend</p>
              <div className="mt-2 flex items-end gap-1 h-16">
                {PAIN_DATA.weeklySparkline.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all"
                    style={{
                      height: `${(val / 10) * 100}%`,
                      backgroundColor: PAIN_COLORS[val] || '#ccc',
                    }}
                    title={`Day ${i + 1}: NRS ${val}`}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-charcoal/40">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            {/* Breakthrough summary */}
            <div className="mt-4 rounded-lg bg-amber/5 border border-amber/20 p-3">
              <p className="text-xs font-semibold text-amber uppercase">Breakthrough Episodes</p>
              <div className="mt-2 flex justify-between">
                <div>
                  <p className="text-2xl font-bold text-charcoal">{PAIN_DATA.breakthroughCount}</p>
                  <p className="text-[10px] text-charcoal/50">this week</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-charcoal">{PAIN_DATA.breakthroughAvgIntensity}</p>
                  <p className="text-[10px] text-charcoal/50">avg intensity</p>
                </div>
              </div>
            </div>

            {/* Pain qualities */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Pain Quality</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PAIN_DATA.painQualities.map((q) => (
                  <span key={q} className="rounded-full bg-terra/10 px-2.5 py-1 text-xs font-medium text-terra">
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Aggravators */}
            <div className="mt-3">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Aggravating Factors</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PAIN_DATA.aggravators.map((a) => (
                  <span key={a} className="rounded-full bg-lavender/40 px-2.5 py-1 text-xs font-medium text-charcoal/70">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER: Medication Panel ── */}
        <div className="space-y-4">
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
              <Pill className="h-5 w-5" />
              Medications
            </h2>

            {/* MEDD display */}
            <div className="mt-4 rounded-lg bg-teal/5 border border-teal/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-teal uppercase">MEDD (Morphine Equivalent)</p>
                  <p className="mt-1 text-3xl font-bold text-charcoal">{MEDICATIONS.medd} <span className="text-sm font-normal text-charcoal/50">mg/day</span></p>
                </div>
                {MEDICATIONS.medd > 200 && (
                  <div className="flex items-center gap-1 rounded-full bg-alert-critical/10 px-3 py-1 text-xs font-bold text-alert-critical">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    High
                  </div>
                )}
              </div>
            </div>

            {/* Medication list */}
            <div className="mt-4 space-y-2">
              {MEDICATIONS.current.map((med) => (
                <div
                  key={med.name}
                  className="flex items-center justify-between rounded-lg border border-sage/10 px-3 py-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'h-2 w-2 rounded-full',
                        med.type === 'opioid' ? 'bg-alert-critical' :
                        med.type === 'opioid-prn' ? 'bg-amber' :
                        med.type === 'adjuvant' ? 'bg-teal' : 'bg-sage'
                      )} />
                      <p className="text-sm font-semibold text-charcoal truncate">{med.name}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-charcoal/50 pl-4">{med.dose} {med.frequency}</p>
                  </div>
                  <span className={cn(
                    'text-xs font-bold',
                    med.adherence >= 90 ? 'text-alert-success' :
                    med.adherence >= 70 ? 'text-amber' : 'text-alert-critical'
                  )}>
                    {med.adherence}%
                  </span>
                </div>
              ))}
            </div>

            {/* PRN usage */}
            <div className="mt-4 rounded-lg bg-amber/5 border border-amber/20 p-3">
              <p className="text-xs font-semibold text-amber uppercase">PRN Usage</p>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-charcoal/60">Last 24h</span>
                <span className="font-bold text-charcoal">{MEDICATIONS.prnUsage.last24h} doses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/60">Avg/day</span>
                <span className="font-bold text-charcoal">{MEDICATIONS.prnUsage.avgPerDay}</span>
              </div>
            </div>

            {/* Side effects */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Side Effects</p>
              <ul className="mt-2 space-y-1">
                {MEDICATIONS.sideEffects.map((se) => (
                  <li key={se} className="flex items-center gap-2 text-xs text-charcoal/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-terra" />
                    {se}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Symptom Panel ── */}
        <div className="space-y-4">
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
              <Heart className="h-5 w-5" />
              Symptoms & Wellbeing
            </h2>

            {/* Top 3 bothersome symptoms */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Most Bothersome</p>
              {SYMPTOMS.top3.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">{s.name}</span>
                    <span className="font-bold text-charcoal">{s.score}/{s.maxScore}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-sage/10">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(s.score / s.maxScore) * 100}%`,
                        backgroundColor: PAIN_COLORS[s.score] || '#ccc',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mood trend */}
            <div className="mt-5 flex items-center gap-3 rounded-lg bg-lavender/20 p-3">
              <Brain className="h-5 w-5 text-charcoal/50" />
              <div>
                <p className="text-sm font-semibold text-charcoal">{SYMPTOMS.moodTrend.label}</p>
                <p className="text-xs text-charcoal/50">Consider PHQ-9 screening</p>
              </div>
            </div>

            {/* Sleep */}
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-teal/5 p-3">
              <Moon className="h-5 w-5 text-teal" />
              <div>
                <p className="text-sm font-semibold text-charcoal">Sleep: {SYMPTOMS.sleepAvg} hrs avg</p>
                <p className="text-xs text-charcoal/50">Below recommended 6-8 hrs</p>
              </div>
            </div>

            {/* Caregiver distress */}
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-amber/5 border border-amber/20 p-3">
              <User className="h-5 w-5 text-amber" />
              <div>
                <p className="text-sm font-semibold text-charcoal">Caregiver Distress: {SYMPTOMS.caregiverDistress.level}</p>
                <p className="text-xs text-charcoal/50">Score: {SYMPTOMS.caregiverDistress.score}/10</p>
              </div>
            </div>

            {/* Data quality indicators */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Data Quality</p>
              <div className="mt-2 space-y-2">
                {[
                  { label: 'Timeliness', value: SYMPTOMS.dataQuality.timeliness },
                  { label: 'Completeness', value: SYMPTOMS.dataQuality.completeness },
                  { label: 'Adherence', value: SYMPTOMS.dataQuality.adherence },
                ].map((dq) => (
                  <div key={dq.label}>
                    <div className="flex justify-between text-xs">
                      <span className="text-charcoal/60">{dq.label}</span>
                      <span className={cn(
                        'font-bold',
                        dq.value >= 85 ? 'text-alert-success' :
                        dq.value >= 70 ? 'text-amber' : 'text-alert-critical'
                      )}>
                        {dq.value}%
                      </span>
                    </div>
                    <div className="mt-0.5 h-1.5 w-full rounded-full bg-sage/10">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${dq.value}%`,
                          backgroundColor:
                            dq.value >= 85 ? '#7BA68C' :
                            dq.value >= 70 ? '#E8A838' : '#C25A45',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Width: Pain Trend Chart ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <TrendingUp className="h-5 w-5" />
            Pain Trend
          </h2>
          <div className="flex gap-1">
            {(['7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setPainRange(range)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  painRange === range
                    ? 'bg-teal text-white'
                    : 'bg-sage/10 text-charcoal/60 hover:bg-sage/20'
                )}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-end gap-[3px] h-32">
          {trendData.map((val, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all cursor-pointer hover:opacity-80"
              style={{
                height: `${(val / 10) * 100}%`,
                backgroundColor: PAIN_COLORS[val] || '#ccc',
              }}
              title={`Day ${i + 1}: NRS ${val}`}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-charcoal/40">
          <span>Day 1</span>
          <span>Day {Math.floor(trendData.length / 2)}</span>
          <span>Day {trendData.length}</span>
        </div>
        {/* Y-axis legend */}
        <div className="mt-2 flex items-center gap-4 text-[10px] text-charcoal/40">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PAIN_COLORS[2] }} /> Mild (1-3)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PAIN_COLORS[5] }} /> Moderate (4-6)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PAIN_COLORS[8] }} /> Severe (7-10)
          </span>
        </div>
      </div>

      {/* ── Alerts Section ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
          <AlertTriangle className="h-5 w-5" />
          Patient Alerts
        </h2>
        <div className="mt-4 space-y-3">
          {alertStates.map((alert) => {
            const config = SEVERITY_CONFIG[alert.severity];
            const SevIcon = config.icon;
            const isActive = alert.status === 'active';
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border-l-4 p-4',
                  config.border,
                  alert.status === 'resolved' ? 'opacity-50' : '',
                  'bg-white shadow-sm'
                )}
              >
                <SevIcon className={cn(
                  'h-5 w-5 flex-shrink-0 mt-0.5',
                  alert.severity === 'critical' ? 'text-red-500' :
                  alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', config.badge)}>
                      {config.label}
                    </span>
                    <span className="text-xs text-charcoal/40 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {alert.time}
                    </span>
                    {alert.status !== 'active' && (
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        alert.status === 'acknowledged' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                      )}>
                        {alert.status === 'acknowledged' ? 'Acknowledged' : 'Resolved'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-charcoal/80">{alert.message}</p>
                </div>
                {isActive && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="rounded-lg bg-teal px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal/90 transition-colors"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="rounded-lg border border-sage/30 px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:bg-sage/5 transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Notes, Care Plan, Actions ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Clinical Notes */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <FileText className="h-5 w-5" />
            Clinical Notes
          </h2>
          <div className="mt-4 space-y-3">
            {CLINICAL_NOTES.map((note) => (
              <div key={note.id} className="rounded-lg border border-sage/10 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{note.author}</p>
                    <p className="text-[10px] text-charcoal/50">{note.role} &middot; {note.date}</p>
                  </div>
                  <button
                    onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                    className="text-charcoal/30 hover:text-charcoal/60"
                  >
                    {expandedNote === note.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {expandedNote === note.id && (
                  <p className="mt-2 text-xs text-charcoal/70 leading-relaxed border-t border-sage/10 pt-2">
                    {note.content}
                  </p>
                )}
                {expandedNote !== note.id && (
                  <p className="mt-1 text-xs text-charcoal/50 truncate">{note.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Care Plan Summary */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <Heart className="h-5 w-5" />
            Care Plan
          </h2>
          <div className="mt-4">
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Goals of Care</p>
            <p className="mt-1 text-sm text-charcoal/70 leading-relaxed">{CARE_PLAN.goals}</p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Current Interventions</p>
            <ul className="mt-2 space-y-1.5">
              {CARE_PLAN.currentInterventions.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-charcoal/70">
                  <Check className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-alert-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <Zap className="h-5 w-5" />
            Quick Actions
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { label: 'Add Note', icon: FileText, color: 'bg-teal text-white hover:bg-teal/90' },
              { label: 'Generate Report', icon: FileText, color: 'bg-sage text-white hover:bg-sage/90' },
              { label: 'Adjust Meds', icon: Pill, color: 'bg-amber text-white hover:bg-amber/90' },
              { label: 'Message Caregiver', icon: MessageSquare, color: 'bg-teal text-white hover:bg-teal/90' },
              { label: 'Schedule Visit', icon: Calendar, color: 'bg-sage text-white hover:bg-sage/90' },
              { label: 'Flag for MDT', icon: Flag, color: 'bg-alert-critical text-white hover:bg-alert-critical/90' },
            ].map((action) => (
              <button
                key={action.label}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors',
                  action.color
                )}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabbed Detail Section ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        {/* Tab bar */}
        <div className="flex border-b border-sage-light/20">
          {([
            { key: 'care_plan' as DetailTab, label: 'Care Plan', icon: ClipboardList },
            { key: 'caregivers' as DetailTab, label: 'Caregivers', icon: Users },
            { key: 'education' as DetailTab, label: 'Education & Wellness', icon: BookOpen },
            { key: 'messages' as DetailTab, label: 'Messages', icon: MessageSquare },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2',
                activeTab === tab.key
                  ? 'border-teal text-teal'
                  : 'border-transparent text-charcoal/50 hover:text-charcoal/70',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {/* ── Care Plan Tab ── */}
          {activeTab === 'care_plan' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-teal">{ACTIVE_CARE_PLAN.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-charcoal/50">
                    <span>Version {ACTIVE_CARE_PLAN.version}</span>
                    <span>&middot;</span>
                    <span>By {ACTIVE_CARE_PLAN.createdBy}</span>
                    <span>&middot;</span>
                    <span>Updated {ACTIVE_CARE_PLAN.lastUpdated}</span>
                  </div>
                </div>
                <span className="rounded-full bg-alert-success/10 px-3 py-1 text-xs font-bold text-alert-success uppercase">
                  {ACTIVE_CARE_PLAN.status}
                </span>
              </div>

              <div className="rounded-lg bg-teal/5 p-4">
                <p className="text-xs font-semibold text-teal uppercase">Goals of Care</p>
                <p className="mt-1 text-sm text-charcoal/70 leading-relaxed">{ACTIVE_CARE_PLAN.goalsOfCare}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Goals */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-charcoal">
                    <Target className="h-4 w-4 text-teal" />
                    Goals
                  </h4>
                  <div className="mt-2 space-y-2">
                    {ACTIVE_CARE_PLAN.goals.map((g, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-sage/10 p-3">
                        {g.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-alert-success" />
                        ) : g.status === 'in_progress' ? (
                          <Clock className="h-5 w-5 flex-shrink-0 text-amber" />
                        ) : (
                          <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-charcoal/20" />
                        )}
                        <span className={cn('text-sm', g.status === 'completed' ? 'text-charcoal/50 line-through' : 'text-charcoal')}>
                          {g.goal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interventions */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-charcoal">
                    <ListTodo className="h-4 w-4 text-teal" />
                    Interventions
                  </h4>
                  <div className="mt-2 space-y-2">
                    {ACTIVE_CARE_PLAN.interventions.map((item, i) => (
                      <div key={i} className="flex items-start justify-between rounded-lg border border-sage/10 p-3">
                        <span className="text-sm text-charcoal/70">{item.text}</span>
                        <span className="ml-3 flex-shrink-0 rounded-full bg-sage/10 px-2.5 py-0.5 text-[10px] font-semibold text-charcoal/60">
                          {item.assigned}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-charcoal/50">
                <Calendar className="h-4 w-4" />
                Next Review: <span className="font-semibold text-charcoal">{ACTIVE_CARE_PLAN.reviewDate}</span>
              </div>
            </div>
          )}

          {/* ── Caregivers Tab ── */}
          {activeTab === 'caregivers' && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-teal">Caregiver Team</h3>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {CAREGIVERS_DATA.map((cg, i) => (
                  <div key={i} className="rounded-xl border border-sage-light/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-xs font-bold text-charcoal/60">
                          {cg.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-charcoal">{cg.name}</p>
                          <p className="text-xs text-charcoal/50">{cg.relationship}</p>
                        </div>
                      </div>
                      {cg.isPrimary && (
                        <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[10px] font-bold text-teal">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-charcoal/60">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" /> {cg.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" /> Last active: {cg.lastActive}
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-3 w-3" />
                        Distress score: <span className={cn('font-bold', cg.distress >= 7 ? 'text-alert-critical' : cg.distress >= 5 ? 'text-amber' : 'text-alert-success')}>{cg.distress}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div>
                <h4 className="text-sm font-bold text-charcoal mb-2">This Week&rsquo;s Care Schedule</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sage-light/20 text-left">
                        <th className="py-2 pr-4 text-xs font-semibold text-charcoal/50">Day</th>
                        <th className="py-2 pr-4 text-xs font-semibold text-charcoal/50">Shift</th>
                        <th className="py-2 pr-4 text-xs font-semibold text-charcoal/50">Caregiver</th>
                        <th className="py-2 text-xs font-semibold text-charcoal/50">Tasks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CARE_SCHEDULE.map((row, i) => (
                        <tr key={i} className="border-b border-sage-light/10">
                          <td className="py-2 pr-4 font-medium text-charcoal">{row.day}</td>
                          <td className="py-2 pr-4">
                            <span className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                              row.shift === 'Morning' ? 'bg-amber/10 text-amber' : 'bg-teal/10 text-teal',
                            )}>
                              {row.shift}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-charcoal/70">{row.caregiver}</td>
                          <td className="py-2 text-charcoal/60 text-xs">{row.tasks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Education & Wellness Tab ── */}
          {activeTab === 'education' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Education modules */}
                <div>
                  <h3 className="flex items-center gap-2 font-heading text-base font-bold text-teal">
                    <GraduationCap className="h-5 w-5" />
                    Education Progress
                  </h3>
                  <div className="mt-3 space-y-2">
                    {EDUCATION_PROGRESS.map((mod, i) => (
                      <div key={i} className="rounded-lg border border-sage/10 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-charcoal">{mod.module}</span>
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold',
                            mod.status === 'completed' ? 'bg-alert-success/10 text-alert-success' :
                            mod.status === 'in_progress' ? 'bg-amber/10 text-amber' :
                            'bg-charcoal/5 text-charcoal/40',
                          )}>
                            {mod.status === 'completed' ? 'Complete' : mod.status === 'in_progress' ? `${mod.progress}%` : 'Locked'}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-sage/10">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${mod.progress}%`,
                              backgroundColor: mod.status === 'completed' ? '#7BA68C' : mod.status === 'in_progress' ? '#E8A838' : '#ddd',
                            }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-charcoal/40">Phase {mod.phase}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wellness summary */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-heading text-base font-bold text-teal">
                    <Sparkles className="h-5 w-5" />
                    Wellness Journey
                  </h3>

                  {/* Breathe sessions */}
                  <div className="rounded-lg bg-teal/5 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal uppercase">
                      <Wind className="h-4 w-4" />
                      Breathe Sessions
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-2xl font-bold text-charcoal">{WELLNESS_DATA.breatheSessions.total}</p>
                        <p className="text-[10px] text-charcoal/40">total sessions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-charcoal">{WELLNESS_DATA.breatheSessions.thisWeek}</p>
                        <p className="text-[10px] text-charcoal/40">this week</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-charcoal/50">
                      Favourite: {WELLNESS_DATA.breatheSessions.favouriteExercise} &middot; Avg: {WELLNESS_DATA.breatheSessions.avgDuration}
                    </p>
                  </div>

                  {/* Gratitude */}
                  <div className="rounded-lg bg-amber/5 border border-amber/20 p-4">
                    <p className="text-xs font-bold text-amber uppercase">Gratitude Journal</p>
                    <div className="mt-2 flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-bold text-charcoal">{WELLNESS_DATA.gratitude.streak}</p>
                        <p className="text-[10px] text-charcoal/40">day streak</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-charcoal">{WELLNESS_DATA.gratitude.totalEntries}</p>
                        <p className="text-[10px] text-charcoal/40">total entries</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal goals */}
                  <div>
                    <p className="text-xs font-bold text-charcoal/60 uppercase mb-2">Personal Goals</p>
                    {WELLNESS_DATA.goals.map((g, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/70">{g.text}</span>
                          <span className="font-bold text-charcoal">{g.progress}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-sage/10">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${g.progress}%`,
                              backgroundColor: g.progress === 100 ? '#7BA68C' : '#E8A838',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Milestones */}
                  <div>
                    <p className="text-xs font-bold text-charcoal/60 uppercase mb-2">Milestones</p>
                    <div className="flex flex-wrap gap-2">
                      {WELLNESS_DATA.milestones.map((m, i) => (
                        <span
                          key={i}
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            m.achieved
                              ? 'bg-alert-success/10 text-alert-success'
                              : 'bg-charcoal/5 text-charcoal/40',
                          )}
                        >
                          {m.achieved && <span className="mr-1">&#10003;</span>}
                          {m.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Messages Tab ── */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-teal">Recent Messages</h3>
                <button className="flex items-center gap-2 rounded-lg bg-teal px-3 py-2 text-xs font-semibold text-white hover:bg-teal/90">
                  <Send className="h-3.5 w-3.5" />
                  New Message
                </button>
              </div>

              <div className="space-y-3">
                {RECENT_MESSAGES.map((msg, i) => (
                  <div key={i} className="rounded-lg border border-sage/10 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-charcoal">{msg.sender}</span>
                        <span className={cn(
                          'rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase',
                          msg.role === 'physician' ? 'bg-teal/10 text-teal' :
                          msg.role === 'nurse' ? 'bg-amber/10 text-amber' :
                          'bg-sage/20 text-sage',
                        )}>
                          {msg.role}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-charcoal/40">
                        <Clock className="h-3 w-3" /> {msg.time}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-charcoal/70 leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button className="text-xs font-semibold text-teal hover:underline">
                  View All Messages &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
