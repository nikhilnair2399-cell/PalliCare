'use client';

import { useState } from 'react';
import { User, Globe, Bell, Shield, LogOut, Heart, Users, ChevronDown, ChevronUp, Phone } from 'lucide-react';
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
  const [showCaregiverSection, setShowCaregiverSection] = useState(false);
  const [caregiver, setCaregiver] = useState({
    name: 'Meera Kumar',
    relationship: 'Wife',
    phone: '+91 98765 43211',
    isAvailable: true,
    hoursPerDay: '12+',
    needsRespite: false,
    healthStatus: 'Good',
    otherHelpers: 'Son (Amit) visits weekends',
  });
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
      <div>
        <h1 className="font-heading text-[24px] font-bold" style={{ color: '#2A6B6B' }}>Settings</h1>
        <p className="mt-1 text-[14px]" style={{ color: '#4A4A4A' }}>Manage your profile and preferences</p>
      </div>

      {/* Profile Section */}
      <div
        className="rounded-xl bg-white p-5"
        style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="mb-4 flex items-center gap-3">
          <User className="h-5 w-5" style={{ color: '#2A6B6B' }} />
          <h2 className="text-[14px] font-bold" style={{ color: '#2D2D2D' }}>Profile</h2>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7BA68C, #2A6B6B)' }}
          >
            {(profile.name || user?.name || 'R').charAt(0)}
          </div>
          <div>
            <p className="text-[17px] font-semibold" style={{ color: '#2D2D2D' }}>
              {profile.name || user?.name}
            </p>
            <p className="text-[12px]" style={{ color: '#4A4A4A' }}>UHID: {profile.uhid || user?.uhid}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 pt-4" style={{ borderTop: '1px solid rgba(168,203,181,0.15)' }}>
          {[
            { label: 'Phone', value: profile.phone || user?.phone },
            { label: 'Age', value: `${profile.age ?? '-'} years` },
            { label: 'Diagnosis', value: profile.diagnosis || '-' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: '#4A4A4A' }}>{item.label}</span>
              <span className="text-right text-[14px] font-medium" style={{ color: '#2D2D2D' }}>{item.value}</span>
            </div>
          ))}

          {profile.care_team && (
            <div>
              <span className="text-[12px]" style={{ color: '#4A4A4A' }}>Care Team</span>
              <div className="mt-1.5 space-y-1">
                {profile.care_team.map((member: any, i: number) => (
                  <p key={i} className="text-[14px]" style={{ color: '#2D2D2D' }}>
                    <span className="font-medium">{member.name}</span>{' '}
                    <span style={{ color: '#4A4A4A' }}>&middot; {member.role}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language */}
      <div
        className="rounded-xl bg-white p-5"
        style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="mb-4 flex items-center gap-3">
          <Globe className="h-5 w-5" style={{ color: '#2A6B6B' }} />
          <h2 className="text-[14px] font-bold" style={{ color: '#2D2D2D' }}>Language</h2>
        </div>
        <div className="flex gap-3">
          {[
            { key: 'en' as const, label: 'English' },
            { key: 'hi' as const, label: '\u0939\u093F\u0928\u094D\u0926\u0940 (Hindi)' },
          ].map((lang) => (
            <button
              key={lang.key}
              onClick={() => handleLanguageChange(lang.key)}
              className="flex-1 rounded-xl py-3 text-center text-[14px] font-medium transition-all"
              style={{
                border: `2px solid ${language === lang.key ? '#2A6B6B' : 'rgba(168,203,181,0.3)'}`,
                backgroundColor: language === lang.key ? 'rgba(42,107,107,0.04)' : 'transparent',
                color: language === lang.key ? '#2A6B6B' : '#4A4A4A',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div
        className="rounded-xl bg-white p-5"
        style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="mb-4 flex items-center gap-3">
          <Bell className="h-5 w-5" style={{ color: '#2A6B6B' }} />
          <h2 className="text-[14px] font-bold" style={{ color: '#2D2D2D' }}>Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'medication_reminders', label: 'Medication Reminders' },
            { key: 'symptom_reminders', label: 'Symptom Log Reminders' },
            { key: 'care_team_messages', label: 'Care Team Messages' },
            { key: 'educational_content', label: 'New Educational Content' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[14px]" style={{ color: '#2D2D2D' }}>{label}</span>
              <button
                onClick={() => toggleNotification(key)}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{
                  backgroundColor: notifications[key as keyof typeof notifications] ? '#2A6B6B' : 'rgba(168,203,181,0.35)',
                }}
              >
                <span
                  className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                  style={{
                    transform: notifications[key as keyof typeof notifications] ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Consent */}
      <div
        className="rounded-xl bg-white p-5"
        style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="mb-3 flex items-center gap-3">
          <Shield className="h-5 w-5" style={{ color: '#2A6B6B' }} />
          <h2 className="text-[14px] font-bold" style={{ color: '#2D2D2D' }}>Privacy &amp; Consent</h2>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: '#4A4A4A' }}>
          Your data is protected under the Digital Personal Data Protection Act
          (DPDPA) 2023. All health records are stored securely within AIIMS Bhopal
          infrastructure and are only accessible to your authorized care team.
        </p>
        <button className="mt-3 text-[12px] font-semibold" style={{ color: '#2A6B6B' }}>
          View Consent Details &rarr;
        </button>
      </div>

      {/* Caregiver Information */}
      <div
        className="rounded-xl bg-white"
        style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <button
          onClick={() => setShowCaregiverSection(!showCaregiverSection)}
          className="flex w-full items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5" style={{ color: '#2A6B6B' }} />
            <h2 className="text-[14px] font-bold" style={{ color: '#2D2D2D' }}>Primary Caregiver</h2>
          </div>
          {showCaregiverSection
            ? <ChevronUp className="h-4 w-4" style={{ color: '#4A4A4A' }} />
            : <ChevronDown className="h-4 w-4" style={{ color: '#4A4A4A' }} />
          }
        </button>
        {showCaregiverSection && (
          <div className="space-y-3 px-5 pb-5" style={{ borderTop: '1px solid rgba(168,203,181,0.1)' }}>
            <div className="pt-3">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: '#D9D4E7' }}
                >
                  {caregiver.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold" style={{ color: '#2D2D2D' }}>{caregiver.name}</p>
                  <p className="text-[12px]" style={{ color: '#4A4A4A' }}>{caregiver.relationship}</p>
                </div>
                <a
                  href={`tel:${caregiver.phone.replace(/\s/g, '')}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'rgba(42,107,107,0.06)' }}
                >
                  <Phone className="h-4 w-4" style={{ color: '#2A6B6B' }} />
                </a>
              </div>
            </div>
            <div className="space-y-2.5 pt-2" style={{ borderTop: '1px solid rgba(168,203,181,0.1)' }}>
              {[
                { label: 'Phone', value: caregiver.phone },
                { label: 'Available', value: caregiver.isAvailable ? 'Yes' : 'No' },
                { label: 'Hours/Day', value: caregiver.hoursPerDay },
                { label: 'Health Status', value: caregiver.healthStatus },
                { label: 'Needs Respite', value: caregiver.needsRespite ? 'Yes' : 'No' },
                { label: 'Other Helpers', value: caregiver.otherHelpers },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: '#4A4A4A' }}>{item.label}</span>
                  <span className="text-right text-[13px] font-medium" style={{ color: '#2D2D2D' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(217,212,231,0.15)' }}>
              <p className="text-[11px] leading-relaxed" style={{ color: '#4A4A4A' }}>
                Your caregiver information helps us provide better support.
                If your caregiver needs assistance, our social worker can connect them with respite services and support groups.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out */}
      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-medium transition-colors"
        style={{ border: '2px solid rgba(194,90,69,0.2)', color: '#C25A45' }}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      {/* Footer */}
      <div className="pt-4 text-center" style={{ borderTop: '1px solid rgba(168,203,181,0.15)' }}>
        <p className="text-[11px]" style={{ color: 'rgba(45,45,45,0.3)' }}>
          PalliCare v1.0 &middot; AIIMS Bhopal
        </p>
        <div className="mt-1 flex items-center justify-center gap-1 text-[11px]" style={{ color: 'rgba(45,45,45,0.2)' }}>
          <Heart className="h-3 w-3" />
          Built with compassion
        </div>
      </div>
    </div>
  );
}
