'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  User,
  Stethoscope,
  Activity,
  Pill,
  Wind,
  Users,
  CheckCircle2,
  Loader2,
  SkipForward,
  Heart,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Animations ─────────────────────────────────────────────── */
const styles = `
@keyframes fade-up {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes scale-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes confetti-burst {
  0% { opacity: 1; transform: scale(0); }
  50% { opacity: 1; transform: scale(1.3); }
  100% { opacity: 0; transform: scale(1.5); }
}
`;

const TOTAL_STEPS = 7;

const ESAS_SYMPTOMS = [
  'Pain', 'Tiredness', 'Nausea', 'Depression', 'Anxiety',
  'Drowsiness', 'Appetite Loss', 'Shortness of Breath', 'Wellbeing',
];

const BREATHING_TECHNIQUES = [
  { id: 'box', name: '4-4-4-4 Box Breathing', desc: 'Equal inhale, hold, exhale, hold' },
  { id: '478', name: '4-7-8 Relaxation', desc: 'Calming technique for sleep & anxiety' },
  { id: 'gentle', name: '2-4 Gentle Calm', desc: 'Short inhale, long exhale for quick relief' },
  { id: 'equal', name: '6-0-6 Equal Breathing', desc: 'Balanced breathing without holds' },
];

const CHECK_IN_TIMES = [
  { id: 'morning', label: 'Morning', time: '8:00 AM' },
  { id: 'afternoon', label: 'Afternoon', time: '2:00 PM' },
  { id: 'evening', label: 'Evening', time: '7:00 PM' },
];

const STEP_ICONS = [Leaf, User, Stethoscope, Activity, Pill, Wind, Users];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Step 1: Profile
  const [preferredName, setPreferredName] = useState('');
  const [age, setAge] = useState('');

  // Step 2: Care context
  const [diagnosisAwareness, setDiagnosisAwareness] = useState<string>('');
  const [treatmentPhase, setTreatmentPhase] = useState<string>('');

  // Step 3: Symptom priorities
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Step 4: Medications
  const [medsConfirmed, setMedsConfirmed] = useState<boolean | null>(null);

  // Step 5: Wellness preferences
  const [breatheTechnique, setBreatheTechnique] = useState('');
  const [checkInTime, setCheckInTime] = useState('morning');

  // Step 6: Emergency contacts
  const [contacts, setContacts] = useState([
    { name: '', phone: '', relation: '' },
  ]);

  // Redirect if already onboarded
  useEffect(() => {
    const onboarded = localStorage.getItem('patient_onboarding_complete');
    if (onboarded === 'true') {
      router.replace('/patient');
    }
  }, [router]);

  function nextStep() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      setAnimKey((k) => k + 1);
    }
  }

  function prevStep() {
    if (step > 0) {
      setStep(step - 1);
      setAnimKey((k) => k + 1);
    }
  }

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : prev.length < 5
          ? [...prev, symptom]
          : prev,
    );
  }

  function addContact() {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', phone: '', relation: '' }]);
    }
  }

  function removeContact(idx: number) {
    setContacts(contacts.filter((_, i) => i !== idx));
  }

  function updateContact(idx: number, field: string, value: string) {
    const updated = [...contacts];
    updated[idx] = { ...updated[idx], [field]: value };
    setContacts(updated);
  }

  async function handleComplete() {
    setLoading(true);

    // Save onboarding data to localStorage (would go to API in production)
    const onboardingData = {
      preferred_name: preferredName,
      age,
      diagnosis_awareness: diagnosisAwareness,
      treatment_phase: treatmentPhase,
      priority_symptoms: selectedSymptoms,
      meds_confirmed: medsConfirmed,
      breathe_technique: breatheTechnique,
      check_in_time: checkInTime,
      emergency_contacts: contacts.filter((c) => c.name && c.phone),
      completed_at: new Date().toISOString(),
    };

    localStorage.setItem('patient_onboarding_data', JSON.stringify(onboardingData));
    localStorage.setItem('patient_onboarding_complete', 'true');

    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push('/patient');
  }

  const StepIcon = STEP_ICONS[step] || Leaf;
  const canProceed = (() => {
    switch (step) {
      case 0: return true; // Welcome — always can proceed
      case 1: return true; // Profile — optional
      case 2: return true; // Care context — optional
      case 3: return true; // Symptoms — optional (but encouraged)
      case 4: return true; // Medications — optional
      case 5: return true; // Wellness — optional
      case 6: return true; // Contacts — optional
      default: return true;
    }
  })();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="flex min-h-screen flex-col bg-cream">
        {/* Progress bar */}
        <div className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm">
          <div className="mx-auto max-w-lg px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-charcoal/50">
                Step {step + 1} of {TOTAL_STEPS}
              </span>
              {step > 0 && step < TOTAL_STEPS - 1 && (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 text-xs text-charcoal/40 hover:text-teal transition-colors"
                >
                  Skip <SkipForward className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-charcoal/8">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-4 sm:py-8">
          <div
            key={animKey}
            className="w-full max-w-lg"
            style={{ animation: 'fade-up 0.35s ease-out' }}
          >

            {/* ── Step 0: Welcome ─────────────────────────── */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-teal/10">
                    <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-teal" />
                  </div>
                </div>
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal">
                    Welcome to PalliCare
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-charcoal-light leading-relaxed max-w-sm mx-auto">
                    Let&apos;s set up your wellness space. This takes about 2 minutes and helps us personalize your experience.
                  </p>
                </div>

                <div className="space-y-3 text-left max-w-xs mx-auto">
                  {[
                    'Track your symptoms & medications',
                    'Practice guided breathing exercises',
                    'Stay connected with your care team',
                    'Build wellness habits at your pace',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/20">
                        <CheckCircle2 className="h-3.5 w-3.5 text-sage" />
                      </div>
                      <span className="text-sm text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  className="mx-auto flex h-12 sm:h-14 w-full max-w-xs items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-sm sm:text-base font-bold text-white transition-all hover:bg-teal/90 active:scale-[0.98]"
                >
                  Let&apos;s Get Started
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* ── Step 1: Profile Basics ──────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <User className="h-6 w-6 text-teal" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">About You</h2>
                  <p className="mt-1 text-sm text-charcoal-light">How should we address you?</p>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-charcoal">
                      Preferred Name
                    </label>
                    <input
                      type="text"
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                      placeholder="What should we call you?"
                      className="h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border border-charcoal/10 bg-white px-4 text-base text-charcoal placeholder:text-charcoal/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-charcoal">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Your age"
                      min={1}
                      max={120}
                      className="h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border border-charcoal/10 bg-white px-4 text-base text-charcoal placeholder:text-charcoal/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                    />
                  </div>

                  {/* Avatar placeholder */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream text-charcoal/30">
                      <User className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal/60">Profile Photo</p>
                      <p className="text-xs text-charcoal/35">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Care Context ────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <Stethoscope className="h-6 w-6 text-teal" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">Your Care Context</h2>
                  <p className="mt-1 text-sm text-charcoal-light">This helps us tailor content for you</p>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal">
                      How much do you know about your diagnosis?
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'full', label: 'I know my full diagnosis and treatment plan' },
                        { value: 'partial', label: 'I know some details, but not everything' },
                        { value: 'minimal', label: 'I prefer my family/caregiver to handle details' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDiagnosisAwareness(opt.value)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all',
                            diagnosisAwareness === opt.value
                              ? 'border-teal bg-teal/5 text-charcoal'
                              : 'border-charcoal/10 text-charcoal/70 hover:border-charcoal/20',
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                              diagnosisAwareness === opt.value
                                ? 'border-teal bg-teal'
                                : 'border-charcoal/20',
                            )}
                          >
                            {diagnosisAwareness === opt.value && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal">
                      Current treatment phase
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'active', label: 'Active Treatment' },
                        { value: 'palliative', label: 'Comfort-Focused' },
                        { value: 'post', label: 'Post-Treatment' },
                        { value: 'unsure', label: 'Not Sure' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setTreatmentPhase(opt.value)}
                          className={cn(
                            'rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                            treatmentPhase === opt.value
                              ? 'border-teal bg-teal/5 text-teal'
                              : 'border-charcoal/10 text-charcoal/60 hover:border-charcoal/20',
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Symptom Priorities ──────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <Activity className="h-6 w-6 text-teal" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">Symptom Priorities</h2>
                  <p className="mt-1 text-sm text-charcoal-light">
                    Pick up to 5 symptoms you want to focus on
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {ESAS_SYMPTOMS.map((symptom) => {
                      const selected = selectedSymptoms.includes(symptom);
                      return (
                        <button
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className={cn(
                            'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                            selected
                              ? 'border-teal bg-teal text-white'
                              : 'border-charcoal/10 text-charcoal/60 hover:border-teal/40 hover:text-teal',
                          )}
                        >
                          {symptom}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs text-charcoal/40 text-center">
                    {selectedSymptoms.length} of 5 selected
                    {selectedSymptoms.length === 0 && ' — you can always change this later'}
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 4: Medications ─────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <Pill className="h-6 w-6 text-teal" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">Your Medications</h2>
                  <p className="mt-1 text-sm text-charcoal-light">
                    Your care team has set up your medication list
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6 space-y-3">
                  {/* Sample medications from mock data */}
                  {['Morphine SR 30mg', 'Ondansetron 4mg', 'Gabapentin 300mg', 'Dexamethasone 4mg', 'Pantoprazole 40mg'].map((med, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-cream/60 px-4 py-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/10">
                        <Pill className="h-4 w-4 text-teal" />
                      </div>
                      <span className="text-sm font-medium text-charcoal">{med}</span>
                    </div>
                  ))}
                  <p className="text-xs text-charcoal/40 text-center pt-2">
                    + {6} more medications in your list
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
                  <p className="text-sm font-medium text-charcoal mb-3">
                    Does this medication list look correct?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMedsConfirmed(true)}
                      className={cn(
                        'rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                        medsConfirmed === true
                          ? 'border-sage bg-sage/10 text-sage'
                          : 'border-charcoal/10 text-charcoal/60 hover:border-sage/40',
                      )}
                    >
                      Yes, looks right
                    </button>
                    <button
                      onClick={() => setMedsConfirmed(false)}
                      className={cn(
                        'rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                        medsConfirmed === false
                          ? 'border-amber bg-amber/10 text-amber'
                          : 'border-charcoal/10 text-charcoal/60 hover:border-amber/40',
                      )}
                    >
                      Need changes
                    </button>
                  </div>
                  {medsConfirmed === false && (
                    <p className="mt-3 text-xs text-charcoal/50 bg-cream/60 rounded-lg px-3 py-2">
                      No worries! You can update medications from the Medications page, or ask your care team to adjust them.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 5: Wellness Preferences ───────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <Wind className="h-6 w-6 text-teal" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">Wellness Preferences</h2>
                  <p className="mt-1 text-sm text-charcoal-light">
                    Personalize your daily wellness routine
                  </p>
                </div>

                {/* Breathing technique */}
                <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
                  <h3 className="text-sm font-medium text-charcoal mb-3">
                    Preferred breathing technique
                  </h3>
                  <div className="space-y-2">
                    {BREATHING_TECHNIQUES.map((tech) => (
                      <button
                        key={tech.id}
                        onClick={() => setBreatheTechnique(tech.id)}
                        className={cn(
                          'flex w-full flex-col items-start rounded-xl border px-4 py-3 text-left transition-all',
                          breatheTechnique === tech.id
                            ? 'border-teal bg-teal/5'
                            : 'border-charcoal/10 hover:border-charcoal/20',
                        )}
                      >
                        <span className={cn(
                          'text-sm font-medium',
                          breatheTechnique === tech.id ? 'text-teal' : 'text-charcoal',
                        )}>
                          {tech.name}
                        </span>
                        <span className="text-xs text-charcoal/50">{tech.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Check-in time */}
                <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
                  <h3 className="text-sm font-medium text-charcoal mb-3">
                    Daily check-in reminder
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {CHECK_IN_TIMES.map((time) => (
                      <button
                        key={time.id}
                        onClick={() => setCheckInTime(time.id)}
                        className={cn(
                          'flex flex-col items-center rounded-xl border px-3 py-3 transition-all',
                          checkInTime === time.id
                            ? 'border-teal bg-teal/5'
                            : 'border-charcoal/10 hover:border-charcoal/20',
                        )}
                      >
                        <span className={cn(
                          'text-sm font-medium',
                          checkInTime === time.id ? 'text-teal' : 'text-charcoal',
                        )}>
                          {time.label}
                        </span>
                        <span className="text-xs text-charcoal/40">{time.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 6: Emergency Contacts ──────────────── */}
            {step === 6 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <Users className="h-6 w-6 text-teal" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">Emergency Contacts</h2>
                  <p className="mt-1 text-sm text-charcoal-light">
                    People who should be notified in emergencies
                  </p>
                </div>

                <div className="space-y-3">
                  {contacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-charcoal/60">
                          Contact {idx + 1}
                        </span>
                        {contacts.length > 1 && (
                          <button
                            onClick={() => removeContact(idx)}
                            className="text-charcoal/30 hover:text-alert-critical transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => updateContact(idx, 'name', e.target.value)}
                        placeholder="Name"
                        className="h-11 sm:h-12 w-full rounded-xl border border-charcoal/10 bg-white px-4 text-sm text-charcoal placeholder:text-charcoal/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => updateContact(idx, 'phone', e.target.value.replace(/\D/g, ''))}
                          placeholder="Phone number"
                          maxLength={10}
                          className="h-11 sm:h-12 w-full rounded-xl border border-charcoal/10 bg-white px-4 text-sm text-charcoal placeholder:text-charcoal/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                        />
                        <input
                          type="text"
                          value={contact.relation}
                          onChange={(e) => updateContact(idx, 'relation', e.target.value)}
                          placeholder="Relation (e.g., Son)"
                          className="h-11 sm:h-12 w-full rounded-xl border border-charcoal/10 bg-white px-4 text-sm text-charcoal placeholder:text-charcoal/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {contacts.length < 3 && (
                  <button
                    onClick={addContact}
                    className="w-full rounded-xl border border-dashed border-charcoal/15 px-4 py-3 text-sm text-charcoal/50 hover:border-teal/40 hover:text-teal transition-all"
                  >
                    + Add another contact
                  </button>
                )}

                {/* Complete button */}
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-sm sm:text-base font-bold text-white transition-all hover:bg-teal/90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Complete Setup
                      <Heart className="h-5 w-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-charcoal/35">
                  You can update all preferences anytime from Settings
                </p>
              </div>
            )}

            {/* ── Navigation (Steps 1-5) ──────────────────── */}
            {step >= 1 && step <= 5 && (
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={prevStep}
                  className="flex h-12 items-center gap-1.5 rounded-xl border border-charcoal/10 px-4 text-sm font-medium text-charcoal/60 transition-all hover:border-charcoal/20 hover:text-charcoal active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceed}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-sm font-bold text-white transition-all hover:bg-teal/90 active:scale-[0.98] disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Back button for step 6 (above the complete button) */}
            {step === 6 && (
              <div className="mt-3">
                <button
                  onClick={prevStep}
                  className="flex h-10 items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Wellness Preferences
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === step ? 'w-6 bg-teal' : i < step ? 'w-1.5 bg-teal/40' : 'w-1.5 bg-charcoal/10',
              )}
            />
          ))}
        </div>
      </div>
    </>
  );
}
