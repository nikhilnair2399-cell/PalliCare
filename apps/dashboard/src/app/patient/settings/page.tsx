'use client';

import { useState } from 'react';
import { Settings, User, Globe, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { usePatientProfile, useUpdatePatientProfile } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PATIENT_PROFILE } from '@/lib/patient-mock-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function SettingsPage() {
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    medication_reminders: true,
    appointment_alerts: true,
    care_messages: true,
    wellness_tips: false,
  });
  const [saving, setSaving] = useState(false);

  const profileQuery = usePatientProfile();
  const updateProfile = useUpdatePatientProfile();
  const { data: profile } = useWithFallback(profileQuery, MOCK_PATIENT_PROFILE);
  const p = profile as any;

  function handleSave() {
    setSaving(true);
    updateProfile.mutate(
      { preferred_language: language, notifications },
      {
        onSettled: () => setTimeout(() => setSaving(false), 500),
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Settings</h1>
        <p className="text-sm text-charcoal-light">
          Manage your profile, preferences, and notifications
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Information */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <User className="h-5 w-5" />
            Profile
          </h2>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal text-2xl font-bold text-white">
              {(p.name || 'R').charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-charcoal">{p.name}</p>
              <p className="text-sm text-charcoal-light">UHID: {p.uhid}</p>
              <p className="text-xs text-charcoal-light">{p.phone}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-sage-light/10 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-charcoal/50">Diagnosis</p>
              <p className="mt-1 text-sm text-charcoal">{p.diagnosis || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-charcoal/50">Age</p>
              <p className="mt-1 text-sm text-charcoal">{p.age ?? '-'} years</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-charcoal/50">Primary Clinician</p>
              <p className="mt-1 text-sm text-charcoal">{p.primary_clinician || 'Dr. Nikhil Nair'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-charcoal/50">Department</p>
              <p className="mt-1 text-sm text-charcoal">Palliative Medicine, AIIMS Bhopal</p>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <Globe className="h-5 w-5" />
            Language
          </h2>
          <p className="mt-1 text-xs text-charcoal-light">Choose your preferred language for the interface</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'Hindi' },
              { code: 'mr', label: 'Marathi' },
              { code: 'ta', label: 'Tamil' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`rounded-xl border p-3 text-center text-sm font-medium transition-all ${
                  language === lang.code
                    ? 'border-teal bg-teal/5 text-teal'
                    : 'border-sage-light/20 text-charcoal-light hover:border-sage-light/40'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <div className="mt-4 space-y-4">
            {[
              { key: 'medication_reminders', label: 'Medication Reminders', desc: 'Get reminded when it\'s time to take medication' },
              { key: 'appointment_alerts', label: 'Appointment Alerts', desc: 'Upcoming appointment notifications' },
              { key: 'care_messages', label: 'Care Team Messages', desc: 'Notifications for new messages from your care team' },
              { key: 'wellness_tips', label: 'Wellness Tips', desc: 'Daily tips for comfort and wellbeing' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">{item.label}</p>
                  <p className="text-xs text-charcoal-light">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-teal' : 'bg-charcoal/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <Shield className="h-5 w-5" />
            Privacy &amp; Data
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">Data Encryption</p>
                <p className="text-xs text-charcoal-light">Your data is encrypted at rest and in transit</p>
              </div>
              <span className="rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-semibold text-sage-dark">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">DPDPA 2023 Compliance</p>
                <p className="text-xs text-charcoal-light">Compliant with Digital Personal Data Protection Act</p>
              </div>
              <span className="rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-semibold text-sage-dark">Compliant</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-teal px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal/90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
