'use client';

import { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  User,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Save,
  Grid3x3,
  Clock,
  PenLine,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { clinicalNotesApi } from '@/lib/api';
import { useWithFallback } from '@/lib/use-api-status';
import { useCreateNote } from '@/lib/hooks';

/* eslint-disable @typescript-eslint/no-explicit-any */

const NOTE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'progress', label: 'Progress' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'plan', label: 'Plan' },
  { value: 'soap', label: 'SOAP' },
  { value: 'handover_sbar', label: 'Handover (SBAR)' },
  { value: 'mdt_meeting', label: 'MDT Meeting' },
  { value: 'family_meeting', label: 'Family Meeting' },
  { value: 'phone_consult', label: 'Phone Consult' },
  { value: 'opioid_review', label: 'Opioid Review' },
];

const TYPE_COLORS: Record<string, string> = {
  progress: 'bg-teal/10 text-teal',
  assessment: 'bg-amber/10 text-amber',
  plan: 'bg-sage/20 text-sage',
  soap: 'bg-lavender/40 text-charcoal',
  handover_sbar: 'bg-terra/10 text-terra',
  mdt_meeting: 'bg-blue-50 text-blue-600',
  family_meeting: 'bg-purple-50 text-purple-600',
  phone_consult: 'bg-green-50 text-green-600',
  opioid_review: 'bg-orange-50 text-orange-600',
};

// Mock data
const MOCK_NOTES = [
  { id: '1', patient: 'Ramesh Kumar', patientId: '1', type: 'progress', date: '20 Feb 2026, 10:30', content: 'Patient reports improved pain control with current morphine regimen. No significant side effects. NRS decreased from 7 to 5 over past 3 days.', author: 'Dr. Nikhil Nair' },
  { id: '2', patient: 'Sunita Devi', patientId: '2', type: 'assessment', date: '19 Feb 2026, 14:15', content: 'Comprehensive pain assessment done. Recommending opioid rotation to oxycodone due to morphine-induced nausea. MEDD calculation reviewed.', author: 'Dr. Nikhil Nair' },
  { id: '3', patient: 'Arjun Singh', patientId: '3', type: 'soap', date: '19 Feb 2026, 09:00', content: 'S: Patient c/o increased nausea and breathlessness. O: SpO2 94%, RR 22. A: Opioid-induced nausea, progressive disease. P: Add ondansetron 4mg BD, O2 PRN.', author: 'Dr. Nikhil Nair' },
  { id: '4', patient: 'Priya Sharma', patientId: '4', type: 'plan', date: '18 Feb 2026, 16:00', content: 'Plan: Increase gabapentin to 400mg TDS. Review in 1 week. Continue current opioid regimen. Referral to psychologist for coping strategies.', author: 'Dr. Nikhil Nair' },
  { id: '5', patient: 'Manoj Patel', patientId: '5', type: 'handover_sbar', date: '18 Feb 2026, 20:00', content: 'SBAR: Situation - Patient stable on current regimen. Background - Chronic pancreatitis with neuropathic pain. Assessment - Well-controlled on tapentadol. Recommendation - Monitor overnight, PRN available.', author: 'Sr. Meena R.' },
  { id: '6', patient: 'Kavita Gupta', patientId: '6', type: 'mdt_meeting', date: '17 Feb 2026, 11:00', content: 'MDT discussed treatment options. Consensus: continue current palliative chemotherapy with dose modification. Palliative radiotherapy to abdominal mass considered.', author: 'Dr. Nikhil Nair' },
];

// ── Clinical Note Templates ───────────────────────────────────────────
const NOTE_TEMPLATES: Record<string, { label: string; icon: string; template: string }> = {
  soap: {
    label: 'SOAP Note',
    icon: '📝',
    template: `S (Subjective):
Patient reports...
Pain: __/10, Location: __
Other symptoms: __

O (Objective):
Vitals: HR __, BP __/__, SpO2 __%, RR __, Temp __°C
Pain NRS: __/10, Site: __, Character: __
PPS: __%, ECOG: __
Weight: __ kg (change: __)
Medications: [current regimen]

A (Assessment):
1. Primary problem:
2. Active issues:
3. Functional status:

P (Plan):
1.
2.
3.
Next review: __`,
  },
  handover_sbar: {
    label: 'SBAR Handover',
    icon: '🔄',
    template: `S (Situation):
[Patient name], [age][sex] with [diagnosis], currently [status].
Reason for handover: __

B (Background):
Diagnosis: __
Key history: __
Current medications: __
Allergies: __
Code status: __

A (Assessment):
Current condition: __
Pain: __/10, MEDD: __ mg/day
Concerns: __

R (Recommendation):
1.
2.
3.
Escalation if: __`,
  },
  progress: {
    label: 'Progress Note',
    icon: '📊',
    template: `Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

Pain Status:
  Current NRS: __/10 (previous: __/10)
  Breakthrough doses in 24h: __
  Background analgesia: __
  MEDD: __ mg/day

Symptom Review:
  Nausea: ☐ None ☐ Mild ☐ Moderate ☐ Severe
  Constipation: ☐ None ☐ Mild ☐ Moderate ☐ Severe
  Fatigue: ☐ None ☐ Mild ☐ Moderate ☐ Severe
  Dyspnea: ☐ None ☐ Mild ☐ Moderate ☐ Severe
  Sleep quality: __/10, Duration: __ hrs

Functional Status:
  PPS: __% (previous: __%)
  Mobility: __
  Self-care: __

Mood/Psychological:
  Patient mood: __
  PHQ-9: __ (if screened)
  Caregiver status: __

Plan Changes:
  1.
  2.

Next Review: __`,
  },
  family_meeting: {
    label: 'Family Meeting',
    icon: '👨‍👩‍👧',
    template: `FAMILY MEETING RECORD
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Duration: __ minutes

Attendees:
  Patient: ☐ Present ☐ Unable to attend (reason: __)
  Family: __
  Clinical team: __

Purpose of Meeting:
  ☐ Goals of care discussion
  ☐ Prognosis update
  ☐ Treatment decision
  ☐ Discharge planning
  ☐ Advance care planning
  ☐ Other: __

Discussion Summary:
  Disease status communicated: __
  Prognosis discussed: ☐ Yes ☐ No ☐ Not appropriate
  Patient/family understanding: ☐ Good ☐ Partial ☐ Needs follow-up

Key Decisions:
  1.
  2.

Goals of Care:
  ☐ Curative intent  ☐ Disease-directed + comfort
  ☐ Comfort-focused  ☐ End-of-life care
  Preferred place of care: __
  Code status: __

Advance Care Directives:
  ☐ Discussed  ☐ Documented  ☐ Already in place  ☐ Deferred

Emotional Response:
  Patient: __
  Family: __
  Support needs identified: __

Follow-up Actions:
  1.
  2.

Next Meeting: __`,
  },
  mdt_meeting: {
    label: 'MDT Meeting',
    icon: '👥',
    template: `MDT MEETING MINUTES
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

Team Present:
  ☐ Palliative Medicine  ☐ Oncology  ☐ Nursing
  ☐ Psychology  ☐ Social Work  ☐ Dietetics
  ☐ Physiotherapy  ☐ Pharmacy  ☐ Chaplaincy
  Others: __

Patient: __
Diagnosis: __
PPS: __%  |  ECOG: __  |  MEDD: __ mg/day

Case Summary:
  Current issues: __
  Since last MDT: __

Domain Reviews:
  Pain/Symptoms: __
  Functional: __
  Psychological: __
  Social/Family: __
  Spiritual: __

MDT Recommendations:
  1.
  2.
  3.

Action Items:
  ☐ [Action] → [Assigned to] → [Due by]
  ☐ [Action] → [Assigned to] → [Due by]

Next MDT Review: __`,
  },
  phone_consult: {
    label: 'Phone Consult',
    icon: '📞',
    template: `TELEPHONE CONSULTATION
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Time: __
Duration: __ minutes

Caller: ☐ Patient  ☐ Caregiver: __  ☐ Other HCP: __
Reason for call: __

Assessment:
  Pain NRS (reported): __/10
  Symptoms discussed: __
  Medication concerns: __
  Red flags: ☐ None  ☐ Present: __

Advice Given:
  1.
  2.

Medication Changes:
  ☐ No changes
  ☐ Changes: __

Escalation:
  ☐ None needed
  ☐ Follow-up call in __
  ☐ Clinic review on __
  ☐ Urgent: __

Documented by: Dr. Nikhil Nair`,
  },
  opioid_review: {
    label: 'Opioid Review',
    icon: '💊',
    template: `OPIOID REVIEW & SAFETY CHECK
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

Current Opioid Regimen:
  Background: __
  Breakthrough: __
  Adjuvants: __
  MEDD: __ mg/day

4 A's Assessment:
  Analgesia (pain control): __/10 → target __/10
  Activities (function): PPS __%, able to __
  Adverse effects:
    ☐ Constipation  ☐ Nausea  ☐ Sedation
    ☐ Pruritus  ☐ Myoclonus  ☐ Respiratory depression
  Aberrant behaviour: ☐ None  ☐ Concerns: __

Breakthrough Analysis (past 7 days):
  Average doses/day: __
  Max doses in 24h: __
  Trigger: ☐ Movement  ☐ Incident  ☐ Spontaneous  ☐ End-of-dose

Dose Adequacy:
  ☐ Adequate — continue current
  ☐ Increase background by __% (reason: __)
  ☐ Opioid rotation to __ (reason: __)
  ☐ Reduce by __% (reason: __)

Safety Checks:
  ☐ NDPS register updated
  ☐ Naloxone availability confirmed (MEDD > 90mg)
  ☐ Renal function reviewed
  ☐ Driving/operating advice given

Plan:
  1.
  2.

Next Opioid Review: __`,
  },
};

function mapApiNote(n: any) {
  return {
    id: n.id,
    patient: n.patient_name || n.patient || 'Unknown',
    patientId: n.patient_id || n.patientId || '',
    type: n.note_type || n.type || 'progress',
    date: n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    content: n.content || '',
    author: n.author_name || n.author || 'Dr. Nikhil Nair',
  };
}

// ── New Note Modal ───────────────────────────────────────────────────
function NewNoteModal({ onClose, onCreated, isFromApi }: {
  onClose: () => void;
  onCreated: (note: any) => void;
  isFromApi: boolean;
}) {
  const [patientName, setPatientName] = useState('');
  const [noteType, setNoteType] = useState('progress');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const createNoteMutation = useCreateNote();

  function applyTemplate(type: string) {
    setNoteType(type);
    const tpl = NOTE_TEMPLATES[type];
    if (tpl && !content.trim()) setContent(tpl.template);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientName.trim() || !content.trim()) return;

    setSaving(true);
    const now = new Date();
    const newNote = {
      id: `local-${Date.now()}`,
      patient: patientName.trim(),
      patientId: '',
      type: noteType,
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      content: content.trim(),
      author: 'Dr. Nikhil Nair',
    };

    // Try API creation if available
    if (isFromApi) {
      try {
        await createNoteMutation.mutateAsync({
          patientId: newNote.patientId || '1',
          data: { note_type: noteType, content: content.trim() },
        });
      } catch {
        // Fall through to local
      }
    }

    setTimeout(() => {
      setSaving(false);
      onCreated(newNote);
    }, 300);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-sage-light/20 px-6 py-4">
          <h2 className="font-heading text-xl font-bold text-teal">New Clinical Note</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-charcoal/40 hover:bg-cream hover:text-charcoal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Patient Name *</label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full rounded-xl border border-sage-light/30 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
            />
          </div>

          {/* Quick Template Cards */}
          {!content.trim() && (
            <div>
              <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Quick Start — Pick a Template</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(NOTE_TEMPLATES).map(([key, tpl]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key)}
                    className={cn(
                      'group rounded-lg border p-2.5 text-left transition-all hover:border-teal hover:shadow-sm',
                      noteType === key ? 'border-teal bg-teal/5' : 'border-sage-light/30',
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{tpl.icon}</span>
                      <span className="text-xs font-bold text-charcoal group-hover:text-teal">{tpl.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note Type */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Note Type *</label>
            <div className="flex flex-wrap gap-2">
              {NOTE_TYPES.filter(t => t.value !== 'all').map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => applyTemplate(t.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    noteType === t.value
                      ? 'bg-teal text-white'
                      : cn('border border-sage-light/30', TYPE_COLORS[t.value] || 'bg-white text-charcoal/60'),
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template indicator */}
          {NOTE_TEMPLATES[noteType] && content.trim() && (
            <div className="flex items-center gap-2 rounded-lg bg-teal/5 px-3 py-2">
              <span className="text-sm">{NOTE_TEMPLATES[noteType].icon}</span>
              <span className="text-xs font-semibold text-teal">
                Using: {NOTE_TEMPLATES[noteType].label} Template
              </span>
              <button
                type="button"
                onClick={() => setContent('')}
                className="ml-auto text-[10px] text-charcoal/40 hover:text-alert-critical"
              >
                Clear template
              </button>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase mb-1.5">Content *</label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your clinical note..."
              className="w-full resize-y rounded-xl border border-sage-light/30 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 font-mono leading-relaxed"
            />
            <p className="mt-1 text-[10px] text-charcoal/40">{content.length} characters</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-sage-light/20 pt-5">
            <button type="button" onClick={onClose} className="rounded-xl border border-sage/30 px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-sage/5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !patientName.trim() || !content.trim()}
              className="flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function ClinicalNotesPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [localNotes, setLocalNotes] = useState<any[]>([]);

  // Fetch my notes from API — fallback to mock
  const myNotesQuery = useQuery({
    queryKey: ['notes', 'mine', selectedType],
    queryFn: () => clinicalNotesApi.myNotes({ page: 1 }).then((r) => r.data),
  });
  const { data: rawNotes, isLoading, isFromApi } = useWithFallback(myNotesQuery, MOCK_NOTES);

  const apiNotes = isFromApi
    ? (Array.isArray(rawNotes) ? rawNotes : (rawNotes as any)?.data || []).map(mapApiNote)
    : MOCK_NOTES;

  const allNotes = [...localNotes, ...apiNotes];

  const filteredNotes: any[] = allNotes.filter((note: any) => {
    const matchesType = selectedType === 'all' || note.type === selectedType;
    const matchesSearch =
      !searchQuery ||
      note.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  function handleNoteCreated(note: any) {
    setLocalNotes(prev => [note, ...prev]);
    setShowNewModal(false);
    setExpandedNote(note.id);
  }

  // Note statistics
  const notesToday = allNotes.filter((n: any) => {
    const d = n.date || '';
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return d.includes(today);
  }).length;
  const typeBreakdown = allNotes.reduce((acc: Record<string, number>, n: any) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])[0];
  const uniquePatients = new Set(allNotes.map((n: any) => n.patient)).size;

  return (
    <div className="space-y-6">
      {/* Note Statistics Strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
          <p className="font-heading text-2xl font-bold text-charcoal">{allNotes.length}</p>
          <p className="text-xs text-charcoal/50">Total Notes</p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
          <p className="font-heading text-2xl font-bold text-teal">{notesToday}</p>
          <p className="text-xs text-charcoal/50">Today</p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
          <p className="font-heading text-2xl font-bold text-charcoal">{uniquePatients}</p>
          <p className="text-xs text-charcoal/50">Patients</p>
        </div>
        <div className="rounded-xl border border-sage-light/30 bg-white p-4 text-center">
          <p className="font-heading text-lg font-bold text-charcoal capitalize">{topType ? topType[0].replace('_', ' ') : '—'}</p>
          <p className="text-xs text-charcoal/50">Most Common</p>
        </div>
      </div>

      {/* Sprint 41 — Daily Activity Heatmap (4 weeks) */}
      {(() => {
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeks = 4;
        const today = new Date();
        const cells: { date: string; count: number; dayOfWeek: number; weekIdx: number }[] = [];
        for (let w = weeks - 1; w >= 0; w--) {
          for (let d = 0; d < 7; d++) {
            const cellDate = new Date(today);
            cellDate.setDate(today.getDate() - (w * 7 + (6 - d)));
            const dateStr = cellDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            const count = allNotes.filter((n: any) => {
              const nd = n.date || '';
              return nd.includes(dateStr);
            }).length;
            cells.push({ date: dateStr, count, dayOfWeek: d, weekIdx: weeks - 1 - w });
          }
        }
        const maxCount = Math.max(...cells.map(c => c.count), 1);
        function heatColor(count: number): string {
          if (count === 0) return 'bg-cream';
          const ratio = count / maxCount;
          if (ratio <= 0.33) return 'bg-teal/20';
          if (ratio <= 0.66) return 'bg-teal/45';
          return 'bg-teal/80';
        }
        const totalNotes28d = cells.reduce((s, c) => s + c.count, 0);
        const activeDays = cells.filter(c => c.count > 0).length;
        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4 text-teal" />
                <h3 className="text-sm font-bold text-charcoal">Activity Heatmap</h3>
              </div>
              <span className="text-xs text-charcoal/50">{totalNotes28d} notes in {activeDays} active days (4 weeks)</span>
            </div>
            <div className="flex gap-1.5">
              {/* Day labels */}
              <div className="flex flex-col gap-1" style={{ paddingTop: '18px' }}>
                {dayLabels.map(d => (
                  <div key={d} className="flex h-5 items-center">
                    <span className="text-[9px] text-charcoal/40 w-6">{d}</span>
                  </div>
                ))}
              </div>
              {/* Grid columns (one per week) */}
              {Array.from({ length: weeks }, (_, wIdx) => {
                const weekCells = cells.filter(c => c.weekIdx === wIdx);
                const weekStart = weekCells[0]?.date?.split(',')[0] || '';
                return (
                  <div key={wIdx} className="flex-1 flex flex-col gap-1">
                    <span className="text-[9px] text-charcoal/30 text-center h-3.5">{weekStart}</span>
                    {weekCells.map((cell, i) => (
                      <div
                        key={i}
                        className={cn('h-5 w-full rounded-sm transition-colors', heatColor(cell.count))}
                        title={`${cell.date}: ${cell.count} note${cell.count !== 1 ? 's' : ''}`}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 flex items-center justify-end gap-1.5">
              <span className="text-[9px] text-charcoal/40">Less</span>
              <div className="h-3 w-3 rounded-sm bg-cream" />
              <div className="h-3 w-3 rounded-sm bg-teal/20" />
              <div className="h-3 w-3 rounded-sm bg-teal/45" />
              <div className="h-3 w-3 rounded-sm bg-teal/80" />
              <span className="text-[9px] text-charcoal/40">More</span>
            </div>
          </div>
        );
      })()}

      {/* Sprint 49 — Note Writing Productivity */}
      {(() => {
        const totalChars = allNotes.reduce((s: number, n: any) => s + (n.content || '').length, 0);
        const avgChars = allNotes.length > 0 ? Math.round(totalChars / allNotes.length) : 0;
        const avgWords = Math.round(avgChars / 5.5);
        const longestNote = allNotes.reduce((max: any, n: any) => (n.content || '').length > ((max?.content || '').length) ? n : max, allNotes[0]);
        const shortestNote = allNotes.reduce((min: any, n: any) => (n.content || '').length < ((min?.content || '').length) ? n : min, allNotes[0]);
        const typeStats = Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1]);
        const maxTypeCount = typeStats.length > 0 ? typeStats[0][1] : 1;
        const templateTypes = Object.keys(NOTE_TEMPLATES);
        const templatedCount = allNotes.filter((n: any) => templateTypes.includes(n.type)).length;
        const templatedPct = allNotes.length > 0 ? Math.round((templatedCount / allNotes.length) * 100) : 0;

        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-charcoal">
                <PenLine className="h-4 w-4 text-teal" /> Writing Productivity
              </h2>
              <span className="text-[10px] text-charcoal/40">{allNotes.length} notes analyzed</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
              <div className="rounded-lg bg-teal/5 p-3 text-center">
                <p className="text-xl font-bold text-charcoal">{avgWords}</p>
                <p className="text-[10px] text-charcoal/40">avg words/note</p>
              </div>
              <div className="rounded-lg bg-sage/5 p-3 text-center">
                <p className="text-xl font-bold text-charcoal">{templatedPct}%</p>
                <p className="text-[10px] text-charcoal/40">use templates</p>
              </div>
              <div className="rounded-lg bg-amber/5 p-3 text-center">
                <p className="text-xl font-bold text-charcoal">{longestNote ? Math.round((longestNote.content || '').length / 5.5) : 0}</p>
                <p className="text-[10px] text-charcoal/40">longest (words)</p>
              </div>
              <div className="rounded-lg bg-lavender/5 p-3 text-center">
                <p className="text-xl font-bold text-charcoal">{shortestNote ? Math.round((shortestNote.content || '').length / 5.5) : 0}</p>
                <p className="text-[10px] text-charcoal/40">shortest (words)</p>
              </div>
            </div>
            <p className="text-[10px] font-semibold text-charcoal/40 uppercase mb-2">Type Distribution</p>
            <div className="space-y-1.5">
              {typeStats.map(([type, count]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold capitalize', TYPE_COLORS[type] || 'bg-charcoal/10 text-charcoal/50')}>
                    {type.replace('_', ' ')}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-charcoal/5">
                    <div className="h-2 rounded-full bg-teal/50 transition-all" style={{ width: `${(count / maxTypeCount) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-charcoal/50 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Sprint 57 — Patient Documentation Coverage */}
      {(() => {
        const PATIENTS = [
          { name: 'Ramesh Kumar', id: '1' },
          { name: 'Sunita Devi', id: '2' },
          { name: 'Arjun Singh', id: '3' },
          { name: 'Priya Sharma', id: '4' },
          { name: 'Manoj Patel', id: '5' },
          { name: 'Kavita Gupta', id: '6' },
          { name: 'Arun Sharma', id: '7' },
          { name: 'Mahesh Verma', id: '8' },
        ];
        const now = new Date();
        const coverage = PATIENTS.map((pt) => {
          const patientNotes = allNotes.filter((n: any) => n.patient === pt.name || n.patientId === pt.id);
          const noteCount = patientNotes.length;
          const lastNote = patientNotes.length > 0 ? patientNotes[0] : null;
          const types = [...new Set(patientNotes.map((n: any) => n.type))];
          const daysSince = lastNote ? Math.max(0, Math.floor((now.getTime() - new Date(lastNote.date?.replace(/,.*/, '') || now).getTime()) / 86400000)) : 99;
          return { ...pt, noteCount, daysSince, types, lastNote };
        }).sort((a, b) => b.daysSince - a.daysSince);
        const overdue = coverage.filter((c) => c.daysSince > 3);
        const documented = coverage.filter((c) => c.daysSince <= 3);
        const coveragePct = PATIENTS.length > 0 ? Math.round((documented.length / PATIENTS.length) * 100) : 0;

        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-charcoal">
                <Users className="h-4 w-4 text-teal" /> Patient Documentation Coverage
              </h2>
              <span className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-bold',
                coveragePct >= 80 ? 'bg-sage/10 text-sage-dark' : coveragePct >= 60 ? 'bg-amber/10 text-amber' : 'bg-terra/10 text-terra',
              )}>
                {coveragePct}% current
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-cream mb-4">
              <div
                className={cn('h-full rounded-full transition-all', coveragePct >= 80 ? 'bg-sage' : coveragePct >= 60 ? 'bg-amber' : 'bg-terra')}
                style={{ width: `${coveragePct}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {overdue.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-terra uppercase mb-1.5">Needs Documentation ({overdue.length})</p>
                  <div className="space-y-1.5">
                    {overdue.map((pt) => (
                      <div key={pt.id} className="flex items-center gap-2 rounded-lg bg-terra/5 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-terra flex-shrink-0" />
                        <span className="text-xs font-semibold text-charcoal flex-1 truncate">{pt.name}</span>
                        <span className="text-[10px] text-terra font-bold">{pt.daysSince > 30 ? 'No notes' : `${pt.daysSince}d ago`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {documented.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-sage uppercase mb-1.5">Recently Documented ({documented.length})</p>
                  <div className="space-y-1.5">
                    {documented.map((pt) => (
                      <div key={pt.id} className="flex items-center gap-2 rounded-lg bg-sage/5 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-sage flex-shrink-0" />
                        <span className="text-xs font-semibold text-charcoal flex-1 truncate">{pt.name}</span>
                        <span className="text-[10px] text-charcoal/40">{pt.noteCount} note{pt.noteCount !== 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-3 text-[10px] text-charcoal/30">Patients without a note in the last 3 days are flagged for documentation</p>
          </div>
        );
      })()}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Clinical Notes
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {allNotes.length} notes &middot; View and manage clinical notes across all patients
          </p>
          {isLoading && <Loader2 className="mt-1 h-4 w-4 animate-spin text-teal" />}
          {!isFromApi && !isLoading && (
            <span className="mt-1 inline-block rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-semibold text-amber">Demo Data</span>
          )}
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search notes by patient or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-sage-light/30 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-charcoal/40" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-sage-light/30 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-teal focus:outline-none"
          >
            {NOTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-charcoal">{note.patient}</h3>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-charcoal/50">
                    <Calendar className="h-3 w-3" />
                    {note.date}
                    {note.author && (
                      <>
                        <span className="text-charcoal/30">&middot;</span>
                        <span>{note.author}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('rounded-full px-3 py-1 text-xs font-semibold capitalize', TYPE_COLORS[note.type] || 'bg-gray-100 text-gray-600')}>
                  {note.type.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                  className="text-charcoal/30 hover:text-charcoal/60"
                >
                  {expandedNote === note.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <p className={cn(
              'mt-3 text-sm text-charcoal/70 leading-relaxed whitespace-pre-wrap',
              expandedNote === note.id ? '' : 'line-clamp-2',
            )}>
              {note.content}
            </p>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-sage-light/40 bg-cream/30 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-charcoal/20" />
          <p className="mt-3 text-sm font-medium text-charcoal/50">No notes found</p>
        </div>
      )}

      {/* New Note Modal */}
      {showNewModal && (
        <NewNoteModal
          onClose={() => setShowNewModal(false)}
          onCreated={handleNoteCreated}
          isFromApi={isFromApi}
        />
      )}
    </div>
  );
}
