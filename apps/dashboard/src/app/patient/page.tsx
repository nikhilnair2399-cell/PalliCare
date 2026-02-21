'use client';

import { CheckCircle2, Heart, Clock, TrendingDown, Sparkles, Wind, BookOpen, MessageSquare, Brain, Moon, Apple, Footprints } from 'lucide-react';
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
      <div
        className="rounded-2xl p-8 text-white"
        style={{ background: 'linear-gradient(135deg, #2A6B6B 0%, #1A4A4A 50%, #2A6B6B 100%)' }}
      >
        <h1 className="font-heading text-[28px] font-bold">
          {greeting}, {firstName}
        </h1>
        <p className="mt-1 text-[16px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Today, You Matter
        </p>
      </div>

      {/* Today&apos;s Summary Strip */}
      {symptom.today && (
        <div
          className="flex items-center gap-4 rounded-xl bg-white p-4"
          style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{ backgroundColor: painColor(symptom.today.pain) }}
            >
              {symptom.today.pain}
            </div>
            <div>
              <p className="text-[12px] font-semibold" style={{ color: '#2D2D2D' }}>Last Pain Score</p>
              <p className="text-[11px]" style={{ color: '#4A4A4A' }}>
                {new Date(symptom.today.logged_at).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="h-8 w-px" style={{ backgroundColor: 'rgba(168,203,181,0.25)' }} />
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" style={{ color: '#7BA68C' }} />
            <div>
              <p className="text-[12px] font-semibold" style={{ color: '#2D2D2D' }}>Week Average</p>
              <p className="text-[11px]" style={{ color: '#4A4A4A' }}>
                {symptom.week_avg_pain}/10 &middot;{' '}
                <span style={{ color: '#7BA68C' }}>{symptom.trend}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Log */}
      <QuickLogCard />

      {/* Today&apos;s Medications */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-[17px] font-bold" style={{ color: '#2D2D2D' }}>
            Today&apos;s Medications
          </h2>
          <Link
            href="/patient/medications"
            className="text-[12px] font-semibold"
            style={{ color: '#2A6B6B' }}
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

      {/* Today&apos;s Intention */}
      {intention && (
        <div
          className="rounded-xl bg-white p-5"
          style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: 'rgba(232,168,56,0.08)' }}
            >
              <Clock className="h-5 w-5" style={{ color: '#E8A838' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold" style={{ color: '#2D2D2D' }}>
                Today&apos;s Intention
              </h3>
              <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>
                {intention.content}
              </p>
              <span
                className="mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{
                  backgroundColor: 'rgba(123,166,140,0.08)',
                  color: '#5A8A6E',
                }}
              >
                {intention.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Health Trackers */}
      <div>
        <h2 className="mb-3 font-heading text-[17px] font-bold" style={{ color: '#2D2D2D' }}>
          Health Trackers
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: '/patient/mood-check', label: 'Mood Check', icon: Brain, bg: 'rgba(217,212,231,0.2)', color: '#8B7BB5' },
            { href: '/patient/sleep', label: 'Sleep', icon: Moon, bg: 'rgba(107,123,179,0.08)', color: '#6B7BB3' },
            { href: '/patient/nutrition', label: 'Nutrition', icon: Apple, bg: 'rgba(123,166,140,0.08)', color: '#7BA68C' },
            { href: '/patient/functional-status', label: 'Daily Ability', icon: Footprints, bg: 'rgba(42,107,107,0.06)', color: '#2A6B6B' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2.5 rounded-xl p-4 transition-shadow hover:shadow-md"
              style={{ backgroundColor: link.bg }}
            >
              <link.icon className="h-5 w-5" style={{ color: link.color }} />
              <span className="text-[12px] font-semibold" style={{ color: '#2D2D2D' }}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: '/patient/my-wishes', label: 'My Wishes', icon: Heart, bg: 'rgba(212,133,107,0.08)' },
          { href: '/patient/breathe', label: 'Breathe', icon: Wind, bg: 'rgba(217,212,231,0.2)' },
          { href: '/patient/learn', label: 'Learn', icon: BookOpen, bg: 'rgba(123,166,140,0.08)' },
          { href: '/patient/journey', label: 'Journey', icon: Sparkles, bg: 'rgba(232,168,56,0.08)' },
          { href: '/patient/messages', label: 'Messages', icon: MessageSquare, bg: 'rgba(42,107,107,0.06)' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-2.5 rounded-xl p-4 transition-shadow hover:shadow-md"
            style={{ backgroundColor: link.bg }}
          >
            <link.icon className="h-5 w-5" style={{ color: '#2A6B6B' }} />
            <span className="text-[12px] font-semibold" style={{ color: '#2D2D2D' }}>
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
