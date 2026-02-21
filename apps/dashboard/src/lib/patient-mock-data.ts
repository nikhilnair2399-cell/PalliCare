/* eslint-disable @typescript-eslint/no-explicit-any */

export const MOCK_PATIENT_PROFILE = {
  id: 'dev-patient-001',
  uhid: 'AIIMS-BPL-2024-001234',
  name: 'Rajesh Kumar',
  age: 58,
  gender: 'M',
  phone: '+91 98765 43210',
  preferred_language: 'en' as const,
  diagnosis: 'Stage III Non-Small Cell Lung Cancer',
  secondary_diagnoses: ['Chronic Back Pain', 'Mild Anxiety'],
  care_team: [
    { role: 'Palliative Physician', name: 'Dr. Nikhil Nair' },
    { role: 'Pain Specialist', name: 'Dr. Priya Sharma' },
    { role: 'Nurse', name: 'Nurse Anita Desai' },
  ],
};

export const MOCK_MEDICATIONS_TODAY = [
  {
    id: 'med-1',
    name: 'Morphine SR',
    dose: '30mg',
    route: 'Oral',
    category: 'opioid',
    schedule: [
      { time: '08:00', label: 'Morning', status: 'taken', taken_at: '2024-02-21T08:15:00Z' },
      { time: '20:00', label: 'Night', status: 'pending', taken_at: null },
    ],
  },
  {
    id: 'med-2',
    name: 'Ondansetron',
    dose: '4mg',
    route: 'Oral',
    category: 'supportive',
    schedule: [
      { time: '08:00', label: 'Morning', status: 'taken', taken_at: '2024-02-21T08:20:00Z' },
      { time: '14:00', label: 'Afternoon', status: 'skipped', taken_at: null },
      { time: '20:00', label: 'Night', status: 'pending', taken_at: null },
    ],
  },
  {
    id: 'med-3',
    name: 'Paracetamol',
    dose: '650mg',
    route: 'Oral',
    category: 'supportive',
    is_prn: true,
    schedule: [],
    last_taken: '2024-02-21T12:30:00Z',
  },
  {
    id: 'med-4',
    name: 'Gabapentin',
    dose: '300mg',
    route: 'Oral',
    category: 'adjuvant',
    schedule: [
      { time: '08:00', label: 'Morning', status: 'taken', taken_at: '2024-02-21T08:10:00Z' },
      { time: '20:00', label: 'Night', status: 'pending', taken_at: null },
    ],
  },
];

export const MOCK_SYMPTOM_SUMMARY = {
  today: {
    pain: 4,
    mood: 'okay',
    logged_at: '2024-02-21T09:00:00Z',
  },
  yesterday: {
    pain: 5,
    mood: 'low',
    logged_at: '2024-02-20T19:00:00Z',
  },
  week_avg_pain: 4.5,
  trend: 'improving',
};

export const MOCK_WELLNESS_SUMMARY = {
  active_goals: 3,
  completed_goals_today: 1,
  gratitude_streak: 7,
  intention_status: 'in_progress',
  unseen_milestones: 1,
};

export const MOCK_GOALS = [
  {
    id: 'goal-1',
    title: 'Walk 10 minutes daily',
    frequency: 'daily',
    status: 'active',
    streak: 5,
    last_completed: '2024-02-20',
    completed_today: true,
  },
  {
    id: 'goal-2',
    title: 'Drink 8 glasses of water',
    frequency: 'daily',
    status: 'active',
    streak: 3,
    last_completed: '2024-02-20',
    completed_today: false,
  },
  {
    id: 'goal-3',
    title: 'Practice deep breathing',
    frequency: 'weekly',
    status: 'active',
    streak: 2,
    last_completed: '2024-02-18',
    completed_today: false,
  },
];

export const MOCK_GRATITUDE_ENTRIES = [
  {
    id: 'grat-1',
    date: '2024-02-21',
    content: 'My family visited today. Their support means everything.',
  },
  {
    id: 'grat-2',
    date: '2024-02-20',
    content: 'Pain was better today. I could read a book for an hour.',
  },
  {
    id: 'grat-3',
    date: '2024-02-19',
    content: 'Doctor explained my treatment clearly. I feel less anxious now.',
  },
  {
    id: 'grat-4',
    date: '2024-02-18',
    content: 'Neighbour brought home-cooked food. Small acts of kindness matter.',
  },
];

export const MOCK_TODAY_INTENTION = {
  date: '2024-02-21',
  content: 'I will take my medications on time and walk for 10 minutes.',
  status: 'in_progress',
};

export const MOCK_MILESTONES = [
  {
    id: 'mile-1',
    title: '7 Day Gratitude Streak',
    description: 'You have been expressing gratitude for 7 consecutive days!',
    achieved_at: '2024-02-21',
    category: 'wellness',
    icon: 'heart',
    seen: false,
  },
  {
    id: 'mile-2',
    title: 'First Week on PalliCare',
    description: 'Welcome! You completed your first week of symptom tracking.',
    achieved_at: '2024-02-18',
    category: 'engagement',
    icon: 'star',
    seen: true,
  },
  {
    id: 'mile-3',
    title: 'Pain Management Pro',
    description: 'You have logged symptoms for 14 consecutive days.',
    achieved_at: '2024-02-14',
    category: 'tracking',
    icon: 'trophy',
    seen: true,
  },
];

export const MOCK_EDUCATION_MODULES = [
  {
    id: 'edu-1',
    title: 'Understanding Your Pain Medications',
    description: 'Learn about the different types of pain medications, how they work, and tips for taking them safely.',
    category: 'Medications',
    duration: '5 min',
    progress: 100,
    completed: true,
  },
  {
    id: 'edu-2',
    title: 'Managing Nausea and Vomiting',
    description: 'Practical tips and techniques to help manage nausea as a side effect of treatment.',
    category: 'Symptom Management',
    duration: '6 min',
    progress: 60,
    completed: false,
  },
  {
    id: 'edu-3',
    title: 'When to Contact Your Care Team',
    description: 'Know the warning signs that need immediate attention and how to reach your care team.',
    category: 'Safety',
    duration: '4 min',
    progress: 0,
    completed: false,
  },
  {
    id: 'edu-4',
    title: 'Breathing Exercises for Comfort',
    description: 'Simple breathing techniques that can help reduce anxiety and manage pain.',
    category: 'Wellness',
    duration: '7 min',
    progress: 30,
    completed: false,
  },
  {
    id: 'edu-5',
    title: 'Nutrition During Treatment',
    description: 'Guidance on eating well during your treatment to maintain strength and comfort.',
    category: 'Nutrition',
    duration: '5 min',
    progress: 0,
    completed: false,
  },
];

export const MOCK_BREATHE_STATS = {
  total_sessions: 24,
  total_minutes: 96,
  favorite_technique: '4-7-8 Breathing',
  last_session: '2024-02-20T18:00:00Z',
  this_week: 5,
};

export const MOCK_MESSAGES = [
  {
    id: 'msg-1',
    sender_name: 'Dr. Nikhil Nair',
    sender_role: 'Palliative Physician',
    content: 'Good morning Rajesh. How is the pain today after the dose adjustment? Please let me know if the morning dose helped.',
    sent_at: '2024-02-21T08:30:00Z',
    is_from_patient: false,
  },
  {
    id: 'msg-2',
    sender_name: 'Rajesh Kumar',
    sender_role: 'Patient',
    content: 'Good morning doctor. Pain is much better today, around 4 out of 10. The new dose seems to be working.',
    sent_at: '2024-02-21T09:15:00Z',
    is_from_patient: true,
  },
  {
    id: 'msg-3',
    sender_name: 'Dr. Nikhil Nair',
    sender_role: 'Palliative Physician',
    content: 'That is great to hear! Please continue with the current dose and log your symptoms regularly. We will review in 3 days.',
    sent_at: '2024-02-21T09:30:00Z',
    is_from_patient: false,
  },
  {
    id: 'msg-4',
    sender_name: 'Nurse Anita Desai',
    sender_role: 'Nurse',
    content: 'Rajesh ji, just a reminder to take your evening medicines at 8 PM. Let me know if you need anything.',
    sent_at: '2024-02-21T17:00:00Z',
    is_from_patient: false,
  },
];

export const MOCK_CARE_PLAN = {
  title: 'Comfort-Focused Care Plan',
  status: 'active',
  updated_at: '2024-02-15',
  goals: [
    'Maintain pain score below 4/10',
    'Improve mobility and independence in daily activities',
    'Support emotional well-being and reduce anxiety',
    'Ensure medication adherence above 90%',
  ],
  next_review: '2024-02-29',
  physician: 'Dr. Nikhil Nair',
};

export const MOCK_PAIN_TRENDS = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const base = 5;
  const variation = Math.sin(i / 5) * 2 + (Math.random() - 0.5);
  const score = Math.max(0, Math.min(10, Math.round((base + variation - i * 0.05) * 10) / 10));
  return {
    date: date.toISOString().split('T')[0],
    pain_score: score,
    breakthrough: i === 8 || i === 15 || i === 22,
  };
});

export const MOCK_RECENT_LOGS = [
  {
    id: 'log-1',
    type: 'quick',
    pain: 4,
    mood: 'okay',
    logged_at: '2024-02-21T09:00:00Z',
  },
  {
    id: 'log-2',
    type: 'full',
    pain: 5,
    mood: 'low',
    fatigue: 6,
    nausea: 3,
    anxiety: 4,
    logged_at: '2024-02-20T19:00:00Z',
  },
  {
    id: 'log-3',
    type: 'quick',
    pain: 5,
    mood: 'okay',
    logged_at: '2024-02-20T08:30:00Z',
  },
  {
    id: 'log-4',
    type: 'full',
    pain: 6,
    mood: 'low',
    fatigue: 7,
    nausea: 4,
    anxiety: 5,
    logged_at: '2024-02-19T20:00:00Z',
  },
];
