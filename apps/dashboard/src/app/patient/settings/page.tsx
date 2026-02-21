'use client';

import { useState } from 'react';
import { User, Globe, Bell, Shield, LogOut, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePatientAuth } from '@/lib/patient-auth';
import { usePatientProfile, useUpdatePatientProfile } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PATIENT_PROFILE } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PatientSettingsPage() {
  const { user, logout } = usePatientAuth();
  const profileQuery = usePatientProfile();
  const updateProfile = useUpdatePatientProfile();
  const { data: rawProfile } = useWithFallback(profileQuery, MOCK_PATIENT_PROFILE);
  const profile = rawProfile as any;

  const [language, setLanguage] = useState(user?.preferred_language || 'en');
  const [notifications, setNotifications] = useState({
    medication_reminders: true,
    symptom_reminders: true,
    care_team_messages: true,
    educational_content: false,
  });

  function handleLanguageChange(lang: 'en' | 'hi') {
    setLanguage(lang);
    updateProfile.mutate({ preferred_language: lang });
  }

  function toggleNotification(key: string) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Settings</h1>
        <p className="text-sm text-charcoal-light">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <User className="h-5 w-5 text-teal" />
          <h2 className="text-sm font-bold text-charcoal">Profile</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sage to-teal text-xl font-bold text-white">
            {(profile.name || user?.name || 'R').charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-charcoal">
              {profile.name || user?.name}
            </p>
            <p className="text-xs text-charcoal-light">
              UHID: {profile.uhid || user?.uhid}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-sage-light/20 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-light">Phone</span>
            <span className="text-sm font-medium text-charcoal">
              {profile.phone || user?.phone}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-light">Age</span>
            <span className="text-sm font-medium text-charcoal">
              {profile.age ?? '-'} years
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-light">Diagnosis</span>
            <span className="text-right text-sm font-medium text-charcoal">
              {profile.diagnosis || '-'}
            </span>
          </div>
          {profile.care_team && (
            <div>
              <span className="text-xs text-charcoal-light">Care Team</span>
              <div className="mt-1.5 space-y-1">
                {profile.care_team.map((member: any, i: number) => (
                  <p key={i} className="text-sm text-charcoal">
                    <span className="font-medium">{member.name}</span>{' '}
                    <span className="text-charcoal-light">
                      &middot; {member.role}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Globe className="h-5 w-5 text-teal" />
          <h2 className="text-sm font-bold text-charcoal">Language</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleLanguageChange('en')}
            className={cn(
              'flex-1 rounded-xl border-2 py-3 text-center text-sm font-medium transition-all',
              language === 'en'
                ? 'border-teal bg-teal/5 text-teal'
                : 'border-sage-light/30 text-charcoal-light hover:border-sage',
            )}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('hi')}
            className={cn(
              'flex-1 rounded-xl border-2 py-3 text-center text-sm font-medium transition-all',
              language === 'hi'
                ? 'border-teal bg-teal/5 text-teal'
                : 'border-sage-light/30 text-charcoal-light hover:border-sage',
            )}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Bell className="h-5 w-5 text-teal" />
          <h2 className="text-sm font-bold text-charcoal">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'medication_reminders', label: 'Medication Reminders' },
            { key: 'symptom_reminders', label: 'Symptom Log Reminders' },
            { key: 'care_team_messages', label: 'Care Team Messages' },
            { key: 'educational_content', label: 'New Educational Content' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-charcoal">{label}</span>
              <button
                onClick={() => toggleNotification(key)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  notifications[key as keyof typeof notifications]
                    ? 'bg-teal'
                    : 'bg-sage-light/40',
                )}
              >
                <span
                  className={cn(
                    'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                    notifications[key as keyof typeof notifications] && 'translate-x-5',
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Consent */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <Shield className="h-5 w-5 text-teal" />
          <h2 className="text-sm font-bold text-charcoal">Privacy & Consent</h2>
        </div>
        <p className="text-xs text-charcoal-light leading-relaxed">
          Your data is protected under the Digital Personal Data Protection Act
          (DPDPA) 2023. All health records are stored securely within AIIMS Bhopal
          infrastructure and are only accessible to your authorized care team.
        </p>
        <button className="mt-3 text-xs font-semibold text-teal hover:underline">
          View Consent Details &rarr;
        </button>
      </div>

      {/* Sign Out */}
      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-alert-critical/20 py-3 text-sm font-medium text-alert-critical hover:bg-alert-critical/5"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      {/* Footer */}
      <div className="border-t border-sage-light/20 pt-4 text-center">
        <p className="text-xs text-charcoal/40">
          PalliCare v1.0.0 &middot; AIIMS Bhopal
        </p>
        <div className="mt-1 flex items-center justify-center gap-1 text-xs text-charcoal/30">
          <Heart className="h-3 w-3" />
          Built with compassion
        </div>
      </div>
    </div>
  );
}
