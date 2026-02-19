'use client';

import { useState } from 'react';
import {
  Users,
  ChevronDown,
  CheckSquare,
  Square,
  MessageSquare,
  FileText,
  Clock,
  Send,
  AlertTriangle,
  Heart,
  Activity,
  Pill,
  User,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// -- Mock data ----------------------------------------------------------------
const PATIENTS_LIST = [
  { id: '1', name: 'Ramesh Kumar', age: 58, diagnosis: 'Lung Ca (Stage IIIB)' },
  { id: '2', name: 'Sunita Devi', age: 55, diagnosis: 'Breast Ca (Stage IV)' },
  { id: '3', name: 'Arun Sharma', age: 70, diagnosis: 'Pancreatic Ca' },
  { id: '4', name: 'Priya Patel', age: 48, diagnosis: 'Ovarian Ca (Stage III)' },
  { id: '5', name: 'Mahesh Verma', age: 65, diagnosis: 'Head & Neck Ca' },
];

const CARE_PLAN = {
  goalsOfCare: [
    'Comfort-focused care with emphasis on pain control (target NRS < 4)',
    'Maintain functional independence for basic ADLs as long as possible',
    'Support family coping and caregiver resilience',
    'Coordinate with oncology for palliative radiotherapy to T10 met',
  ],
  painManagementPlan: [
    'Morphine SR 60mg q12h as background opioid',
    'Morphine IR 15mg q4h PRN for breakthrough pain (max 6 doses/day)',
    'Gabapentin 300mg TID for neuropathic component -- titrate to 600mg TID if tolerated',
    'Dexamethasone 4mg BID for bone pain and appetite',
    'Consider opioid rotation if MEDD exceeds 300mg or intolerable side effects',
  ],
  teamTasks: [
    { id: 't1', text: 'Review breakthrough dose frequency and adjust background dose', assignee: 'Dr. Vaishali W.', role: 'Palliative Medicine', done: false },
    { id: 't2', text: 'Train caregiver on PRN timing and pain diary recording', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: true },
    { id: 't3', text: 'Schedule palliative RT consultation for T10 vertebral met', assignee: 'Dr. Anil K.', role: 'Oncology', done: false },
    { id: 't4', text: 'Assess for depression using PHQ-9 (low mood 3+ days)', assignee: 'Ms. Priya S.', role: 'Clinical Psychology', done: false },
    { id: 't5', text: 'Review Gabapentin adherence -- check for side effects causing missed doses', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: false },
    { id: 't6', text: 'Update NDPS register for increased morphine dosing', assignee: 'Pharm. Rajan T.', role: 'Pharmacy', done: true },
    { id: 't7', text: 'Caregiver distress assessment and support counselling session', assignee: 'Ms. Sunita M.', role: 'Social Work', done: false },
  ],
};

const SBAR = {
  situation: 'Ramesh Kumar, 58M with Stage IIIB Lung Ca and bone metastases, currently admitted with escalating pain. Pain score sustained at NRS 7-8/10 over the past 72 hours despite background opioid therapy. MEDD has reached 220mg/day, exceeding the 200mg safety threshold.',
  background: 'Diagnosed 8 months ago. Progressive disease with new T10 vertebral metastasis on recent CT. On Morphine SR 60mg q12h plus Morphine IR 15mg PRN. Gabapentin 300mg TID for neuropathic component. Adherence to Gabapentin has been suboptimal at 78%. PPS 50%, ECOG 2. DNR status documented. Caregiver (wife Sunita) showing moderate distress (6/10).',
  assessment: 'Pain is mixed somatic-neuropathic from bone metastases. Breakthrough frequency has increased to 5 doses/day (baseline 2/day), suggesting inadequate background analgesia. Mood has been low for 3 consecutive days. Sleep disrupted averaging 4.2 hrs/night. Functional decline noted.',
  recommendation: 'Recommend: (1) Increase Morphine SR to 90mg q12h based on breakthrough consumption. (2) Titrate Gabapentin to 600mg TID for neuropathic component. (3) Urgent palliative RT referral for T10 met. (4) PHQ-9 screening for depression. (5) Caregiver support counselling. (6) Review in 48 hours with MDT.',
};

const TEAM_MESSAGES = [
  {
    id: 'm1',
    author: 'Dr. Vaishali W.',
    role: 'Palliative Medicine',
    badge: 'Dr.',
    badgeColor: 'bg-teal text-white',
    time: '09:15 AM',
    content: 'Reviewed pain trajectory. The breakthrough frequency clearly indicates background dose is insufficient. Planning to increase Morphine SR to 90mg q12h. Will also review Gabapentin titration.',
  },
  {
    id: 'm2',
    author: 'Sr. Meena R.',
    role: 'Palliative Nurse',
    badge: 'Sr.',
    badgeColor: 'bg-sage text-white',
    time: '09:22 AM',
    content: 'Caregiver Sunita shared that patient has been reluctant to take Gabapentin due to dizziness. She is managing pain diary well but seems overwhelmed. Recommend social work referral.',
  },
  {
    id: 'm3',
    author: 'Dr. Anil K.',
    role: 'Oncology',
    badge: 'Dr.',
    badgeColor: 'bg-teal text-white',
    time: '09:35 AM',
    content: 'Radiation oncology slot available Friday. Single fraction 8Gy to T10 would be appropriate. Patient is fit enough for transport. Will coordinate with Sr. Meena for logistics.',
  },
  {
    id: 'm4',
    author: 'Ms. Priya S.',
    role: 'Clinical Psychology',
    badge: 'Psy.',
    badgeColor: 'bg-lavender text-charcoal',
    time: '09:48 AM',
    content: 'Will administer PHQ-9 this afternoon. The sustained low mood pattern and sleep disruption are concerning. May need to consider low-dose mirtazapine if depression confirmed -- has sleep and appetite benefits.',
  },
  {
    id: 'm5',
    author: 'Pharm. Rajan T.',
    role: 'Pharmacy',
    badge: 'Rx',
    badgeColor: 'bg-amber text-white',
    time: '10:01 AM',
    content: 'NDPS register updated for morphine dose change. Current stock sufficient for 2 weeks. Reminder: if MEDD crosses 300mg, mandatory second signatory required per institutional policy.',
  },
];

// -- Component ----------------------------------------------------------------
export default function MDTPage() {
  const [selectedPatient, setSelectedPatient] = useState('1');
  const [tasks, setTasks] = useState(CARE_PLAN.teamTasks);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(TEAM_MESSAGES);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const patient = PATIENTS_LIST.find((p) => p.id === selectedPatient) || PATIENTS_LIST[0];
  const completedTasks = tasks.filter((t) => t.done).length;

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function sendMessage() {
    if (!messageText.trim()) return;
    const newMsg = {
      id: `m${messages.length + 1}`,
      author: 'Dr. Vaishali W.',
      role: 'Palliative Medicine',
      badge: 'Dr.',
      badgeColor: 'bg-teal text-white',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
      content: messageText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessageText('');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-teal" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">
              MDT Collaboration
            </h1>
            <p className="text-sm text-charcoal-light">
              Multi-Disciplinary Team care coordination and handover
            </p>
          </div>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="relative">
        <button
          onClick={() => setShowPatientDropdown(!showPatientDropdown)}
          className="flex items-center gap-3 rounded-xl border border-sage-light/30 bg-white px-5 py-3 shadow-sm transition-all hover:shadow-md w-full sm:w-auto"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/10">
            <User className="h-4 w-4 text-teal" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-charcoal">{patient.name}</p>
            <p className="text-xs text-charcoal/50">{patient.age}y &middot; {patient.diagnosis}</p>
          </div>
          <ChevronDown className={cn(
            'h-4 w-4 text-charcoal/40 transition-transform ml-2',
            showPatientDropdown && 'rotate-180'
          )} />
        </button>

        {showPatientDropdown && (
          <div className="absolute top-full left-0 mt-1 z-10 w-full sm:w-80 rounded-xl border border-sage/20 bg-white shadow-lg overflow-hidden">
            {PATIENTS_LIST.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPatient(p.id);
                  setShowPatientDropdown(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-cream',
                  p.id === selectedPatient && 'bg-teal/5'
                )}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sage/10 text-xs font-bold text-sage">
                  {p.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{p.name}</p>
                  <p className="text-xs text-charcoal/50">{p.age}y &middot; {p.diagnosis}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main grid: Care Plan + SBAR */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Care Plan Card ── */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <Heart className="h-5 w-5" />
            Care Plan
          </h2>

          {/* Goals of Care */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Goals of Care</p>
            <ul className="mt-2 space-y-1.5">
              {CARE_PLAN.goalsOfCare.map((goal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal flex-shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          {/* Pain Management Plan */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Pain Management Plan</p>
            <ul className="mt-2 space-y-1.5">
              {CARE_PLAN.painManagementPlan.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal/70">
                  <Pill className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Team Tasks */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Team Tasks</p>
              <span className="text-xs text-charcoal/40">{completedTasks}/{tasks.length} done</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-sage/10">
              <div
                className="h-1.5 rounded-full bg-teal transition-all"
                style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
              />
            </div>
            <ul className="mt-3 space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-start gap-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {task.done ? (
                      <CheckSquare className="h-4 w-4 text-alert-success" />
                    ) : (
                      <Square className="h-4 w-4 text-charcoal/30 hover:text-teal" />
                    )}
                  </button>
                  <div className={cn('flex-1', task.done && 'opacity-50')}>
                    <p className={cn('text-sm text-charcoal/70', task.done && 'line-through')}>
                      {task.text}
                    </p>
                    <p className="text-[10px] text-charcoal/40 mt-0.5">
                      {task.assignee} &middot; {task.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── SBAR Handover Card ── */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
              <FileText className="h-5 w-5" />
              SBAR Handover
            </h2>
            <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-semibold text-teal uppercase">
              Auto-generated
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {[
              { letter: 'S', title: 'Situation', content: SBAR.situation, color: 'border-l-alert-critical bg-red-50/50' },
              { letter: 'B', title: 'Background', content: SBAR.background, color: 'border-l-amber bg-amber-50/50' },
              { letter: 'A', title: 'Assessment', content: SBAR.assessment, color: 'border-l-teal bg-teal/5' },
              { letter: 'R', title: 'Recommendation', content: SBAR.recommendation, color: 'border-l-alert-success bg-green-50/50' },
            ].map((section) => (
              <div
                key={section.letter}
                className={cn('rounded-lg border-l-4 p-4', section.color)}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">
                    {section.letter}
                  </span>
                  <p className="text-sm font-bold text-charcoal">{section.title}</p>
                </div>
                <p className="mt-2 text-sm text-charcoal/70 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Generated timestamp */}
          <div className="mt-4 flex items-center gap-2 text-xs text-charcoal/40">
            <Clock className="h-3 w-3" />
            Generated: 18 Feb 2026, 09:00 IST &middot; Based on last 72h data
          </div>
        </div>
      </div>

      {/* ── Team Messages ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        <div className="border-b border-sage/10 px-5 py-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <MessageSquare className="h-5 w-5" />
            Team Discussion
          </h2>
          <p className="text-xs text-charcoal/50 mt-1">
            MDT discussion for {patient.name} &middot; {messages.length} messages
          </p>
        </div>

        {/* Messages list */}
        <div className="max-h-[400px] overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <span className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold flex-shrink-0',
                msg.badgeColor
              )}>
                {msg.badge}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-charcoal">{msg.author}</span>
                  <span className="text-[10px] text-charcoal/40">{msg.role}</span>
                  <span className="text-[10px] text-charcoal/30 ml-auto flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {msg.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-charcoal/70 leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="border-t border-sage/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-bold text-white flex-shrink-0">
              Dr.
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                className="w-full rounded-lg border border-sage/20 bg-cream/30 py-2.5 pl-4 pr-12 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                  messageText.trim()
                    ? 'bg-teal text-white hover:bg-teal/90'
                    : 'bg-sage/10 text-charcoal/30'
                )}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
