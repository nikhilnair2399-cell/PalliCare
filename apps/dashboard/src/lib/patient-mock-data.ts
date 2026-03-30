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
  {
    id: 'med-5',
    name: 'Morphine IR',
    dose: '15mg',
    route: 'Oral',
    category: 'opioid',
    is_prn: true,
    schedule: [],
    last_taken: '2024-02-21T14:45:00Z',
  },
  {
    id: 'med-6',
    name: 'Dexamethasone',
    dose: '4mg',
    route: 'Oral',
    category: 'adjuvant',
    schedule: [
      { time: '08:00', label: 'Morning', status: 'taken', taken_at: '2024-02-21T08:05:00Z' },
    ],
  },
  {
    id: 'med-7',
    name: 'Lactulose',
    dose: '15mL',
    route: 'Oral',
    category: 'supportive',
    schedule: [
      { time: '08:00', label: 'Morning', status: 'taken', taken_at: '2024-02-21T08:25:00Z' },
      { time: '20:00', label: 'Night', status: 'pending', taken_at: null },
    ],
  },
  {
    id: 'med-8',
    name: 'Amitriptyline',
    dose: '25mg',
    route: 'Oral',
    category: 'adjuvant',
    schedule: [
      { time: '21:00', label: 'Night', status: 'pending', taken_at: null },
    ],
  },
  {
    id: 'med-9',
    name: 'Pantoprazole',
    dose: '40mg',
    route: 'Oral',
    category: 'supportive',
    schedule: [
      { time: '07:00', label: 'Morning', status: 'taken', taken_at: '2024-02-21T07:00:00Z' },
    ],
  },
  {
    id: 'med-10',
    name: 'Metoclopramide',
    dose: '10mg',
    route: 'Oral',
    category: 'supportive',
    schedule: [
      { time: '07:30', label: 'Morning', status: 'taken', taken_at: '2024-02-21T07:35:00Z' },
      { time: '13:30', label: 'Afternoon', status: 'skipped', taken_at: null },
      { time: '19:30', label: 'Evening', status: 'pending', taken_at: null },
    ],
  },
  {
    id: 'med-11',
    name: 'Lorazepam',
    dose: '0.5mg',
    route: 'Oral',
    category: 'supportive',
    is_prn: true,
    schedule: [],
    last_taken: '2024-02-20T22:15:00Z',
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
    description: 'Learn how pain signals work, the types of medications available, and how to take them safely for better comfort.',
    category: 'Pain Management',
    duration: '8 min',
    progress: 100,
    completed: true,
    sections: [
      {
        title: 'How Pain Signals Work',
        body: 'Your body has a built-in alarm system. When tissue is damaged or under stress, nerve endings send electrical signals up through your spinal cord to your brain. Your brain then decides how much pain you feel — and this is where it gets interesting.\n\nThe "gate control" theory explains that your spinal cord has tiny gates that can open or close to let pain signals through. When you rub a sore spot, apply warmth, or practice deep breathing, you are actually helping to close those gates. Pain medications work by interrupting these signals at different points along the pathway.\n\nUnderstanding this helps you see why a combination of approaches — medication plus comfort measures — often works better than medication alone. You are not just masking pain; you are working with your body\'s own systems.',
        tips: [
          'Think of pain medication as keeping the gates closed — taking it on schedule prevents pain from building up.',
          'Gentle massage, warmth, or cold packs can help close the pain gates alongside your medications.',
          'Tell your care team about ALL your pain, not just the worst moments — this helps them choose the right approach.',
        ],
      },
      {
        title: 'Types of Pain Medications',
        body: 'Pain medications fall into three main groups, and your doctor may use one or a combination depending on your needs.\n\nNon-opioid analgesics include paracetamol (acetaminophen) and NSAIDs like ibuprofen. These work well for mild to moderate pain and can reduce inflammation. They are often the foundation of pain management.\n\nOpioid medications — such as morphine, fentanyl, and tramadol — are used for moderate to severe pain. They work directly on pain receptors in your brain and spinal cord. Despite common fears, when used as prescribed for pain, these medications are safe and effective.\n\nAdjuvant medications were originally designed for other conditions but help with specific types of pain. Gabapentin helps with nerve pain (burning, tingling), while amitriptyline can help with both pain and sleep. Dexamethasone reduces swelling that may be pressing on nerves.',
        tips: [
          'Keep a list of all your medications with doses — show it to every doctor or nurse who treats you.',
          'Non-opioid and opioid medications work on different pathways, so they can be safely combined for better relief.',
          'If you have nerve pain (burning, shooting, tingling), ask your doctor about adjuvant medications specifically for this type.',
        ],
      },
      {
        title: 'Taking Medications Safely',
        body: 'The most important rule in pain management is to stay ahead of the pain. Think of it like keeping a wall strong — it is much easier to maintain than to rebuild after it collapses.\n\nClock-based dosing means taking your regular pain medication at set times, whether or not you feel pain at that moment. This keeps a steady level of medication in your blood. Your doctor may also prescribe a "breakthrough" dose — an extra dose you can take when pain spikes above your baseline despite regular medication.\n\nNever adjust your doses on your own. If your pain is not well controlled, contact your care team. They can adjust the dose, change the timing, or try a different medication. Taking too much can cause unwanted side effects, while taking too little means unnecessary suffering.',
        tips: [
          'Set phone alarms for each medication time — consistency is the key to good pain control.',
          'Your breakthrough dose is your safety net. Do not hesitate to use it when needed — that is exactly what it is for.',
          'Keep at least one week\'s supply of medications at home. Running out over a weekend can be very distressing.',
          'If you are fasting for religious reasons, talk to your doctor about modified dosing schedules beforehand.',
        ],
      },
      {
        title: 'Managing Side Effects',
        body: 'Most pain medication side effects are manageable and many improve over time as your body adjusts. Knowing what to expect helps you feel more in control.\n\nConstipation is the most common opioid side effect and unlike other side effects, it does not go away on its own. Your doctor will likely prescribe a laxative to take alongside your pain medication — take it every day, not just when you feel constipated. Drinking water and eating fibre-rich foods like fruits and dal also helps.\n\nNausea often occurs in the first few days of starting an opioid but usually settles within a week. Taking medication with a small snack can help. If nausea persists, your doctor can prescribe an antiemetic.\n\nDrowsiness is common when starting or increasing a dose but typically improves within a few days. Avoid driving or operating machinery during this adjustment period. If drowsiness persists beyond a week, let your team know.',
        tips: [
          'Start your laxative the same day you start opioid medication — do not wait for constipation to develop.',
          'Eat a small biscuit or piece of roti before taking your pain medication to reduce nausea.',
          'Keep a side effect diary for the first week of any new medication — this helps your doctor make adjustments.',
        ],
      },
      {
        title: 'Common Myths About Pain Medicine',
        body: 'Fear and misinformation about pain medication — especially opioids — can prevent people from getting the relief they deserve. Let us address the most common concerns.\n\nAddiction vs dependence vs tolerance: These are three different things. Physical dependence means your body adapts to the medication (this is normal and expected). Tolerance means you may need a higher dose over time for the same effect (also normal). Addiction is compulsive use despite harm — and it is extremely rare when opioids are used as prescribed for pain.\n\nThe "saving it for later" myth is one of the most harmful beliefs. Some people avoid strong pain medicine thinking they should save it for when pain gets "really bad." But uncontrolled pain actually makes your nervous system more sensitive over time, making future pain harder to treat. Using appropriate pain relief now is the wise choice.\n\nThe WHO Pain Ladder is a step-by-step approach developed by the World Health Organization. It starts with non-opioids, moves to mild opioids, then strong opioids as needed. Your doctor follows this evidence-based approach to find what works for you.',
        tips: [
          'Taking prescribed pain medication for actual pain is not the same as addiction — do not let this fear prevent you from getting relief.',
          'There is no benefit to "toughing it out." Uncontrolled pain is physically harmful and slows recovery.',
          'If family members express concern about your pain medication, ask your doctor to speak with them directly.',
        ],
      },
      {
        title: 'Communicating Pain to Your Team',
        body: 'Your care team cannot feel your pain, so clear communication is essential for getting the right treatment. The more specific you can be, the better they can help.\n\nThe 0-10 pain scale is a starting point: 0 means no pain, 10 is the worst pain imaginable. But numbers alone do not tell the whole story. Describing the quality of your pain — sharp, dull, burning, aching, throbbing, shooting — helps your doctor identify the type and choose the right medication.\n\nKeeping a simple pain diary can be incredibly helpful. Note when pain occurs, what makes it better or worse, how long it lasts, and whether your breakthrough dose helped. Patterns in your diary may reveal triggers or timing issues that can be addressed.\n\nDo not downplay your pain to be "a good patient." Honesty helps your team provide the best care. If pain is affecting your sleep, appetite, mood, or daily activities, these are all important things to share.',
        tips: [
          'Before your appointment, write down your top 3 pain concerns so you do not forget them.',
          'Use descriptive words: "burning in my right arm that shoots down to my fingers" is much more helpful than "my arm hurts."',
          'Rate your pain at its best, worst, and average over the past week — this gives a fuller picture than a single number.',
          'Tell your team if pain is stopping you from sleeping, eating, or spending time with family — these impacts matter.',
        ],
      },
    ],
    key_takeaways: [
      'Pain medications work by interrupting pain signals at different points — combining approaches often works best.',
      'Take your regular medication on schedule (clock-based dosing) to stay ahead of pain rather than chasing it.',
      'Constipation from opioids needs proactive treatment — start laxatives on day one.',
      'Using prescribed pain medication is not addiction — uncontrolled pain is more harmful than the medication.',
      'Clear communication with your care team (describing quality, timing, and impact) leads to better pain control.',
      'Keep a simple pain diary and a medication list — these are your most powerful self-advocacy tools.',
    ],
  },
  {
    id: 'edu-2',
    title: 'Managing Nausea and Vomiting',
    description: 'Understand why nausea happens during treatment and learn practical strategies — from medications to dietary changes — that bring relief.',
    category: 'Symptom Management',
    duration: '6 min',
    progress: 60,
    completed: false,
    sections: [
      {
        title: 'Why Nausea Happens',
        body: 'Nausea during treatment is not a sign that something is going wrong — it is your body responding to medications, changes in your digestive system, or signals from the brain\'s "vomiting centre."\n\nThere are several pathways that trigger nausea. The chemoreceptor trigger zone (CTZ) in your brain detects chemicals in your blood — including some medications — and can trigger nausea as a protective response. Your digestive system itself can send signals when it is irritated or slowed down. Even anxiety and strong smells can activate nausea pathways.\n\nUnderstanding the cause matters because different anti-nausea medications target different pathways. Your doctor chooses the right one based on what is most likely causing your nausea. This is why telling your team when nausea occurs (morning? after medications? with certain smells?) is so helpful.',
        tips: [
          'Note when nausea is worst — after a specific medication, in the morning, or with certain foods. This pattern helps your doctor choose the right treatment.',
          'Nausea from starting a new medication often improves within 3-5 days as your body adjusts.',
          'If you feel nauseous, take slow deep breaths through your nose — this can calm the vomiting centre.',
        ],
      },
      {
        title: 'Anti-Nausea Medications',
        body: 'Several effective medications are available, and your doctor will choose based on the cause of your nausea.\n\nOndansetron (Emeset/Vomikind) blocks serotonin signals and works very well for medication-induced nausea. It is usually taken 30 minutes before meals or the medication that triggers nausea.\n\nMetoclopramide (Perinorm) speeds up stomach emptying and is helpful when nausea comes from a sluggish digestive system. It works best taken before meals.\n\nDexamethasone is a steroid that reduces inflammation and can be a powerful anti-nausea medication, often used alongside others for better effect. It also improves appetite.\n\nYour doctor may prescribe a combination of these if single medications are not enough. Always take anti-nausea medications as prescribed — preventing nausea is much easier than stopping it once it starts.',
        tips: [
          'Take your anti-nausea medication before you feel nauseous — prevention is easier than treatment.',
          'Keep ondansetron tablets where you can reach them easily, including by your bedside.',
          'If one anti-nausea medication is not working, tell your doctor. There are many options and combinations to try.',
        ],
      },
      {
        title: 'Dietary Strategies',
        body: 'What and how you eat can make a significant difference in managing nausea. Small changes in your eating habits can bring real relief.\n\nEat small, frequent meals every 2-3 hours rather than three large meals. An empty stomach can actually worsen nausea, so try to eat a little something even when you do not feel like it. Bland, dry foods like plain roti, toast, or biscuits are often well tolerated.\n\nCold or room-temperature foods tend to have less smell than hot foods, which can be helpful when odours trigger nausea. Try cold curd with rice, fruit, or sandwiches. Ginger — as ginger tea, ginger biscuits, or a small piece of fresh ginger — has genuine anti-nausea properties backed by research.\n\nAvoid very spicy, greasy, or strongly flavoured foods during episodes. Sipping fluids throughout the day rather than drinking large amounts at once also helps. Nimbu pani (lemon water) with a pinch of salt can settle the stomach and replace lost minerals.',
        tips: [
          'Keep plain biscuits or dry toast at your bedside to eat before getting up in the morning.',
          'Try ginger tea: steep fresh ginger slices in hot water for 5 minutes with a little honey.',
          'Avoid lying down immediately after eating — stay upright for at least 30 minutes.',
          'Suck on ice chips or frozen fruit pieces if you cannot tolerate fluids.',
        ],
      },
      {
        title: 'Body Position and Timing',
        body: 'How you position your body and time your activities can reduce nausea significantly.\n\nAfter eating, sit upright or recline slightly — lying completely flat puts pressure on your stomach and can worsen nausea. A comfortable reclining position with your head elevated is ideal for resting after meals.\n\nFresh air helps many people. If possible, sit near an open window or go outside for a few minutes when nausea hits. The change in air and gentle breeze can be surprisingly calming.\n\nAvoid sudden movements. Get up slowly from lying or sitting positions. If you need to move around the house, take it gently. Motion can worsen nausea, so avoid reading in a moving vehicle.\n\nTiming your activities around medication can help too. If a specific medication causes nausea, try taking it with food or at bedtime (ask your doctor first). Schedule activities that might trigger nausea (cooking, cleaning) for times when you feel best.',
        tips: [
          'After eating, rest in a slightly reclined position with your head elevated — do not lie flat.',
          'Open a window or use a fan for fresh air when nausea strikes.',
          'Take the medication that causes nausea at bedtime if your doctor approves — you may sleep through the worst of it.',
        ],
      },
      {
        title: 'When to Call for Help',
        body: 'While most nausea can be managed at home, certain situations need prompt medical attention.\n\nCall your care team if you cannot keep any fluids down for more than 12 hours. Dehydration can develop quickly and makes everything else harder to manage. Signs of dehydration include dark urine, dry mouth, dizziness when standing, and reduced urination.\n\nVomiting blood or material that looks like coffee grounds, severe abdominal pain with vomiting, or vomiting that starts suddenly and severely after being well controlled — these all need urgent attention.\n\nIf you have been unable to take your regular pain medications due to vomiting, let your team know. They can provide alternative routes (such as patches or injections) so your pain control is not disrupted.\n\nDo not feel embarrassed about calling. Persistent nausea significantly affects your quality of life and there are always more options to try.',
        tips: [
          'If you cannot keep fluids down for more than 12 hours, contact your care team — do not wait longer.',
          'Watch for signs of dehydration: dark urine, dry mouth, dizziness, and feeling very tired.',
          'If vomiting prevents you from taking your regular medications, call your team — alternative routes are available.',
        ],
      },
    ],
    key_takeaways: [
      'Nausea has specific causes and targeted treatments — telling your team when and how it occurs helps them choose the right medication.',
      'Take anti-nausea medication before you feel sick — prevention is easier than cure.',
      'Small frequent meals, bland/cold foods, ginger, and staying upright after eating are your best dietary strategies.',
      'Fresh air, gentle movements, and proper positioning can reduce nausea without medication.',
      'Call your care team if you cannot keep fluids down for more than 12 hours or if you see blood in vomit.',
    ],
  },
  {
    id: 'edu-3',
    title: 'When to Contact Your Care Team',
    description: 'Know which symptoms need immediate attention, which can wait, and how to communicate effectively with your care team.',
    category: 'Safety',
    duration: '5 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'Red Flag Symptoms',
        body: 'Some symptoms need immediate attention because they could indicate a serious change in your condition. Knowing these red flags helps you act quickly when it matters most.\n\nContact your care team immediately or go to the emergency department if you experience: uncontrolled pain that does not respond to your breakthrough dose, sudden difficulty breathing or a significant increase in breathlessness, a fever above 101°F (38.3°C) — especially if you are on chemotherapy, new confusion or sudden personality changes, inability to wake someone or unusual drowsiness that is new, seizures or uncontrolled movements, or sudden severe headache unlike any you have had before.\n\nThese do not necessarily mean something terrible is happening, but they need prompt assessment. It is always better to call and be reassured than to wait and risk a problem getting worse.',
        tips: [
          'Put your care team\'s emergency number in your phone under "ICE" (In Case of Emergency) — and make sure family members have it too.',
          'If you are unsure whether a symptom is a "red flag," call anyway. Your team would rather hear from you than have you worry alone.',
          'Keep a written list of red flag symptoms on your refrigerator or bedside table for quick reference.',
        ],
      },
      {
        title: 'Urgent But Not Emergency',
        body: 'Some situations need attention within 24 hours but may not require an emergency visit. These are best handled by calling your palliative care team during working hours.\n\nPersistent vomiting lasting more than a day, constipation lasting more than 3 days despite taking laxatives, new or worsening swelling in your legs or abdomen, medication running out or running low (less than 3 days\' supply), a new rash or skin change especially around medication patches, increasing drowsiness over several days, or mouth sores making it hard to eat or drink.\n\nFor these situations, call your team during regular hours. Have your medication list and a description of when the problem started ready. If you cannot reach your palliative care team, your local hospital\'s medicine department or emergency services can help.',
        tips: [
          'Call your team if constipation lasts more than 3 days — do not wait longer, as it becomes harder to treat.',
          'Check your medication supply every week. If you have less than a week\'s supply, contact your pharmacy or team.',
          'Keep your doctor\'s clinic number, hospital number, and after-hours number all saved in your phone.',
        ],
      },
      {
        title: 'Questions That Can Wait',
        body: 'Not every concern needs an immediate call. Some questions can be saved for your next scheduled appointment, which helps you use your consultation time well.\n\nQuestions about medication timing adjustments (whether to take a medication with breakfast or dinner), general dietary questions (what foods to eat or avoid), activity level guidance (how much walking or exercise is appropriate), medication refill requests (when you still have more than a week\'s supply), and questions about your overall treatment plan.\n\nKeeping a notebook of these non-urgent questions is very helpful. Write them down as they come to you, and bring the list to your next appointment. This way you will not forget anything, and your doctor can address all your concerns in one visit.\n\nHowever, trust your instincts. If something feels wrong or different, even if it seems small, it is okay to call. No question is too silly, and your care team would rather help you feel confident about what to do.',
        tips: [
          'Keep a small notebook or phone note for questions to ask at your next visit.',
          'Write down the question AND when you first noticed the concern — context helps your doctor.',
          'If you are unsure whether something can wait, a simple phone call to ask is perfectly fine.',
        ],
      },
      {
        title: 'How to Communicate Effectively',
        body: 'When you call your care team, clear communication helps them help you faster. A simple framework called SBAR can guide you.\n\nSituation: Start with who you are and what is happening right now. "This is Rajesh Kumar, your patient. I am having severe pain in my abdomen that started two hours ago."\n\nBackground: Share relevant context. "I was fine this morning. I took all my medications on time. My last bowel movement was three days ago."\n\nAssessment: Share what you think might be going on (it is okay to guess). "I think it might be related to constipation, but it feels different from my usual pain."\n\nRequest: Say what you need. "Can you advise me on what to do, or should I come in to be seen?"\n\nYou do not need to use these exact words — the idea is simply to cover these four points: what is happening, the context, your concern, and what you need.',
        tips: [
          'Practice the SBAR format once — write it out for a real scenario so you feel confident using it.',
          'Have your medication list and recent symptoms diary near the phone when you call.',
          'If someone else is calling on your behalf, make sure they know your medications and recent changes.',
          'It is okay to say "I do not know what is wrong, but something feels different." That is valuable information.',
        ],
      },
      {
        title: 'After-Hours Resources',
        body: 'Illness does not follow office hours. Knowing what resources are available at night and on weekends gives you peace of mind.\n\nYour palliative care team may have an after-hours phone number — save this in your phone and give it to your family. Some teams have a nurse helpline available in the evenings.\n\nIf you need to go to an emergency department, bring your medication list, your latest prescription from your palliative care doctor, and any relevant reports. Tell the ER team immediately that you are a palliative care patient — this helps them understand your situation and avoid unnecessary tests.\n\nKeep a "hospital bag" ready with these documents, basic toiletries, a phone charger, and comfortable clothing. Having it ready reduces stress during an urgent situation.\n\nRemember: calling for help is never wrong. Your care team would always rather hear from you — even at 2 AM — than have you suffer in silence.',
        tips: [
          'Prepare a one-page summary with your diagnosis, current medications, allergies, and your palliative care doctor\'s name and phone number.',
          'Keep this summary in your wallet, phone case, and with a family member.',
          'If you go to the ER, say: "I am a palliative care patient under Dr [Name] at AIIMS. Here is my medication list."',
          'Pack a small hospital bag with documents, medications for 2 days, charger, and basic toiletries — keep it ready.',
        ],
      },
    ],
    key_takeaways: [
      'Red flags (uncontrolled pain, fever, breathing difficulty, confusion) need immediate attention — call or go to the ER.',
      'Urgent issues (persistent vomiting, constipation >3 days, low medication supply) should be reported within 24 hours.',
      'Use the SBAR format (Situation, Background, Assessment, Request) when calling your care team.',
      'Keep a one-page medical summary and medication list ready for emergencies.',
      'Calling for help is never wrong — your team prefers a call to your suffering in silence.',
    ],
  },
  {
    id: 'edu-4',
    title: 'Breathing Exercises for Comfort',
    description: 'Learn gentle breathing techniques that activate your body\'s natural calming response, reduce anxiety, and help manage pain.',
    category: 'Wellness',
    duration: '8 min',
    progress: 30,
    completed: false,
    sections: [
      {
        title: 'Why Breathing Matters',
        body: 'Your breath is one of the most powerful tools you have — and it is always with you. When you breathe slowly and deeply, you activate the vagus nerve, which runs from your brain down through your body. This nerve acts like a brake pedal for your stress response.\n\nWhen the vagus nerve is activated, your heart rate slows, blood pressure drops, muscles relax, and your body produces less cortisol (the stress hormone). This is called the parasympathetic response — your body\'s natural "rest and digest" mode.\n\nResearch shows that slow breathing (around 6 breaths per minute) can reduce pain perception by up to 40% in some studies. It does not make pain disappear, but it changes how your brain processes pain signals. Combined with medication, breathing exercises can significantly improve your comfort.',
        tips: [
          'You do not need any special equipment or training — just a comfortable position and a few minutes.',
          'Even 3 minutes of slow breathing can shift your nervous system from "fight or flight" to "rest and restore."',
          'If you feel lightheaded during any breathing exercise, return to your normal breathing pattern. You are not doing it wrong — just ease into it gradually.',
        ],
      },
      {
        title: 'Diaphragmatic Breathing',
        body: 'Diaphragmatic breathing (belly breathing) is the foundation of all relaxation breathing. Most of us breathe shallowly into our chest, especially when stressed or in pain. This technique teaches you to use your diaphragm — the large dome-shaped muscle below your lungs.\n\nHere is how to practice: Sit comfortably or lie down with your knees bent. Place one hand on your chest and the other on your belly, just below your ribs. Breathe in slowly through your nose for a count of 4, letting your belly push your hand outward. Your chest hand should stay relatively still. Exhale slowly through pursed lips for a count of 6, feeling your belly gently fall inward.\n\nThe key is making your exhale longer than your inhale. This is what activates the calming vagus nerve response. Start with 5 breaths and gradually work up to 5-10 minutes.\n\nIf lying flat is uncomfortable, try sitting upright or in a reclined position. The technique works in any position.',
        tips: [
          'Place one hand on your belly and feel it rise as you breathe in slowly through your nose for 4 counts.',
          'Make your exhale longer than your inhale — try 4 counts in, 6 counts out.',
          'Practice when you are already calm first. Once it becomes natural, use it during pain or anxiety.',
          'If counting feels stressful, just focus on making a slow, gentle exhale like blowing through a straw.',
        ],
      },
      {
        title: 'Box Breathing for Anxiety',
        body: 'Box breathing is used by military personnel and athletes to stay calm under pressure. It is structured and simple, which makes it excellent for anxious moments when your mind is racing.\n\nThe pattern: Breathe in for 4 counts. Hold for 4 counts. Breathe out for 4 counts. Hold for 4 counts. Repeat.\n\nVisualize drawing a box in your mind: up one side (inhale), across the top (hold), down the other side (exhale), across the bottom (hold). This visualization gives your anxious mind something to focus on besides worry.\n\nBox breathing is particularly helpful before medical procedures, during anxiety episodes, when you cannot sleep due to racing thoughts, or when waiting for test results. Start with 4 rounds and build up to 8-10 rounds.\n\nIf holding your breath feels uncomfortable, reduce the hold to 2 counts or skip it entirely and just do slow equal inhale-exhale counts.',
        tips: [
          'Use box breathing before procedures or appointments that make you nervous — start 5 minutes beforehand.',
          'If 4-count holds feel too long, start with 3 counts for each step and gradually increase.',
          'Try box breathing when you cannot fall asleep — the rhythm can quiet racing thoughts within 2-3 minutes.',
        ],
      },
      {
        title: 'Pursed Lip Breathing',
        body: 'If you experience breathlessness (dyspnea), pursed lip breathing is one of the most effective techniques available. It slows your breathing rate, keeps your airways open longer, and helps release trapped air from your lungs.\n\nHere is how: Breathe in through your nose for 2 counts. Pucker your lips as if you were going to whistle or blow out a candle. Exhale slowly through your pursed lips for 4-6 counts. The exhale should be gentle — imagine you are blowing on hot chai to cool it down.\n\nThis technique is especially useful during physical activity (walking, climbing stairs), when breathlessness comes on suddenly, and during episodes of anxiety-related breathing difficulty.\n\nPractice when you are breathing normally so that it becomes automatic when you need it. The goal is to make this your "go-to" response whenever breathing feels difficult.',
        tips: [
          'Practice the "cooling hot chai" exhale — slow, gentle, through pursed lips.',
          'Use pursed lip breathing during walking or any physical exertion to prevent breathlessness.',
          'If sudden breathlessness hits, lean forward slightly with hands on knees and do pursed lip breathing — this position opens up the chest.',
        ],
      },
      {
        title: 'Body Scan with Breath',
        body: 'This technique combines slow breathing with a progressive body scan, systematically relaxing each part of your body. It is especially good for pain management and sleep preparation.\n\nFind a comfortable position. Close your eyes if you wish. Begin breathing slowly using diaphragmatic breathing. Now, direct your attention to the top of your head. As you exhale, imagine releasing any tension there. Move down to your forehead, jaw (unclench it!), neck, and shoulders.\n\nContinue down through your arms, hands, chest, abdomen, hips, thighs, calves, and feet. Spend 2-3 breaths on each area. If you notice an area of pain or tension, do not fight it — simply breathe into that area and imagine the breath carrying warmth and softness to that spot.\n\nA full body scan takes about 10 minutes but even a shortened version (head, shoulders, abdomen, legs) in 5 minutes is beneficial. Many people find this is the most effective technique for falling asleep.',
        tips: [
          'Unclench your jaw right now — most people carry tension there without realising it.',
          'Try a body scan when getting into bed at night. Many people fall asleep before reaching their feet.',
          'If your mind wanders (it will!), gently bring it back to where you left off. Wandering is normal, not failure.',
          'You can find free guided body scan recordings online if having a voice guide you is helpful.',
        ],
      },
      {
        title: 'Building a Daily Practice',
        body: 'The benefits of breathing exercises multiply with regular practice. Even a few minutes daily builds your body\'s ability to shift into calm mode more quickly when you need it.\n\nAnchor your practice to existing habits. Try diaphragmatic breathing for 3 minutes after your morning chai, box breathing before lunch, or a body scan at bedtime. Linking new habits to existing ones makes them much more likely to stick.\n\nStart small — genuinely small. Three minutes once a day is far better than an ambitious 20-minute goal that you abandon after two days. You can always add more once the habit is established.\n\nKeep in mind that breathing exercises are skills. Like any skill, they feel more natural with practice. The first few times may feel awkward or forced. By the second week, your body begins to respond more quickly. By the third week, you may notice that you automatically shift to slow breathing when stressed.',
        tips: [
          'Pair breathing practice with something you already do daily: after morning chai, before lunch, or at bedtime.',
          'Start with just 3 minutes. Consistency matters more than duration.',
          'Use the PalliCare Breathe feature for guided sessions with timing and prompts.',
          'Track your sessions — even a simple checkmark on a calendar builds motivation.',
        ],
      },
    ],
    key_takeaways: [
      'Slow, deep breathing activates your vagus nerve, which switches your body from stress mode to calm mode.',
      'Diaphragmatic breathing (belly breathing with longer exhales) is the foundation — practise this first.',
      'Box breathing (4-4-4-4 pattern) is excellent for anxiety and racing thoughts.',
      'Pursed lip breathing helps with breathlessness — exhale like cooling hot chai.',
      'Body scan with breath is the most effective technique for pain and sleep.',
      'Start with 3 minutes daily anchored to an existing habit — consistency beats duration.',
    ],
  },
  {
    id: 'edu-5',
    title: 'Nutrition During Treatment',
    description: 'Practical guidance on eating well during treatment — from managing taste changes to Indian diet adaptations that maintain your strength and comfort.',
    category: 'Nutrition',
    duration: '7 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'Why Nutrition Changes',
        body: 'If eating feels different during your treatment, you are not imagining it. Your body is going through real changes that affect how food tastes, how hungry you feel, and how your digestive system works.\n\nMany medications alter taste perception — foods may taste metallic, bland, or unpleasantly different. This is caused by how certain drugs affect your taste buds and saliva. It is temporary and will improve when treatment changes or ends.\n\nAppetite loss is extremely common and has multiple causes: medications, pain, nausea, fatigue, and emotional distress can all suppress hunger signals. Your body\'s metabolic needs may also shift during illness, sometimes requiring more calories and protein than usual even as your appetite decreases.\n\nUnderstanding these changes helps you stop blaming yourself for "not eating enough." Your body is working hard, and your eating patterns naturally adapt. The goal is not to eat "normally" — it is to eat in a way that supports your comfort and energy.',
        tips: [
          'Do not force yourself to eat large meals. Your body is telling you something — listen to it and eat smaller portions more often.',
          'Changes in taste and appetite are side effects of treatment, not your fault.',
          'Focus on foods that appeal to you right now, even if they are not what you "usually" eat.',
        ],
      },
      {
        title: 'High-Calorie Small Meals',
        body: 'When appetite is low, every bite needs to count. The strategy is to make small portions as nutrient-dense and calorie-rich as possible.\n\nEnrich whatever you eat: add a spoon of ghee to dal or rice, use full-fat milk instead of water for porridge, add peanut butter or crushed nuts to rotis, or stir cream into soups. These small additions significantly boost the calorie content without increasing the volume of food.\n\nNutrient-dense snacks to keep handy: roasted makhana (fox nuts) with a pinch of salt, paneer cubes, handfuls of mixed dry fruits (almonds, cashews, raisins), cheese slices, and homemade energy balls (dates, nuts, and jaggery rolled together).\n\nTiming matters. Many people feel hungriest in the morning, so make breakfast your largest meal if that works for you. Eat before you take medications that suppress appetite. And keep snacks within arm\'s reach — when a wave of hunger comes, you want to act on it immediately.',
        tips: [
          'Add ghee, butter, or cream to whatever you are already eating to boost calories.',
          'Keep date-and-nut energy balls in the fridge for quick, calorie-dense snacks.',
          'Eat your biggest meal at the time of day when your appetite is best — for many people, this is morning.',
          'Keep small snacks by your bedside, sofa, and wherever you spend most time.',
        ],
      },
      {
        title: 'Hydration Strategies',
        body: 'Staying hydrated is one of the most important things you can do for your overall comfort. Dehydration worsens fatigue, constipation, confusion, and can affect how well your medications work.\n\nAim for small, frequent sips rather than trying to drink a full glass at once. Keep a water bottle with you at all times. If plain water does not appeal to you, try nimbu pani (lemon water), coconut water, diluted fruit juice, buttermilk (chaas), or herbal tea.\n\nOral rehydration solution (ORS) or homemade nimbu-namak-cheeni pani (lemon-salt-sugar water) is important if you have been vomiting or have diarrhea, as you lose electrolytes along with water.\n\nFoods with high water content also contribute to hydration: watermelon, cucumber, oranges, curd, soups, and dal are all good sources. Popsicles or frozen fruit bars can be soothing and hydrating, especially if you have a sore mouth.\n\nLimit caffeine (chai, coffee) to 2-3 cups per day as excess caffeine can worsen dehydration and interfere with sleep.',
        tips: [
          'Keep a water bottle visible wherever you sit — visual cues remind you to sip.',
          'Try coconut water or chaas (buttermilk) if plain water does not appeal to you.',
          'If you have been vomiting, sip ORS or nimbu-namak-cheeni pani to replace lost electrolytes.',
          'Count soups, dal, curd, and juicy fruits toward your daily fluid intake — they all count.',
        ],
      },
      {
        title: 'Managing Taste Changes',
        body: 'Taste changes (dysgeusia) are one of the most frustrating side effects because they affect the pleasure of eating — something that should bring comfort. Here are specific strategies for common taste problems.\n\nMetallic taste: Use plastic or wooden utensils instead of metal. Marinate food in lemon juice, vinegar, or tangy chutneys. Cold foods have less metallic taste than hot foods. Sucking on lemon drops or mint can refresh your palate.\n\nEverything tastes bland: Enhance flavour with strong spices (if tolerated) — ginger, garlic, cinnamon, cardamom, and cumin can compensate for reduced taste. Textured foods (crunchy, chewy) can provide satisfaction when flavour is missing.\n\nSweet things taste too sweet: Dilute sweet drinks. Add a squeeze of lemon to desserts. Try savoury snacks instead.\n\nFood aversions: It is completely normal to suddenly dislike foods you used to enjoy. Do not force them. Your tastes may shift back later. In the meantime, explore new foods without guilt.',
        tips: [
          'Switch to wooden or plastic spoons and forks if food tastes metallic.',
          'Cold or room-temperature foods often taste better than hot foods during taste changes.',
          'Rinse your mouth with baking soda water (1/4 teaspoon in a cup of water) before meals to neutralise metallic taste.',
          'Experiment with herbs and spices — sometimes bold flavours can break through taste changes.',
        ],
      },
      {
        title: 'Indian Diet Adaptations',
        body: 'Indian cuisine has many naturally healing foods that are well-suited to managing symptoms during treatment. You do not need special "medical food" — traditional comfort foods are often the best medicine.\n\nKhichdi (rice and moong dal) is the ideal recovery food: easy to digest, gentle on the stomach, and can be enriched with ghee, vegetables, and spices. It has been India\'s go-to healing food for centuries with good reason.\n\nCurd and lassi provide natural probiotics that support digestive health, especially important if you are taking antibiotics or experiencing digestive issues. Buttermilk (chaas) with roasted cumin, salt, and a pinch of hing (asafoetida) is excellent for digestion.\n\nRasam (South Indian pepper-tomato broth) is hydrating, warming, and the black pepper aids digestion. Dalia (broken wheat porridge) with milk is nutritious and easy to eat. Sabudana khichdi provides quick energy on low-appetite days.\n\nHaldi doodh (turmeric milk) before bed has mild anti-inflammatory properties and is soothing. Add a pinch of black pepper to improve turmeric absorption.',
        tips: [
          'Khichdi with extra ghee is the perfect healing food — easy to digest, nutritious, and comforting.',
          'Have a bowl of curd or a glass of chaas daily for gut-friendly probiotics.',
          'Haldi doodh (golden milk) with a pinch of pepper before bed is soothing and mildly anti-inflammatory.',
          'Ask family members to prepare traditional comfort foods from your childhood — emotional comfort aids healing.',
        ],
      },
      {
        title: 'Supplements and When to Ask',
        body: 'Supplements can help fill nutritional gaps, but they should complement your diet, not replace food. Always discuss supplements with your doctor before starting them.\n\nProtein supplements (protein powders mixed into milk or smoothies) can help when you cannot eat enough protein-rich foods. Your body needs protein for healing, maintaining muscle, and immune function. Ask your doctor or dietitian for recommendations suitable for your situation.\n\nVitamin D deficiency is common in India and can worsen fatigue and bone pain. A simple blood test can check your levels, and supplementation is safe and inexpensive if needed.\n\nIron and B12 supplements may be needed if blood tests show deficiency, which is common during treatment and can worsen fatigue.\n\nBe cautious with herbal supplements and alternative medicines. Some can interact with your medications — for example, certain Ayurvedic preparations can affect liver function or interact with chemotherapy. Always tell your palliative care doctor about ANY supplements or alternative medicines you are taking.',
        tips: [
          'Never start a supplement without telling your doctor — some interact with medications.',
          'Ask your doctor to check vitamin D and B12 levels — deficiencies are common and easily treated.',
          'If someone recommends an Ayurvedic or herbal remedy, check with your palliative care doctor first.',
          'A simple protein powder in milk or smoothies can boost intake when appetite is very low.',
        ],
      },
    ],
    key_takeaways: [
      'Taste changes and appetite loss are normal treatment side effects — not your fault.',
      'Small, calorie-dense meals are better than forcing large portions. Add ghee, cream, and nuts to boost calories.',
      'Stay hydrated with frequent small sips — coconut water, chaas, nimbu pani, and soups all count.',
      'Traditional Indian comfort foods (khichdi, curd, rasam, haldi doodh) are genuinely therapeutic.',
      'Always tell your doctor about any supplements or alternative medicines before starting them.',
    ],
  },
  {
    id: 'edu-6',
    title: 'Understanding Your Emotions',
    description: 'Explore the emotional landscape of living with illness — learn to identify, express, and care for your feelings with kindness.',
    category: 'Emotional Wellness',
    duration: '8 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'The Emotional Landscape of Illness',
        body: 'Living with a serious illness brings a storm of emotions — and every single one of them is valid. Fear about the future, sadness about what has changed, anger at the unfairness of it all, guilt about being a "burden," relief when symptoms ease, and even moments of unexpected joy. These can arrive one at a time or all at once.\n\nThink of your emotions as ocean waves. Some are gentle ripples; others feel like towering walls of water. But no wave lasts forever — even the most overwhelming feelings rise, peak, and eventually recede. Your job is not to stop the waves but to learn to stay afloat.\n\nMany patients feel pressure to be "brave" or "positive" all the time. But forcing yourself to suppress natural emotions is exhausting and can actually increase distress. Research in psycho-oncology consistently shows that acknowledging your feelings — even the difficult ones — is healthier than suppressing them.\n\nThere is no right or wrong way to feel. Whatever you are experiencing right now is a natural human response to an extraordinary situation.',
        tips: [
          'You do not need to be brave or positive all the time. Give yourself permission to feel whatever comes up.',
          'Remind yourself: "This feeling is a wave. It will rise, and it will pass."',
          'If someone says "stay strong," remember that feeling your emotions IS strength.',
        ],
      },
      {
        title: 'Identifying What You Are Feeling',
        body: 'Sometimes the hardest part is knowing exactly what you are feeling. "I feel bad" covers a lot of territory. Getting more specific helps — because different emotions need different responses.\n\nStart by noticing where you feel the emotion in your body. A tight chest and shallow breathing often signal anxiety. A heavy, sinking feeling in your stomach may be sadness. Clenched jaw and hot face often accompany anger. A hollow, empty feeling in your chest may be grief.\n\nAn emotion wheel can help you go beyond basic labels. Start at the centre: are you feeling "bad" or "good"? If bad, is it more angry, sad, scared, or disgusted? If scared, is it worried, anxious, helpless, or panicked? Each layer gets more specific and more useful.\n\nNaming your emotion — even just to yourself — has a real neurological effect. Brain imaging studies show that putting a name to a feeling reduces activity in the amygdala (your brain\'s alarm centre). Psychologists call this "name it to tame it."',
        tips: [
          'Try the body check: close your eyes and scan from head to toe. Where do you feel tightness, heaviness, or warmth? That is your emotion showing up physically.',
          'Practice naming your feelings specifically: instead of "I feel bad," try "I feel worried about tomorrow\'s appointment."',
          'Share your feelings with one trusted person today — even a simple "I feel scared about..." is enough.',
        ],
      },
      {
        title: 'The "Second Arrow"',
        body: 'There is a teaching from Buddhist psychology about the "two arrows." The first arrow is the pain or difficulty you face — the illness, the symptoms, the losses. You did not choose this, and you cannot always avoid it.\n\nThe second arrow is the one we shoot at ourselves: "Why am I so weak?", "I should be handling this better", "I am being such a burden to everyone", "Other people manage, why can\'t I?" This second arrow — the self-judgment about our suffering — often hurts more than the first.\n\nResistance amplifies distress. When you fight against a difficult feeling ("I should not feel this way"), you add frustration and shame on top of the original pain. When you allow the feeling to exist without judgment ("I am feeling afraid, and that makes sense given what I am going through"), the emotion often softens naturally.\n\nThis does not mean you enjoy the pain or give up. It means you stop punishing yourself for having a natural human response. You are already dealing with enough — you do not need to add self-criticism on top.',
        tips: [
          'When you catch yourself in self-criticism, pause and ask: "Am I shooting a second arrow at myself?"',
          'Replace "I should not feel this way" with "It makes sense that I feel this way given what I am going through."',
          'Self-compassion is not weakness — it is the same kindness you would offer a dear friend in your situation.',
        ],
      },
      {
        title: 'Healthy Expression',
        body: 'Emotions need an outlet. Bottling them up does not make them disappear — it usually makes them emerge in less helpful ways, like irritability, physical tension, or withdrawal from loved ones.\n\nJournaling is one of the most researched emotional coping tools. You do not need to write beautifully or even in complete sentences. Just putting pen to paper (or fingers to phone) for 10-15 minutes about what you are feeling can provide significant relief. Research by psychologist James Pennebaker shows that expressive writing improves immune function and reduces distress.\n\nTalking to a trusted person — whether a family member, friend, counselor, or fellow patient — provides connection and validation. Sometimes you do not need advice; you just need someone to listen and say, "That sounds really hard."\n\nCreative outlets provide a different kind of expression. Drawing, singing, listening to music, gardening, cooking, or any activity where you lose yourself can process emotions that words cannot capture. There is no "talent" required — the process is what heals, not the product.',
        tips: [
          'Try writing for just 10 minutes about how you are feeling right now. Do not edit or judge — just write.',
          'When talking to someone, it is okay to say "I just need you to listen, I do not need advice right now."',
          'Listen to a song that matches your mood — music validates emotions in a way that words sometimes cannot.',
          'If writing feels hard, try voice recording your thoughts on your phone. Just talking out loud helps.',
        ],
      },
      {
        title: 'Emotional First Aid',
        body: 'When emotions become overwhelming — a panic attack, uncontrollable crying, or intense despair — you need immediate tools to stabilise yourself. Think of these as emotional first aid.\n\nThe 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This anchors you in the present moment and interrupts the emotional spiral.\n\nSelf-compassion phrases can soothe your nervous system. Place your hand on your heart and say quietly: "This is a moment of suffering. Suffering is part of being human. May I be kind to myself in this moment." These are not empty words — physical touch combined with kind words activates the same neurological pathways as being comforted by another person.\n\nCold water on your wrists or face activates the mammalian dive reflex, which automatically slows your heart rate and calms your nervous system. Holding ice cubes can serve a similar function during intense distress.\n\nRemember: these are tools for the moment. If intense distress is frequent or lasting, please ask your care team about counseling support.',
        tips: [
          'Practice the 5-4-3-2-1 grounding technique right now so it is familiar when you need it.',
          'Place your hand on your heart and say: "This is hard, and I am doing my best." Feel the warmth of your hand.',
          'Splash cold water on your face or hold ice cubes to quickly calm an overwhelmed nervous system.',
          'Keep a "comfort box" with items that soothe you: a favourite photo, a soft cloth, essential oil, a smooth stone.',
        ],
      },
      {
        title: 'When Professional Support Helps',
        body: 'There is a difference between normal emotional responses to illness and clinical depression or anxiety that needs professional treatment. Both are valid, but the second benefits from additional support.\n\nConsider seeking professional help if: you feel persistently hopeless for more than two weeks (not just bad days, but a constant weight), you have lost interest in everything and everyone, you have thoughts of harming yourself, you cannot sleep or you sleep all day, anxiety is so severe it prevents you from doing basic activities, or you are relying on alcohol or other substances to cope.\n\nProfessional support does not mean you are weak or "crazy." A psychologist or counselor trained in illness-related distress can provide specific tools (like cognitive behavioral therapy or acceptance and commitment therapy) that genuinely reduce suffering.\n\nYour palliative care team at AIIMS can refer you. You can simply say: "I think I might benefit from talking to someone about how I am feeling." That is all it takes.',
        tips: [
          'Feeling sad is normal. Feeling hopeless for more than two weeks may be depression — and depression is treatable.',
          'Ask your palliative care team: "Can you refer me to someone I can talk to about my feelings?" It is that simple.',
          'Professional support is a sign of self-awareness, not weakness.',
          'If you have thoughts of self-harm, tell your care team immediately — they will help without judgment.',
        ],
      },
    ],
    key_takeaways: [
      'Every emotion you feel is valid — there is no "right way" to feel during illness.',
      'Naming your emotions specifically ("I feel anxious about..." vs "I feel bad") reduces their intensity.',
      'The "second arrow" (self-judgment about your feelings) often hurts more than the original pain — practice self-compassion.',
      'Journaling, talking to a trusted person, or creative expression all provide healthy emotional outlets.',
      'The 5-4-3-2-1 grounding technique is your emotional first aid for overwhelming moments.',
      'Persistent hopelessness, loss of interest, or thoughts of self-harm deserve professional support — ask your team.',
    ],
  },
  {
    id: 'edu-7',
    title: 'Living with Uncertainty',
    description: 'Learn to navigate the unknown with practical strategies for worry management, finding meaning, and cultivating realistic hope.',
    category: 'Emotional Wellness',
    duration: '7 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'The Challenge of Not Knowing',
        body: 'Uncertainty is one of the hardest aspects of living with a serious illness. Not knowing what tomorrow holds, what test results will show, or how your body will feel next week creates a unique kind of stress.\n\nHumans are wired to predict and plan — it is how our ancestors survived. When the future becomes unpredictable, your brain goes into overdrive trying to "figure it out," leading to rumination, anxiety, and exhaustion. This is called intolerance of uncertainty, and it is a completely normal response.\n\nThe truth is, uncertainty was always part of life — illness simply makes it impossible to ignore. Nobody, healthy or ill, truly knows what tomorrow brings. The difference is that illness strips away the comfortable illusion of control.\n\nAcknowledging uncertainty — rather than fighting it — is the first step. You do not need to like it or accept it cheerfully. Simply saying "I do not know what will happen, and that is frightening" is more honest and less exhausting than pretending you have it all figured out.',
        tips: [
          'When worry about the future spirals, try saying: "I do not know what will happen, and that is okay for right now."',
          'Uncertainty is exhausting for everyone — you are not weak for finding it difficult.',
          'Notice when your mind is trying to "solve" the future. Gently remind yourself: "I only need to handle today."',
        ],
      },
      {
        title: 'What You Can Control',
        body: 'While you cannot control the course of your illness, there is much you can influence. Focusing on what is within your reach reduces helplessness and builds a sense of agency.\n\nThe "circle of control" exercise: Draw two circles, one inside the other. In the inner circle, write things you can control — your daily routine, how you spend your time, who you talk to, what you eat, how you respond to your thoughts, seeking comfort measures. In the outer circle, write things you cannot control — test results, other people\'s reactions, the future, your diagnosis.\n\nWhen anxiety rises, check: am I worrying about something in my inner circle or outer circle? If it is in the inner circle, take one small action. If it is in the outer circle, practice letting go — not because it does not matter, but because holding onto it only adds to your suffering.\n\nDaily routines provide powerful anchoring. A morning ritual (chai, reading, prayer), regular mealtimes, an afternoon activity, and a bedtime routine create a framework of predictability within an unpredictable situation.',
        tips: [
          'Each morning, choose one thing in your control to focus on. It can be as simple as "I will sit in the garden for 20 minutes."',
          'When worry hits, ask yourself: "Is this something I can actually do something about right now?"',
          'Routines are your anchor. Even a simple routine of chai, prayer, and a short walk creates stability.',
        ],
      },
      {
        title: 'Finding Meaning Day by Day',
        body: 'Viktor Frankl, a psychiatrist who survived the concentration camps, wrote that humans can endure almost anything if they find meaning in it. His approach, called logotherapy, suggests that meaning can be found in three ways: through what you give to the world (creating, helping), through what you receive from the world (love, beauty, humour), and through the stand you take toward unavoidable suffering.\n\nYou do not need a grand purpose. Meaning exists in small moments: teaching your grandchild to make chai, telling a family story, noticing the colour of the sky at dusk, being present with a loved one, or choosing kindness despite your pain.\n\nSome patients find that illness clarifies what truly matters. Relationships that felt routine become precious. Small pleasures that were overlooked become deeply satisfying. This shift in perspective — while not chosen — can bring an unexpected richness to your days.\n\nMeaning is not about being happy all the time. It is about feeling that your life matters, that your presence has value, and that your days have purpose — however small that purpose may seem.',
        tips: [
          'Ask yourself each evening: "What was one meaningful moment today?" It can be tiny — a warm cup of chai, a smile from a grandchild.',
          'Share a story, a recipe, or a piece of wisdom with someone younger. Your experience has value.',
          'Meaning is not about big achievements. Being present, being kind, and being loved are profoundly meaningful.',
        ],
      },
      {
        title: 'Hope Without Denial',
        body: 'Hope and honesty can coexist. You do not need to deny reality to maintain hope, and acknowledging difficulties does not make you hopeless.\n\nRealistic hope means shifting from "I hope everything will be fine" to more specific, attainable hopes: "I hope to be comfortable today," "I hope to see my granddaughter\'s birthday," "I hope to have a good conversation with my son," "I hope for a peaceful night\'s sleep."\n\nThis is sometimes called "hoping for the best while preparing wisely." You can hope for good outcomes while also making practical plans. These are not contradictions — they are acts of wisdom and love.\n\nHope can also evolve over time. What you hope for today may be different from what you hoped for six months ago, and that is okay. Hope is not static; it adapts to your reality while still reaching toward something good.',
        tips: [
          'Redefine your hopes to be specific and achievable: "I hope to enjoy lunch with my family today."',
          'Hope and honesty are not opposites. You can hope for the best while also preparing practically.',
          'Share your hopes with your family — they may be hoping for the same things without knowing how to say it.',
        ],
      },
      {
        title: 'Mindful Present-Moment Living',
        body: 'Worry is always about the future. Regret is always about the past. The present moment — this one, right now — is the only place where life actually happens.\n\nMindfulness does not mean emptying your mind or achieving some special state. It simply means noticing what is happening right now: the warmth of tea in your hands, the sound of birds outside, the texture of your blanket, the face of someone you love. When you are fully present, worry cannot exist simultaneously.\n\nThe "worry time" technique is practical for managing anxious thoughts. Set aside 15 minutes at a specific time each day (not before bed) as your "worry time." During the rest of the day, when worries arise, write them on a list and tell yourself: "I will think about this during worry time." When worry time arrives, review the list. You will often find that many worries have resolved themselves or seem less urgent.\n\nThis is not about ignoring real concerns. It is about choosing when to engage with worry rather than letting it ambush you throughout the day.',
        tips: [
          'Right now, notice 3 things: one you can see, one you can hear, one you can feel. You are in the present moment.',
          'Try "worry time": set 15 minutes at 3 PM to worry. At all other times, write worries down and postpone them.',
          'When your mind races to the future, gently say: "That is for later. Right now, I am here."',
          'Practice eating one meal mindfully today — notice the colours, textures, flavours, and warmth.',
        ],
      },
    ],
    key_takeaways: [
      'Uncertainty is exhausting because your brain is wired to predict and plan — finding it hard is normal, not weak.',
      'Focus on your "circle of control" — daily routines, relationships, comfort choices, how you spend your time.',
      'Meaning exists in small moments — a conversation, a cup of chai, a shared memory.',
      'Realistic hope shifts from vague ("everything will be fine") to specific and achievable ("I hope to enjoy today").',
      'The "worry time" technique (15 minutes of scheduled worry) prevents anxiety from hijacking your whole day.',
    ],
  },
  {
    id: 'edu-8',
    title: 'Peaceful Sleep',
    description: 'Understand why sleep changes during illness and learn practical techniques — from relaxation routines to pain positioning — for better rest.',
    category: 'Wellness',
    duration: '6 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'Why Sleep Changes During Illness',
        body: 'If you are struggling with sleep, you are not alone. Sleep disturbances affect up to 70% of palliative care patients, and understanding why helps you find the right solutions.\n\nPain is the most common sleep disruptor. It may prevent you from falling asleep, wake you during the night, or make it hard to find a comfortable position. Even mild pain that you manage during the day can feel amplified in the quiet darkness of night.\n\nMedications can affect sleep in both directions — some cause drowsiness during the day (shifting your sleep cycle), while others (especially steroids like dexamethasone) can cause insomnia. If you notice sleep changes after starting a new medication, tell your doctor.\n\nAnxiety and racing thoughts are the invisible sleep thieves. When the world goes quiet at night, worries that you managed during the day can rush in. Your cortisol (stress hormone) levels naturally dip at night, but anxiety can keep them elevated, preventing the relaxation needed for sleep.',
        tips: [
          'If pain is keeping you awake, talk to your doctor about timing your pain medication so it peaks at bedtime.',
          'Steroids (dexamethasone) can cause insomnia — ask your doctor about taking them in the morning instead of evening.',
          'Keep a notepad by your bed to write down worries. Getting them out of your head and onto paper can free your mind for sleep.',
        ],
      },
      {
        title: 'Sleep Hygiene Basics',
        body: 'Sleep hygiene refers to habits and environmental factors that promote good sleep. Small changes in your routine can make a big difference.\n\nYour bedroom should be cool, dark, and quiet. Use curtains or an eye mask to block light. If noise is an issue, a fan or soft background sounds can help. The ideal room temperature for sleep is slightly cool — around 20-22°C.\n\nA consistent wake time is more important than a consistent bedtime. Try to wake at the same time every day, even on weekends. This anchors your body clock. If you nap during the day, keep naps short (20-30 minutes) and before 3 PM.\n\nThe hour before bed is your "wind-down" period. Reduce screen brightness or avoid screens entirely — the blue light from phones and TVs suppresses melatonin (your sleep hormone). Instead, try gentle music, reading, prayer, or a warm drink (caffeine-free).\n\nAvoid heavy meals close to bedtime, but a small snack (warm milk, a few biscuits) can help if hunger wakes you at night.',
        tips: [
          'Set a consistent wake-up alarm — even if you had a bad night, a regular wake time trains your body clock.',
          'Make your room as dark as possible. Even small lights from phones or electronics can disrupt sleep.',
          'Stop using your phone 1 hour before bed. If you use it for relaxation, switch to "night mode" and dim the screen.',
          'A cup of warm milk or chamomile tea 30 minutes before bed can signal your body that sleep is coming.',
        ],
      },
      {
        title: 'Relaxation Techniques for Bedtime',
        body: 'Active relaxation techniques help bridge the gap between wakefulness and sleep. Unlike simply "trying to relax" (which often backfires), these techniques give your mind and body specific instructions.\n\nProgressive muscle relaxation: Starting at your toes, gently tense each muscle group for 5 seconds, then release for 10 seconds. Move up through your calves, thighs, abdomen, chest, arms, and face. The contrast between tension and release teaches your body what "relaxed" feels like. Many people fall asleep before reaching their face.\n\nYoga nidra (yogic sleep) is an ancient Indian practice that is essentially a guided body scan done in a lying position. You remain aware but deeply relaxed — in the space between waking and sleeping. Even 15 minutes of yoga nidra can feel as restful as an hour of sleep.\n\nGuided imagery: Imagine a place where you feel completely safe and comfortable — perhaps a childhood home, a favourite garden, or a quiet riverside. Build the scene in rich detail: what do you see, hear, smell, and feel? Immersing yourself in this "safe place" activates the same relaxation pathways as actually being there.',
        tips: [
          'Try progressive muscle relaxation tonight — start at your toes and work upward. Do not worry if you fall asleep before finishing.',
          'Search for "yoga nidra" on YouTube for free guided sessions in Hindi or English.',
          'Create your "safe place" image during the daytime first. The more detail you add, the more effective it becomes at bedtime.',
        ],
      },
      {
        title: 'Managing Nighttime Pain',
        body: 'Nighttime pain requires specific strategies beyond what works during the day. The goal is to minimise pain disruption so your body can get the rest it needs to heal.\n\nPillow positioning can reduce pressure on painful areas. For back pain, try a pillow under your knees when lying on your back or between your knees when on your side. For abdominal discomfort, a slightly elevated position (using an extra pillow or a wedge) can help. Experiment to find what works for your specific pain.\n\nTiming your pain medication is crucial. Talk to your doctor about scheduling a dose 30-45 minutes before your planned bedtime, so it peaks when you are trying to fall asleep. If you typically wake at 3 AM with pain, your doctor may adjust the medication schedule to provide coverage during those vulnerable hours.\n\nHeat therapy (a warm water bottle wrapped in a cloth, a heated wheat bag, or a warm bath before bed) can relax muscles and soothe aching. Cold therapy (an ice pack wrapped in a towel) is better for sharp or inflammatory pain. Try both to see which works for you.\n\nGentle stretching or range-of-motion exercises before bed can release muscle tension that builds during the day.',
        tips: [
          'Experiment with pillow placement: under knees, between knees, or behind your back to find your most comfortable position.',
          'Ask your doctor to time your pain medication so it peaks at your bedtime.',
          'A warm water bottle on sore areas 15 minutes before bed can soothe muscles and prepare your body for sleep.',
          'If you wake with pain at night, take your breakthrough dose and do 5 minutes of slow breathing while waiting for it to work.',
        ],
      },
      {
        title: 'When Sleep Aids Are Needed',
        body: 'Sometimes, despite good sleep hygiene and relaxation techniques, you may need medication to help you sleep. This is not a failure — it is a practical response to a real problem.\n\nMelatonin is a natural hormone that regulates your sleep-wake cycle. Low-dose melatonin (0.5-3mg) taken 1-2 hours before bedtime can help if your body clock is disrupted. It is available without a prescription and has few side effects.\n\nPrescription sleep aids may be recommended by your doctor for persistent insomnia. These include medications like zolpidem, low-dose amitriptyline (which also helps with pain), or specific benzodiazepines. Your doctor will choose the safest option considering your other medications.\n\nIt is important to discuss dependency awareness with your doctor. Some sleep medications are best used short-term while other strategies (relaxation, sleep hygiene) take effect. Others are safe for longer use. Your doctor will guide you on this.\n\nRemember: getting restorative sleep is essential for managing pain, maintaining mood, and preserving quality of life. If you need a sleep aid to achieve this, it is a legitimate and important part of your care.',
        tips: [
          'If sleep problems persist for more than 2 weeks despite trying other strategies, ask your doctor about sleep aids.',
          'Take melatonin 1-2 hours before your planned bedtime, not right when you get into bed.',
          'Tell your doctor about ALL sleep strategies you have tried — this helps them choose the right medication.',
          'Sleep is essential for healing. Needing help with sleep is not weakness — it is smart self-care.',
        ],
      },
    ],
    key_takeaways: [
      'Sleep problems affect up to 70% of palliative care patients — you are not alone, and solutions exist.',
      'A consistent wake time, cool dark room, and a screen-free wind-down hour are your sleep hygiene foundations.',
      'Progressive muscle relaxation and yoga nidra are powerful bedtime techniques — many people fall asleep during practice.',
      'Time your pain medication to peak at bedtime and use pillow positioning to minimise overnight discomfort.',
      'Sleep aids (melatonin or prescription) are legitimate tools when other strategies are not enough.',
    ],
  },
  {
    id: 'edu-9',
    title: 'Dignity and Legacy',
    description: 'Explore ways to preserve your sense of self, share your life story, and create meaningful connections that endure beyond your presence.',
    category: 'Life & Meaning',
    duration: '8 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'What Is Dignity Therapy',
        body: 'Dignity therapy was developed by Dr. Harvey Chochinov, a Canadian psychiatrist who spent decades studying what matters most to people facing serious illness. His research found that dignity — feeling valued, respected, and that your life has meaning — is central to quality of life.\n\nDignity is not something that illness can take away. It is not about what you can or cannot do physically. It lives in your identity, your relationships, your values, and your story. Even when your body changes, your essential self — the person you are — remains.\n\nDignity therapy involves creating a "generativity document" — a recorded conversation (or written document) about the things that matter most to you: your proudest moments, your deepest values, the lessons you have learned, and the words you want to share with those you love.\n\nStudies show that dignity therapy reduces depression, increases sense of purpose, and is deeply valued by both patients and their families. Many families treasure the generativity document as one of their most precious possessions.',
        tips: [
          'Dignity is not about what you can do — it is about who you are. Illness cannot erase your identity.',
          'Consider asking your care team if dignity therapy is available. Even a simplified version can be deeply meaningful.',
          'You do not need to create a perfect document. Even a simple letter, a voice note, or a conversation can carry your legacy.',
        ],
      },
      {
        title: 'Your Life Story Matters',
        body: 'Every person carries a unique story — decades of experiences, relationships, challenges overcome, wisdom gained, and love given. Your story matters, and sharing it is one of the most generous gifts you can offer.\n\nA generativity document is built around simple but powerful questions: What are you most proud of? What have you learned about life that you want to pass on? What are your most important memories? What do you want your family to know and remember? What advice would you give to your children, grandchildren, or loved ones?\n\nYou can create this in whatever way feels right. Write it by hand, type it, record it as a voice message, or have someone interview you and write it down. There is no wrong format. Some people create it in one sitting; others add to it over weeks.\n\nSharing your story is not just for your family — it is for you too. Research shows that reflecting on your life narrative helps integrate your experiences, find patterns of meaning, and feel a sense of completeness.',
        tips: [
          'Start with one question: "What is the moment in my life I am most proud of?" Let the story flow from there.',
          'You can record a voice message on your phone — it captures not just your words but your voice, which loved ones treasure.',
          'Ask a family member to sit with you and ask questions. Sometimes having a listener makes it easier to share.',
        ],
      },
      {
        title: 'Legacy Projects',
        body: 'Legacy projects are tangible ways to leave a piece of yourself for those you love. They do not need to be elaborate — simple and heartfelt is often the most powerful.\n\nLetters for milestones: Write letters to loved ones for future occasions — a grandchild\'s wedding, a daughter\'s 50th birthday, the birth of a baby you may not meet. These letters become treasures that carry your presence into the future.\n\nRecipe collection: If cooking is part of your identity, write down your special recipes with personal notes — "This was your grandfather\'s favourite," "Add extra cardamom the way your mother likes it." Include measurements, tips, and the stories behind each dish.\n\nPhoto album with stories: Go through old photos and write or record the stories behind them. Who is in the photo? What was happening that day? What do you remember about that time? Without your narration, these stories could be lost.\n\nVoice or video recordings: Record yourself telling family stories, singing a favourite song, reading a children\'s book for grandchildren, or simply saying what you want your family to know. Your voice is uniquely yours.\n\nHand-written notes: Even a simple "I love you and I am proud of you" in your handwriting becomes a priceless keepsake.',
        tips: [
          'Write one letter this week — to any loved one, for any occasion. It does not need to be perfect.',
          'Ask a family member to video you telling your favourite family story. These recordings become family treasures.',
          'Write down your signature recipes with personal notes and the stories behind them.',
          'A handwritten "I love you" note tucked into a book or drawer will be found and cherished.',
        ],
      },
      {
        title: 'Values and Wishes',
        body: 'Advance care planning is not about giving up — it is about taking control. By clearly communicating your values and wishes, you ensure that your care reflects who you are, even when you cannot speak for yourself.\n\nStart with your values rather than specific medical decisions. What matters most to you? Being alert and able to communicate? Being at home? Being comfortable? Being surrounded by family? Having spiritual rituals observed? These values help your family and doctors make decisions that align with who you are.\n\nDesignate a decision-maker — someone you trust to speak for you if you cannot speak for yourself. This should be someone who knows your values, can handle difficult decisions under pressure, and will advocate for your wishes even when others disagree.\n\nHave the conversation with your family. This is often the hardest step, but it is an act of love. You are relieving them of the impossible burden of guessing what you would want. Families who have had these conversations report less guilt, less conflict, and more peace afterward.',
        tips: [
          'Start the advance care planning conversation with values, not medical details: "What matters most to me is..."',
          'Choose a decision-maker and tell them — and your doctor — who it is.',
          'Having this conversation is an act of love. You are protecting your family from having to guess.',
          'Write your wishes down or tell your palliative care team so they are documented in your medical record.',
        ],
      },
      {
        title: 'Finding Purpose Now',
        body: 'Purpose does not require productivity. In a culture that often equates worth with what you "do," illness can feel like it erases your purpose. But purpose is about being, not just doing.\n\nAsk yourself: What do I still want to say? What do I still want to share? What do I still want to experience? What relationships do I want to deepen? These questions can reveal meaningful activities that are within your reach.\n\nDaily purpose activities might include: mentoring a younger family member, helping a grandchild with homework, offering prayer for others, listening to a friend who is struggling, maintaining a garden or caring for a plant, contributing to family decisions, or simply being a loving presence.\n\nYour presence itself has value. Being in the room while your family gathers, holding a grandchild\'s hand, or being the person everyone comes home to — these are not small things. Research on patient dignity consistently shows that "being present" is one of the most valued contributions patients feel they make.',
        tips: [
          'Ask yourself: "What is one thing I can offer today — a story, a prayer, a smile, a piece of advice?"',
          'Your presence IS your purpose. Being someone people come to, confide in, and love is profoundly meaningful.',
          'Choose one small daily purpose: watering a plant, calling a relative, or reading to a grandchild.',
        ],
      },
    ],
    key_takeaways: [
      'Dignity lives in your identity, values, and relationships — illness cannot erase who you are.',
      'Creating a generativity document (your life story, values, and wishes) reduces depression and gives lasting meaning.',
      'Legacy projects — letters, recipes, recordings, photos with stories — carry your presence into the future.',
      'Advance care planning is an act of love that protects your family from having to guess your wishes.',
      'Purpose does not require productivity. Your presence, your love, and your wisdom are deeply meaningful.',
    ],
  },
  {
    id: 'edu-10',
    title: 'Understanding Grief Before Loss',
    description: 'Learn about anticipatory grief — the grieving that happens before loss — and find ways to navigate it with compassion for yourself and your family.',
    category: 'Emotional Wellness',
    duration: '7 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'What Is Anticipatory Grief',
        body: 'Anticipatory grief is the grief you experience before a loss has fully occurred. It is grief for what has already changed, what is changing now, and what you fear will change in the future.\n\nYou may be grieving the loss of your health, your independence, your roles (as provider, caretaker, active grandparent), your future plans, and the time you hoped to have. This grief is real, it is valid, and it is not premature or inappropriate — it is a natural response to real losses.\n\nAnticipatory grief is different from the grief that comes after loss. It exists in an ongoing present where loss and life coexist. You might grieve in the morning and laugh in the afternoon. You might cry about the future and then fully enjoy the present moment. This back-and-forth is normal and healthy.\n\nThe stages of grief (denial, anger, bargaining, depression, acceptance) that Kubler-Ross described are not a linear ladder you climb. They are more like waves that come and go, sometimes several in a single day. You may never experience some stages, and you may revisit others repeatedly. All of this is normal.',
        tips: [
          'Anticipatory grief is real grief. You do not need to wait for a loss to "qualify" for grieving.',
          'Crying about the future and laughing in the present are both normal — they are not contradictions.',
          'There is no correct order or timeline for grief. Let it unfold as it needs to.',
        ],
      },
      {
        title: 'Grieving Your Former Self',
        body: 'One of the deepest griefs in illness is the loss of who you used to be. The person who could walk for hours, work a full day, cook elaborate meals, or play with grandchildren without tiring. This is a real loss, and it deserves acknowledgment.\n\nIdentity reconstruction is a natural process of adjusting your sense of self. You are not less — you are different. The core of who you are (your values, your love, your wisdom, your humour) has not changed. But the ways you express these things may need to adapt.\n\nSomeone who expressed love through cooking may now express it by directing a family member in the kitchen, sharing recipes, or simply being present while food is prepared. Someone who was the "strong one" in the family may discover that allowing others to care for them is itself an act of courage and trust.\n\nAllow yourself to grieve the person you were while also getting to know the person you are becoming. They are both you.',
        tips: [
          'Write a letter to your "former self" — acknowledge who you were and what you could do. Then write about who you are now and what you still bring to the world.',
          'Adapt, do not abandon. If you cannot cook, teach. If you cannot walk far, sit in the garden. Your essence remains.',
          'Ask yourself: "What qualities do I still have that I am proud of?" You may be surprised at how many there are.',
        ],
      },
      {
        title: 'Dual Process Model',
        body: 'The Dual Process Model, developed by grief researchers Stroebe and Schut, describes how people naturally oscillate between two modes when dealing with loss.\n\nLoss-focused coping is when you confront the grief directly — crying, talking about your feelings, processing what has changed or what you fear losing. This is the "grief work" that most people associate with mourning.\n\nRestoration-focused coping is when you attend to ongoing life — enjoying a meal, watching a favourite programme, laughing at a joke, planning a family outing, or simply having a normal day. This is not avoidance; it is a necessary counterbalance to grief.\n\nHealthy grieving involves moving back and forth between these two modes. A day of deep sadness followed by a day of relative normalcy is not inconsistent — it is how human beings naturally process loss. If you spent every moment in loss-focused coping, you would be overwhelmed. If you spent every moment in restoration-focused coping, you would be avoiding important emotional work.\n\nGive yourself permission to do both. Cry when you need to cry. Laugh when something is funny. Neither one diminishes the other.',
        tips: [
          'Both crying and laughing are healthy parts of grieving. You do not need to feel guilty about moments of joy.',
          'If you have been in "loss mode" for days, give yourself permission to watch a comedy, call a friend, or enjoy a treat.',
          'If you have been avoiding grief by staying constantly busy, set aside quiet time to let feelings surface.',
        ],
      },
      {
        title: 'Supporting Your Family\'s Grief',
        body: 'Your family is also experiencing anticipatory grief, and their grief process may look very different from yours. Understanding this can prevent misunderstandings and deepen connection.\n\nSome family members may withdraw — not because they do not care, but because they are overwhelmed and do not know how to express their feelings. Others may become hyperactive, constantly doing things, because staying busy keeps the grief at bay. Some may seem "in denial" — carrying on as if nothing is wrong — because they are not ready to face the reality yet.\n\nIn Indian families, there is often a culture of "protective silence" — family members hide their distress from the patient, and the patient hides their distress from the family. While well-intentioned, this mutual pretense can leave everyone feeling alone.\n\nConsider having open conversations. This does not mean dwelling on sadness — it means giving each other permission to be honest. "I know we are both scared, and that is okay. We do not have to pretend to be fine." This kind of honesty can bring tremendous relief and closeness.',
        tips: [
          'Remember that your family grieves differently. Their way is not wrong — it is just different from yours.',
          'Break the "protective silence" with a simple statement: "I know this is hard for all of us. It is okay to talk about it."',
          'Give family members permission to feel their feelings. Saying "It is okay to be sad" can be incredibly freeing for them.',
          'Consider a family meeting with your palliative care social worker to help everyone communicate openly.',
        ],
      },
      {
        title: 'Rituals of Connection',
        body: 'Creating rituals and traditions during this time can provide comfort, meaning, and lasting memories for your family. Rituals do not need to be elaborate — simple, repeated acts of love carry tremendous power.\n\nGratitude practice: Each evening, share one thing you are grateful for with a family member. This simple ritual shifts attention from what is being lost to what is still present. Over time, it creates a collection of appreciated moments.\n\nMemory-making: Intentionally create new memories. This might be a weekly family dinner, a monthly outing, watching a favourite programme together every Sunday, or a daily evening chai together. These become touchstones that your family will carry forward.\n\nLegacy rituals: Teach a grandchild something that is uniquely yours — a card game, a song, a way of folding rotis, a bedtime story you were told as a child. These small transmissions of tradition are how families carry their elders forward through generations.\n\nReligious and spiritual rituals: If faith is important to you, shared prayer, temple visits, or scriptural reading can provide comfort and connection. These shared spiritual moments often become some of the most treasured memories.',
        tips: [
          'Start a gratitude ritual: each evening, share one thing you appreciated about the day with someone you love.',
          'Create one "family tradition" — Sunday chai together, a weekly card game, or a shared prayer — that can continue.',
          'Teach a grandchild something only you know — your special recipe, a song, a game from your childhood.',
          'Take photos. Not just on special occasions — photograph ordinary moments. These become the most treasured.',
        ],
      },
    ],
    key_takeaways: [
      'Anticipatory grief — grieving losses before, during, and ahead — is real, valid, and completely normal.',
      'Grieving your former self is one of the deepest parts of illness. You are not less — you are adapting.',
      'The Dual Process Model says healthy grieving naturally oscillates between sadness and normal life. Both are needed.',
      'Your family grieves too, often in silence. Breaking the "protective silence" can bring relief and closeness.',
      'Simple rituals — gratitude sharing, family traditions, teaching grandchildren — create lasting bonds and meaning.',
    ],
  },
  {
    id: 'edu-11',
    title: 'Pain and Your Mind',
    description: 'Discover the powerful connection between your thoughts and pain perception, and learn mind-based techniques that can genuinely reduce your discomfort.',
    category: 'Pain Management',
    duration: '7 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'The Mind-Body Pain Connection',
        body: 'Pain is not just about what is happening in your body — it is about how your brain interprets those signals. The neuromatrix theory of pain explains that your brain creates the experience of pain by combining physical signals with your thoughts, emotions, memories, and expectations.\n\nThis is not saying your pain is "in your head" or imaginary. It is absolutely real. But it does mean that your mental state genuinely influences how much pain you feel. When you are anxious, your brain amplifies pain signals. When you are calm, absorbed in something enjoyable, or feeling safe, those same signals are turned down.\n\nThink of it like a volume dial. The physical signal stays the same, but your brain can turn the volume up or down based on context. Soldiers in battle often do not feel severe injuries until the danger passes. People engrossed in a gripping film barely notice a headache. This is not willpower — it is neuroscience.\n\nThis understanding is empowering. It means you have tools — mental and emotional — that can work alongside your medication to reduce pain.',
        tips: [
          'Your pain is real AND your mind can influence it. These are not contradictions.',
          'Notice how your pain changes with your mood: worse when anxious, better when distracted. This is the mind-body connection in action.',
          'Mind-based techniques are not replacements for medication — they are partners that make medication work better.',
        ],
      },
      {
        title: 'Pain Catastrophizing',
        body: 'Pain catastrophizing is a pattern of thinking that amplifies pain. It has three components: rumination (you cannot stop thinking about the pain), magnification (you believe the pain is unbearable or the worst it could be), and helplessness (you feel nothing can be done).\n\nThese thoughts are not your fault — they are your brain\'s attempt to protect you by keeping your attention focused on a threat. But they create a vicious cycle: catastrophic thoughts increase anxiety, anxiety increases muscle tension and stress hormones, and these physical changes genuinely increase pain.\n\nRecognizing catastrophizing is the first step. Common catastrophizing thoughts include: "This pain will never end," "I can\'t stand this," "Something terrible must be happening," and "Nothing helps." When you notice these thoughts, try adding a gentle challenge: "This pain is very hard right now, AND it has been better at other times," or "I feel helpless right now, AND my breakthrough dose has helped before."\n\nThe word "AND" is powerful. It does not deny your experience — it adds perspective.',
        tips: [
          'Watch for "always/never" language in your pain thoughts: "It will NEVER get better" or "Nothing EVER helps." These are catastrophizing signals.',
          'Replace "but" with "and": "My pain is bad AND I have coped with hard days before."',
          'Catastrophizing is not your fault — it is your brain trying to protect you. Be kind to yourself when you notice it.',
        ],
      },
      {
        title: 'Distraction and Engagement',
        body: 'Distraction is not about ignoring your pain — it is about redirecting your brain\'s attention. Research shows that when your brain is deeply engaged in something, it literally processes fewer pain signals. This is why pain often feels worse at night when you have nothing to focus on.\n\nThe best distractions are activities that require active engagement rather than passive consumption. Talking to someone is better than watching TV. Playing a game is better than scrolling a phone. Cooking, gardening, art, or puzzles engage multiple brain areas simultaneously, leaving fewer resources available for pain processing.\n\nMusic therapy deserves special mention. Listening to music you love — especially music with personal meaning — activates reward circuits in the brain that directly suppress pain pathways. Singing or humming amplifies this effect because it engages your vagus nerve (the calming nerve discussed in the breathing module).\n\nFlow states — those moments when you are so absorbed in an activity that you lose track of time — are the most powerful natural pain relievers. Identify activities that create flow for you and make them a regular part of your day.',
        tips: [
          'Create a "comfort playlist" of songs with happy memories. Play it during difficult pain moments.',
          'Active engagement (conversation, games, puzzles) reduces pain more than passive watching (TV, scrolling).',
          'Identify your "flow" activities — whatever makes you lose track of time. Schedule these during your most painful periods.',
          'If you love singing, sing. Humming and singing activate your vagus nerve and release endorphins.',
        ],
      },
      {
        title: 'Guided Imagery for Pain',
        body: 'Guided imagery uses your imagination to create calming, healing mental experiences. Research shows it can reduce pain intensity by 20-30% in many patients. Your brain responds to vivid imagination in many of the same ways it responds to reality.\n\nThe "safe place" technique: Close your eyes and imagine a place where you feel completely safe, peaceful, and comfortable. Build it in rich sensory detail — the colours, sounds, smells, textures, and temperature. Visit this place whenever pain escalates. With practice, you can transport yourself there within seconds.\n\nThe "turning down the dial" technique: Imagine your pain as a dial or slider, like a volume control, with numbers from 0 to 10. Visualize the dial at your current pain level. Now, slowly imagine turning the dial down — 7 to 6... 6 to 5... 5 to 4. As you visualize the number decreasing, some people genuinely experience a reduction in pain intensity.\n\nThese techniques work best with regular practice. Try them during mild pain first, so they become familiar tools you can use during more intense episodes. Combining imagery with slow breathing amplifies the effect.',
        tips: [
          'Build your "safe place" in detail when you are calm. What do you see, hear, smell, feel? The more vivid, the more effective.',
          'Try the "dial" technique right now: visualize your pain level as a number, then slowly imagine turning it down by one or two points.',
          'Practice guided imagery daily for a week. Like any skill, it becomes more effective with repetition.',
        ],
      },
      {
        title: 'Acceptance-Based Approaches',
        body: 'Acceptance and Commitment Therapy (ACT) offers a different approach to pain: instead of fighting it, you learn to coexist with it while still living a meaningful life.\n\nACT does not mean giving up or resigning yourself to suffering. It means stopping the exhausting war with pain that often makes things worse. Fighting pain takes enormous energy — energy that could be used for living. Acceptance says: "This pain is here. I do not like it. AND I can still choose what matters to me today."\n\nPain defusion is an ACT technique where you observe your pain thoughts without getting trapped by them. Instead of "I am in terrible pain" (which makes pain your entire identity), try "I am noticing that my body is experiencing pain" (which creates space between you and the pain).\n\nValues-driven action means asking: "Despite this pain, what matters to me today?" Maybe it is spending time with family, reading, praying, or simply being kind. When you act on your values despite pain, you maintain a sense of purpose and identity that pain cannot take away.\n\nThis is not about ignoring pain. It is about refusing to let pain make all your decisions.',
        tips: [
          'Try reframing: instead of "I AM in pain," say "I NOTICE pain in my body." This small shift creates distance.',
          'Ask yourself each morning: "Despite my pain, what one thing matters to me today?" Then do that thing.',
          'Acceptance is not giving up. It is redirecting your energy from fighting pain to living your life.',
          'You are more than your pain. Pain is something you experience — it is not who you are.',
        ],
      },
    ],
    key_takeaways: [
      'Pain is real AND your mind genuinely influences its intensity — this is neuroscience, not imagination.',
      'Pain catastrophizing (rumination, magnification, helplessness) amplifies pain. Recognizing these thought patterns is the first step.',
      'Active engagement (conversation, music, hobbies) redirects your brain and genuinely reduces pain signals.',
      'Guided imagery ("safe place" and "turning down the dial") can reduce pain intensity by 20-30% with practice.',
      'ACT teaches you to coexist with pain while living according to your values — acceptance is not giving up.',
    ],
  },
  {
    id: 'edu-12',
    title: 'Talking to Your Family',
    description: 'Navigate difficult conversations with family members — from breaking through protective silence to talking to children and expressing love.',
    category: 'Communication',
    duration: '7 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'Why These Conversations Are Hard',
        body: 'In many Indian families, there is an unspoken agreement to "protect" each other from difficult truths. The patient smiles and says "I am fine" to spare the family. The family avoids mentioning the illness to spare the patient. Everyone pretends, and everyone suffers alone.\n\nThis "mutual pretense" comes from love — no one wants to cause pain to those they love. But it creates isolation at the very time when connection matters most. When you cannot talk honestly about what you are going through, you lose the chance for deeper intimacy, practical planning, and emotional support.\n\nCultural factors make these conversations especially challenging. Talking about death and illness is considered inauspicious in many communities. Elders may feel they should not "burden" younger family members. Younger family members may feel it is disrespectful to raise difficult topics with elders.\n\nBut here is what families consistently report after having these conversations: relief. "We were all thinking the same things but no one would say it." Opening the door — even a crack — often brings the family closer together rather than apart.',
        tips: [
          'The discomfort of having a difficult conversation is temporary. The regret of not having it can last forever.',
          'You do not need to say everything at once. Even starting with "Can we talk about something important?" opens the door.',
          'Ask your palliative care social worker to help facilitate a family conversation if you need support.',
        ],
      },
      {
        title: 'Starting the Conversation',
        body: 'There is no perfect way to start a difficult conversation. But there are approaches that make it easier for everyone.\n\nChoose the right time and place. A quiet, private space without distractions works best. Avoid starting during meals, family gatherings, or when someone is rushing. "Can we talk after dinner tonight, just us?" gives the other person time to prepare emotionally.\n\nUse "I" statements instead of assumptions. "I have been feeling worried and I want to share that with you" is gentler than "We need to discuss my illness." Starting with your feelings invites connection rather than triggering defensiveness.\n\nAsk what they want to know. Not everyone is ready for the same level of detail. "I want to talk about how things are going. What would be helpful for you to know?" respects their readiness while opening the conversation.\n\nBe prepared for different reactions. Some people cry, some get angry, some go silent, some change the subject. All of these are normal responses to difficult information. Give them space and time. You can always return to the conversation later.',
        tips: [
          'Start with feelings, not facts: "I have been feeling worried" rather than "My report says..."',
          'Ask: "What would be helpful for you to know?" This respects their readiness.',
          'If someone is not ready to talk, say: "I understand. I am here whenever you are ready." Do not force it.',
          'Writing a letter can be an alternative if face-to-face feels too difficult.',
        ],
      },
      {
        title: 'Talking to Children',
        body: 'Children are remarkably perceptive. Even very young children sense when something is wrong. Silence does not protect them — it increases their anxiety because their imagination fills the gaps with scenarios often worse than reality.\n\nAge-appropriate honesty is key. For young children (3-7): use simple, concrete language. "Nani is sick. The doctors are helping, but Nani needs to rest a lot. You can still sit with Nani and tell stories." Avoid metaphors like "going to sleep" or "going away" as children may take them literally.\n\nFor older children (8-12): they can understand more. "I have a serious illness. The doctors are giving me medicine to help me feel comfortable, but they cannot make the illness go away completely. I want you to know that I love you very much and it is okay to ask me questions."\n\nFor teenagers: respect their growing maturity. Be honest but also acknowledge that this is hard for them. "I know this is not easy to hear. I want you to know what is happening so you do not have to guess or worry alone."\n\nAll children need three reassurances: it is not their fault, they are loved, and they will be taken care of. Repeat these often.',
        tips: [
          'Children sense the truth. Honest, age-appropriate information reduces their anxiety more than silence.',
          'Always reassure children: "This is not your fault. I love you. You will always be taken care of."',
          'Let children ask questions and answer honestly. "I do not know" is a perfectly acceptable answer.',
          'Watch for changes in behaviour (withdrawal, anger, school problems) — these may be signs a child is struggling silently.',
        ],
      },
      {
        title: 'Navigating Family Conflict',
        body: 'Illness can bring families together, but it can also surface old tensions and create new conflicts. Different family members may have strong opinions about treatment, care decisions, religious practices, or even daily routines.\n\nCommon conflicts include: disagreement about whether to pursue aggressive treatment, tension between siblings about caregiving responsibilities, in-law dynamics around care decisions, and differing views on how much to tell extended family or community.\n\nYour voice matters most. In the midst of family opinions, remember that your wishes and values should guide decisions about your care. If family members are arguing about what is "best for you," you have every right to say what you want — or to designate someone to speak for you.\n\nFamily meetings facilitated by your palliative care team can be invaluable. A neutral third party (social worker, counselor, or doctor) can help family members express concerns, hear each other, and reach agreements. This is not a sign of family failure — it is a wise and loving use of available resources.',
        tips: [
          'Your wishes come first. It is your life and your care — family members advise, but you decide.',
          'Ask your palliative care team to arrange a family meeting if conflicts are causing stress.',
          'Sometimes family members argue because they are scared. Naming the fear ("I know we are all scared") can de-escalate conflict.',
          'Assign specific caregiving tasks to different family members to prevent burnout and resentment.',
        ],
      },
      {
        title: 'Expressing Love and Gratitude',
        body: 'One of the most important conversations you can have is the simplest: telling the people you love that you love them. It sounds obvious, but many families communicate love through actions (cooking, providing, caring) rather than words — and words carry a unique power.\n\nDo not wait for the "right moment." The right moment is any moment when you feel love — over morning chai, during a quiet evening, while watching TV together, or even in a simple text message. Ordinary moments become extraordinary when filled with expressed love.\n\nBe specific. "I love how you always make my chai exactly the way I like it" lands differently than a general "I love you." Specific appreciation tells people exactly what they mean to you and what you notice about them.\n\nGratitude can be expressed in many ways: a direct conversation, a letter (handwritten letters are treasured), a voice recording, or through a third person ("Tell your mother I am so proud of how she takes care of everyone"). Choose whatever feels natural to you.\n\nIf expressing emotion is difficult (it is for many people), start small. A hand on someone\'s shoulder, sitting close, or a simple "Thank you for being here" can carry enormous meaning.',
        tips: [
          'Tell one person today something specific you love about them. Do not wait for a special occasion.',
          'If words are hard, write a short note: "I am grateful for you because..." and leave it where they will find it.',
          'Express love in whatever way feels natural — words, touch, food, presence. There is no wrong way.',
          'The people who care for you need to hear they are appreciated. Caregiving is hard, and your gratitude sustains them.',
        ],
      },
    ],
    key_takeaways: [
      'Protective silence isolates everyone. Opening up — even a little — brings relief and closeness.',
      'Start difficult conversations with "I" statements and feelings, not facts or assumptions.',
      'Children need honest, age-appropriate information and three reassurances: it is not their fault, they are loved, they will be cared for.',
      'Family conflicts during illness are normal. Your palliative care team can facilitate family meetings.',
      'Do not wait for the perfect moment to express love and gratitude. Ordinary moments are the right moments.',
    ],
  },
  {
    id: 'edu-13',
    title: 'Spiritual Comfort',
    description: 'Explore how spirituality — across traditions and beyond — can provide comfort, meaning, and peace during your journey.',
    category: 'Spiritual Care',
    duration: '8 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'Spirituality in Illness',
        body: 'Spirituality during illness goes beyond religion — though religion can be a powerful part of it. Spirituality is about the big questions: Why is this happening? What is the meaning of my life? What happens after death? Is there something greater than myself?\n\nSpiritual distress is common and real. It can manifest as anger at God or fate ("Why me?"), a crisis of faith ("I prayed and it did not help"), existential loneliness ("No one truly understands"), loss of meaning ("What is the point?"), or fear of the unknown ("What happens when I die?").\n\nThese questions do not have easy answers, and that is okay. The value is in the asking, the exploring, and the sharing — not in arriving at neat conclusions. Many patients find that sitting with these questions, rather than running from them, brings a deeper kind of peace.\n\nSpiritual care is an important part of palliative care. Your team may include or can refer you to a spiritual counselor, chaplain, or religious leader who is experienced in supporting people through serious illness. You do not need to be religious to benefit from spiritual care.',
        tips: [
          'Spiritual distress ("Why me?", "What is the point?") is normal and valid. You do not need to have answers.',
          'Spirituality is broader than religion. It includes connection, meaning, purpose, and peace — however you find them.',
          'Ask your palliative care team about spiritual care support — it is a recognised and valuable part of your care.',
        ],
      },
      {
        title: 'Prayer and Meditation Across Traditions',
        body: 'Prayer and meditation, in their many forms, have been sources of comfort for thousands of years. Whatever your tradition, there are practices that can bring peace.\n\nIn Hindu tradition, japa (repetitive mantra chanting such as "Om Namah Shivaya" or the Mahamrityunjaya mantra) calms the mind through rhythm and devotion. Dhyana (meditation) and simple practices like lighting a diya (lamp) and sitting in silence can create a sacred space even at the bedside.\n\nIn Islamic tradition, dhikr (remembrance of Allah through repeated phrases like "SubhanAllah" or "Alhamdulillah") provides comfort and grounding. Dua (personal prayer) allows you to speak to Allah in your own words about your fears, hopes, and needs. The Quran itself encourages patience (sabr) during difficulty as a source of spiritual strength.\n\nIn Christian tradition, contemplative prayer, reading Psalms (especially Psalm 23 — "The Lord is my shepherd"), and the rosary offer meditative comfort. Many find solace in surrendering concerns to God through prayer.\n\nIf you are not religious, mindfulness meditation — simply sitting quietly and observing your breath and thoughts without judgment — provides similar calming benefits without a religious framework.',
        tips: [
          'You do not need to pray "correctly." Speaking to God, the universe, or your own inner wisdom in your own words is always enough.',
          'If formal meditation is difficult, try simply sitting with a diya or candle flame for 5 minutes, watching the light.',
          'Repetitive prayer (japa, dhikr, rosary) calms the nervous system through rhythm — similar to breathing exercises.',
          'It is okay if your prayers include anger, doubt, or fear. Honest prayer is the most authentic kind.',
        ],
      },
      {
        title: 'Finding Peace with the Unknown',
        body: 'Every spiritual and philosophical tradition offers frameworks for making peace with what we cannot know or control.\n\nIn Hindu philosophy, the concept of karma — that life\'s events unfold according to a larger pattern — can provide comfort. The Bhagavad Gita teaches that the soul (atman) is eternal and the body is temporary: "The soul is neither born, and nor does it die." For many, this belief transforms death from an ending into a transition.\n\nIn Islamic thought, the concept of qadr (divine predestination) teaches that God\'s plan is wise even when we cannot understand it. Tawakkul (trusting in Allah) encourages placing trust in divine wisdom while still doing your best.\n\nIn Christian faith, trusting in God\'s plan and the promise of eternal life provides comfort. "For I know the plans I have for you," (Jeremiah 29:11) reassures that there is purpose even in suffering.\n\nIn secular and humanistic frameworks, finding peace comes through accepting the natural cycle of life, finding meaning in relationships and contributions, and trusting that the love you have given will continue in those you leave behind.\n\nNo framework eliminates fear or sadness entirely. But having a framework — any framework — provides something to hold onto when the ground feels uncertain.',
        tips: [
          'Whatever your belief system, it is okay to draw comfort from its teachings about life, death, and meaning.',
          'If your faith is shaken by illness, that is normal. Many people find their faith deepens through struggle, not despite it.',
          'You can hold multiple frameworks simultaneously — drawing from tradition, personal experience, and new insights.',
        ],
      },
      {
        title: 'Forgiveness and Letting Go',
        body: 'Forgiveness — of others and of yourself — is one of the most powerful acts of spiritual healing. Carrying resentment, guilt, or regret consumes energy that you need for living.\n\nSelf-forgiveness is often the hardest. You may carry guilt about things you did or did not do, words said or left unsaid, relationships neglected, or choices you regret. Remember: you made the best decisions you could with the information and circumstances you had at the time.\n\nForgiving others does not mean what they did was okay. It means releasing the hold that resentment has on you. Holding onto anger is like carrying a heavy stone — putting it down does not change what happened, but it frees your hands and your heart.\n\nReconciliation is different from forgiveness. You can forgive someone in your heart without needing to see them or hear their apology. And if reconciliation is possible and desired — reconnecting with an estranged family member, resolving an old conflict — illness can provide the courage to reach out.\n\nLetting go is not about forgetting. It is about choosing peace.',
        tips: [
          'Self-forgiveness exercise: "I did the best I could with what I knew at the time. I forgive myself."',
          'Forgiveness is for your peace, not for the other person. You do not need their apology to let go.',
          'If there is someone you want to reconcile with, consider reaching out. The worst that can happen is they say no.',
          'Write a letter of forgiveness — to yourself or to someone else. You do not need to send it. The writing itself heals.',
        ],
      },
      {
        title: 'Connecting with Your Community',
        body: 'Spiritual community provides a sense of belonging that is especially important during illness. Whether it is a temple, mosque, church, gurudwara, or a gathering of like-minded people, community offers support that individual practice cannot replicate.\n\nIf you can visit your place of worship, even briefly, this can be deeply nourishing. But if mobility is limited, bring your community to you. Many religious leaders are willing and honoured to visit patients at home or in hospital.\n\nBedside spiritual practices are equally valid. A family member can read scripture, play devotional music, light a diya or incense, or simply sit in prayer with you. Creating a small sacred space at your bedside — with a photo, a religious text, a lamp, or a meaningful object — can provide ongoing comfort.\n\nOnline communities and phone-based prayer groups can also provide connection. Many temples, mosques, and churches now offer virtual services and personal prayer support.\n\nRemember: spiritual care is a recognised part of palliative care at AIIMS. Your team can help connect you with appropriate spiritual support.',
        tips: [
          'Ask your religious leader to visit you at home or in hospital — most consider it a privilege to provide this support.',
          'Create a small sacred space at your bedside: a photo, a prayer book, a lamp, or any meaningful object.',
          'Ask family members to play devotional music, read scripture, or sit in prayer with you — shared practice is powerful.',
          'Your palliative care team can help arrange spiritual support appropriate to your tradition.',
        ],
      },
    ],
    key_takeaways: [
      'Spiritual distress ("Why me?", existential questions) is a normal part of serious illness deserving care and attention.',
      'Prayer and meditation — japa, dhikr, contemplative prayer, or secular mindfulness — calm both mind and body.',
      'Finding peace does not require answers. Having a framework to hold onto (religious or secular) provides comfort.',
      'Forgiveness (especially self-forgiveness) releases emotional weight and frees energy for living.',
      'Spiritual community — in person, at bedside, or online — provides belonging and support during illness.',
    ],
  },
  {
    id: 'edu-14',
    title: 'Caring for Your Caregivers',
    description: 'Understand the challenges your caregivers face and discover how you can support them — even as they support you.',
    category: 'Family & Caregiving',
    duration: '6 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'Understanding Caregiver Burden',
        body: 'Your caregivers — whether spouse, children, siblings, or friends — are on this journey with you. And while your needs are the focus, their wellbeing matters enormously, both for their sake and for yours.\n\nCaregiver burden is the physical, emotional, social, and financial toll of providing ongoing care. It is not a sign of weakness or lack of love — it is a natural consequence of sustained high-demand caregiving without adequate support.\n\nSigns of caregiver burnout include: persistent exhaustion that sleep does not fix, irritability or anger that seems out of proportion, withdrawing from friends and activities, neglecting their own health (skipping meals, missing their own doctor appointments), feeling trapped or resentful (followed by guilt about feeling resentful), difficulty sleeping, and physical symptoms like headaches or back pain.\n\nIn India, caregiving often falls disproportionately on women — wives, daughters, or daughters-in-law — who may also be managing a household, children, and sometimes employment. This invisible labour can be overwhelming.',
        tips: [
          'Watch for signs of burnout in your caregivers: exhaustion, irritability, withdrawal, or neglecting their own health.',
          'Caregiver burnout is not a failure of love. It is a natural response to an incredibly demanding situation.',
          'Multiple caregivers sharing the load prevents any one person from burning out.',
        ],
      },
      {
        title: 'How You Can Help Your Caregivers',
        body: 'You may feel that you are only "receiving" care, but there are many ways you can support the people who support you.\n\nAccept help gracefully. This sounds simple but can be the hardest thing for someone who has always been independent. When you resist help, your caregiver feels rejected. When you accept help with genuine gratitude, it validates their effort and strengthens your bond.\n\nCommunicate clearly about what you need and do not need. Caregivers cannot read minds, and guessing causes anxiety. "I would like help getting dressed but I want to brush my teeth myself" is clearer and kinder than "I can manage" (when you cannot) or passive frustration.\n\nExpress appreciation regularly. Caregiving is exhausting, and a simple "Thank you for making my chai exactly how I like it" or "I know this is hard, and I appreciate you" can refuel a tired caregiver more than rest.\n\nBe honest about your pain and symptoms. Hiding your true condition to "protect" your caregiver often backfires — they sense something is wrong but cannot help because they do not have accurate information.',
        tips: [
          'Accept help with a simple "Thank you" — it validates your caregiver\'s effort and love.',
          'Be specific about your needs: "Can you help me with X?" is better than waiting and getting frustrated.',
          'Thank your caregiver for something specific every day. Small appreciation prevents burnout.',
          'Being honest about how you feel (rather than hiding it) actually reduces your caregiver\'s anxiety.',
        ],
      },
      {
        title: 'Encouraging Self-Care',
        body: 'One of the most loving things you can do for your caregiver is to actively encourage them to take care of themselves. This is not selfish — a depleted caregiver cannot provide the care you need.\n\nGive explicit permission to take breaks. Many caregivers feel guilty stepping away even for an hour. When you say, "Please go meet your friend for coffee — I will be fine, and I want you to have time for yourself," you remove the guilt barrier.\n\nRespite care — having another family member, friend, volunteer, or professional caregiver step in temporarily — gives your primary caregiver essential rest. This is not abandonment; it is sustainable caregiving.\n\nEncourage your caregiver to maintain their social connections. Isolation is one of the biggest risks of caregiving. Friends, community, and hobbies provide essential emotional refueling.\n\nRemind them (gently) to attend their own medical appointments, eat properly, and sleep. Caregivers who neglect their own health often become patients themselves.',
        tips: [
          'Say directly: "I want you to take time for yourself. You deserve it and I need you to stay well."',
          'Help arrange respite care — ask another family member or friend to take over for an afternoon or evening.',
          'Encourage your caregiver to keep one regular activity: a weekly visit with friends, exercise, or a hobby.',
          'If your caregiver is skipping their own doctor appointments, gently insist they go.',
        ],
      },
      {
        title: 'Family Dynamics Under Stress',
        body: 'Illness reshuffles family roles in ways that can be uncomfortable for everyone. Understanding these shifts helps you navigate them with compassion.\n\nRole reversal with adult children is one of the most emotionally complex dynamics. The parent who was always the caretaker now needs care. The child who was always protected now does the protecting. This shift can trigger grief, awkwardness, and friction on both sides.\n\nSpouse caregiving brings unique challenges. Your life partner is simultaneously your caregiver, your emotional support, and someone who is grieving in their own right. The romantic and partnership aspects of your relationship may shift, and both of you may need to grieve this change.\n\nSibling dynamics often surface during caregiving. Old patterns ("Why does everything fall on me?", "You were always the favourite") can resurface under stress. Unequal caregiving distribution is one of the most common sources of family conflict.\n\nAcknowledging these dynamics openly — "I know this is strange for both of us" or "I appreciate that you have taken on more than your share" — can ease tension significantly.',
        tips: [
          'If your adult child is now caring for you, acknowledge the role reversal: "I know this is not easy for either of us. Thank you."',
          'Be gentle with your spouse — they are carrying grief alongside caregiving.',
          'If caregiving is unevenly distributed among siblings, suggest a family discussion to share responsibilities.',
          'Old family patterns may resurface under stress. Patience with each other is essential.',
        ],
      },
      {
        title: 'Resources and Support Groups',
        body: 'Caregivers do not have to navigate this alone. Support resources can make a meaningful difference in their ability to sustain caregiving while maintaining their own wellbeing.\n\nAIIMS Bhopal\'s palliative care team includes social workers who can provide counseling and connect caregivers with resources. Encourage your caregiver to meet with the social worker — this is a normal and valued part of palliative care.\n\nCaregiver support groups — whether in-person or online — provide a space where caregivers can share experiences, vent frustrations, and receive understanding from others in similar situations. Knowing "I am not the only one feeling this way" is profoundly reassuring.\n\nOnline resources and helplines offer support outside office hours. Many organisations provide caregiver-specific information, coping tools, and emotional support via phone or WhatsApp.\n\nProfessional counseling for caregivers is not a luxury — it is an investment in sustainable care. A caregiver who receives emotional support can provide better care for longer without burning out.',
        tips: [
          'Encourage your caregiver to connect with the palliative care social worker at AIIMS — this is a valued part of your care.',
          'Suggest a caregiver support group — sharing with others who understand is one of the most effective ways to prevent burnout.',
          'Professional counseling for caregivers is not selfish — it is essential for sustainable, quality care.',
          'Keep important numbers handy: palliative care team, social worker, caregiver helpline, local support groups.',
        ],
      },
    ],
    key_takeaways: [
      'Caregiver burnout is real and common — watch for exhaustion, irritability, withdrawal, and health neglect.',
      'Accept help gracefully, communicate needs clearly, and express specific appreciation daily.',
      'Actively encourage your caregiver to take breaks, see friends, and attend to their own health.',
      'Family role reversals and sibling dynamics often surface during illness — patience and open communication help.',
      'Support resources (social workers, support groups, counseling) are essential for sustainable caregiving.',
    ],
  },
  {
    id: 'edu-15',
    title: 'Finding Joy Every Day',
    description: 'Discover why positive experiences matter even during illness, and learn practical ways to cultivate gratitude, laughter, and creative expression.',
    category: 'Wellness',
    duration: '5 min',
    progress: 0,
    completed: false,
    sections: [
      {
        title: 'The Science of Positive Emotions',
        body: 'Experiencing joy, gratitude, amusement, and love during illness is not denial — it is medicine. Research by psychologist Barbara Fredrickson shows that positive emotions "broaden and build": they expand your awareness, creativity, and coping resources.\n\nPositive emotions do not ignore or replace difficult ones. They coexist with sadness, fear, and pain. You can laugh at a joke in the morning and cry about your situation in the afternoon. Both are genuine, and both are important.\n\nPhysiologically, positive emotions reduce cortisol (stress hormone), lower blood pressure, boost immune function, and increase pain tolerance. A genuine laugh triggers the release of endorphins — your body\'s natural painkillers. Even a brief experience of warmth or connection calms the nervous system.\n\nYou do not need to force happiness. The goal is to notice and appreciate moments of goodness when they naturally arise, and to create small conditions where they are more likely to occur.',
        tips: [
          'Joy during illness is not denial — it is a natural and healthy part of the human experience.',
          'You do not need to choose between sadness and happiness. Both can coexist on the same day.',
          'Positive emotions are genuinely therapeutic — they reduce stress hormones and boost your immune system.',
        ],
      },
      {
        title: 'Gratitude Practice',
        body: 'Gratitude is one of the most researched positive psychology interventions, and it is simple enough to practice from any situation — even a hospital bed.\n\nThe "three good things" exercise: Each evening, write down (or think about) three good things that happened during your day. They can be tiny: a warm cup of chai, sunlight through the window, a phone call from a friend, or a moment of comfort. Do this for two weeks and research shows measurable improvements in mood and sleep.\n\nA gratitude letter is a more intensive practice. Write a letter to someone who has made a positive difference in your life — a parent, teacher, friend, or caregiver — describing specifically what they did and how it affected you. If possible, read it to them in person. This exercise consistently produces one of the strongest and longest-lasting boosts in wellbeing of any positive psychology intervention.\n\nAppreciative inquiry turns your attention to what IS working rather than what is not. Instead of asking "What went wrong today?" ask "What went right today? What worked? What moment was good?" This simple shift in question changes what your brain looks for.',
        tips: [
          'Tonight, name 3 good things from your day — no matter how small. The warm blanket. The kind nurse. The taste of chai.',
          'Write a gratitude letter to someone who matters to you. Read it to them if you can — the effect is profound for both of you.',
          'Keep a "good moments" notebook. On difficult days, reading past entries can remind you that good moments still come.',
        ],
      },
      {
        title: 'Savoring Techniques',
        body: 'Savoring is the art of fully experiencing positive moments rather than letting them pass unnoticed. When life is uncertain, each pleasant experience becomes more precious — if you slow down enough to actually feel it.\n\nMindful eating: Choose one meal or snack and eat it with full attention. Notice the colours on the plate. Smell the aroma before the first bite. Chew slowly and notice the textures and flavours. This transforms an ordinary meal into a sensory experience.\n\nNature observation: Even from a window or a chair in the garden, nature offers endless small wonders. The pattern of clouds, the colour of leaves, the movement of birds, the warmth of sunlight on your skin. Spending 5 minutes simply observing nature has measurable stress-reducing effects.\n\nReminiscence: Revisiting happy memories in detail is a form of time travel that brings past joy into the present. Look at old photos, listen to music from your younger years, or simply close your eyes and relive a favourite moment. Where were you? Who was there? What did you see, hear, and feel?',
        tips: [
          'Eat one meal today with full attention — no TV, no phone. Just the food, the flavours, and the moment.',
          'Spend 5 minutes watching nature from your window or garden. Notice colours, movements, and sounds.',
          'Pull out an old photo album or listen to a song from your youth. Let the memories wash over you.',
          'Share a happy memory with a family member: "Remember when we..." These conversations nourish both of you.',
        ],
      },
      {
        title: 'Humour and Laughter',
        body: 'Laughter truly is good medicine. A genuine laugh reduces stress hormones, increases immune cell activity, relaxes muscle tension (for up to 45 minutes), and triggers endorphin release. Norman Cousins, who wrote about his own healing, called laughter "internal jogging."\n\nYou do not need to find illness funny to benefit from humour. Watch a comedy show that makes you laugh. Tell or listen to jokes. Spend time with people who bring lightness. Many patients find that their sense of humour becomes one of their most valued coping tools.\n\nGiving yourself permission to laugh can be important. Some people feel guilty about laughing during a serious illness, as if it means they are not taking their situation seriously. But laughter and seriousness are not opposites. You can take your illness seriously AND find moments of genuine amusement. In fact, laughter helps you cope with the seriousness.\n\nChildren are natural laughter generators. If grandchildren or young family members are around, their energy and silliness can be the best medicine available.',
        tips: [
          'Watch something funny today — a comedy show, funny videos, or a favourite humorous film.',
          'Spend time with people who make you laugh. Laughter is contagious and healing.',
          'Give yourself permission to laugh. Joy and illness are not contradictions.',
          'If grandchildren are around, let their silliness infect you. Children are the best laughter therapy.',
        ],
      },
      {
        title: 'Creative Expression',
        body: 'Creating something — anything — is an act of meaning-making. It says: "I am here. I have something to express. I matter." Creative expression does not require talent, training, or producing something "good." The process itself is what heals.\n\nArt therapy research shows that drawing, painting, or even colouring can reduce anxiety, express emotions that words cannot capture, and provide a sense of accomplishment. You do not need to be an artist. Scribbling with colours, arranging flowers, or decorating a space can be creative expression.\n\nMusic — listening, singing, humming, or playing — activates multiple brain areas simultaneously and is one of the most powerful mood regulators available. Playing songs from your past can reconnect you with your identity and happier times.\n\nWriting — journaling, poetry, letters, or even short stories — provides a way to process experiences and create something permanent from your inner world. Many patients find that writing about their experiences helps them find meaning and order in what feels chaotic.\n\nThe point is not to create something perfect. It is to engage, express, and connect with the creative spark that is part of being human.',
        tips: [
          'Try colouring, drawing, or arranging flowers — no talent needed. The process is the point.',
          'Sing or hum a favourite song. Music engages your whole brain and lifts your mood.',
          'Write a poem, a memory, or a letter. It does not need to be "good" — it just needs to be yours.',
          'Frame or save something you create. It is a tangible reminder that you are still creating, still expressing, still here.',
        ],
      },
    ],
    key_takeaways: [
      'Positive emotions during illness are not denial — they are therapeutic, reducing stress hormones and boosting immunity.',
      'The "three good things" gratitude exercise each evening measurably improves mood and sleep within two weeks.',
      'Savoring (mindful eating, nature observation, reminiscence) makes ordinary moments extraordinary.',
      'Laughter is genuine medicine — it reduces pain, relaxes muscles, and releases endorphins.',
      'Creative expression (art, music, writing) is about process, not product. Creating is an act of meaning.',
    ],
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

/* ================================================================== */
/*  Aliases (for refactored patient pages)                             */
/* ================================================================== */

export const MOCK_MEDICATIONS = MOCK_MEDICATIONS_TODAY;

export const MOCK_JOURNEY = {
  goals: MOCK_GOALS,
  gratitude: MOCK_GRATITUDE_ENTRIES,
  intentions: [MOCK_TODAY_INTENTION],
  milestones: MOCK_MILESTONES,
};

export const MOCK_PAIN_DIARY = {
  entries: MOCK_PAIN_TRENDS,
  summary: {
    avg_pain_7d: MOCK_SYMPTOM_SUMMARY.week_avg_pain,
    highest_pain: Math.max(...MOCK_PAIN_TRENDS.map((p) => p.pain_score)),
    breakthrough_count: MOCK_PAIN_TRENDS.filter((p) => p.breakthrough).length,
    trend: MOCK_SYMPTOM_SUMMARY.trend,
  },
};
