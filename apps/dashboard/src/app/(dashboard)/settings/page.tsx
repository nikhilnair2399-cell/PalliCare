'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  BellOff,
  Moon,
  Sun,
  Clock,
  Shield,
  Info,
  AlertTriangle,
  AlertCircle,
  Check,
  ChevronDown,
  Monitor,
  Mail,
  Smartphone,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// -- Mock data ----------------------------------------------------------------
const PROFILE = {
  name: 'Dr. Nikhil Nair',
  department: 'Anaesthesiology & Palliative Medicine',
  affiliation: 'AIIMS Bhopal',
  role: 'Lead Creator & Senior Resident',
  email: 'nikhil.nair@aiims.edu',
  mciReg: 'MCI-2019-MP-4521',
  phone: '+91 98765 12345',
};

interface AlertPreference {
  id: string;
  label: string;
  description: string;
  icon: typeof AlertTriangle;
  enabled: boolean;
  severity: 'critical' | 'warning' | 'info';
}

// -- Component ----------------------------------------------------------------
export default function SettingsPage() {
  // Alert preferences state
  const [alertPreferences, setAlertPreferences] = useState<AlertPreference[]>([
    { id: 'critical_pain', label: 'Critical Pain Alerts', description: 'NRS > 7 sustained for 4+ hours', icon: AlertTriangle, enabled: true, severity: 'critical' },
    { id: 'medd_threshold', label: 'MEDD Threshold', description: 'Morphine equivalent exceeds safety limit', icon: AlertTriangle, enabled: true, severity: 'critical' },
    { id: 'medication_non_adherence', label: 'Medication Non-Adherence', description: 'Adherence drops below 70%', icon: AlertCircle, enabled: true, severity: 'warning' },
    { id: 'breakthrough_frequency', label: 'Breakthrough Dose Frequency', description: 'PRN doses exceed 3/day', icon: AlertCircle, enabled: true, severity: 'warning' },
    { id: 'mood_distress', label: 'Mood & Distress Alerts', description: 'Sustained low mood for 3+ days', icon: AlertCircle, enabled: true, severity: 'warning' },
    { id: 'no_data', label: 'Missing Data Alerts', description: 'No patient log for 24+ hours', icon: Info, enabled: false, severity: 'info' },
    { id: 'sleep_disrupted', label: 'Sleep Disruption', description: 'Poor sleep reported 5+ of 7 nights', icon: Info, enabled: true, severity: 'info' },
    { id: 'functional_decline', label: 'Functional Decline', description: 'Significant decline in physical function', icon: Info, enabled: false, severity: 'info' },
  ]);

  const [notificationMethod, setNotificationMethod] = useState('push_email');
  const [escalationTimeout, setEscalationTimeout] = useState('30');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('06:00');
  const [darkMode, setDarkMode] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState('20');

  function toggleAlert(id: string) {
    setAlertPreferences((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }

  const severityBadge = {
    critical: { bg: 'bg-red-100 text-red-700', label: 'Critical' },
    warning: { bg: 'bg-amber-100 text-amber-700', label: 'Warning' },
    info: { bg: 'bg-blue-100 text-blue-600', label: 'Info' },
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-teal" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">Settings</h1>
          <p className="text-sm text-charcoal-light">
            Manage your profile, alert preferences, and display settings
          </p>
        </div>
      </div>

      {/* ── Profile Section ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
          <User className="h-5 w-5" />
          Profile
        </h2>
        <div className="mt-5 flex items-start gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal text-2xl font-bold text-white flex-shrink-0">
            NN
          </div>
          <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-charcoal/50 uppercase">Name</p>
              <p className="mt-1 text-sm font-medium text-charcoal">{PROFILE.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal/50 uppercase">Role</p>
              <p className="mt-1 text-sm font-medium text-charcoal">
                <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
                  <Shield className="h-3 w-3" />
                  {PROFILE.role}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal/50 uppercase">Department</p>
              <p className="mt-1 text-sm font-medium text-charcoal">{PROFILE.department}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal/50 uppercase">Affiliation</p>
              <p className="mt-1 text-sm font-medium text-charcoal">{PROFILE.affiliation}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal/50 uppercase">Email</p>
              <p className="mt-1 text-sm font-medium text-charcoal">{PROFILE.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal/50 uppercase">MCI Registration</p>
              <p className="mt-1 text-sm font-medium text-charcoal font-mono">{PROFILE.mciReg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alert Preferences ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
          <Bell className="h-5 w-5" />
          Alert Preferences
        </h2>
        <p className="mt-1 text-xs text-charcoal/50">
          Configure which clinical alerts you receive and how they are delivered
        </p>

        {/* Alert toggles */}
        <div className="mt-5 space-y-2">
          {alertPreferences.map((alert) => {
            const badge = severityBadge[alert.severity];
            const AlertIcon = alert.icon;
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-center gap-4 rounded-lg border p-4 transition-colors',
                  alert.enabled ? 'border-sage/20 bg-white' : 'border-sage/10 bg-sage/5 opacity-60'
                )}
              >
                <AlertIcon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  alert.severity === 'critical' ? 'text-red-500' :
                  alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-charcoal">{alert.label}</p>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', badge.bg)}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/50 mt-0.5">{alert.description}</p>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                    alert.enabled ? 'bg-teal' : 'bg-charcoal/20'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                      alert.enabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Notification method */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-charcoal/60 uppercase">Notification Method</label>
            <select
              value={notificationMethod}
              onChange={(e) => setNotificationMethod(e.target.value)}
              className="mt-2 w-full rounded-lg border border-sage/20 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            >
              <option value="push_only">Push Notifications Only</option>
              <option value="email_only">Email Only</option>
              <option value="push_email">Push + Email</option>
              <option value="sms">SMS (Critical Only)</option>
            </select>
            <div className="mt-2 flex items-center gap-2 text-xs text-charcoal/40">
              {notificationMethod.includes('push') && <Smartphone className="h-3 w-3" />}
              {notificationMethod.includes('email') && <Mail className="h-3 w-3" />}
              {notificationMethod === 'sms' && <Smartphone className="h-3 w-3" />}
              <span>
                {notificationMethod === 'push_only' && 'Mobile app push notifications'}
                {notificationMethod === 'email_only' && 'Email notifications to ' + PROFILE.email}
                {notificationMethod === 'push_email' && 'Push + Email to ' + PROFILE.email}
                {notificationMethod === 'sms' && 'SMS to registered phone for critical alerts only'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60 uppercase">Escalation Timeout</label>
            <select
              value={escalationTimeout}
              onChange={(e) => setEscalationTimeout(e.target.value)}
              className="mt-2 w-full rounded-lg border border-sage/20 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
            <p className="mt-2 text-xs text-charcoal/40">
              Unacknowledged critical alerts escalate to department head after this duration
            </p>
          </div>
        </div>
      </div>

      {/* ── Quiet Hours ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
            <BellOff className="h-5 w-5" />
            Quiet Hours
          </h2>
          <button
            onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              quietHoursEnabled ? 'bg-teal' : 'bg-charcoal/20'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                quietHoursEnabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        <p className="mt-1 text-xs text-charcoal/50">
          Suppress non-critical notifications during rest hours. Critical alerts always come through.
        </p>

        {quietHoursEnabled && (
          <div className="mt-4 flex items-center gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/60 uppercase">Start</label>
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="mt-1 block rounded-lg border border-sage/20 bg-white px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>
            <span className="mt-6 text-charcoal/40">to</span>
            <div>
              <label className="text-xs font-semibold text-charcoal/60 uppercase">End</label>
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="mt-1 block rounded-lg border border-sage/20 bg-white px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs text-charcoal/40">
              <Moon className="h-3 w-3" />
              {quietStart} - {quietEnd}
            </div>
          </div>
        )}
      </div>

      {/* ── Display Preferences ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
          <Monitor className="h-5 w-5" />
          Display Preferences
        </h2>

        <div className="mt-5 space-y-5">
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between rounded-lg border border-sage/10 p-4">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5 text-lavender" /> : <Sun className="h-5 w-5 text-amber" />}
              <div>
                <p className="text-sm font-semibold text-charcoal">Dark Mode</p>
                <p className="text-xs text-charcoal/50">
                  {darkMode ? 'Dark theme enabled' : 'Light theme active'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                darkMode ? 'bg-teal' : 'bg-charcoal/20'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Items per page */}
          <div className="flex items-center justify-between rounded-lg border border-sage/10 p-4">
            <div>
              <p className="text-sm font-semibold text-charcoal">Items per Page</p>
              <p className="text-xs text-charcoal/50">Number of records shown in patient and alert lists</p>
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(e.target.value)}
              className="rounded-lg border border-sage/20 bg-white px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── DPDPA 2023 Consent & Data Governance ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
          <Shield className="h-5 w-5" />
          DPDPA 2023 Consent & Data Governance
        </h2>
        <p className="mt-1 text-xs text-charcoal/50">
          Digital Personal Data Protection Act compliance. Patients manage their own consent via the mobile app.
        </p>

        <div className="mt-4 space-y-2">
          {[
            { type: 'data_collection', label: 'Patient Data Collection', desc: 'Symptom, medication, and wellness data for clinical care delivery', status: 'granted' },
            { type: 'analytics', label: 'Analytics & Research Use', desc: 'Anonymized data for quality improvement and palliative care research', status: 'granted' },
            { type: 'communication', label: 'Communication Preferences', desc: 'Notifications and care team messages via app, SMS, and WhatsApp', status: 'granted' },
          ].map((consent) => (
            <div key={consent.type} className="flex items-center justify-between rounded-lg border border-sage/10 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-charcoal">{consent.label}</p>
                <p className="text-xs text-charcoal/50 mt-0.5">{consent.desc}</p>
              </div>
              <span className="ml-3 flex-shrink-0 rounded-full bg-alert-success/10 px-2.5 py-0.5 text-[10px] font-bold text-alert-success uppercase flex items-center gap-1">
                <Check className="h-3 w-3" />
                {consent.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Data Governance</p>
            <p className="mt-1 text-xs text-charcoal/60 leading-relaxed">
              All patient data is stored within AIIMS Bhopal infrastructure. Data processing complies with DPDPA 2023 requirements.
              Audit logs are maintained for all data access events. Data retention follows institutional policy (7 years after last encounter).
            </p>
          </div>
        </div>
      </div>

      {/* ── System Status ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
          <Monitor className="h-5 w-5" />
          System Status & Feature Flags
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Services */}
          <div>
            <p className="text-xs font-semibold text-charcoal/50 uppercase mb-2">Services</p>
            {[
              { name: 'NestJS API', detail: 'localhost:3001', ok: true },
              { name: 'PostgreSQL + TimescaleDB', detail: 'v16 + v2.14', ok: true },
              { name: 'Redis', detail: 'v7.2 Alpine', ok: true },
              { name: 'MinIO (S3)', detail: '4 buckets', ok: true },
              { name: 'WebSocket Gateway', detail: 'localhost:3002', ok: true },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center justify-between py-2 border-b border-sage-light/10 last:border-0">
                <span className="text-sm text-charcoal">{svc.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-charcoal/40">{svc.detail}</span>
                  <span className={cn('h-2 w-2 rounded-full', svc.ok ? 'bg-alert-success' : 'bg-alert-critical')} />
                </div>
              </div>
            ))}
          </div>

          {/* Feature flags */}
          <div>
            <p className="text-xs font-semibold text-charcoal/50 uppercase mb-2">Feature Flags</p>
            {[
              { flag: 'Voice Input', enabled: true },
              { flag: 'Caregiver Mode', enabled: true },
              { flag: 'Offline Sync', enabled: true },
              { flag: 'ABHA Linking', enabled: false },
              { flag: 'FHIR Export', enabled: false },
              { flag: 'WhatsApp Notifications', enabled: false },
            ].map((f) => (
              <div key={f.flag} className="flex items-center justify-between py-2 border-b border-sage-light/10 last:border-0">
                <span className="text-sm text-charcoal">{f.flag}</span>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  f.enabled ? 'bg-alert-success/10 text-alert-success' : 'bg-charcoal/10 text-charcoal/40',
                )}>
                  {f.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-teal">
          <Heart className="h-5 w-5" />
          About PalliCare
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-cream/50 p-4">
            <p className="text-xs font-semibold text-charcoal/50 uppercase">Application</p>
            <p className="mt-1 text-sm font-medium text-charcoal">PalliCare Clinician Dashboard</p>
            <p className="text-xs text-charcoal/50 mt-1">Palliative care monitoring, decision support & team collaboration</p>
          </div>
          <div className="rounded-lg bg-cream/50 p-4">
            <p className="text-xs font-semibold text-charcoal/50 uppercase">Version</p>
            <p className="mt-1 text-sm font-medium text-charcoal">v1.0.0-beta</p>
            <p className="text-xs text-charcoal/50 mt-1">Sprint 10 &middot; Built 20 Feb 2026</p>
          </div>
          <div className="rounded-lg bg-cream/50 p-4">
            <p className="text-xs font-semibold text-charcoal/50 uppercase">Institution</p>
            <p className="mt-1 text-sm font-medium text-charcoal">AIIMS Bhopal</p>
            <p className="text-xs text-charcoal/50 mt-1">Department of Anaesthesiology &amp; Palliative Medicine</p>
          </div>
          <div className="rounded-lg bg-cream/50 p-4">
            <p className="text-xs font-semibold text-charcoal/50 uppercase">Compliance</p>
            <p className="mt-1 text-sm font-medium text-charcoal">DPDPA 2023 / ABDM Compliant</p>
            <p className="text-xs text-charcoal/50 mt-1">FHIR R4 data model &middot; ABHA integration (planned)</p>
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-sage/10 pt-4">
          {['Privacy Policy', 'Terms of Service', 'Data Retention Policy', 'NDPS Compliance', 'DPDPA Notice', 'Contact Support'].map((link) => (
            <button
              key={link}
              className="text-xs font-medium text-teal hover:text-teal-dark hover:underline transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
