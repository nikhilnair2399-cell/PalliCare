'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHealthCheck } from '@/lib/hooks';
import { useApiStatus } from '@/lib/use-api-status';

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
  // API health & status
  const healthQuery = useHealthCheck();
  const { status: apiStatus, isOnline } = useApiStatus();

  const healthData = healthQuery.data as any;
  const dbStatus = healthData?.details?.database?.status === 'up' || healthData?.status === 'ok';
  const tsdbVersion = healthData?.details?.timescaledb?.version;
  const dbVersion = healthData?.details?.database?.version;

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
  const [toast, setToast] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<string | null>(null);

  // ── Load persisted settings from localStorage on mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pallicare_settings');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.notificationMethod) setNotificationMethod(s.notificationMethod);
        if (s.escalationTimeout) setEscalationTimeout(s.escalationTimeout);
        if (typeof s.quietHoursEnabled === 'boolean') setQuietHoursEnabled(s.quietHoursEnabled);
        if (s.quietStart) setQuietStart(s.quietStart);
        if (s.quietEnd) setQuietEnd(s.quietEnd);
        if (typeof s.darkMode === 'boolean') setDarkMode(s.darkMode);
        if (s.itemsPerPage) setItemsPerPage(s.itemsPerPage);
        if (Array.isArray(s.alertPreferences)) {
          setAlertPreferences(prev => prev.map(a => {
            const saved = s.alertPreferences.find((sa: any) => sa.id === a.id);
            return saved ? { ...a, enabled: saved.enabled } : a;
          }));
        }
      }
    } catch { /* ignore parse errors */ }
  }, []);

  // ── Persist settings to localStorage on change ──
  const persistSettings = useCallback(() => {
    try {
      localStorage.setItem('pallicare_settings', JSON.stringify({
        notificationMethod, escalationTimeout, quietHoursEnabled, quietStart, quietEnd, darkMode, itemsPerPage,
        alertPreferences: alertPreferences.map(a => ({ id: a.id, enabled: a.enabled })),
      }));
      setToast('Settings saved');
      setTimeout(() => setToast(null), 2000);
    } catch { /* quota exceeded, etc */ }
  }, [notificationMethod, escalationTimeout, quietHoursEnabled, quietStart, quietEnd, darkMode, itemsPerPage, alertPreferences]);

  // Auto-save on any settings change (debounced via dependency array)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('pallicare_settings', JSON.stringify({
          notificationMethod, escalationTimeout, quietHoursEnabled, quietStart, quietEnd, darkMode, itemsPerPage,
          alertPreferences: alertPreferences.map(a => ({ id: a.id, enabled: a.enabled })),
        }));
      } catch { /* ignore */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [notificationMethod, escalationTimeout, quietHoursEnabled, quietStart, quietEnd, darkMode, itemsPerPage, alertPreferences]);

  // ── Dark mode: toggle class on <html> element ──
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
            <p className="text-xs font-semibold text-charcoal/50 uppercase mb-2">
              Services
              {healthQuery.isLoading && <Loader2 className="ml-2 inline h-3 w-3 animate-spin text-teal" />}
            </p>
            {[
              { name: 'NestJS API', detail: isOnline ? 'Connected' : 'localhost:3001', ok: isOnline },
              { name: 'PostgreSQL + TimescaleDB', detail: dbVersion ? `${dbVersion.split(',')[0]}${tsdbVersion ? ` + v${tsdbVersion}` : ''}` : 'v16 + v2.14', ok: dbStatus },
              { name: 'Redis', detail: 'v7.2 Alpine', ok: isOnline },
              { name: 'MinIO (S3)', detail: '4 buckets', ok: isOnline },
              { name: 'WebSocket Gateway', detail: 'localhost:3002', ok: isOnline },
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
            <p className="text-xs text-charcoal/50 mt-1">Sprint 21 &middot; Built 21 Feb 2026</p>
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
              onClick={() => setLegalModal(link)}
              className="text-xs font-medium text-teal hover:text-teal-dark hover:underline transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lg toast-slide-in">
          {toast}
        </div>
      )}

      {/* Legal Document Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setLegalModal(null)}>
          <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-sage-light/20 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-teal">{legalModal}</h2>
              <button onClick={() => setLegalModal(null)} className="rounded-lg p-2 text-charcoal/40 hover:bg-cream hover:text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-charcoal/70 leading-relaxed space-y-3">
              {legalModal === 'Privacy Policy' && (
                <>
                  <p>PalliCare collects and processes patient health data strictly for clinical care delivery, symptom monitoring, and care team coordination at AIIMS Bhopal.</p>
                  <p>All data is stored within AIIMS Bhopal institutional infrastructure. No patient data is shared with external parties without explicit consent. Data processing complies with DPDPA 2023 requirements.</p>
                  <p>Clinicians access only patients assigned to their care team. All data access events are logged in immutable audit trails.</p>
                </>
              )}
              {legalModal === 'Terms of Service' && (
                <>
                  <p>PalliCare is a clinical decision-support tool intended for use by licensed healthcare professionals at AIIMS Bhopal.</p>
                  <p>This system does not replace clinical judgment. All treatment decisions must be made by qualified clinicians. The platform provides data visualization, alerts, and communication tools to support — not replace — clinical care.</p>
                  <p>Users are responsible for maintaining the confidentiality of their login credentials and must report any unauthorized access immediately.</p>
                </>
              )}
              {legalModal === 'Data Retention Policy' && (
                <>
                  <p>Patient clinical data is retained for 7 years after the last clinical encounter, in accordance with AIIMS institutional policy and Medical Council of India guidelines.</p>
                  <p>Audit logs are retained indefinitely. Communication records between care team members are retained for 3 years. Anonymized analytics data may be retained for research purposes without time limitation.</p>
                </>
              )}
              {legalModal === 'NDPS Compliance' && (
                <>
                  <p>PalliCare tracks opioid prescriptions and maintains digital records in compliance with the Narcotic Drugs and Psychotropic Substances Act, 1985.</p>
                  <p>All morphine equivalent daily dose (MEDD) calculations are logged. Threshold alerts are generated when MEDD exceeds 200mg/day (mandatory second signatory) or 300mg/day (institutional review required).</p>
                  <p>Digital NDPS register entries are cross-referenced with pharmacy dispensing records.</p>
                </>
              )}
              {legalModal === 'DPDPA Notice' && (
                <>
                  <p>In compliance with the Digital Personal Data Protection Act (DPDPA) 2023, PalliCare processes personal health data under the legitimate purpose of healthcare delivery.</p>
                  <p>Patients have the right to: access their data, request correction, withdraw consent (where applicable), and file grievances with the institutional Data Protection Officer.</p>
                  <p>Contact: DPO, AIIMS Bhopal — dpo@aiims-bhopal.edu.in</p>
                </>
              )}
              {legalModal === 'Contact Support' && (
                <>
                  <p className="font-semibold text-charcoal">PalliCare Technical Support</p>
                  <p>Email: pallicare-support@aiims-bhopal.edu.in</p>
                  <p>Phone: +91 755-2672355 (Ext: 4521)</p>
                  <p>Hours: Monday–Saturday, 9:00 AM – 5:00 PM IST</p>
                  <p className="mt-2">For clinical emergencies, contact the Department of Anaesthesiology & Palliative Medicine directly.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
