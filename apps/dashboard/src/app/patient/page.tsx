'use client';

import { CheckCircle2, Heart, Clock, TrendingDown, Sparkles } from 'lucide-react';
import { usePatientProfile, useWellnessSummary, usePatientMedications } from '@/lib/patient-hooks';
import { usePatientAuth } from '@/lib/patient-auth';
import { useWithFallback } from '@/lib/use-api-status';
import {
  MOCK_PATIENT_PROFILE,
  MOCK_WELLNESS_SUMMARY,
  MOCK_MEDICATIONS_TODAY,
  MOCK_SYMPTOM_SUMMARY,
  MOCK_TODAY_INTENTION,
} from '@/lib/patient-mock-data';
import { ComfortCard } from '@/components/patient/ComfortCard';
import { MedicationStrip } from '@/components/patient/MedicationStrip';
import { QuickLogCard } from '@/components/patient/QuickLogCard';
import { painColor } from '@/lib/utils';
import Link from 'next/link';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PatientHomePage() {
  const { user } = usePatientAuth();
  const profileQuery = usePatientProfile();
  const wellnessQuery = useWellnessSummary();
  const medsQuery = usePatientMedications();

  const { data: profile } = useWithFallback(profileQuery, MOCK_PATIENT_PROFILE);
  const { data: wellness } = useWithFallback(wellnessQuery, MOCK_WELLNESS_SUMMARY);
  const { data: meds } = useWithFallback(medsQuery, MOCK_MEDICATIONS_TODAY);

  const firstName = user?.name?.split(' ')[0] ?? (profile as any).name?.split(' ')[0] ?? 'Friend';
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const w = wellness as any;
  const symptom = MOCK_SYMPTOM_SUMMARY;
  const intention = MOCK_TODAY_INTENTION;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero Greeting */}
      <div className="rounded-2xl bg-gradient-to-br from-sage via-teal to-teal-dark p-8 text-white shadow-lg">
        <h1 className="font-heading text-3xl font-bold">
          {greeting}, {firstName}
        </h1>
        <p className="mt-2 text-lg text-white/80">Today, You Matter</p>
      </div>

      {/* Today's Summary Strip */}
      {symptom.today && (
        <div className="flex items-center gap-4 rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: painColor(symptom.today.pain) }}
            >
              {symptom.today.pain}
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal">Last Pain Score</p>
              <p className="text-[11px] text-charcoal-light">
                {new Date(symptom.today.logged_at).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="h-8 w-px bg-sage-light/30" />
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-sage" />
            <div>
              <p className="text-xs font-semibold text-charcoal">Week Average</p>
              <p className="text-[11px] text-charcoal-light">
                {symptom.week_avg_pain}/10 &middot;{' '}
                <span className="text-sage">{symptom.trend}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Log */}
      <QuickLogCard />

      {/* Today's Medications */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-charcoal">
            Today&apos;s Medications
          </h2>
          <Link
            href="/patient/medications"
            className="text-xs font-semibold text-teal hover:underline"
          >
            View All &rarr;
          </Link>
        </div>
        <MedicationStrip medications={Array.isArray(meds) ? meds : MOCK_MEDICATIONS_TODAY} />
      </div>

      {/* Wellness Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ComfortCard
          title="Active Goals"
          value={w.active_goals ?? 0}
          subtitle={`${w.completed_goals_today ?? 0} done today`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="sage"
        />
        <ComfortCard
          title="Gratitude Streak"
          value={`${w.gratitude_streak ?? 0} days`}
          subtitle="Keep it going!"
          icon={<Heart className="h-5 w-5" />}
          color="lavender"
        />
        <ComfortCard
          title="Milestones"
          value={w.unseen_milestones ?? 0}
          subtitle="new achievements"
          icon={<Sparkles className="h-5 w-5" />}
          color="amber"
        />
      </div>

      {/* Today's Intention */}
      {intention && (
        <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10">
              <Clock className="h-5 w-5 text-amber" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-charcoal">
                Today&apos;s Intention
              </h3>
              <p className="mt-1 text-sm text-charcoal-light">
                {intention.content}
              </p>
              <span className="mt-2 inline-block rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-sage-dark">
                {intention.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: '/patient/breathe', label: 'Breathe', icon: '🧘', bg: 'bg-lavender-light/50' },
          { href: '/patient/learn', label: 'Learn', icon: '📚', bg: 'bg-sage/10' },
          { href: '/patient/journey', label: 'Journey', icon: '✨', bg: 'bg-amber/10' },
          { href: '/patient/messages', label: 'Messages', icon: '💬', bg: 'bg-teal/10' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-2 rounded-xl ${link.bg} p-4 transition-all hover:shadow-md`}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-xs font-semibold text-charcoal">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
