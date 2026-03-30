'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const USER_KEY = 'pallicare_user';

const ROLES = [
  { key: 'physician',    label: 'Physician',    color: 'bg-teal' },
  { key: 'nurse',        label: 'Nurse',        color: 'bg-amber' },
  { key: 'psychologist', label: 'Psychologist', color: 'bg-purple-500' },
] as const;

const ROLE_USERS: Record<string, object> = {
  physician: {
    id: 'dev-clinician-001',
    name: 'Dr. Nikhil Nair',
    role: 'clinician',
    phone: '+919876543210',
    clinicianRole: 'physician',
    permissions: { canPrescribe: true, canExportResearch: true, canManageUsers: false },
    department: 'Palliative Care & Pain Management',
    designation: 'Assistant Professor',
  },
  nurse: {
    id: 'dev-nurse-001',
    name: 'Sr. Meena R.',
    role: 'clinician',
    phone: '+919876543211',
    clinicianRole: 'nurse',
    permissions: { canPrescribe: false, canExportResearch: false, canManageUsers: false },
    department: 'Palliative Care & Pain Management',
    designation: 'Senior Nurse',
  },
  psychologist: {
    id: 'dev-psych-001',
    name: 'Dr. Priya M.',
    role: 'clinician',
    phone: '+919876543212',
    clinicianRole: 'psychologist',
    permissions: { canPrescribe: false, canExportResearch: false, canManageUsers: false },
    department: 'Psychology',
    designation: 'Clinical Psychologist',
  },
};

export function DevRoleSwitcher() {
  const [open, setOpen] = useState(false);

  // Only render in development
  if (process.env.NODE_ENV === 'production') return null;

  function getCurrentRole(): string {
    if (typeof window === 'undefined') return 'physician';
    try {
      const json = localStorage.getItem(USER_KEY);
      if (!json) return 'physician';
      const user = JSON.parse(json);
      return user.clinicianRole || 'physician';
    } catch {
      return 'physician';
    }
  }

  function switchRole(roleKey: string) {
    const userData = ROLE_USERS[roleKey];
    if (!userData) return;
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    window.location.reload();
  }

  const currentRole = getCurrentRole();

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {open && (
        <div className="mb-2 rounded-xl border border-sage-light/30 bg-white p-3 shadow-xl">
          <p className="mb-2 text-[10px] font-bold text-charcoal/40 uppercase">Switch Role</p>
          <div className="space-y-1.5">
            {ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => switchRole(r.key)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  currentRole === r.key
                    ? 'bg-teal/10 text-teal ring-1 ring-teal/30'
                    : 'text-charcoal/60 hover:bg-cream',
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', r.color)} />
                {r.label}
                {currentRole === r.key && (
                  <span className="ml-auto text-[9px] text-teal/60">active</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-white shadow-lg hover:bg-charcoal/90 transition-colors"
        title="Dev Role Switcher"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}
