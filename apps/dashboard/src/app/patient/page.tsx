'use client';

import Link from 'next/link';
import { Activity, Pill, Heart, Wind, Sparkles, BookOpen, TrendingUp, MessageCircle, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { usePatientProfile, useWellnessSummary, usePatientMedications } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PATIENT_PROFILE, MOCK_WELLNESS_SUMMARY, MOCK_MEDICATIONS } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PatientHomePage() {
  const profileQuery = usePatientProfile();
  const wellnessQuery = useWellnessSummary();
  const medsQuery = usePatientMedications();

  const { data: profile } = useWithFallback(profileQuery, MOCK_PATIENT_PROFILE);
  const { data: wellness } = useWithFallback(wellnessQuery, MOCK_WELLNESS_SUMMARY);
  const { data: rawMeds } = useWithFallback(medsQuery, MOCK_MEDICATIONS);

  const p = profile as any;
  const w = wellness as any;
  const meds: any[] = Array.isArray(rawMeds) ? rawMeds : MOCK_MEDICATIONS;
  const pendingMeds = meds.flatMap((m: any) =>
    (m.schedule || []).filter((s: any) => s.status === 'pending'),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">
          Today, You Matter
        </h1>
        <p className="text-sm text-charcoal-light">
          Your daily wellness overview &mdash; track, reflect, and stay connected
        </p>
      </div>

      {/* Stat Cards — 4 columns on desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pain Level"
          value={String(w.current_pain ?? w.last_pain ?? '3')}
          change={w.pain_trend ?? 'Stable today'}
          changeType="info"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          title="Medications Today"
          value={`${meds.length > 0 ? meds.flatMap((m: any) => m.schedule || []).filter((s: any) => s.status === 'taken').length : 0}/${meds.flatMap((m: any) => m.schedule || []).length || 0}`}
          change="Taken / Total doses"
          changeType="increase"
          icon={<Pill className="h-5 w-5" />}
        />
        <StatCard
          title="Wellness Streak"
          value={`${w.gratitude_streak ?? w.streak ?? 5} days`}
          change="Gratitude journal streak"
          changeType="increase"
          icon={<Heart className="h-5 w-5" />}
        />
        <StatCard
          title="Breathe Sessions"
          value={String(w.breathe_sessions ?? w.total_sessions ?? 12)}
          change={`${w.breathe_minutes ?? w.total_minutes ?? 48} minutes total`}
          changeType="info"
          icon={<Wind className="h-5 w-5" />}
        />
      </div>

      {/* Main Grid — 2/3 + 1/3 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Medications */}
          <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-sage-light/20 px-5 py-4">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
                <Pill className="h-5 w-5" />
                Today&apos;s Medications
              </h2>
              <Link href="/patient/medications" className="text-xs font-semibold text-teal hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="divide-y divide-sage-light/10">
              {meds.slice(0, 4).map((med: any, i: number) => (
                <div key={med.id || i} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-cream/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10">
                      <Pill className="h-4 w-4 text-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{med.name}</p>
                      <p className="text-xs text-charcoal-light">{med.dose} &middot; {med.frequency || 'Daily'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(med.schedule || []).some((s: any) => s.status === 'taken') ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-medium text-sage-dark">
                        <CheckCircle2 className="h-3 w-3" /> Taken
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber/10 px-2.5 py-0.5 text-xs font-medium text-amber">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {meds.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <Pill className="mx-auto h-8 w-8 text-charcoal/20" />
                  <p className="mt-2 text-xs text-charcoal/50">No medications scheduled</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Symptom Log */}
          <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-sage-light/20 px-5 py-4">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
                <Activity className="h-5 w-5" />
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { label: 'Log Symptoms', href: '/patient/log', icon: Activity, color: 'bg-teal/10 text-teal' },
                { label: 'Pain Diary', href: '/patient/pain-diary', icon: TrendingUp, color: 'bg-terra/10 text-terra' },
                { label: 'Breathe', href: '/patient/breathe', icon: Wind, color: 'bg-sage/10 text-sage-dark' },
                { label: 'Learn', href: '/patient/learn', icon: BookOpen, color: 'bg-lavender/20 text-charcoal' },
                { label: 'Journey', href: '/patient/journey', icon: Sparkles, color: 'bg-amber/10 text-amber' },
                { label: 'Messages', href: '/patient/messages', icon: MessageCircle, color: 'bg-teal/10 text-teal' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-sage-light/20 p-4 text-center transition-all hover:border-sage-light/40 hover:shadow-sm"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-charcoal">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — 1 col */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-charcoal">Profile</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-lg font-bold text-white">
                {(p.name || 'R').charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{p.name}</p>
                <p className="text-xs text-charcoal-light">UHID: {p.uhid}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-sage-light/10 pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-light">Diagnosis</span>
                <span className="font-medium text-charcoal">{p.diagnosis || '-'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-light">Age</span>
                <span className="font-medium text-charcoal">{p.age ?? '-'} years</span>
              </div>
            </div>
          </div>

          {/* Today's Intention */}
          <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-charcoal">
              <Sparkles className="h-4 w-4 text-amber" />
              Today&apos;s Intention
            </h3>
            <p className="mt-3 text-sm italic leading-relaxed text-charcoal-light">
              &ldquo;{w.todays_intention || 'I will find moments of peace and gratitude today.'}&rdquo;
            </p>
          </div>

          {/* Pending Medications */}
          {pendingMeds.length > 0 && (
            <div className="rounded-xl border border-amber/30 bg-amber/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-charcoal">
                <Pill className="h-4 w-4 text-amber" />
                Upcoming Doses
              </h3>
              <div className="mt-3 space-y-2">
                {pendingMeds.slice(0, 3).map((dose: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-charcoal">{dose.time}</span>
                    <span className="rounded-full bg-amber/10 px-2 py-0.5 font-medium text-amber">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/patient/medications"
                className="mt-3 block text-center text-xs font-semibold text-teal hover:underline"
              >
                View All Medications &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
