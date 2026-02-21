'use client';

import { useState } from 'react';
import { User, Globe, Bell, Shield, Save, Loader2, Accessibility, Phone } from 'lucide-react';
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
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Settings</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Manage your profile, preferences, and notifications
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
          <User className="h-5 w-5 text-teal" />
          Profile
        </h2>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-2xl font-bold text-white">
            {(p.name || 'R').charAt(0)}
          </div>
          <div>
            <p className="text-xl font-semibold text-charcoal">{p.name}</p>
            <p className="text-sm text-charcoal-light">UHID: {p.uhid}</p>
            <p className="text-sm text-charcoal-light">{p.phone}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-charcoal/5 pt-5">
          <div>
            <p className="text-xs font-semibold uppercase text-charcoal/40">Diagnosis</p>
            <p className="mt-1 text-base text-charcoal">{p.diagnosis || '-'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-charcoal/40">Age</p>
            <p className="mt-1 text-base text-charcoal">{p.age ?? '-'} years</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-charcoal/40">Primary Clinician</p>
            <p className="mt-1 text-base text-charcoal">{p.primary_clinician || 'Dr. Nikhil Nair'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-charcoal/40">Department</p>
            <p className="mt-1 text-base text-charcoal">Palliative Medicine, AIIMS Bhopal</p>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
          <Globe className="h-5 w-5 text-teal" />
          Language
        </h2>
        <p className="mt-1 text-sm text-charcoal-light">Choose your preferred language</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'Hindi' },
            { code: 'mr', label: 'Marathi' },
            { code: 'ta', label: 'Tamil' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`rounded-xl p-4 text-center text-base font-medium transition-all ${
                language === lang.code
                  ? 'bg-teal/5 text-teal ring-2 ring-teal/20'
                  : 'bg-cream text-charcoal-light hover:bg-charcoal/5'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
          <Bell className="h-5 w-5 text-teal" />
          Notifications
        </h2>
        <div className="mt-4 space-y-5">
          {[
            { key: 'medication_reminders', label: 'Medication Reminders', desc: 'Get reminded when it\'s time to take medication' },
            { key: 'appointment_alerts', label: 'Appointment Alerts', desc: 'Upcoming appointment notifications' },
            { key: 'care_messages', label: 'Care Team Messages', desc: 'Notifications for new messages from your care team' },
            { key: 'wellness_tips', label: 'Wellness Tips', desc: 'Daily tips for comfort and wellbeing' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-charcoal">{item.label}</p>
                <p className="text-sm text-charcoal-light">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({
                  ...prev,
                  [item.key]: !prev[item.key as keyof typeof prev],
                }))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-teal' : 'bg-charcoal/20'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
          <Accessibility className="h-5 w-5 text-teal" />
          Accessibility
        </h2>
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-base font-medium text-charcoal">Text Size</p>
            <p className="text-sm text-charcoal-light">Choose a comfortable reading size</p>
            <div className="mt-3 flex gap-3">
              {([
                { key: 'normal' as const, label: 'Normal', sample: 'text-sm' },
                { key: 'large' as const, label: 'Large', sample: 'text-base' },
                { key: 'extra-large' as const, label: 'Extra Large', sample: 'text-lg' },
              ]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setFontSize(opt.key)}
                  className={`flex-1 rounded-xl p-3 text-center transition-all ${
                    fontSize === opt.key
                      ? 'bg-teal/5 text-teal ring-2 ring-teal/20'
                      : 'bg-cream text-charcoal-light hover:bg-charcoal/5'
                  }`}
                >
                  <span className={`font-medium ${opt.sample}`}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-charcoal">High Contrast</p>
              <p className="text-sm text-charcoal-light">Increase contrast for better readability</p>
            </div>
            <button
              onClick={() => setHighContrast(v => !v)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                highContrast ? 'bg-teal' : 'bg-charcoal/20'
              }`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
          <Phone className="h-5 w-5 text-teal" />
          Emergency Contacts
        </h2>
        <p className="mt-1 text-sm text-charcoal-light">Quick access to your care team and emergency numbers</p>
        <div className="mt-4 space-y-3">
          {[
            { name: p.primary_clinician || 'Dr. Nikhil Nair', role: 'Primary Clinician', phone: '+91 98765 43210' },
            { name: 'Palliative Care Unit', role: 'AIIMS Bhopal', phone: '+91 755 267 0000' },
            { name: 'Emergency Helpline', role: 'National', phone: '112' },
          ].map((contact, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-cream/50 px-4 py-3">
              <div>
                <p className="text-base font-medium text-charcoal">{contact.name}</p>
                <p className="text-sm text-charcoal-light">{contact.role}</p>
              </div>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 rounded-xl bg-teal/10 px-4 py-2 text-sm font-semibold text-teal transition-colors hover:bg-teal/20"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
          <Shield className="h-5 w-5 text-teal" />
          Privacy &amp; Data
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-charcoal">Data Encryption</p>
              <p className="text-sm text-charcoal-light">Your data is encrypted at rest and in transit</p>
            </div>
            <span className="rounded-full bg-sage/10 px-3 py-1 text-sm font-semibold text-sage-dark">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-charcoal">DPDPA 2023 Compliance</p>
              <p className="text-sm text-charcoal-light">Compliant with Digital Personal Data Protection Act</p>
            </div>
            <span className="rounded-full bg-sage/10 px-3 py-1 text-sm font-semibold text-sage-dark">Compliant</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Save className="h-5 w-5" />
        )}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
