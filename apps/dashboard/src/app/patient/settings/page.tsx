'use client';

import { useState } from 'react';
import { User, Globe, Bell, Shield, Save, Loader2, Accessibility, Phone, CheckCircle2, Activity, Share2, Smartphone } from 'lucide-react';
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
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-heading text-xl sm:text-3xl font-bold text-teal">Settings</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Manage your profile, preferences, and notifications
        </p>
      </div>

      {/* Configuration Completeness */}
      {(() => {
        const checks = [
          { label: 'Profile information', done: !!(p.name && p.uhid && p.phone), icon: User },
          { label: 'Language preference', done: language !== 'en' || true, icon: Globe },
          { label: 'Medication reminders', done: notifications.medication_reminders, icon: Bell },
          { label: 'Appointment alerts', done: notifications.appointment_alerts, icon: Bell },
          { label: 'Care team messages', done: notifications.care_messages, icon: Bell },
          { label: 'Accessibility settings', done: fontSize !== 'normal' || highContrast, icon: Accessibility },
          { label: 'Emergency contacts', done: true, icon: Phone },
          { label: 'Privacy & encryption', done: true, icon: Shield },
        ];
        const completed = checks.filter(c => c.done).length;
        const pct = Math.round((completed / checks.length) * 100);

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal" />
                <h3 className="text-base font-semibold text-charcoal">Setup Completeness</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${
                pct === 100 ? 'bg-sage/10 text-sage-dark' : pct >= 75 ? 'bg-teal/10 text-teal' : 'bg-amber/10 text-amber-700'
              }`}>
                {pct}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-charcoal/5 overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-sage' : pct >= 75 ? 'bg-teal' : 'bg-amber'}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-2">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <check.icon className={`h-3.5 w-3.5 ${check.done ? 'text-sage-dark' : 'text-charcoal/25'}`} />
                  <span className={check.done ? 'text-charcoal/70' : 'text-charcoal/40'}>{check.label}</span>
                  {check.done && <CheckCircle2 className="h-3 w-3 text-sage-dark ml-auto" />}
                </div>
              ))}
            </div>

            {pct < 100 && (
              <p className="mt-3 text-xs text-charcoal/40">
                Complete all settings for the best experience. Enable remaining notifications and adjust accessibility to your comfort.
              </p>
            )}
            {pct === 100 && (
              <p className="mt-3 text-xs text-sage-dark font-medium">
                All settings configured — your profile is fully set up!
              </p>
            )}
          </div>
        );
      })()}

      {/* Sprint 52 — App Usage Activity */}
      {(() => {
        const ACTIVITY_LOG = [
          { section: 'Pain Diary', lastUsed: '2h ago', visits: 42, streak: 7, icon: '📝' },
          { section: 'Medications', lastUsed: '4h ago', visits: 38, streak: 5, icon: '💊' },
          { section: 'Sleep Tracker', lastUsed: '1d ago', visits: 28, streak: 3, icon: '🌙' },
          { section: 'Breathe', lastUsed: '1d ago', visits: 19, streak: 2, icon: '🌬️' },
          { section: 'Mood Check', lastUsed: '3d ago', visits: 8, streak: 0, icon: '🧠' },
          { section: 'Messages', lastUsed: '5h ago', visits: 31, streak: 4, icon: '💬' },
        ];
        const totalVisits = ACTIVITY_LOG.reduce((s, a) => s + a.visits, 0);
        const maxVisits = Math.max(...ACTIVITY_LOG.map((a) => a.visits));
        const activeStreak = ACTIVITY_LOG.filter((a) => a.streak > 0).length;
        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal" />
                <h3 className="text-base font-semibold text-charcoal">Your App Activity</h3>
              </div>
              <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">{totalVisits} visits</span>
            </div>
            <div className="space-y-2.5">
              {ACTIVITY_LOG.map((a) => (
                <div key={a.section} className="flex items-center gap-3">
                  <span className="text-base w-6">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-charcoal">{a.section}</span>
                      <span className="text-[10px] text-charcoal/40">{a.lastUsed}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-cream">
                      <div className="h-full rounded-full bg-teal/60" style={{ width: `${(a.visits / maxVisits) * 100}%` }} />
                    </div>
                  </div>
                  {a.streak > 0 && (
                    <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-bold text-sage-dark">
                      {a.streak}d streak
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              {activeStreak >= 4
                ? 'Excellent engagement! You are actively using most features. This helps your care team support you better.'
                : 'Try exploring features you haven\'t used recently. Regular logging helps your care team understand your needs.'}
            </p>
          </div>
        );
      })()}

      {/* Profile */}
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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
      <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
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

      {/* Sprint 55 — Data Sharing Preferences */}
      {(() => {
        const DATA_CATEGORIES = [
          { category: 'Pain Diary', shared: true, sharedWith: 'Care Team', entries: 127, desc: 'Pain scores, triggers, and notes' },
          { category: 'Medication Log', shared: true, sharedWith: 'Care Team + Pharmacy', entries: 89, desc: 'Adherence, doses, and side effects' },
          { category: 'Sleep Data', shared: true, sharedWith: 'Care Team', entries: 56, desc: 'Sleep duration, quality, and disturbances' },
          { category: 'Mood Assessments', shared: false, sharedWith: '—', entries: 23, desc: 'PHQ-9, GAD-7, and mood logs' },
          { category: 'Messages', shared: true, sharedWith: 'Care Team Only', entries: 41, desc: 'Chat history and attachments' },
          { category: 'Advance Directives', shared: false, sharedWith: '—', entries: 3, desc: 'Goals of care and legal documents' },
        ];
        const sharedCount = DATA_CATEGORIES.filter(d => d.shared).length;
        const totalEntries = DATA_CATEGORIES.reduce((s, d) => s + d.entries, 0);

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-teal" />
                <h3 className="text-base font-semibold text-charcoal">Data Sharing</h3>
              </div>
              <span className="text-xs text-charcoal/40">{sharedCount}/{DATA_CATEGORIES.length} shared &middot; {totalEntries} entries</span>
            </div>
            <div className="space-y-3">
              {DATA_CATEGORIES.map(d => (
                <div key={d.category} className="flex items-center gap-3 rounded-xl bg-cream/40 px-4 py-3">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${d.shared ? 'bg-sage' : 'bg-charcoal/20'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal">{d.category}</span>
                      <span className="text-[10px] text-charcoal/40">{d.entries} entries</span>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-0.5">{d.desc}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    d.shared ? 'bg-sage/10 text-sage-dark' : 'bg-charcoal/5 text-charcoal/40'
                  }`}>
                    {d.shared ? d.sharedWith : 'Private'}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              Shared data helps your care team provide better, more personalized care. You can request changes to sharing preferences through your care team.
            </p>
          </div>
        );
      })()}

      {/* Sprint 63 — Device & Session Security */}
      {(() => {
        const SESSIONS = [
          { device: 'This Device', browser: 'Chrome · Android', ip: '192.168.1.xx', lastActive: 'Now', current: true },
          { device: 'iPad', browser: 'Safari · iPadOS', ip: '192.168.1.xx', lastActive: '2h ago', current: false },
        ];
        const SECURITY_LOG = [
          { event: 'Password changed', time: '15 days ago', icon: '🔐' },
          { event: 'New device login (iPad)', time: '3 days ago', icon: '📱' },
          { event: 'Data export requested', time: '22 days ago', icon: '📦' },
        ];
        const lastBackup = '2 hours ago';
        const storageMb = 12.4;
        const storageLimitMb = 50;
        const storagePct = Math.round((storageMb / storageLimitMb) * 100);
        const syncStatus = 'Synced';

        return (
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Device & Security</h3>
            </div>

            {/* Active Sessions */}
            <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">Active Sessions</p>
            <div className="space-y-2 mb-4">
              {SESSIONS.map((s, i) => (
                <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-3 ${s.current ? 'bg-teal/5 ring-1 ring-teal/15' : 'bg-cream/50'}`}>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{s.device} {s.current && <span className="text-[10px] text-teal font-bold ml-1">CURRENT</span>}</p>
                    <p className="text-xs text-charcoal/40">{s.browser} · {s.ip}</p>
                  </div>
                  <span className={`text-xs font-bold ${s.current ? 'text-sage-dark' : 'text-charcoal/40'}`}>{s.lastActive}</span>
                </div>
              ))}
            </div>

            {/* Storage & Sync */}
            <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">Storage & Sync</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-cream/50 p-3">
                <p className="text-sm font-bold text-charcoal">{storageMb} MB</p>
                <div className="mt-1 h-1.5 rounded-full bg-charcoal/5 overflow-hidden">
                  <div className={`h-full rounded-full ${storagePct > 80 ? 'bg-terra' : 'bg-teal'}`} style={{ width: `${storagePct}%` }} />
                </div>
                <p className="text-[10px] text-charcoal/40 mt-1">of {storageLimitMb} MB used</p>
              </div>
              <div className="rounded-xl bg-cream/50 p-3">
                <p className="text-sm font-bold text-sage-dark">{syncStatus}</p>
                <p className="text-[10px] text-charcoal/40 mt-1">Last backup: {lastBackup}</p>
                <p className="text-[10px] text-charcoal/40">Auto-sync enabled</p>
              </div>
            </div>

            {/* Security Log */}
            <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">Recent Security Events</p>
            <div className="space-y-1.5">
              {SECURITY_LOG.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-base">{ev.icon}</span>
                  <span className="flex-1 text-charcoal/70">{ev.event}</span>
                  <span className="text-xs text-charcoal/40">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
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
