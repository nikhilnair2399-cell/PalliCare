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
