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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { clinicalNotesApi } from '@/lib/api';
import { useWithFallback } from '@/lib/use-api-status';

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
};

// Mock data
const NOTES = [
  { id: '1', patient: 'Ramesh Kumar', type: 'progress', date: '20 Feb 2026, 10:30', content: 'Patient reports improved pain control with current morphine regimen. No significant side effects. NRS decreased from 7 to 5 over past 3 days.' },
  { id: '2', patient: 'Sunita Devi', type: 'assessment', date: '19 Feb 2026, 14:15', content: 'Comprehensive pain assessment done. Recommending opioid rotation to oxycodone due to morphine-induced nausea. MEDD calculation reviewed.' },
  { id: '3', patient: 'Arjun Singh', type: 'soap', date: '19 Feb 2026, 09:00', content: 'S: Patient c/o increased nausea and breathlessness. O: SpO2 94%, RR 22. A: Opioid-induced nausea, progressive disease. P: Add ondansetron 4mg BD, O2 PRN.' },
  { id: '4', patient: 'Priya Sharma', type: 'plan', date: '18 Feb 2026, 16:00', content: 'Plan: Increase gabapentin to 400mg TDS. Review in 1 week. Continue current opioid regimen. Referral to psychologist for coping strategies.' },
  { id: '5', patient: 'Manoj Patel', type: 'handover_sbar', date: '18 Feb 2026, 20:00', content: 'SBAR: Situation - Patient stable on current regimen. Background - Chronic pancreatitis with neuropathic pain. Assessment - Well-controlled on tapentadol. Recommendation - Monitor overnight, PRN available.' },
  { id: '6', patient: 'Kavita Gupta', type: 'mdt_meeting', date: '17 Feb 2026, 11:00', content: 'MDT discussed treatment options. Consensus: continue current palliative chemotherapy with dose modification. Palliative radiotherapy to abdominal mass considered.' },
];

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function mapApiNote(n: any) {
  return {
    id: n.id,
    patient: n.patient_name || n.patient || 'Unknown',
    type: n.note_type || n.type || 'progress',
    date: n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    content: n.content || '',
  };
}

export default function ClinicalNotesPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  // Fetch my notes from API — fallback to mock
  const myNotesQuery = useQuery({
    queryKey: ['notes', 'mine', selectedType],
    queryFn: () => clinicalNotesApi.myNotes({ page: 1 }).then((r) => r.data),
  });
  const { data: rawNotes, isLoading, isFromApi } = useWithFallback(myNotesQuery, NOTES);

  const allNotes = isFromApi
    ? (Array.isArray(rawNotes) ? rawNotes : (rawNotes as any)?.data || []).map(mapApiNote)
    : NOTES;

  const filteredNotes: any[] = allNotes.filter((note: any) => {
    const matchesType = selectedType === 'all' || note.type === selectedType;
    const matchesSearch =
      !searchQuery ||
      note.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">
            Clinical Notes
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            View and manage clinical notes across all patients
          </p>
          {isLoading && <Loader2 className="mt-1 h-4 w-4 animate-spin text-teal" />}
          {!isFromApi && !isLoading && (
            <span className="mt-1 inline-block rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-semibold text-amber">Demo Data</span>
          )}
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90 transition-colors">
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
              'mt-3 text-sm text-charcoal/70 leading-relaxed',
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
    </div>
  );
}
