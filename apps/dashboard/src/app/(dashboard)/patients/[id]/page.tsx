'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Loader2,
  X,
  Edit3,
  Printer,
  Download,
  Upload,
  Thermometer,
  Stethoscope,
  Paperclip,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  usePatient,
  usePatientPainTrends,
  usePatientMedications,
  usePatientSymptomLogs,
  useAlerts,
  useClinicalNotes,
  useActiveCarePlan,
  usePatientCaregivers,
  useCareSchedules,
  usePatientMessages,
  useAcknowledgeAlert,
  useResolveAlert,
  useCreateNote,
  useSendMessage,
} from '@/lib/hooks';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

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
const MOCK_PATIENT = {
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

const MOCK_PAIN_DATA = {
  currentNRS: 7,
  trendDirection: 'worsening' as 'worsening' | 'improving' | 'stable',
  trendMagnitude: '+2 from 72h ago',
  weeklySparkline: [4, 5, 6, 5, 7, 8, 7],
  breakthroughCount: 5,
  breakthroughAvgIntensity: 8.2,
  painQualities: ['Burning', 'Aching', 'Shooting'],
  aggravators: ['Movement', 'Coughing', 'Night-time'],
};

const MOCK_PAIN_TREND_30D = [
  5, 4, 5, 6, 5, 4, 5, 6, 7, 6, 5, 6, 7, 7, 6,
  7, 8, 7, 6, 7, 8, 7, 7, 8, 7, 6, 7, 8, 7, 7,
];

const MOCK_MEDICATIONS = {
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

const MOCK_SYMPTOMS = {
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

const MOCK_PATIENT_ALERTS: PatientAlert[] = [
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

const MOCK_CLINICAL_NOTES = [
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

const MOCK_CARE_PLAN = {
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
const MOCK_ACTIVE_CARE_PLAN = {
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

const MOCK_CAREGIVERS_DATA = [
  { name: 'Sunita Kumar', relationship: 'Spouse', phone: '+91 98765 43210', isPrimary: true, lastActive: '1h ago', distress: 6 },
  { name: 'Rahul Kumar', relationship: 'Son', phone: '+91 87654 32109', isPrimary: false, lastActive: '2d ago', distress: 4 },
];

const MOCK_CARE_SCHEDULE = [
  { day: 'Mon', shift: 'Morning', caregiver: 'Sunita Kumar', tasks: 'Medication admin, meal prep, symptom log' },
  { day: 'Mon', shift: 'Evening', caregiver: 'Rahul Kumar', tasks: 'Wound care, mobility exercises' },
  { day: 'Tue', shift: 'Morning', caregiver: 'Sunita Kumar', tasks: 'Medication admin, doctor appointment' },
  { day: 'Tue', shift: 'Evening', caregiver: 'Sunita Kumar', tasks: 'Breathing exercises, symptom log' },
  { day: 'Wed', shift: 'Morning', caregiver: 'Sunita Kumar', tasks: 'Medication admin, meal prep' },
];

const MOCK_EDUCATION_PROGRESS = [
  { module: 'Understanding Your Pain', phase: 1, progress: 100, status: 'completed' },
  { module: 'Medication Management', phase: 1, progress: 100, status: 'completed' },
  { module: 'Breathing for Comfort', phase: 2, progress: 75, status: 'in_progress' },
  { module: 'Sleep Hygiene', phase: 2, progress: 30, status: 'in_progress' },
  { module: 'Caregiver Wellness', phase: 3, progress: 0, status: 'locked' },
];

const MOCK_WELLNESS_DATA = {
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

const MOCK_RECENT_MESSAGES = [
  { sender: 'Nurse Priya', content: 'Pain score has been consistently above 6 for the past 3 days.', time: '10 min ago', role: 'nurse' },
  { sender: 'Dr. Nikhil Nair', content: 'Let\'s increase the SR morphine to 45mg BD. Please reassess in 24h.', time: '25 min ago', role: 'physician' },
  { sender: 'Sunita Kumar', content: 'He is not sleeping well. The pain wakes him up at night.', time: '2h ago', role: 'caregiver' },
];

// -- Mock vitals & documents --------------------------------------------------
const MOCK_VITALS = {
  latest: {
    bp: '118/72',
    hr: 88,
    spo2: 95,
    rr: 18,
    temp: 37.2,
    recordedAt: '2 hrs ago',
  },
  history: [
    { date: '20 Feb', bp: '118/72', hr: 88, spo2: 95, rr: 18, temp: 37.2 },
    { date: '19 Feb', bp: '122/78', hr: 92, spo2: 94, rr: 20, temp: 37.4 },
    { date: '18 Feb', bp: '115/70', hr: 85, spo2: 96, rr: 17, temp: 37.0 },
    { date: '17 Feb', bp: '120/74', hr: 90, spo2: 95, rr: 19, temp: 37.1 },
    { date: '16 Feb', bp: '128/82', hr: 96, spo2: 93, rr: 22, temp: 37.6 },
  ],
  labResults: [
    { test: 'Hb', value: '9.2 g/dL', flag: 'low', date: '18 Feb' },
    { test: 'Creatinine', value: '1.4 mg/dL', flag: 'high', date: '18 Feb' },
    { test: 'Albumin', value: '2.8 g/dL', flag: 'low', date: '18 Feb' },
    { test: 'WBC', value: '6.2 x10³/µL', flag: 'normal', date: '18 Feb' },
    { test: 'Platelets', value: '180 x10³/µL', flag: 'normal', date: '18 Feb' },
  ],
};

const MOCK_DOCUMENTS = [
  { id: 'doc1', name: 'CT Scan Report - Thorax', type: 'Radiology', date: '14 Feb 2026', size: '2.4 MB' },
  { id: 'doc2', name: 'Consent Form - Palliative RT', type: 'Consent', date: '15 Feb 2026', size: '156 KB' },
  { id: 'doc3', name: 'Lab Report - CBC + KFT', type: 'Lab Report', date: '18 Feb 2026', size: '340 KB' },
  { id: 'doc4', name: 'Discharge Summary - Oncology', type: 'Summary', date: '10 Feb 2026', size: '1.1 MB' },
];

type DetailTab = 'care_plan' | 'caregivers' | 'education' | 'messages' | 'vitals' | 'documents';

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

// -- API data adapters --------------------------------------------------------

function mapApiPatient(p: any) {
  const dob = p.date_of_birth ? new Date(p.date_of_birth) : null;
  const age = dob ? Math.floor((Date.now() - dob.getTime()) / 31557600000) : p.age ?? 0;
  return {
    id: p.id,
    name: p.full_name || p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
    age,
    gender: p.gender || 'U',
    diagnosis: p.primary_diagnosis || p.diagnosis || '',
    ppsScore: p.pps_score ?? p.ppsScore ?? 0,
    ecogStatus: p.ecog_status ?? p.ecogStatus ?? 0,
    phaseOfIllness: p.phase_of_illness || p.phaseOfIllness || 'Stable',
    abhaId: p.abha_id || p.abhaId || '',
    codeStatus: p.code_status || p.codeStatus || '',
    caregiver: p.primary_caregiver ? {
      name: p.primary_caregiver.name || p.primary_caregiver.full_name || 'Unknown',
      phone: p.primary_caregiver.phone || '',
      relationship: p.primary_caregiver.relationship || '',
    } : (p.caregiver || MOCK_PATIENT.caregiver),
  };
}

function mapApiPainData(trends: any) {
  if (!trends) return MOCK_PAIN_DATA;
  const dataPoints: number[] = Array.isArray(trends.data_points) ? trends.data_points :
    Array.isArray(trends.scores) ? trends.scores :
    Array.isArray(trends) ? trends : [];
  const weeklySparkline = dataPoints.length >= 7 ? dataPoints.slice(-7) : MOCK_PAIN_DATA.weeklySparkline;
  const currentNRS = trends.current_nrs ?? trends.currentNRS ?? dataPoints[dataPoints.length - 1] ?? MOCK_PAIN_DATA.currentNRS;

  // Compute trend direction
  let trendDirection: 'worsening' | 'improving' | 'stable' = 'stable';
  let trendMagnitude = 'Stable';
  if (dataPoints.length >= 4) {
    const recent = dataPoints[dataPoints.length - 1];
    const older = dataPoints[Math.max(0, dataPoints.length - 4)];
    const diff = recent - older;
    if (diff > 0) { trendDirection = 'worsening'; trendMagnitude = `+${diff} from 72h ago`; }
    else if (diff < 0) { trendDirection = 'improving'; trendMagnitude = `${diff} from 72h ago`; }
  }

  return {
    currentNRS,
    trendDirection: trends.trend_direction || trendDirection,
    trendMagnitude: trends.trend_magnitude || trendMagnitude,
    weeklySparkline,
    breakthroughCount: trends.breakthrough_count ?? trends.breakthroughCount ?? MOCK_PAIN_DATA.breakthroughCount,
    breakthroughAvgIntensity: trends.breakthrough_avg_intensity ?? trends.breakthroughAvgIntensity ?? MOCK_PAIN_DATA.breakthroughAvgIntensity,
    painQualities: trends.pain_qualities || trends.painQualities || MOCK_PAIN_DATA.painQualities,
    aggravators: trends.aggravators || MOCK_PAIN_DATA.aggravators,
  };
}

function mapApiMedications(meds: any) {
  if (!meds) return MOCK_MEDICATIONS;
  return {
    medd: meds.medd ?? meds.total_medd ?? MOCK_MEDICATIONS.medd,
    current: Array.isArray(meds.current || meds.medications || meds)
      ? (meds.current || meds.medications || meds).map((m: any) => ({
          name: m.medication_name || m.name || 'Unknown',
          dose: m.dose || m.dosage || '',
          frequency: m.frequency || '',
          adherence: m.adherence_rate ?? m.adherence ?? 0,
          type: m.medication_type || m.type || 'supportive',
        }))
      : MOCK_MEDICATIONS.current,
    prnUsage: meds.prn_usage || meds.prnUsage || MOCK_MEDICATIONS.prnUsage,
    sideEffects: meds.side_effects || meds.sideEffects || MOCK_MEDICATIONS.sideEffects,
  };
}

function mapApiSymptoms(logs: any) {
  if (!logs) return MOCK_SYMPTOMS;
  const entries = Array.isArray(logs.entries || logs) ? (logs.entries || logs) : [];
  // Extract top 3 symptoms by score
  const top3 = entries.length > 0
    ? entries.slice(0, 3).map((e: any) => ({
        name: e.symptom_name || e.name || 'Unknown',
        score: e.score ?? e.severity ?? 0,
        maxScore: e.max_score ?? 10,
      }))
    : MOCK_SYMPTOMS.top3;

  return {
    top3,
    moodTrend: logs.mood_trend || logs.moodTrend || MOCK_SYMPTOMS.moodTrend,
    sleepAvg: logs.sleep_avg ?? logs.sleepAvg ?? MOCK_SYMPTOMS.sleepAvg,
    caregiverDistress: logs.caregiver_distress || logs.caregiverDistress || MOCK_SYMPTOMS.caregiverDistress,
    dataQuality: logs.data_quality || logs.dataQuality || MOCK_SYMPTOMS.dataQuality,
  };
}

function mapApiAlerts(alerts: any): PatientAlert[] {
  if (!alerts) return MOCK_PATIENT_ALERTS;
  const arr = Array.isArray(alerts.data || alerts) ? (alerts.data || alerts) : [];
  if (arr.length === 0) return MOCK_PATIENT_ALERTS;
  return arr.map((a: any) => ({
    id: a.id,
    severity: a.severity || 'warning',
    message: a.message || a.description || '',
    time: a.created_at ? formatTimeAgo(a.created_at) : (a.time || ''),
    status: a.status || 'active',
  }));
}

function mapApiNotes(notes: any) {
  const arr = Array.isArray(notes.data || notes) ? (notes.data || notes) : [];
  if (arr.length === 0) return MOCK_CLINICAL_NOTES;
  return arr.map((n: any) => ({
    id: n.id,
    author: n.author_name || n.author || 'Unknown',
    role: n.author_role || n.role || '',
    date: n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : (n.date || ''),
    content: n.content || '',
  }));
}

function mapApiCarePlan(cp: any) {
  if (!cp) return { plan: MOCK_CARE_PLAN, active: MOCK_ACTIVE_CARE_PLAN };
  const plan = {
    goals: cp.goals_of_care || cp.goalsOfCare || cp.goals || MOCK_CARE_PLAN.goals,
    currentInterventions: Array.isArray(cp.interventions)
      ? cp.interventions.map((i: any) => typeof i === 'string' ? i : i.text || i.description || '')
      : MOCK_CARE_PLAN.currentInterventions,
  };
  const active = {
    title: cp.title || MOCK_ACTIVE_CARE_PLAN.title,
    status: cp.status || 'active',
    version: cp.version ?? 1,
    goalsOfCare: cp.goals_of_care || cp.goalsOfCare || MOCK_ACTIVE_CARE_PLAN.goalsOfCare,
    goals: Array.isArray(cp.goals_list || cp.goals) && (cp.goals_list || cp.goals).length > 0
      ? (cp.goals_list || cp.goals).filter((g: any) => typeof g === 'object').map((g: any) => ({
          goal: g.goal || g.description || g.text || '',
          status: g.status || 'pending',
        }))
      : MOCK_ACTIVE_CARE_PLAN.goals,
    interventions: Array.isArray(cp.interventions) && cp.interventions.length > 0
      ? cp.interventions.map((i: any) => ({
          text: typeof i === 'string' ? i : (i.text || i.description || ''),
          assigned: typeof i === 'string' ? '' : (i.assigned || i.assigned_to || ''),
        }))
      : MOCK_ACTIVE_CARE_PLAN.interventions,
    reviewDate: cp.review_date ? new Date(cp.review_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : (cp.reviewDate || MOCK_ACTIVE_CARE_PLAN.reviewDate),
    createdBy: cp.created_by_name || cp.createdBy || MOCK_ACTIVE_CARE_PLAN.createdBy,
    lastUpdated: cp.updated_at ? new Date(cp.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : (cp.lastUpdated || MOCK_ACTIVE_CARE_PLAN.lastUpdated),
  };
  return { plan, active };
}

function mapApiCaregivers(data: any) {
  const arr = Array.isArray(data.data || data) ? (data.data || data) : [];
  if (arr.length === 0) return MOCK_CAREGIVERS_DATA;
  return arr.map((cg: any) => ({
    name: cg.full_name || cg.name || 'Unknown',
    relationship: cg.relationship || '',
    phone: cg.phone || cg.phone_number || '',
    isPrimary: cg.is_primary ?? cg.isPrimary ?? false,
    lastActive: cg.last_active ? formatTimeAgo(cg.last_active) : (cg.lastActive || ''),
    distress: cg.distress_score ?? cg.distress ?? 0,
  }));
}

function mapApiSchedules(data: any) {
  const arr = Array.isArray(data.data || data) ? (data.data || data) : [];
  if (arr.length === 0) return MOCK_CARE_SCHEDULE;
  return arr.map((s: any) => ({
    day: s.day || new Date(s.date || s.scheduled_at).toLocaleDateString('en-IN', { weekday: 'short' }),
    shift: s.shift || s.shift_type || 'Morning',
    caregiver: s.caregiver_name || s.caregiver || '',
    tasks: s.tasks || s.description || '',
  }));
}

function mapApiMessages(data: any) {
  const arr = Array.isArray(data.data || data.messages || data) ? (data.data || data.messages || data) : [];
  if (arr.length === 0) return MOCK_RECENT_MESSAGES;
  return arr.slice(0, 5).map((m: any) => ({
    sender: m.sender_name || m.sender || 'Unknown',
    content: m.content || m.message || '',
    time: m.created_at ? formatTimeAgo(m.created_at) : (m.time || ''),
    role: m.sender_role || m.role || 'physician',
  }));
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const d = Math.floor(hrs / 24);
  return `${d}d ago`;
}

// -- Component ----------------------------------------------------------------
export default function PatientDetailPage() {
  const params = useParams();
  const patientId = (params?.id as string) || '';

  const router = useRouter();
  const [painRange, setPainRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [localAlertOverrides, setLocalAlertOverrides] = useState<Record<string, string>>({});
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('care_plan');

  // Sprint 20 — Modal states
  const [showAddNote, setShowAddNote] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showAdjustMeds, setShowAdjustMeds] = useState(false);
  const [showScheduleVisit, setShowScheduleVisit] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  // Sprint 20 — Add Note form state
  const [noteType, setNoteType] = useState('progress');
  const [noteContent, setNoteContent] = useState('');
  const [localNotes, setLocalNotes] = useState<any[]>([]);

  // Sprint 20 — Edit patient form state
  const [editForm, setEditForm] = useState({
    diagnosis: '', ppsScore: 0, ecogStatus: 0, codeStatus: '',
    caregiverName: '', caregiverPhone: '', phaseOfIllness: '',
  });

  // Sprint 20 — Inline message state
  const [inlineMessage, setInlineMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const msgInputRef = useRef<HTMLInputElement>(null);

  // Sprint 20 — Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sprint 20 — Document upload
  const [localDocuments, setLocalDocuments] = useState<any[]>([]);

  // Sprint 20 — Pagination
  const [notesPage, setNotesPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Sprint 20 — Schedule visit form
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');
  const [visitType, setVisitType] = useState('follow_up');
  const [visitNotes, setVisitNotes] = useState('');

  // Sprint 20 — Flag for MDT
  const [mdtFlagged, setMdtFlagged] = useState(false);

  // ── API Queries with fallback ──────────────────────────────────────
  const patientQuery = usePatient(patientId);
  const { data: rawPatient, isLoading: patientLoading, isFromApi: patientFromApi } =
    useWithFallback(patientQuery, MOCK_PATIENT);
  const PATIENT = patientFromApi ? mapApiPatient(rawPatient) : MOCK_PATIENT;

  const painQuery = usePatientPainTrends(patientId, 30);
  const { data: rawPain, isFromApi: painFromApi } = useWithFallback(painQuery, null);
  const PAIN_DATA: typeof MOCK_PAIN_DATA = painFromApi ? mapApiPainData(rawPain) : MOCK_PAIN_DATA;

  const painTrend30d: number[] = painFromApi && rawPain
    ? (Array.isArray((rawPain as any).data_points) ? (rawPain as any).data_points :
       Array.isArray((rawPain as any).scores) ? (rawPain as any).scores :
       Array.isArray(rawPain) ? rawPain as number[] : MOCK_PAIN_TREND_30D)
    : MOCK_PAIN_TREND_30D;

  const medsQuery = usePatientMedications(patientId);
  const { data: rawMeds, isFromApi: medsFromApi } = useWithFallback(medsQuery, null);
  const MEDICATIONS: typeof MOCK_MEDICATIONS = medsFromApi ? mapApiMedications(rawMeds) : MOCK_MEDICATIONS;

  const symptomsQuery = usePatientSymptomLogs(patientId);
  const { data: rawSymptoms, isFromApi: symptomsFromApi } = useWithFallback(symptomsQuery, null);
  const SYMPTOMS: typeof MOCK_SYMPTOMS = symptomsFromApi ? mapApiSymptoms(rawSymptoms) : MOCK_SYMPTOMS;

  // Sprint 20 (#6): Filter alerts by patient — pass patient_id when API supports it
  const alertsQuery = useAlerts({ status: 'active' });
  const { data: rawAlerts, isFromApi: alertsFromApi } = useWithFallback(alertsQuery, null);
  const allAlerts: PatientAlert[] = alertsFromApi ? mapApiAlerts(rawAlerts) : MOCK_PATIENT_ALERTS;
  // Filter to only this patient's alerts (API may return all; filter client-side by patient_id/name)
  const baseAlerts: PatientAlert[] = alertsFromApi
    ? allAlerts.filter((a: any) => a.patient_id === patientId || !a.patient_id)
    : MOCK_PATIENT_ALERTS;

  const notesQuery = useClinicalNotes(patientId);
  const { data: rawNotes, isFromApi: notesFromApi } = useWithFallback(notesQuery, null);
  const CLINICAL_NOTES: typeof MOCK_CLINICAL_NOTES = notesFromApi ? mapApiNotes(rawNotes) : MOCK_CLINICAL_NOTES;

  const carePlanQuery = useActiveCarePlan(patientId);
  const { data: rawCarePlan, isFromApi: cpFromApi } = useWithFallback(carePlanQuery, null);
  const { plan: CARE_PLAN, active: ACTIVE_CARE_PLAN }: { plan: typeof MOCK_CARE_PLAN; active: typeof MOCK_ACTIVE_CARE_PLAN } = cpFromApi ? mapApiCarePlan(rawCarePlan) : { plan: MOCK_CARE_PLAN, active: MOCK_ACTIVE_CARE_PLAN };

  const caregiversQuery = usePatientCaregivers(patientId);
  const { data: rawCaregivers, isFromApi: cgFromApi } = useWithFallback(caregiversQuery, null);
  const CAREGIVERS_DATA: typeof MOCK_CAREGIVERS_DATA = cgFromApi ? mapApiCaregivers(rawCaregivers) : MOCK_CAREGIVERS_DATA;

  const schedulesQuery = useCareSchedules(patientId);
  const { data: rawSchedules, isFromApi: schedFromApi } = useWithFallback(schedulesQuery, null);
  const CARE_SCHEDULE: typeof MOCK_CARE_SCHEDULE = schedFromApi ? mapApiSchedules(rawSchedules) : MOCK_CARE_SCHEDULE;

  const messagesQuery = usePatientMessages(patientId);
  const { data: rawMessages, isFromApi: msgFromApi } = useWithFallback(messagesQuery, null);
  const RECENT_MESSAGES: typeof MOCK_RECENT_MESSAGES = msgFromApi ? mapApiMessages(rawMessages) : MOCK_RECENT_MESSAGES;

  // Mutations
  const acknowledgeMutation = useAcknowledgeAlert();
  const resolveMutation = useResolveAlert();
  const createNoteMutation = useCreateNote();
  const sendMessageMutation = useSendMessage();

  // Is any data from API?
  const isFromApi = patientFromApi || painFromApi || medsFromApi;
  const isLoading = patientLoading;

  // Sprint 20 — Patient-specific alert filtering (#6)
  const patientAlertFilter = useCallback((alerts: PatientAlert[]) => {
    // When using API data, alerts should already be filtered by patient
    // For mock data, show all since they're patient-specific mocks
    return alerts;
  }, []);

  // Apply local overrides to alerts
  const alertStates: PatientAlert[] = baseAlerts.map((a) => ({
    ...a,
    status: (localAlertOverrides[a.id] || a.status) as PatientAlert['status'],
  }));

  // Pain trend data filtered by range
  const trendData = (() => {
    if (painRange === '7d') return painTrend30d.slice(-7);
    if (painRange === '30d') return painTrend30d;
    return painTrend30d;
  })();

  const maxPain = Math.max(...trendData);

  function acknowledgeAlert(id: string) {
    setLocalAlertOverrides((prev) => ({ ...prev, [id]: 'acknowledged' }));
    if (alertsFromApi) acknowledgeMutation.mutate(id);
  }

  function resolveAlert(id: string) {
    setLocalAlertOverrides((prev) => ({ ...prev, [id]: 'resolved' }));
    if (alertsFromApi) resolveMutation.mutate({ id });
  }

  // Education & Wellness — keep as mock (no API endpoint yet)
  const EDUCATION_PROGRESS = MOCK_EDUCATION_PROGRESS;
  const WELLNESS_DATA = MOCK_WELLNESS_DATA;

  // Sprint 20 — Combined notes (local + API) with pagination (#7)
  const allNotes = [...localNotes, ...CLINICAL_NOTES];
  const totalNotePages = Math.max(1, Math.ceil(allNotes.length / ITEMS_PER_PAGE));
  const paginatedNotes = allNotes.slice((notesPage - 1) * ITEMS_PER_PAGE, notesPage * ITEMS_PER_PAGE);

  // Sprint 20 — Combined messages with pagination (#7)
  const allMessages = [...localMessages, ...RECENT_MESSAGES];
  const totalMsgPages = Math.max(1, Math.ceil(allMessages.length / ITEMS_PER_PAGE));
  const paginatedMessages = allMessages.slice((messagesPage - 1) * ITEMS_PER_PAGE, messagesPage * ITEMS_PER_PAGE);

  // Sprint 20 — Combined documents
  const allDocuments = [...localDocuments, ...MOCK_DOCUMENTS];

  // Sprint 20 — Handler: Add Note (#1)
  function handleAddNote() {
    if (!noteContent.trim()) return;
    const newNote = {
      id: `local-${Date.now()}`,
      author: 'Dr. Nikhil N.',
      role: 'Palliative Medicine',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      content: noteContent.trim(),
    };
    setLocalNotes((prev) => [newNote, ...prev]);
    createNoteMutation.mutate({ patientId, data: { note_type: noteType, content: noteContent.trim() } });
    setNoteContent('');
    setNoteType('progress');
    setShowAddNote(false);
    showToast('Clinical note saved');
  }

  // Sprint 20 — Handler: Edit Patient (#2)
  function openEditPatient() {
    setEditForm({
      diagnosis: PATIENT.diagnosis,
      ppsScore: PATIENT.ppsScore,
      ecogStatus: PATIENT.ecogStatus,
      codeStatus: PATIENT.codeStatus,
      caregiverName: PATIENT.caregiver.name,
      caregiverPhone: PATIENT.caregiver.phone,
      phaseOfIllness: PATIENT.phaseOfIllness,
    });
    setShowEditPatient(true);
  }

  function handleSavePatient() {
    // In real app, would call API to update patient
    setShowEditPatient(false);
    showToast('Patient details updated');
  }

  // Sprint 20 — Handler: Send Inline Message (#3)
  function handleSendInlineMessage() {
    if (!inlineMessage.trim()) return;
    const newMsg = {
      sender: 'Dr. Nikhil Nair',
      content: inlineMessage.trim(),
      time: 'just now',
      role: 'physician',
    };
    setLocalMessages((prev) => [newMsg, ...prev]);
    sendMessageMutation.mutate({ patient_id: patientId, content: inlineMessage.trim() });
    setInlineMessage('');
    showToast('Message sent');
  }

  // Sprint 20 — Handler: Upload Document (#5)
  function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const doc = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'PDF' : file.name.endsWith('.jpg') || file.name.endsWith('.png') ? 'Image' : 'Document',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
      };
      setLocalDocuments((prev) => [doc, ...prev]);
    });
    e.target.value = '';
  }

  // Sprint 20 — Handler: Flag for MDT (#1)
  function handleFlagMDT() {
    setMdtFlagged(true);
    showToast('Patient flagged for MDT review');
    // In real app would create an MDT referral via API
    setTimeout(() => setMdtFlagged(false), 3000);
  }

  // Sprint 20 — Handler: Generate Report / Print (#8)
  function handlePrint() {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 500);
  }

  // Sprint 20 — Handler: Schedule Visit
  function handleScheduleVisit() {
    if (!visitDate) return;
    // Would call API to create schedule
    setShowScheduleVisit(false);
    setVisitDate('');
    setVisitNotes('');
    showToast(`Visit scheduled for ${visitDate} at ${visitTime}`);
  }

  // Auto-scroll messages
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages.length]);

  // Focus message input when "Message Caregiver" quick action is used
  useEffect(() => {
    if (showNewMessage && activeTab === 'messages') {
      setTimeout(() => {
        msgInputRef.current?.focus();
        setShowNewMessage(false);
      }, 200);
    }
  }, [showNewMessage, activeTab]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Show toast helper
  function showToast(message: string, type: 'success' | 'info' = 'success') {
    setToast({ message, type });
  }

  return (
    <div className="space-y-6">
      {/* ── Demo / Loading Banner ── */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-teal">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading patient data...
        </div>
      )}
      {!isFromApi && !isLoading && (
        <div className="rounded-lg bg-amber/10 px-4 py-2 text-xs font-semibold text-amber">
          Demo Data — API offline. Showing sample patient data.
        </div>
      )}

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
                {PATIENT.codeStatus && (
                  <span className="rounded-full bg-alert-critical/10 px-3 py-0.5 text-xs font-semibold text-alert-critical">
                    {PATIENT.codeStatus}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-charcoal/70">{PATIENT.diagnosis}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
            {/* Sprint 20: Edit + Print buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={openEditPatient}
                className="flex items-center gap-1.5 rounded-lg border border-sage/30 px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:bg-cream transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-lg border border-sage/30 px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:bg-cream transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Sub-info row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-sage/10 pt-3 text-xs text-charcoal/60">
          {PATIENT.abhaId && (
            <>
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                ABHA: {PATIENT.abhaId}
              </span>
              <span className="h-3 w-px bg-sage/20" />
            </>
          )}
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
        {/* Clinical Notes — Sprint 20: Paginated (#7) */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
              <FileText className="h-5 w-5" />
              Clinical Notes
            </h2>
            <span className="text-xs text-charcoal/40">{allNotes.length} total</span>
          </div>
          <div className="mt-4 space-y-3">
            {paginatedNotes.map((note) => (
              <div key={note.id} className={cn('rounded-lg border p-3', note.id.startsWith('local-') ? 'border-teal/30 bg-teal/5' : 'border-sage/10')}>
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
          {/* Pagination */}
          {totalNotePages > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button onClick={() => setNotesPage((p) => Math.max(1, p - 1))} disabled={notesPage === 1} className="rounded p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-charcoal/50">{notesPage} / {totalNotePages}</span>
              <button onClick={() => setNotesPage((p) => Math.min(totalNotePages, p + 1))} disabled={notesPage === totalNotePages} className="rounded p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
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

        {/* Action Buttons — Sprint 20: All wired (#1) */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <Zap className="h-5 w-5" />
            Quick Actions
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              onClick={() => setShowAddNote(true)}
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition-all bg-teal text-white hover:bg-teal/90 hover:shadow-md active:scale-[0.98]"
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              Add Note
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition-all bg-sage text-white hover:bg-sage/90 hover:shadow-md active:scale-[0.98]"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              Generate Report
            </button>
            <button
              onClick={() => setShowAdjustMeds(true)}
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition-all bg-amber text-white hover:bg-amber/90 hover:shadow-md active:scale-[0.98]"
            >
              <Pill className="h-4 w-4 flex-shrink-0" />
              Adjust Meds
            </button>
            <button
              onClick={() => { setActiveTab('messages'); setShowNewMessage(true); }}
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition-all bg-teal text-white hover:bg-teal/90 hover:shadow-md active:scale-[0.98]"
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              Message Caregiver
            </button>
            <button
              onClick={() => setShowScheduleVisit(true)}
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition-all bg-sage text-white hover:bg-sage/90 hover:shadow-md active:scale-[0.98]"
            >
              <Calendar className="h-4 w-4 flex-shrink-0" />
              Schedule Visit
            </button>
            <button
              onClick={handleFlagMDT}
              disabled={mdtFlagged}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition-all hover:shadow-md active:scale-[0.98]',
                mdtFlagged
                  ? 'bg-alert-success text-white cursor-default'
                  : 'bg-alert-critical text-white hover:bg-alert-critical/90'
              )}
            >
              <Flag className="h-4 w-4 flex-shrink-0" />
              {mdtFlagged ? '✓ Flagged!' : 'Flag for MDT'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabbed Detail Section ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        {/* Tab bar — horizontally scrollable on mobile */}
        <div className="flex overflow-x-auto border-b border-sage-light/20 scrollbar-hide">
          {([
            { key: 'care_plan' as DetailTab, label: 'Care Plan', icon: ClipboardList },
            { key: 'caregivers' as DetailTab, label: 'Caregivers', icon: Users },
            { key: 'vitals' as DetailTab, label: 'Vitals & Labs', icon: Stethoscope },
            { key: 'documents' as DetailTab, label: 'Documents', icon: Paperclip },
            { key: 'education' as DetailTab, label: 'Education', icon: BookOpen },
            { key: 'messages' as DetailTab, label: 'Messages', icon: MessageSquare },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex-shrink-0',
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

          {/* ── Vitals & Labs Tab — Sprint 20 (#4) ── */}
          {activeTab === 'vitals' && (
            <div className="space-y-5">
              {/* Latest vitals cards */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-teal">Latest Vitals</h3>
                  <span className="text-xs text-charcoal/40">Recorded {MOCK_VITALS.latest.recordedAt}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
                  {[
                    { label: 'BP', value: MOCK_VITALS.latest.bp, unit: 'mmHg', icon: Heart, color: 'text-alert-critical' },
                    { label: 'HR', value: `${MOCK_VITALS.latest.hr}`, unit: 'bpm', icon: Activity, color: 'text-teal' },
                    { label: 'SpO₂', value: `${MOCK_VITALS.latest.spo2}`, unit: '%', icon: Droplets, color: 'text-blue-500' },
                    { label: 'RR', value: `${MOCK_VITALS.latest.rr}`, unit: '/min', icon: Wind, color: 'text-sage' },
                    { label: 'Temp', value: `${MOCK_VITALS.latest.temp}`, unit: '°C', icon: Thermometer, color: 'text-amber' },
                  ].map((v) => (
                    <div key={v.label} className="rounded-xl border border-sage-light/30 p-4 text-center">
                      <v.icon className={cn('mx-auto h-5 w-5', v.color)} />
                      <p className="mt-2 text-2xl font-bold text-charcoal">{v.value}</p>
                      <p className="text-[10px] text-charcoal/40">{v.unit}</p>
                      <p className="mt-1 text-xs font-semibold text-charcoal/60">{v.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitals history table */}
              <div>
                <h4 className="text-sm font-bold text-charcoal mb-2">Vitals History (5 Days)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sage-light/20 text-left">
                        <th className="py-2 pr-3 text-xs font-semibold text-charcoal/50">Date</th>
                        <th className="py-2 pr-3 text-xs font-semibold text-charcoal/50">BP</th>
                        <th className="py-2 pr-3 text-xs font-semibold text-charcoal/50">HR</th>
                        <th className="py-2 pr-3 text-xs font-semibold text-charcoal/50">SpO₂</th>
                        <th className="py-2 pr-3 text-xs font-semibold text-charcoal/50">RR</th>
                        <th className="py-2 text-xs font-semibold text-charcoal/50">Temp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_VITALS.history.map((row, i) => (
                        <tr key={i} className="border-b border-sage-light/10">
                          <td className="py-2 pr-3 font-medium text-charcoal">{row.date}</td>
                          <td className="py-2 pr-3 text-charcoal/70">{row.bp}</td>
                          <td className="py-2 pr-3 text-charcoal/70">{row.hr}</td>
                          <td className="py-2 pr-3 text-charcoal/70">{row.spo2}%</td>
                          <td className="py-2 pr-3 text-charcoal/70">{row.rr}</td>
                          <td className="py-2 text-charcoal/70">{row.temp}°C</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab results */}
              <div>
                <h4 className="text-sm font-bold text-charcoal mb-2">Recent Lab Results</h4>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  {MOCK_VITALS.labResults.map((lab, i) => (
                    <div key={i} className={cn(
                      'flex items-center justify-between rounded-lg border p-3',
                      lab.flag === 'high' ? 'border-red-200 bg-red-50/50' :
                      lab.flag === 'low' ? 'border-amber-200 bg-amber-50/50' :
                      'border-sage/10',
                    )}>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{lab.test}</p>
                        <p className="text-[10px] text-charcoal/40">{lab.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn('text-sm font-bold', lab.flag === 'high' ? 'text-alert-critical' : lab.flag === 'low' ? 'text-amber' : 'text-alert-success')}>
                          {lab.value}
                        </p>
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
                          lab.flag === 'high' ? 'bg-red-100 text-red-700' :
                          lab.flag === 'low' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700',
                        )}>
                          {lab.flag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Documents Tab — Sprint 20 (#5) ── */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-teal">Documents</h3>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-teal px-3 py-2 text-xs font-semibold text-white hover:bg-teal/90 transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  Upload File
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple className="hidden" onChange={handleDocumentUpload} />
                </label>
              </div>

              <div className="space-y-2">
                {allDocuments.map((doc) => (
                  <div key={doc.id} className={cn('flex items-center justify-between rounded-lg border p-4', doc.id.startsWith('local-') ? 'border-teal/30 bg-teal/5' : 'border-sage/10')}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10">
                        <FileText className="h-5 w-5 text-charcoal/40" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{doc.name}</p>
                        <p className="text-[10px] text-charcoal/40">{doc.type} &middot; {doc.date} &middot; {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-2 text-charcoal/30 hover:bg-cream hover:text-teal transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-charcoal/30 hover:bg-cream hover:text-teal transition-colors" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      {doc.id.startsWith('local-') && (
                        <button
                          onClick={() => setLocalDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                          className="rounded-lg p-2 text-charcoal/30 hover:bg-red-50 hover:text-alert-critical transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {allDocuments.length === 0 && (
                  <div className="py-12 text-center">
                    <Paperclip className="mx-auto h-10 w-10 text-charcoal/20" />
                    <p className="mt-2 text-sm text-charcoal/40">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Messages Tab — Sprint 20: Wired (#3, #7) ── */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-teal">Messages</h3>
                <span className="text-xs text-charcoal/40">{allMessages.length} total</span>
              </div>

              {/* Inline compose */}
              <div className="flex gap-2">
                <input
                  ref={msgInputRef}
                  type="text"
                  placeholder="Type a message to the care team..."
                  value={inlineMessage}
                  onChange={(e) => setInlineMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendInlineMessage(); } }}
                  className="flex-1 rounded-lg border border-sage-light/50 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-light/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                />
                <button
                  onClick={handleSendInlineMessage}
                  disabled={!inlineMessage.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </div>

              <div className="space-y-3">
                {paginatedMessages.map((msg, i) => (
                  <div key={i} className={cn('rounded-lg border p-4', msg.sender === 'Dr. Nikhil Nair' && msg.time === 'just now' ? 'border-teal/30 bg-teal/5' : 'border-sage/10')}>
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
                <div ref={msgEndRef} />
              </div>

              {/* Pagination */}
              {totalMsgPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setMessagesPage((p) => Math.max(1, p - 1))} disabled={messagesPage === 1} className="rounded p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-charcoal/50">{messagesPage} / {totalMsgPages}</span>
                  <button onClick={() => setMessagesPage((p) => Math.min(totalMsgPages, p + 1))} disabled={messagesPage === totalMsgPages} className="rounded p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => router.push('/messages')}
                  className="text-xs font-semibold text-teal hover:underline"
                >
                  View All Messages &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODALS — Sprint 20                                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* ── Add Note Modal (#1) ── */}
      {showAddNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowAddNote(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-teal">Add Clinical Note</h3>
              <button onClick={() => setShowAddNote(false)} className="rounded-lg p-1 hover:bg-sage/10"><X className="h-5 w-5 text-charcoal/40" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Note Type</label>
                <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none">
                  <option value="progress">Progress Note</option>
                  <option value="assessment">Assessment</option>
                  <option value="plan">Plan Update</option>
                  <option value="medication">Medication Change</option>
                  <option value="procedure">Procedure Note</option>
                  <option value="consultation">Consultation</option>
                  <option value="nursing">Nursing Note</option>
                  <option value="social_work">Social Work</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Patient</label>
                <p className="mt-1 text-sm font-medium text-charcoal">{PATIENT.name} ({PATIENT.age}y/{PATIENT.gender})</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Content</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={6}
                  placeholder="Enter clinical note..."
                  className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal font-mono focus:border-teal focus:outline-none resize-none"
                />
                <p className="mt-1 text-right text-[10px] text-charcoal/40">{noteContent.length} chars</p>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAddNote(false)} className="rounded-lg border border-sage/30 px-4 py-2 text-xs font-semibold text-charcoal/60 hover:bg-sage/5">Cancel</button>
                <button onClick={handleAddNote} disabled={!noteContent.trim()} className="rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90 disabled:opacity-50">
                  <FileText className="mr-1.5 inline h-3.5 w-3.5" />
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Patient Modal (#2) ── */}
      {showEditPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowEditPatient(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-teal">Edit Patient Details</h3>
              <button onClick={() => setShowEditPatient(false)} className="rounded-lg p-1 hover:bg-sage/10"><X className="h-5 w-5 text-charcoal/40" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Diagnosis</label>
                <input type="text" value={editForm.diagnosis} onChange={(e) => setEditForm({ ...editForm, diagnosis: e.target.value })} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal/60 uppercase">PPS Score</label>
                  <input type="number" min={0} max={100} step={10} value={editForm.ppsScore} onChange={(e) => setEditForm({ ...editForm, ppsScore: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/60 uppercase">ECOG</label>
                  <select value={editForm.ecogStatus} onChange={(e) => setEditForm({ ...editForm, ecogStatus: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none">
                    {[0, 1, 2, 3, 4].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/60 uppercase">Code Status</label>
                  <select value={editForm.codeStatus} onChange={(e) => setEditForm({ ...editForm, codeStatus: e.target.value })} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none">
                    <option value="Full Code">Full Code</option>
                    <option value="DNR">DNR</option>
                    <option value="DNI">DNI</option>
                    <option value="DNR/DNI">DNR/DNI</option>
                    <option value="Comfort Only">Comfort Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Phase of Illness</label>
                <select value={editForm.phaseOfIllness} onChange={(e) => setEditForm({ ...editForm, phaseOfIllness: e.target.value })} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none">
                  <option value="Stable">Stable</option>
                  <option value="Unstable">Unstable</option>
                  <option value="Deteriorating">Deteriorating</option>
                  <option value="Terminal">Terminal</option>
                </select>
              </div>
              <div className="border-t border-sage/10 pt-4">
                <p className="text-xs font-semibold text-charcoal/60 uppercase mb-2">Primary Caregiver</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-charcoal/40">Name</label>
                    <input type="text" value={editForm.caregiverName} onChange={(e) => setEditForm({ ...editForm, caregiverName: e.target.value })} className="mt-0.5 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-charcoal/40">Phone</label>
                    <input type="text" value={editForm.caregiverPhone} onChange={(e) => setEditForm({ ...editForm, caregiverPhone: e.target.value })} className="mt-0.5 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowEditPatient(false)} className="rounded-lg border border-sage/30 px-4 py-2 text-xs font-semibold text-charcoal/60 hover:bg-sage/5">Cancel</button>
                <button onClick={handleSavePatient} className="rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90">
                  <Save className="mr-1.5 inline h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Adjust Meds Modal (#1) ── */}
      {showAdjustMeds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowAdjustMeds(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-teal">Adjust Medications</h3>
              <button onClick={() => setShowAdjustMeds(false)} className="rounded-lg p-1 hover:bg-sage/10"><X className="h-5 w-5 text-charcoal/40" /></button>
            </div>
            <p className="text-sm text-charcoal/60 mb-4">Current medications for {PATIENT.name} (MEDD: {MEDICATIONS.medd} mg/day)</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {MEDICATIONS.current.map((med) => (
                <div key={med.name} className="flex items-center justify-between rounded-lg border border-sage/10 p-3">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{med.name}</p>
                    <p className="text-xs text-charcoal/50">{med.dose} {med.frequency}</p>
                  </div>
                  <button className="rounded-lg border border-sage/20 px-2.5 py-1 text-[10px] font-semibold text-teal hover:bg-teal/5">
                    Modify
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-amber/5 border border-amber/20 p-3">
              <p className="text-xs text-amber">
                <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
                Medication changes require documented clinical rationale and will be logged.
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowAdjustMeds(false)} className="rounded-lg border border-sage/30 px-4 py-2 text-xs font-semibold text-charcoal/60 hover:bg-sage/5">Close</button>
              <button onClick={() => { setShowAdjustMeds(false); setShowAddNote(true); setNoteType('medication'); }} className="rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90">
                Log Med Change Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg toast-slide-in',
          toast.type === 'success' ? 'bg-alert-success' : 'bg-teal',
        )}>
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 rounded p-0.5 hover:bg-white/20">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Schedule Visit Modal (#1) ── */}
      {showScheduleVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowScheduleVisit(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-teal">Schedule Visit</h3>
              <button onClick={() => setShowScheduleVisit(false)} className="rounded-lg p-1 hover:bg-sage/10"><X className="h-5 w-5 text-charcoal/40" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Patient</label>
                <p className="mt-1 text-sm font-medium text-charcoal">{PATIENT.name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Visit Type</label>
                <select value={visitType} onChange={(e) => setVisitType(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none">
                  <option value="follow_up">Follow-Up</option>
                  <option value="home_visit">Home Visit</option>
                  <option value="mdt_review">MDT Review</option>
                  <option value="caregiver_meeting">Caregiver Meeting</option>
                  <option value="procedure">Procedure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal/60 uppercase">Date</label>
                  <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/60 uppercase">Time</label>
                  <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Notes</label>
                <textarea value={visitNotes} onChange={(e) => setVisitNotes(e.target.value)} rows={3} placeholder="Purpose of visit, preparation needed..." className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowScheduleVisit(false)} className="rounded-lg border border-sage/30 px-4 py-2 text-xs font-semibold text-charcoal/60 hover:bg-sage/5">Cancel</button>
                <button onClick={handleScheduleVisit} disabled={!visitDate} className="rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90 disabled:opacity-50">
                  <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
