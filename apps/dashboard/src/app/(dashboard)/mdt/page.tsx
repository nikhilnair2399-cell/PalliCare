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
  ArrowUp,
  ArrowRight,
  ArrowDown,
  CalendarClock,
  Plus,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// -- Mock data ----------------------------------------------------------------
const PATIENTS_LIST = [
  { id: '1', name: 'Ramesh Kumar', age: 58, diagnosis: 'Lung Ca (Stage IIIB)', pps: 50, nrs: 8, medd: 220, codeStatus: 'DNR' },
  { id: '2', name: 'Sunita Devi', age: 55, diagnosis: 'Breast Ca (Stage IV)', pps: 60, nrs: 4, medd: 45, codeStatus: 'Full Code' },
  { id: '3', name: 'Arun Sharma', age: 70, diagnosis: 'Pancreatic Ca', pps: 40, nrs: 8, medd: 310, codeStatus: 'DNR/DNI' },
  { id: '4', name: 'Priya Patel', age: 48, diagnosis: 'Ovarian Ca (Stage III)', pps: 60, nrs: 3, medd: 0, codeStatus: 'Full Code' },
  { id: '5', name: 'Mahesh Verma', age: 65, diagnosis: 'Head & Neck Ca', pps: 50, nrs: 6, medd: 120, codeStatus: 'DNR' },
];

const PATIENT_DATA: Record<string, { carePlan: typeof CARE_PLAN_1; sbar: typeof SBAR_1; teamMessages: typeof MESSAGES_1 }> = {};

type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: typeof ArrowUp; bg: string }> = {
  urgent: { label: 'Urgent', color: 'text-alert-critical', icon: ArrowUp, bg: 'bg-alert-critical/10' },
  high: { label: 'High', color: 'text-terra', icon: ArrowUp, bg: 'bg-terra/10' },
  medium: { label: 'Medium', color: 'text-amber', icon: ArrowRight, bg: 'bg-amber/10' },
  low: { label: 'Low', color: 'text-sage', icon: ArrowDown, bg: 'bg-sage/10' },
};

function isOverdue(deadline: string): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date('2026-02-21');
}

function daysUntil(deadline: string): number | null {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - new Date('2026-02-21').getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

const CARE_PLAN_1 = {
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
    { id: 't1', text: 'Review breakthrough dose frequency and adjust background dose', assignee: 'Dr. Nikhil N.', role: 'Palliative Medicine', done: false, priority: 'urgent' as TaskPriority, deadline: '2026-02-21' },
    { id: 't2', text: 'Train caregiver on PRN timing and pain diary recording', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: true, priority: 'high' as TaskPriority, deadline: '2026-02-19' },
    { id: 't3', text: 'Schedule palliative RT consultation for T10 vertebral met', assignee: 'Dr. Anil K.', role: 'Oncology', done: false, priority: 'urgent' as TaskPriority, deadline: '2026-02-22' },
    { id: 't4', text: 'Assess for depression using PHQ-9 (low mood 3+ days)', assignee: 'Ms. Priya S.', role: 'Clinical Psychology', done: false, priority: 'high' as TaskPriority, deadline: '2026-02-23' },
    { id: 't5', text: 'Review Gabapentin adherence -- check for side effects causing missed doses', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: false, priority: 'medium' as TaskPriority, deadline: '2026-02-24' },
    { id: 't6', text: 'Update NDPS register for increased morphine dosing', assignee: 'Pharm. Rajan T.', role: 'Pharmacy', done: true, priority: 'high' as TaskPriority, deadline: '2026-02-18' },
    { id: 't7', text: 'Caregiver distress assessment and support counselling session', assignee: 'Ms. Sunita M.', role: 'Social Work', done: false, priority: 'medium' as TaskPriority, deadline: '2026-02-25' },
  ],
};

const SBAR_1 = {
  situation: 'Ramesh Kumar, 58M with Stage IIIB Lung Ca and bone metastases, currently admitted with escalating pain. Pain score sustained at NRS 7-8/10 over the past 72 hours despite background opioid therapy. MEDD has reached 220mg/day, exceeding the 200mg safety threshold.',
  background: 'Diagnosed 8 months ago. Progressive disease with new T10 vertebral metastasis on recent CT. On Morphine SR 60mg q12h plus Morphine IR 15mg PRN. Gabapentin 300mg TID for neuropathic component. Adherence to Gabapentin has been suboptimal at 78%. PPS 50%, ECOG 2. DNR status documented. Caregiver (wife Sunita) showing moderate distress (6/10).',
  assessment: 'Pain is mixed somatic-neuropathic from bone metastases. Breakthrough frequency has increased to 5 doses/day (baseline 2/day), suggesting inadequate background analgesia. Mood has been low for 3 consecutive days. Sleep disrupted averaging 4.2 hrs/night. Functional decline noted.',
  recommendation: 'Recommend: (1) Increase Morphine SR to 90mg q12h based on breakthrough consumption. (2) Titrate Gabapentin to 600mg TID for neuropathic component. (3) Urgent palliative RT referral for T10 met. (4) PHQ-9 screening for depression. (5) Caregiver support counselling. (6) Review in 48 hours with MDT.',
};

const MESSAGES_1 = [
  { id: 'm1', author: 'Dr. Nikhil N.', role: 'Palliative Medicine', badge: 'Dr.', badgeColor: 'bg-teal text-white', time: '09:15 AM', content: 'Reviewed pain trajectory. The breakthrough frequency clearly indicates background dose is insufficient. Planning to increase Morphine SR to 90mg q12h. Will also review Gabapentin titration.' },
  { id: 'm2', author: 'Sr. Meena R.', role: 'Palliative Nurse', badge: 'Sr.', badgeColor: 'bg-sage text-white', time: '09:22 AM', content: 'Caregiver Sunita shared that patient has been reluctant to take Gabapentin due to dizziness. She is managing pain diary well but seems overwhelmed. Recommend social work referral.' },
  { id: 'm3', author: 'Dr. Anil K.', role: 'Oncology', badge: 'Dr.', badgeColor: 'bg-teal text-white', time: '09:35 AM', content: 'Radiation oncology slot available Friday. Single fraction 8Gy to T10 would be appropriate. Patient is fit enough for transport. Will coordinate with Sr. Meena for logistics.' },
  { id: 'm4', author: 'Ms. Priya S.', role: 'Clinical Psychology', badge: 'Psy.', badgeColor: 'bg-lavender text-charcoal', time: '09:48 AM', content: 'Will administer PHQ-9 this afternoon. The sustained low mood pattern and sleep disruption are concerning. May need to consider low-dose mirtazapine if depression confirmed -- has sleep and appetite benefits.' },
  { id: 'm5', author: 'Pharm. Rajan T.', role: 'Pharmacy', badge: 'Rx', badgeColor: 'bg-amber text-white', time: '10:01 AM', content: 'NDPS register updated for morphine dose change. Current stock sufficient for 2 weeks. Reminder: if MEDD crosses 300mg, mandatory second signatory required per institutional policy.' },
];

PATIENT_DATA['1'] = { carePlan: CARE_PLAN_1, sbar: SBAR_1, teamMessages: MESSAGES_1 };

PATIENT_DATA['2'] = {
  carePlan: {
    goalsOfCare: [
      'Symptom control with focus on nausea and appetite management',
      'Emotional and psychological support for anticipatory grief',
      'Caregiver education on medication administration',
    ],
    painManagementPlan: [
      'Paracetamol 1g QID as baseline analgesic',
      'Tramadol 50mg TID for moderate bone pain',
      'Ondansetron 8mg TID for chemotherapy-induced nausea',
      'Bland diet plan with small frequent meals',
    ],
    teamTasks: [
      { id: 't1', text: 'Monitor nausea severity daily and adjust anti-emetics', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: false, priority: 'high' as TaskPriority, deadline: '2026-02-22' },
      { id: 't2', text: 'Weekly dietary assessment and calorie intake monitoring', assignee: 'Dt. Anita P.', role: 'Dietetics', done: true, priority: 'medium' as TaskPriority, deadline: '2026-02-20' },
      { id: 't3', text: 'Psychological support session for disease progression anxiety', assignee: 'Ms. Priya S.', role: 'Clinical Psychology', done: false, priority: 'high' as TaskPriority, deadline: '2026-02-23' },
      { id: 't4', text: 'Educate family on subcutaneous medication administration', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: false, priority: 'medium' as TaskPriority, deadline: '2026-02-26' },
    ],
  },
  sbar: {
    situation: 'Sunita Devi, 55F with Stage IV Breast Ca, reporting improved nausea control after anti-emetic switch. Pain remains moderate at NRS 4/10.',
    background: 'Diagnosed 14 months ago with bone and liver metastases. Previous nausea episodes 4/day reduced to 1/day after switching to ondansetron. Tolerating small frequent meals. PPS 60%, ECOG 2.',
    assessment: 'Nausea improving with current regime. Appetite slowly recovering. Mild anxiety about disease progression. Caregiver (husband Mohan) coping well with medication schedule.',
    recommendation: 'Recommend: (1) Continue current anti-emetic regime for 1 week then reassess. (2) Dietitian follow-up for calorie optimization. (3) Psychology referral for anticipatory grief counselling. (4) Review in 1 week.',
  },
  teamMessages: [
    { id: 'm1', author: 'Dt. Anita P.', role: 'Dietetics', badge: 'Dt.', badgeColor: 'bg-sage text-white', time: '10:00 AM', content: 'Sunita ji tolerating bland diet plan well. Calorie intake improved from 800 to 1200 kcal/day this week. Recommending protein supplement shake.' },
    { id: 'm2', author: 'Dr. Nikhil N.', role: 'Palliative Medicine', badge: 'Dr.', badgeColor: 'bg-teal text-white', time: '10:15 AM', content: 'Good progress on nausea front. Ondansetron switch working. Continue current regime and reassess in one week.' },
    { id: 'm3', author: 'Sr. Meena R.', role: 'Palliative Nurse', badge: 'Sr.', badgeColor: 'bg-sage text-white', time: '10:30 AM', content: 'Patient expressing anxiety about upcoming scan results. Recommend psychology referral for supportive counselling.' },
  ],
};

PATIENT_DATA['3'] = {
  carePlan: {
    goalsOfCare: [
      'Aggressive pain management targeting NRS < 3',
      'Nutritional support via nasogastric feeding if oral intake fails',
      'Family meeting for goals-of-care discussion',
      'Advance care directive documentation',
    ],
    painManagementPlan: [
      'Fentanyl patch 50mcg/hr as background opioid',
      'Morphine IR 10mg q3h PRN for breakthrough pain',
      'Celecoxib 200mg BD for inflammatory component',
      'Consider intrathecal pump if oral route fails',
    ],
    teamTasks: [
      { id: 't1', text: 'Daily pain assessment with NRS + Wong-Baker', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: false, priority: 'urgent' as TaskPriority, deadline: '2026-02-21' },
      { id: 't2', text: 'Nutrition assessment and NG tube consideration', assignee: 'Dt. Anita P.', role: 'Dietetics', done: false, priority: 'urgent' as TaskPriority, deadline: '2026-02-20' },
      { id: 't3', text: 'Family goals-of-care meeting coordination', assignee: 'Ms. Sunita M.', role: 'Social Work', done: true, priority: 'high' as TaskPriority, deadline: '2026-02-19' },
      { id: 't4', text: 'Review fentanyl patch absorption and dose adequacy', assignee: 'Dr. Nikhil N.', role: 'Palliative Medicine', done: false, priority: 'high' as TaskPriority, deadline: '2026-02-22' },
      { id: 't5', text: 'Spiritual care assessment and support', assignee: 'Chaplain Ravi', role: 'Spiritual Care', done: false, priority: 'medium' as TaskPriority, deadline: '2026-02-24' },
    ],
  },
  sbar: {
    situation: 'Arun Sharma, 70M with Pancreatic Ca, presenting with severe abdominal pain (NRS 8/10) and progressive weight loss. Oral intake declining over past 2 weeks.',
    background: 'Diagnosed 5 months ago. Unresectable tumour with liver metastases. On Fentanyl patch 50mcg/hr with oral morphine PRN. Weight loss 8kg in 2 months. PPS 40%, ECOG 3. Family aware of prognosis.',
    assessment: 'Pain poorly controlled despite transdermal fentanyl. Possible coeliac plexus involvement. Nutritional status deteriorating rapidly. Family requesting meeting to discuss goals of care.',
    recommendation: 'Recommend: (1) Increase fentanyl to 75mcg/hr. (2) Consider coeliac plexus block referral. (3) NG tube insertion if oral intake < 500 kcal/day. (4) Family meeting this week. (5) Advance care directive discussion. (6) MDT review in 48 hours.',
  },
  teamMessages: [
    { id: 'm1', author: 'Dr. Nikhil N.', role: 'Palliative Medicine', badge: 'Dr.', badgeColor: 'bg-teal text-white', time: '08:30 AM', content: 'Arun ji had a very difficult night. Pain score peaking at 8/10. Fentanyl patch needs to be stepped up. Will discuss coeliac plexus block with anaesthesia team.' },
    { id: 'm2', author: 'Ms. Sunita M.', role: 'Social Work', badge: 'SW', badgeColor: 'bg-terra text-white', time: '09:00 AM', content: 'Family meeting scheduled for Thursday. Sons have arrived from Delhi. They want to understand prognosis and care options clearly.' },
    { id: 'm3', author: 'Chaplain Ravi', role: 'Spiritual Care', badge: 'Ch.', badgeColor: 'bg-charcoal/60 text-white', time: '09:20 AM', content: 'Patient expressed wish for a prayer session with family. Have arranged for tomorrow morning. Also discussed advance care preferences — he prefers comfort over aggressive intervention.' },
  ],
};

PATIENT_DATA['4'] = {
  carePlan: {
    goalsOfCare: [
      'Post-operative pain management after debulking surgery',
      'Early mobilization and physiotherapy',
      'Psychological support for body image concerns',
    ],
    painManagementPlan: [
      'Paracetamol 1g QID + Ibuprofen 400mg TID',
      'Tramadol 100mg BD for moderate pain',
      'Gabapentin 100mg TID for neuropathic component (titrate up)',
    ],
    teamTasks: [
      { id: 't1', text: 'Post-op wound assessment and dressing', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: true, priority: 'high' as TaskPriority, deadline: '2026-02-18' },
      { id: 't2', text: 'Physiotherapy mobilization plan initiation', assignee: 'PT Ravi K.', role: 'Physiotherapy', done: false, priority: 'high' as TaskPriority, deadline: '2026-02-21' },
      { id: 't3', text: 'Body image and coping counselling', assignee: 'Ms. Priya S.', role: 'Clinical Psychology', done: false, priority: 'medium' as TaskPriority, deadline: '2026-02-24' },
    ],
  },
  sbar: {
    situation: 'Priya Patel, 48F with Stage III Ovarian Ca, post-operative day 5 after debulking surgery. Pain well controlled at NRS 3/10.',
    background: 'Debulking surgery 5 days ago. Recovery progressing well. Started oral feeds on day 3. Ambulating with assistance. PPS 60%, ECOG 2.',
    assessment: 'Surgical pain improving. Patient anxious about chemotherapy starting next week. Body image concerns noted by nursing staff.',
    recommendation: 'Recommend: (1) Continue current analgesic regime. (2) Start physiotherapy protocol. (3) Psychology referral for pre-chemo anxiety. (4) Discharge planning for day 7 if progressing.',
  },
  teamMessages: [
    { id: 'm1', author: 'Sr. Meena R.', role: 'Palliative Nurse', badge: 'Sr.', badgeColor: 'bg-sage text-white', time: '07:30 AM', content: 'Priya ji had a good night. Pain controlled, slept 7 hours. Wound healing well. She is anxious about starting chemotherapy next week.' },
    { id: 'm2', author: 'Dr. Nikhil N.', role: 'Palliative Medicine', badge: 'Dr.', badgeColor: 'bg-teal text-white', time: '08:00 AM', content: 'Good recovery trajectory. Will discuss chemo expectations with oncology team and arrange a pre-chemo counselling session.' },
  ],
};

PATIENT_DATA['5'] = {
  carePlan: {
    goalsOfCare: [
      'Optimize pain control for oral cavity and neck region',
      'Nutritional support via PEG tube management',
      'Speech and swallowing rehabilitation',
      'Caregiver training for PEG feeding',
    ],
    painManagementPlan: [
      'Morphine SR 30mg q12h as background opioid',
      'Morphine IR 10mg PRN for breakthrough pain before meals',
      'Lidocaine viscous gargle for oral mucositis pain',
      'Dexamethasone 2mg BD to reduce tumour-related oedema',
    ],
    teamTasks: [
      { id: 't1', text: 'Monitor PEG tube site and feeding tolerance', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: false, priority: 'high' as TaskPriority, deadline: '2026-02-21' },
      { id: 't2', text: 'Speech therapy assessment for swallowing function', assignee: 'SLP Kavita D.', role: 'Speech Pathology', done: false, priority: 'medium' as TaskPriority, deadline: '2026-02-23' },
      { id: 't3', text: 'Caregiver PEG feeding education session', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: true, priority: 'high' as TaskPriority, deadline: '2026-02-17' },
      { id: 't4', text: 'Oral hygiene protocol implementation', assignee: 'Sr. Meena R.', role: 'Palliative Nurse', done: false, priority: 'low' as TaskPriority, deadline: '2026-02-27' },
    ],
  },
  sbar: {
    situation: 'Mahesh Verma, 65M with Head & Neck Ca, managed with PEG feeding due to dysphagia. Pain NRS 6/10 localized to oral cavity and neck.',
    background: 'Diagnosed 6 months ago. Post-radiation mucositis ongoing. PEG tube placed 3 weeks ago. Weight stabilized since PEG insertion. PPS 50%, ECOG 2. Wife trained on PEG feeds.',
    assessment: 'Pain predominantly from mucositis and tumour mass. PEG functioning well. Speech and swallowing assessment pending. Mood stable.',
    recommendation: 'Recommend: (1) Continue current opioid regime. (2) Lidocaine gargle before attempted oral intake. (3) Speech therapy consult. (4) Oral hygiene protocol. (5) Review in 1 week.',
  },
  teamMessages: [
    { id: 'm1', author: 'Dr. Nikhil N.', role: 'Palliative Medicine', badge: 'Dr.', badgeColor: 'bg-teal text-white', time: '11:00 AM', content: 'Mahesh ji reports oral pain improving slightly with lidocaine gargle. PEG feeds being tolerated well at 1500 kcal/day. Need speech therapy input for swallowing rehab.' },
    { id: 'm2', author: 'Sr. Meena R.', role: 'Palliative Nurse', badge: 'Sr.', badgeColor: 'bg-sage text-white', time: '11:20 AM', content: 'Wife has completed PEG feeding training. She is confident with the technique. PEG site clean, no signs of infection.' },
  ],
};

// -- Component ----------------------------------------------------------------
export default function MDTPage() {
  const [selectedPatient, setSelectedPatient] = useState('1');
  const [tasksByPatient, setTasksByPatient] = useState<Record<string, typeof CARE_PLAN_1.teamTasks>>({});
  const [messageText, setMessageText] = useState('');
  const [messagesByPatient, setMessagesByPatient] = useState<Record<string, typeof MESSAGES_1>>({});
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'overdue' | 'urgent' | 'pending'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Dr. Nikhil N.');
  const [newTaskRole, setNewTaskRole] = useState('Palliative Medicine');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const patient = PATIENTS_LIST.find((p) => p.id === selectedPatient) || PATIENTS_LIST[0];
  const patientData = PATIENT_DATA[selectedPatient] || PATIENT_DATA['1'];
  const tasks = tasksByPatient[selectedPatient] || patientData.carePlan.teamTasks;
  const messages = messagesByPatient[selectedPatient] || patientData.teamMessages;
  const sbar = patientData.sbar;
  const carePlan = patientData.carePlan;
  const completedTasks = tasks.filter((t) => t.done).length;
  const overdueTasks = tasks.filter((t) => !t.done && isOverdue(t.deadline)).length;
  const urgentTasks = tasks.filter((t) => !t.done && (t.priority === 'urgent' || t.priority === 'high')).length;

  // Sort: urgent/overdue first, then by priority, then by deadline
  const priorityOrder: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sortedFilteredTasks = [...tasks]
    .sort((a, b) => {
      // Completed tasks go to bottom
      if (a.done !== b.done) return a.done ? 1 : -1;
      // Overdue tasks bubble up
      const aOverdue = isOverdue(a.deadline) ? 0 : 1;
      const bOverdue = isOverdue(b.deadline) ? 0 : 1;
      if (aOverdue !== bOverdue) return aOverdue - bOverdue;
      // Then by priority
      const aPri = priorityOrder[a.priority] ?? 2;
      const bPri = priorityOrder[b.priority] ?? 2;
      if (aPri !== bPri) return aPri - bPri;
      // Then by deadline
      if (a.deadline && b.deadline) return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return 0;
    })
    .filter((t) => {
      if (taskFilter === 'overdue') return !t.done && isOverdue(t.deadline);
      if (taskFilter === 'urgent') return !t.done && (t.priority === 'urgent' || t.priority === 'high');
      if (taskFilter === 'pending') return !t.done;
      return true;
    });

  function toggleTask(id: string) {
    const currentTasks = tasksByPatient[selectedPatient] || patientData.carePlan.teamTasks;
    setTasksByPatient(prev => ({
      ...prev,
      [selectedPatient]: currentTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }

  function sendMessage() {
    if (!messageText.trim()) return;
    const currentMessages = messagesByPatient[selectedPatient] || patientData.teamMessages;
    const newMsg = {
      id: `m${currentMessages.length + 1}`,
      author: 'Dr. Nikhil N.',
      role: 'Palliative Medicine',
      badge: 'Dr.',
      badgeColor: 'bg-teal text-white',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
      content: messageText,
    };
    setMessagesByPatient(prev => ({
      ...prev,
      [selectedPatient]: [...currentMessages, newMsg],
    }));
    setMessageText('');
  }

  function addTask() {
    if (!newTaskText.trim()) return;
    const currentTasks = tasksByPatient[selectedPatient] || patientData.carePlan.teamTasks;
    const newTask = {
      id: `t-new-${Date.now()}`,
      text: newTaskText.trim(),
      assignee: newTaskAssignee,
      role: newTaskRole,
      done: false,
      priority: newTaskPriority,
      deadline: newTaskDeadline || '',
    };
    setTasksByPatient(prev => ({
      ...prev,
      [selectedPatient]: [...currentTasks, newTask],
    }));
    setNewTaskText('');
    setNewTaskDeadline('');
    setNewTaskPriority('medium');
    setShowAddTask(false);
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

      {/* Cross-Patient Action Summary */}
      {(() => {
        let totalTasks = 0, totalDone = 0, totalOverdue = 0, totalUrgent = 0;
        PATIENTS_LIST.forEach((pt) => {
          const ptTasks = tasksByPatient[pt.id] || (PATIENT_DATA[pt.id] || PATIENT_DATA['1']).carePlan.teamTasks;
          totalTasks += ptTasks.length;
          totalDone += ptTasks.filter((t: any) => t.done).length;
          totalOverdue += ptTasks.filter((t: any) => !t.done && isOverdue(t.deadline)).length;
          totalUrgent += ptTasks.filter((t: any) => !t.done && (t.priority === 'urgent' || t.priority === 'high')).length;
        });
        const pctDone = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal" />
                <span className="text-sm text-charcoal/60">All Patients:</span>
                <span className="text-sm font-bold text-charcoal">{totalDone}/{totalTasks} tasks done</span>
                <span className="text-xs text-charcoal/40">({pctDone}%)</span>
              </div>
              {totalOverdue > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-alert-critical/10 px-2.5 py-0.5 text-xs font-bold text-alert-critical">
                  <AlertTriangle className="h-3 w-3" /> {totalOverdue} overdue
                </span>
              )}
              {totalUrgent > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-terra/10 px-2.5 py-0.5 text-xs font-bold text-terra">
                  <ArrowUp className="h-3 w-3" /> {totalUrgent} urgent/high
                </span>
              )}
              <div className="ml-auto h-2 w-32 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${pctDone}%` }} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Sprint 40 — Upcoming MDT Meetings Timeline */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="h-4 w-4 text-teal" />
          <h3 className="text-sm font-bold text-charcoal">Upcoming MDT Meetings</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[
            { time: '10:00 AM', title: 'Ward Round', patients: 5, status: 'now' as const },
            { time: '2:00 PM', title: 'MDT Conference', patients: 3, status: 'upcoming' as const },
            { time: '3:30 PM', title: 'Family Meeting — Arjun Singh', patients: 1, status: 'upcoming' as const },
            { time: 'Tomorrow', title: 'Opioid Review Committee', patients: 4, status: 'future' as const },
            { time: 'Wed', title: 'Palliative Grand Rounds', patients: 0, status: 'future' as const },
          ].map((meeting, i) => {
            const isNow = meeting.status === 'now';
            return (
              <div key={i} className={cn(
                'flex-shrink-0 rounded-lg border p-3 min-w-[140px]',
                isNow ? 'border-teal bg-teal/5' : meeting.status === 'upcoming' ? 'border-sage-light/30 bg-white' : 'border-dashed border-charcoal/10 bg-cream/30',
              )}>
                <div className="flex items-center gap-1.5 mb-1">
                  {isNow && <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />}
                  <span className={cn('text-[10px] font-bold uppercase', isNow ? 'text-teal' : 'text-charcoal/40')}>
                    {isNow ? 'In Progress' : meeting.time}
                  </span>
                </div>
                <p className="text-xs font-semibold text-charcoal truncate">{meeting.title}</p>
                {meeting.patients > 0 && (
                  <p className="text-[10px] text-charcoal/40 mt-0.5">{meeting.patients} patient{meeting.patients !== 1 ? 's' : ''}</p>
                )}
              </div>
            );
          })}
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

      {/* Patient Quick Vitals Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-sage-light/30 bg-white p-3 text-center">
          <p className="text-[10px] font-semibold text-charcoal/50 uppercase">Pain NRS</p>
          <p className={cn('text-2xl font-bold', patient.nrs >= 7 ? 'text-alert-critical' : patient.nrs >= 4 ? 'text-amber' : 'text-alert-success')}>
            {patient.nrs}/10
          </p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-3 text-center">
          <p className="text-[10px] font-semibold text-charcoal/50 uppercase">PPS</p>
          <p className={cn('text-2xl font-bold', patient.pps <= 30 ? 'text-alert-critical' : patient.pps <= 50 ? 'text-amber' : 'text-sage')}>
            {patient.pps}%
          </p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-3 text-center">
          <p className="text-[10px] font-semibold text-charcoal/50 uppercase">MEDD</p>
          <p className={cn('text-2xl font-bold', patient.medd >= 200 ? 'text-alert-critical' : patient.medd >= 90 ? 'text-amber' : 'text-charcoal')}>
            {patient.medd}<span className="text-xs font-normal text-charcoal/40 ml-0.5">mg</span>
          </p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-3 text-center">
          <p className="text-[10px] font-semibold text-charcoal/50 uppercase">Code Status</p>
          <p className="text-sm font-bold text-charcoal mt-1">{patient.codeStatus}</p>
        </div>
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
              {carePlan.goalsOfCare.map((goal, i) => (
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
              {carePlan.painManagementPlan.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal/70">
                  <Pill className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Team Tasks — Enhanced */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Team Tasks</p>
              <div className="flex items-center gap-2">
                {overdueTasks > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-alert-critical/10 px-2 py-0.5 text-[10px] font-bold text-alert-critical">
                    <AlertTriangle className="h-3 w-3" />
                    {overdueTasks} overdue
                  </span>
                )}
                <span className="text-xs text-charcoal/40">{completedTasks}/{tasks.length} done</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-sage/10">
              <div
                className="h-1.5 rounded-full bg-teal transition-all"
                style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
              />
            </div>

            {/* Filter chips */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {([
                { key: 'all', label: 'All' },
                { key: 'overdue', label: `Overdue (${overdueTasks})` },
                { key: 'urgent', label: `Urgent/High (${urgentTasks})` },
                { key: 'pending', label: 'Pending' },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTaskFilter(key)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors',
                    taskFilter === key
                      ? 'bg-teal text-white'
                      : 'bg-sage/10 text-charcoal/50 hover:bg-sage/20',
                  )}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="ml-auto flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-semibold text-teal hover:bg-teal/20"
              >
                <Plus className="h-3 w-3" /> Add Task
              </button>
            </div>

            {/* Add Task inline form */}
            {showAddTask && (
              <div className="mt-2 rounded-lg border border-teal/20 bg-teal/5 p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Task description..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full rounded-lg border border-sage/20 bg-white px-3 py-1.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none"
                />
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Assignee"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="flex-1 min-w-[120px] rounded-lg border border-sage/20 bg-white px-2 py-1 text-xs text-charcoal focus:border-teal focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newTaskRole}
                    onChange={(e) => setNewTaskRole(e.target.value)}
                    className="flex-1 min-w-[120px] rounded-lg border border-sage/20 bg-white px-2 py-1 text-xs text-charcoal focus:border-teal focus:outline-none"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="rounded-lg border border-sage/20 bg-white px-2 py-1 text-xs text-charcoal focus:border-teal focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="rounded-lg border border-sage/20 bg-white px-2 py-1 text-xs text-charcoal focus:border-teal focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowAddTask(false)} className="rounded-lg px-3 py-1 text-xs text-charcoal/50 hover:bg-sage/10">Cancel</button>
                  <button
                    onClick={addTask}
                    disabled={!newTaskText.trim()}
                    className="rounded-lg bg-teal px-3 py-1 text-xs font-semibold text-white hover:bg-teal/90 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Task list */}
            <ul className="mt-3 space-y-2">
              {sortedFilteredTasks.map((task) => {
                const priCfg = PRIORITY_CONFIG[task.priority];
                const PriIcon = priCfg.icon;
                const overdue = !task.done && isOverdue(task.deadline);
                const days = daysUntil(task.deadline);
                return (
                  <li
                    key={task.id}
                    className={cn(
                      'flex items-start gap-2 rounded-lg border p-2.5 transition-colors',
                      overdue
                        ? 'border-alert-critical/30 bg-alert-critical/5'
                        : 'border-sage/10 hover:bg-cream/30',
                    )}
                  >
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
                    <div className={cn('flex-1 min-w-0', task.done && 'opacity-50')}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn(priCfg.bg, priCfg.color, 'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase')}>
                          <PriIcon className="h-2.5 w-2.5" />
                          {priCfg.label}
                        </span>
                        {overdue && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-alert-critical/10 px-1.5 py-0.5 text-[9px] font-bold text-alert-critical uppercase">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Overdue
                          </span>
                        )}
                        {task.deadline && !overdue && !task.done && days !== null && days <= 2 && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber/10 px-1.5 py-0.5 text-[9px] font-bold text-amber uppercase">
                            Due soon
                          </span>
                        )}
                      </div>
                      <p className={cn('mt-1 text-sm text-charcoal/70', task.done && 'line-through')}>
                        {task.text}
                      </p>
                      <div className="mt-1 flex items-center gap-2 flex-wrap text-[10px] text-charcoal/40">
                        <span>{task.assignee} &middot; {task.role}</span>
                        {task.deadline && (
                          <span className={cn(
                            'flex items-center gap-0.5',
                            overdue ? 'text-alert-critical font-semibold' : '',
                          )}>
                            <CalendarClock className="h-2.5 w-2.5" />
                            {new Date(task.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            {days !== null && !task.done && (
                              <span>
                                ({overdue ? `${Math.abs(days)}d late` : days === 0 ? 'Today' : `${days}d left`})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {sortedFilteredTasks.length === 0 && (
              <p className="mt-3 text-center text-xs text-charcoal/40">No tasks match this filter</p>
            )}
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
              { letter: 'S', title: 'Situation', content: sbar.situation, color: 'border-l-alert-critical bg-red-50/50' },
              { letter: 'B', title: 'Background', content: sbar.background, color: 'border-l-amber bg-amber-50/50' },
              { letter: 'A', title: 'Assessment', content: sbar.assessment, color: 'border-l-teal bg-teal/5' },
              { letter: 'R', title: 'Recommendation', content: sbar.recommendation, color: 'border-l-alert-success bg-green-50/50' },
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
