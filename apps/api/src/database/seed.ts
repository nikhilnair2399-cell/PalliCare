/**
 * PalliCare Database Seeder
 *
 * Seeds the development database with realistic palliative care data.
 * Run: npx ts-node src/database/seed.ts
 */
import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pallicare',
  user: process.env.DB_USERNAME || 'pallicare_user',
  password: process.env.DB_PASSWORD || 'pallicare_dev_password',
});

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Seeding PalliCare database...\n');

    // ─── 1. Clinician User ─────────────────────────────────
    const clinicianUserId = uuid();
    await client.query(
      `INSERT INTO users (id, type, phone, phone_verified, email, name, name_hi, language_pref)
       VALUES ($1, 'clinician', '+919876500001', TRUE, 'nikhil.nair@aiims.edu',
               'Dr. Nikhil Nair', 'डॉ. निखिल नायर', 'en')
       ON CONFLICT (phone) DO NOTHING`,
      [clinicianUserId],
    );

    const clinicianResult = await client.query(
      `SELECT id FROM users WHERE phone = '+919876500001'`,
    );
    const actualClinicianUserId = clinicianResult.rows[0].id;

    await client.query(
      `INSERT INTO clinicians (user_id, designation, department, role, can_prescribe, institutional_email)
       VALUES ($1, 'Assistant Professor', 'Palliative Care & Pain Management', 'physician', TRUE, 'nikhil.nair@aiims.edu')
       ON CONFLICT (user_id) DO NOTHING`,
      [actualClinicianUserId],
    );
    console.log('  Clinician: Dr. Nikhil Nair');

    // ─── 2. Patient Users ──────────────────────────────────
    const patients = [
      { name: 'Ramesh Kumar', nameHi: 'रमेश कुमार', phone: '+919876500010', diagnosis: 'Head and Neck Cancer (Oral Cavity)', age: 62, gender: 'male' },
      { name: 'Sunita Devi', nameHi: 'सुनीता देवी', phone: '+919876500011', diagnosis: 'Breast Cancer Stage IV', age: 55, gender: 'female' },
      { name: 'Arjun Singh', nameHi: 'अर्जुन सिंह', phone: '+919876500012', diagnosis: 'Lung Cancer (NSCLC)', age: 68, gender: 'male' },
      { name: 'Priya Sharma', nameHi: 'प्रिया शर्मा', phone: '+919876500013', diagnosis: 'Cervical Cancer Stage III', age: 45, gender: 'female' },
      { name: 'Manoj Patel', nameHi: 'मनोज पटेल', phone: '+919876500014', diagnosis: 'Chronic Pancreatitis with Chronic Pain', age: 58, gender: 'male' },
      { name: 'Kavita Gupta', nameHi: 'कविता गुप्ता', phone: '+919876500015', diagnosis: 'Ovarian Cancer Stage IIIC', age: 52, gender: 'female' },
      { name: 'Rajesh Yadav', nameHi: 'राजेश यादव', phone: '+919876500016', diagnosis: 'Colorectal Cancer', age: 61, gender: 'male' },
      { name: 'Anita Mishra', nameHi: 'अनीता मिश्रा', phone: '+919876500017', diagnosis: 'COPD with Chronic Pain', age: 70, gender: 'female' },
    ];

    const patientIds: string[] = [];

    for (const p of patients) {
      const userId = uuid();
      const patientId = uuid();

      await client.query(
        `INSERT INTO users (id, type, phone, phone_verified, name, name_hi, gender, language_pref)
         VALUES ($1, 'patient', $2, TRUE, $3, $4, $5, 'hi')
         ON CONFLICT (phone) DO NOTHING`,
        [userId, p.phone, p.name, p.nameHi, p.gender],
      );

      const userResult = await client.query(
        `SELECT id FROM users WHERE phone = $1`,
        [p.phone],
      );
      const actualUserId = userResult.rows[0].id;

      await client.query(
        `INSERT INTO patients (id, user_id, primary_diagnosis, primary_clinician_id,
                               phase_of_illness, pps_score, care_setting, onboarding_stage)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'complete')
         ON CONFLICT (user_id) DO NOTHING`,
        [
          patientId,
          actualUserId,
          p.diagnosis,
          actualClinicianUserId,
          ['stable', 'unstable', 'deteriorating', 'stable', 'stable', 'unstable', 'stable', 'deteriorating'][patients.indexOf(p)],
          [70, 60, 40, 80, 70, 50, 60, 30][patients.indexOf(p)],
          ['outpatient', 'inpatient', 'inpatient', 'outpatient', 'outpatient', 'inpatient', 'home_care', 'home_care'][patients.indexOf(p)],
        ],
      );

      const patientResult = await client.query(
        `SELECT id FROM patients WHERE user_id = $1`,
        [actualUserId],
      );
      patientIds.push(patientResult.rows[0].id);
      console.log(`  Patient: ${p.name} (${p.diagnosis.substring(0, 30)}...)`);
    }

    // ─── 3. Medications ────────────────────────────────────
    const medications = [
      // Patient 0: Ramesh Kumar
      { patientIdx: 0, name: 'Morphine Oral', dose: 15, unit: 'mg', frequency: 'Q4H', route: 'oral', category: 'opioid', medd_factor: 1, is_prn: false },
      { patientIdx: 0, name: 'Paracetamol', dose: 1000, unit: 'mg', frequency: 'TDS', route: 'oral', category: 'non_opioid_analgesic', medd_factor: null, is_prn: false },
      { patientIdx: 0, name: 'Morphine IR', dose: 5, unit: 'mg', frequency: 'PRN', route: 'oral', category: 'opioid', medd_factor: 1, is_prn: true },
      // Patient 1: Sunita Devi
      { patientIdx: 1, name: 'Oxycodone', dose: 10, unit: 'mg', frequency: 'BD', route: 'oral', category: 'opioid', medd_factor: 1.5, is_prn: false },
      { patientIdx: 1, name: 'Gabapentin', dose: 300, unit: 'mg', frequency: 'TDS', route: 'oral', category: 'adjuvant', medd_factor: null, is_prn: false },
      // Patient 2: Arjun Singh
      { patientIdx: 2, name: 'Fentanyl Patch', dose: 25, unit: 'mcg', frequency: 'Q72H', route: 'transdermal', category: 'opioid', medd_factor: 2.4, is_prn: false },
      { patientIdx: 2, name: 'Ondansetron', dose: 4, unit: 'mg', frequency: 'BD', route: 'oral', category: 'anti_emetic', medd_factor: null, is_prn: false },
      // Patient 3: Priya Sharma
      { patientIdx: 3, name: 'Tramadol', dose: 100, unit: 'mg', frequency: 'TDS', route: 'oral', category: 'opioid', medd_factor: 0.1, is_prn: false },
      { patientIdx: 3, name: 'Duloxetine', dose: 60, unit: 'mg', frequency: 'OD', route: 'oral', category: 'adjuvant', medd_factor: null, is_prn: false },
      // Patient 4: Manoj Patel
      { patientIdx: 4, name: 'Tapentadol', dose: 50, unit: 'mg', frequency: 'BD', route: 'oral', category: 'opioid', medd_factor: 0.4, is_prn: false },
      { patientIdx: 4, name: 'Pantoprazole', dose: 40, unit: 'mg', frequency: 'OD', route: 'oral', category: 'other', medd_factor: null, is_prn: false },
    ];

    for (const m of medications) {
      await client.query(
        `INSERT INTO medications (patient_id, name, dose, unit, frequency, route, category, is_prn, medd_factor, start_date, status, prescribed_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE - INTERVAL '30 days', 'active', $10)`,
        [patientIds[m.patientIdx], m.name, m.dose, m.unit, m.frequency, m.route, m.category, m.is_prn, m.medd_factor, actualClinicianUserId],
      );
    }
    console.log(`  Medications: ${medications.length} entries seeded`);

    // ─── 4. Symptom Logs (last 14 days) ────────────────────
    let logCount = 0;
    for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
      for (let pIdx = 0; pIdx < patientIds.length; pIdx++) {
        // Morning log
        const painAM = Math.min(10, Math.max(0, Math.floor(Math.random() * 7) + [3, 4, 6, 2, 4, 5, 3, 7][pIdx] - 2));
        const moods = ['good', 'calm', 'okay', 'low', 'anxious', 'distressed'];
        const sleepQ = ['good', 'okay', 'poor'];

        await client.query(
          `INSERT INTO symptom_logs (patient_id, logged_by, log_type, timestamp, pain_intensity, mood, sleep_quality, sleep_hours)
           VALUES ($1, (SELECT user_id FROM patients WHERE id = $1), 'full',
                   NOW() - make_interval(days => $2) + INTERVAL '9 hours',
                   $3, $4, $5, $6)`,
          [
            patientIds[pIdx],
            dayOffset,
            painAM,
            moods[Math.floor(Math.random() * moods.length)],
            sleepQ[Math.floor(Math.random() * sleepQ.length)],
            Math.floor(Math.random() * 4) + 4,
          ],
        );
        logCount++;

        // Evening log (50% chance)
        if (Math.random() > 0.5) {
          const painPM = Math.min(10, Math.max(0, painAM + Math.floor(Math.random() * 3) - 1));
          await client.query(
            `INSERT INTO symptom_logs (patient_id, logged_by, log_type, timestamp, pain_intensity, mood)
             VALUES ($1, (SELECT user_id FROM patients WHERE id = $1), 'quick',
                     NOW() - make_interval(days => $2) + INTERVAL '19 hours',
                     $3, $4)`,
            [patientIds[pIdx], dayOffset, painPM, moods[Math.floor(Math.random() * moods.length)]],
          );
          logCount++;
        }
      }
    }
    console.log(`  Symptom logs: ${logCount} entries seeded`);

    // ─── 5. Clinical Alerts ────────────────────────────────
    const alerts = [
      { patientIdx: 2, type: 'critical', rule: 'pain_spike', message: 'Pain spike: NRS 9/10 (was 5/10 yesterday)' },
      { patientIdx: 2, type: 'critical', rule: 'no_log_48h', message: 'No symptom log for 48+ hours' },
      { patientIdx: 1, type: 'warning', rule: 'med_adherence_low', message: 'Medication adherence below 70% this week' },
      { patientIdx: 5, type: 'warning', rule: 'esas_deterioration', message: 'ESAS nausea score worsening trend' },
      { patientIdx: 7, type: 'critical', rule: 'pps_decline', message: 'PPS score declined from 40 to 30' },
      { patientIdx: 3, type: 'info', rule: 'medd_threshold', message: 'MEDD approaching 60mg threshold' },
    ];

    for (const a of alerts) {
      await client.query(
        `INSERT INTO alerts (patient_id, type, trigger_rule, message, status, assigned_to)
         VALUES ($1, $2, $3, $4, 'active', $5)`,
        [patientIds[a.patientIdx], a.type, a.rule, a.message, actualClinicianUserId],
      );
    }
    console.log(`  Alerts: ${alerts.length} entries seeded`);

    // ─── 6. Clinical Notes ─────────────────────────────────
    for (let i = 0; i < 5; i++) {
      await client.query(
        `INSERT INTO clinical_notes (clinician_id, patient_id, note_type, content)
         VALUES ($1, $2, $3, $4)`,
        [
          actualClinicianUserId,
          patientIds[i],
          ['progress', 'assessment', 'plan', 'soap', 'handover_sbar'][i],
          [
            'Patient reports improved pain control with current morphine regimen. No significant side effects.',
            'Comprehensive pain assessment done. Recommending opioid rotation due to side effects.',
            'Plan: Increase gabapentin to 400mg TDS. Review in 1 week. Continue current opioid.',
            'S: Patient c/o increased nausea. O: Vitals stable. A: Opioid-induced nausea. P: Add ondansetron 4mg BD.',
            'SBAR handover: Patient stable on current regimen. Monitor for breakthrough pain overnight.',
          ][i],
        ],
      );
    }
    console.log('  Clinical notes: 5 entries seeded');

    // ─── 7. Caregiver Users ──────────────────────────────────
    const caregiverData = [
      { name: 'Meena Kumar', nameHi: 'मीना कुमार', phone: '+919876500020', relationship: 'Spouse', patientIdx: 0 },
      { name: 'Rohit Devi', nameHi: 'रोहित देवी', phone: '+919876500021', relationship: 'Son', patientIdx: 1 },
      { name: 'Pooja Singh', nameHi: 'पूजा सिंह', phone: '+919876500022', relationship: 'Daughter', patientIdx: 2 },
    ];

    const caregiverIds: string[] = [];
    for (const cg of caregiverData) {
      const cgUserId = uuid();
      await client.query(
        `INSERT INTO users (id, type, phone, phone_verified, name, name_hi, language_pref)
         VALUES ($1, 'caregiver', $2, TRUE, $3, $4, 'hi')
         ON CONFLICT (phone) DO NOTHING`,
        [cgUserId, cg.phone, cg.name, cg.nameHi],
      );
      const cgUserResult = await client.query(`SELECT id FROM users WHERE phone = $1`, [cg.phone]);
      const actualCgUserId = cgUserResult.rows[0].id;

      const cgId = uuid();
      await client.query(
        `INSERT INTO caregivers (id, user_id, patient_id, relationship, permission_level, status, activated_at)
         VALUES ($1, $2, $3, $4, 'standard', 'active', NOW())
         ON CONFLICT (user_id, patient_id) DO NOTHING`,
        [cgId, actualCgUserId, patientIds[cg.patientIdx], cg.relationship],
      );
      const cgResult = await client.query(
        `SELECT id FROM caregivers WHERE user_id = $1 AND patient_id = $2`,
        [actualCgUserId, patientIds[cg.patientIdx]],
      );
      caregiverIds.push(cgResult.rows[0].id);
    }
    console.log(`  Caregivers: ${caregiverData.length} entries seeded`);

    // ─── 8. Goals ────────────────────────────────────────────
    const goalData = [
      { patientIdx: 0, category: 'physical', desc: 'Walk for 15 minutes daily', descHi: 'रोज़ 15 मिनट चलना', freq: 'daily' },
      { patientIdx: 0, category: 'social', desc: 'Call a friend or family member', descHi: 'किसी दोस्त या परिवार वाले को फ़ोन करना', freq: '3x_week' },
      { patientIdx: 1, category: 'coping', desc: 'Practice breathing exercises', descHi: 'साँस की एक्सरसाइज़ करना', freq: 'daily' },
      { patientIdx: 1, category: 'self_care', desc: 'Write in gratitude journal', descHi: 'कृतज्ञता डायरी में लिखना', freq: 'daily' },
      { patientIdx: 2, category: 'medical', desc: 'Take all medications on time', descHi: 'सभी दवाएँ समय पर लेना', freq: 'daily' },
      { patientIdx: 3, category: 'physical', desc: 'Gentle yoga stretches', descHi: 'हल्का योग स्ट्रेच', freq: '3x_week' },
    ];

    for (const g of goalData) {
      const goalId = uuid();
      await client.query(
        `INSERT INTO goals (id, patient_id, category, description, description_hi, frequency)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [goalId, patientIds[g.patientIdx], g.category, g.desc, g.descHi, g.freq],
      );
      // Add some goal logs for last 7 days
      for (let d = 6; d >= 0; d--) {
        if (Math.random() > 0.3) {
          await client.query(
            `INSERT INTO goal_logs (goal_id, date, completed)
             VALUES ($1, CURRENT_DATE - $2::int, $3)
             ON CONFLICT (goal_id, date) DO NOTHING`,
            [goalId, d, Math.random() > 0.2],
          );
        }
      }
    }
    console.log(`  Goals: ${goalData.length} with logs seeded`);

    // ─── 9. Gratitude Entries ─────────────────────────────────
    const gratitudeTexts = [
      'Grateful for the warm sunshine today',
      'Thank you for my daughter visiting me',
      'Happy that the pain was less today',
      'Grateful for the kind nurse who helped me',
      'Thankful for a good night of sleep',
    ];
    for (let pIdx = 0; pIdx < 3; pIdx++) {
      for (let d = 4; d >= 0; d--) {
        await client.query(
          `INSERT INTO gratitude_entries (patient_id, content, date)
           VALUES ($1, $2, CURRENT_DATE - $3::int)
           ON CONFLICT (patient_id, date) DO NOTHING`,
          [patientIds[pIdx], gratitudeTexts[(pIdx + d) % gratitudeTexts.length], d],
        );
      }
    }
    console.log('  Gratitude entries: 15 entries seeded');

    // ─── 10. Intentions ──────────────────────────────────────
    const intentionTexts = [
      'I will take a short walk today',
      'I will practice deep breathing',
      'I will eat a nutritious meal',
      'I will spend time with family',
      'I will listen to calming music',
    ];
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      for (let d = 2; d >= 0; d--) {
        const status = d === 0 ? 'pending' : (Math.random() > 0.3 ? 'yes' : 'partially');
        await client.query(
          `INSERT INTO intentions (patient_id, date, content, completed_status)
           VALUES ($1, CURRENT_DATE - $2::int, $3, $4)
           ON CONFLICT (patient_id, date) DO NOTHING`,
          [patientIds[pIdx], d, intentionTexts[(pIdx + d) % intentionTexts.length], status],
        );
      }
    }
    console.log('  Intentions: 12 entries seeded');

    // ─── 11. Milestones ──────────────────────────────────────
    const milestoneData = [
      { patientIdx: 0, type: 'first_log', msg: 'First symptom log completed!', emoji: '🎯' },
      { patientIdx: 0, type: '7_day_streak', msg: '7-day logging streak!', emoji: '🔥' },
      { patientIdx: 1, type: 'first_log', msg: 'First symptom log completed!', emoji: '🎯' },
      { patientIdx: 1, type: 'first_breathe', msg: 'First breathing session!', emoji: '🧘' },
      { patientIdx: 2, type: 'first_log', msg: 'First symptom log completed!', emoji: '🎯' },
    ];
    for (const m of milestoneData) {
      await client.query(
        `INSERT INTO milestones (patient_id, type, message, emoji, seen)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (patient_id, type) DO NOTHING`,
        [patientIds[m.patientIdx], m.type, m.msg, m.emoji, Math.random() > 0.5],
      );
    }
    console.log(`  Milestones: ${milestoneData.length} entries seeded`);

    // ─── 12. Learn Modules ───────────────────────────────────
    const learnModules = [
      { phase: 1, order: 1, titleEn: 'Understanding Your Pain', titleHi: 'अपने दर्द को समझना', type: 'animated', mins: 8, audience: 'patient' },
      { phase: 1, order: 2, titleEn: 'Pain Rating Made Easy', titleHi: 'दर्द रेटिंग आसान बनाएं', type: 'interactive', mins: 5, audience: 'patient' },
      { phase: 1, order: 3, titleEn: 'Your Medications Guide', titleHi: 'आपकी दवाओं की गाइड', type: 'animated', mins: 10, audience: 'both' },
      { phase: 2, order: 1, titleEn: 'Breathing for Pain Relief', titleHi: 'दर्द राहत के लिए साँस', type: 'guided', mins: 12, audience: 'patient' },
      { phase: 2, order: 2, titleEn: 'Sleep Hygiene Tips', titleHi: 'नींद सुधार के तरीके', type: 'story', mins: 7, audience: 'both' },
      { phase: 2, order: 3, titleEn: 'Caregiver Self-Care', titleHi: 'देखभालकर्ता स्व-देखभाल', type: 'reflective', mins: 10, audience: 'caregiver' },
      { phase: 3, order: 1, titleEn: 'Advanced Symptom Tracking', titleHi: 'उन्नत लक्षण ट्रैकिंग', type: 'interactive', mins: 8, audience: 'patient' },
      { phase: 3, order: 2, titleEn: 'Understanding Palliative Care', titleHi: 'पैलिएटिव केयर समझना', type: 'video', mins: 15, audience: 'both' },
      { phase: 4, order: 1, titleEn: 'Legacy & Life Review', titleHi: 'विरासत और जीवन समीक्षा', type: 'reflective', mins: 20, audience: 'patient' },
      { phase: 4, order: 2, titleEn: 'Grief and Coping', titleHi: 'दुख और सामना', type: 'audio', mins: 15, audience: 'caregiver' },
    ];

    const moduleIds: string[] = [];
    for (const lm of learnModules) {
      const moduleId = uuid();
      moduleIds.push(moduleId);
      await client.query(
        `INSERT INTO learn_modules (id, phase, display_order, title_en, title_hi, content_type, duration_minutes, target_audience)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (phase, display_order) DO NOTHING`,
        [moduleId, lm.phase, lm.order, lm.titleEn, lm.titleHi, lm.type, lm.mins, lm.audience],
      );
    }
    // Add progress for first 2 patients
    for (let pIdx = 0; pIdx < 2; pIdx++) {
      for (let mIdx = 0; mIdx < 4; mIdx++) {
        const status = mIdx < 2 ? 'completed' : (mIdx === 2 ? 'in_progress' : 'available');
        const pct = mIdx < 2 ? 100 : (mIdx === 2 ? 45 : 0);
        await client.query(
          `INSERT INTO learn_progress (patient_id, module_id, status, progress_pct, started_at, completed_at)
           VALUES ($1, $2, $3, $4, NOW() - INTERVAL '7 days', CASE WHEN $3 = 'completed' THEN NOW() ELSE NULL END)
           ON CONFLICT (patient_id, module_id) DO NOTHING`,
          [patientIds[pIdx], moduleIds[mIdx], status, pct],
        );
      }
    }
    console.log(`  Learn modules: ${learnModules.length} modules, 8 progress entries seeded`);

    // ─── 13. Breathe Sessions ────────────────────────────────
    const exercises = ['4_7_8', 'box_breathing', 'diaphragmatic', 'anulom_vilom', 'body_scan'];
    const feelings = ['tense', 'anxious', 'neutral', 'calm', 'pain'];
    const postFeelings = ['neutral', 'calm', 'relaxed', 'better'];
    for (let pIdx = 0; pIdx < 3; pIdx++) {
      for (let d = 6; d >= 0; d--) {
        if (Math.random() > 0.4) {
          await client.query(
            `INSERT INTO breathe_sessions (patient_id, exercise_type, duration_seconds, pre_feeling, post_feeling, completed, completed_at)
             VALUES ($1, $2, $3, $4, $5, TRUE, NOW() - make_interval(days => $6) + INTERVAL '10 hours')`,
            [
              patientIds[pIdx],
              exercises[Math.floor(Math.random() * exercises.length)],
              [120, 180, 240, 300, 360][Math.floor(Math.random() * 5)],
              feelings[Math.floor(Math.random() * feelings.length)],
              postFeelings[Math.floor(Math.random() * postFeelings.length)],
              d,
            ],
          );
        }
      }
    }
    console.log('  Breathe sessions: ~12 entries seeded');

    // ─── 14. Care Plans ──────────────────────────────────────
    for (let i = 0; i < 3; i++) {
      await client.query(
        `INSERT INTO care_plans (patient_id, created_by, title, goals_of_care, goals, interventions, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'active')`,
        [
          patientIds[i],
          actualClinicianUserId,
          `Palliative Care Plan - ${patients[i].name}`,
          'Optimize pain management, maintain quality of life, support family caregivers',
          JSON.stringify([
            { goal: 'Pain NRS ≤ 4/10', status: 'in_progress' },
            { goal: 'Improve sleep quality', status: 'pending' },
            { goal: 'Maintain current functional status', status: 'in_progress' },
          ]),
          JSON.stringify([
            { intervention: 'Opioid titration per protocol', assigned_to: 'physician' },
            { intervention: 'Daily symptom monitoring via app', assigned_to: 'patient' },
            { intervention: 'Weekly psychosocial check-in', assigned_to: 'psychologist' },
          ]),
        ],
      );
    }
    console.log('  Care plans: 3 entries seeded');

    // ─── 15. Care Schedules ──────────────────────────────────
    for (let d = 0; d < 7; d++) {
      for (let cgIdx = 0; cgIdx < caregiverIds.length; cgIdx++) {
        await client.query(
          `INSERT INTO care_schedules (patient_id, caregiver_id, date, start_time, end_time, notes)
           VALUES ($1, $2, CURRENT_DATE + $3::int, $4, $5, $6)`,
          [
            patientIds[cgIdx],
            caregiverIds[cgIdx],
            d,
            d % 2 === 0 ? '08:00' : '14:00',
            d % 2 === 0 ? '14:00' : '20:00',
            d === 0 ? 'First shift of the week' : null,
          ],
        );
      }
    }
    console.log('  Care schedules: 21 entries seeded');

    // ─── 16. Medication Database (Reference) ─────────────────
    const medDb = [
      { name: 'Morphine', category: 'opioid', nameHi: 'मॉर्फिन', medd: 1, nlem: true, palliative: true, brands: ['Morcontin', 'MS Contin'], routes: ['oral', 'subcutaneous', 'intravenous'] },
      { name: 'Oxycodone', category: 'opioid', nameHi: 'ऑक्सीकोडोन', medd: 1.5, nlem: false, palliative: true, brands: ['OxyContin', 'Oxyfast'], routes: ['oral'] },
      { name: 'Fentanyl', category: 'opioid', nameHi: 'फेंटेनिल', medd: null, nlem: true, palliative: true, brands: ['Durogesic', 'Fenpatch'], routes: ['transdermal', 'subcutaneous', 'intravenous'] },
      { name: 'Tramadol', category: 'opioid', nameHi: 'ट्रामाडोल', medd: 0.1, nlem: true, palliative: true, brands: ['Ultracet', 'Contramal'], routes: ['oral'] },
      { name: 'Paracetamol', category: 'non_opioid_analgesic', nameHi: 'पैरासिटामोल', medd: null, nlem: true, palliative: true, brands: ['Crocin', 'Dolo'], routes: ['oral'] },
      { name: 'Gabapentin', category: 'adjuvant', nameHi: 'गैबापेंटिन', medd: null, nlem: true, palliative: true, brands: ['Gabantin', 'Neurontin'], routes: ['oral'] },
      { name: 'Pregabalin', category: 'adjuvant', nameHi: 'प्रीगैबलिन', medd: null, nlem: false, palliative: true, brands: ['Lyrica', 'Pregastar'], routes: ['oral'] },
      { name: 'Ondansetron', category: 'anti_emetic', nameHi: 'ऑन्डैनसेट्रॉन', medd: null, nlem: true, palliative: true, brands: ['Emeset', 'Vomikind'], routes: ['oral', 'intravenous'] },
      { name: 'Metoclopramide', category: 'anti_emetic', nameHi: 'मेटोक्लोप्रामाइड', medd: null, nlem: true, palliative: true, brands: ['Perinorm', 'Reglan'], routes: ['oral', 'intravenous'] },
      { name: 'Dexamethasone', category: 'steroid', nameHi: 'डेक्सामेथासोन', medd: null, nlem: true, palliative: true, brands: ['Decadron', 'Dexona'], routes: ['oral', 'intravenous'] },
      { name: 'Lactulose', category: 'laxative', nameHi: 'लैक्टुलोज़', medd: null, nlem: true, palliative: true, brands: ['Duphalac', 'Lactihep'], routes: ['oral'] },
      { name: 'Bisacodyl', category: 'laxative', nameHi: 'बिसाकोडिल', medd: null, nlem: true, palliative: true, brands: ['Dulcolax'], routes: ['oral', 'rectal'] },
      { name: 'Duloxetine', category: 'adjuvant', nameHi: 'डुलोक्सेटिन', medd: null, nlem: false, palliative: true, brands: ['Cymbalta', 'Duvanta'], routes: ['oral'] },
      { name: 'Tapentadol', category: 'opioid', nameHi: 'टैपेंटाडोल', medd: 0.4, nlem: false, palliative: true, brands: ['Nucynta', 'Tapal'], routes: ['oral'] },
      { name: 'Codeine', category: 'opioid', nameHi: 'कोडीन', medd: 0.15, nlem: true, palliative: true, brands: ['Codeine Phosphate'], routes: ['oral'] },
    ];

    for (const m of medDb) {
      await client.query(
        `INSERT INTO medication_database (generic_name, category, name_hi, medd_factor, nlem_listed, palliative_use, brand_names, common_routes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [m.name, m.category, m.nameHi, m.medd, m.nlem, m.palliative, m.brands, m.routes],
      );
    }
    console.log(`  Medication DB: ${medDb.length} reference entries seeded`);

    // ─── 17. Notifications (sample) ──────────────────────────
    const notifTypes = ['medication_reminder', 'symptom_check', 'appointment', 'alert_new', 'education_new'];
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      for (let n = 0; n < 3; n++) {
        const userResult = await client.query(
          `SELECT user_id FROM patients WHERE id = $1`, [patientIds[pIdx]],
        );
        await client.query(
          `INSERT INTO notifications (user_id, type, title_en, title_hi, body_en, priority, channel, is_read, is_sent, sent_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'push', $7, TRUE, NOW() - make_interval(hours => $8))`,
          [
            userResult.rows[0].user_id,
            notifTypes[(pIdx + n) % notifTypes.length],
            ['Time for your medication', 'How are you feeling?', 'Upcoming appointment reminder', 'New clinical alert', 'New learning module available'][((pIdx + n) % 5)],
            ['दवा का समय हो गया', 'आप कैसा महसूस कर रहे हैं?', 'आगामी अपॉइंटमेंट रिमाइंडर', 'नया क्लिनिकल अलर्ट', 'नया शिक्षा मॉड्यूल उपलब्ध'][((pIdx + n) % 5)],
            'Please take action as needed.',
            n === 0 ? 'high' : 'normal',
            n > 0,
            n * 4 + pIdx,
          ],
        );
      }
    }
    console.log('  Notifications: 12 entries seeded');

    // ─── 18. Consent Records ─────────────────────────────────
    for (let pIdx = 0; pIdx < patientIds.length; pIdx++) {
      const userResult = await client.query(
        `SELECT user_id FROM patients WHERE id = $1`, [patientIds[pIdx]],
      );
      for (const consentType of ['data_collection', 'research_use', 'emergency_sharing']) {
        await client.query(
          `INSERT INTO consent_records (user_id, consent_type, granted, version, granted_at, method)
           VALUES ($1, $2, TRUE, '1.0.0', NOW() - INTERVAL '30 days', 'in_app')`,
          [userResult.rows[0].user_id, consentType],
        );
      }
    }
    console.log(`  Consent records: ${patientIds.length * 3} entries seeded`);

    await client.query('COMMIT');
    console.log('\nSeed complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
