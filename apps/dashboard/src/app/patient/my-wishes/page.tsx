'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Heart,
  FileText,
  Users,
  Phone,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2,
  Edit3,
  Shield,
  Home,
  Building,
  PlusCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ───── Types ───── */
interface SurrogateContact {
  name: string;
  relationship: string;
  phone: string;
}

interface WishesState {
  primarySurrogate: SurrogateContact;
  alternateSurrogate: SurrogateContact;
  goalsOfCare: 'comfort' | 'life_prolonging' | 'undecided';
  goalsNotes: string;
  codeStatus: 'full_code' | 'dnr' | 'dni' | 'dnr_dni' | 'undecided';
  hospitalPref: 'yes' | 'comfort_only' | 'no' | 'undecided';
  icuPref: 'yes' | 'no' | 'undecided';
  ventilatorPref: 'yes' | 'no' | 'undecided';
  feedingTubePref: 'yes' | 'no' | 'undecided';
  preferredPlace: 'home' | 'hospital' | 'hospice' | 'undecided';
  religion: string;
  ritualPreferences: string;
  dietaryRestrictions: string;
  hasLivingWill: boolean;
  livingWillDate: string;
  hasPOA: boolean;
  poaDate: string;
  personalWishes: string;
  lastUpdated: string;
  lastReviewDate: string;
}

const INITIAL_WISHES: WishesState = {
  primarySurrogate: { name: 'Meera Kumar', relationship: 'Wife', phone: '+91 98765 43211' },
  alternateSurrogate: { name: 'Amit Kumar', relationship: 'Son', phone: '+91 98765 43212' },
  goalsOfCare: 'comfort',
  goalsNotes: 'I want to focus on quality of life and being comfortable. I want to spend as much time at home with family as possible.',
  codeStatus: 'dnr',
  hospitalPref: 'comfort_only',
  icuPref: 'no',
  ventilatorPref: 'no',
  feedingTubePref: 'undecided',
  preferredPlace: 'home',
  religion: 'Hindu',
  ritualPreferences: 'Please arrange for a pandit for prayers. Family should be present.',
  dietaryRestrictions: 'Vegetarian',
  hasLivingWill: true,
  livingWillDate: '2024-01-15',
  hasPOA: true,
  poaDate: '2024-01-15',
  personalWishes: 'I want my grandchildren to visit whenever they can. I would like to listen to bhajans in the evening. Please keep my room bright with flowers.',
  lastUpdated: '2024-02-10',
  lastReviewDate: '2024-02-10',
};

const GOALS_OPTIONS = [
  { value: 'comfort', label: 'Comfort-Focused', desc: 'Focus on quality of life, pain control, and comfort', icon: Heart },
  { value: 'life_prolonging', label: 'Life-Prolonging', desc: 'Use all available treatments to extend life', icon: PlusCircle },
  { value: 'undecided', label: 'Undecided', desc: 'I am not sure yet and would like to discuss further', icon: FileText },
];

const PREFERENCE_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'undecided', label: 'Undecided' },
];

const PLACE_OPTIONS = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'hospital', label: 'Hospital', icon: Building },
  { value: 'hospice', label: 'Hospice', icon: Heart },
  { value: 'undecided', label: 'Undecided', icon: FileText },
];

export default function MyWishesPage() {
  const [wishes, setWishes] = useState<WishesState>(INITIAL_WISHES);
  const [editing, setEditing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('goals');
  const [saved, setSaved] = useState(false);

  function update(field: keyof WishesState, value: any) {
    setWishes((prev) => ({ ...prev, [field]: value }));
  }

  function updateSurrogate(type: 'primarySurrogate' | 'alternateSurrogate', field: keyof SurrogateContact, value: string) {
    setWishes((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  }

  function handleSave() {
    update('lastUpdated', new Date().toISOString().split('T')[0]);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function toggleSection(id: string) {
    setExpandedSection(expandedSection === id ? null : id);
  }

  function SectionHeader({ id, title, icon: Icon, count }: { id: string; title: string; icon: any; count?: number }) {
    const isOpen = expandedSection === id;
    return (
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 text-left transition-colors hover:bg-white/80"
      >
        <Icon className="h-5 w-5 flex-shrink-0 text-teal" />
        <span className="flex-1 text-base font-semibold text-charcoal">{title}</span>
        {count !== undefined && (
          <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal">
            {count} items
          </span>
        )}
        {isOpen ? <ChevronUp className="h-4 w-4 text-charcoal-light" /> : <ChevronDown className="h-4 w-4 text-charcoal-light" />}
      </button>
    );
  }

  function RadioGroup({ value, options, onChange, disabled }: { name: string; value: string; options: { value: string; label: string; desc?: string; icon?: any }[]; onChange: (v: any) => void; disabled?: boolean }) {
    return (
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={clsx(
              'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all',
              value === opt.value ? 'border-teal bg-teal/5' : 'border-charcoal/10 bg-white',
              disabled && 'pointer-events-none opacity-60',
            )}
          >
            <div
              className={clsx(
                'flex h-5 w-5 items-center justify-center rounded-full border-2',
                value === opt.value ? 'border-teal' : 'border-charcoal/20',
              )}
            >
              {value === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-teal" />}
            </div>
            {opt.icon && <opt.icon className={clsx('h-4 w-4', value === opt.value ? 'text-teal' : 'text-charcoal-light')} />}
            <div>
              <span className={clsx('text-base font-semibold', value === opt.value ? 'text-teal' : 'text-charcoal')}>
                {opt.label}
              </span>
              {opt.desc && <p className="text-sm text-charcoal-light">{opt.desc}</p>}
            </div>
          </label>
        ))}
      </div>
    );
  }

  function TextField({ label, value, onChange, multiline, disabled }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; disabled?: boolean }) {
    const Comp = multiline ? 'textarea' : 'input';
    return (
      <div>
        <label className="mb-1 block text-sm font-semibold text-charcoal-light">{label}</label>
        <Comp
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          disabled={disabled}
          rows={multiline ? 3 : undefined}
          className={clsx(
            'w-full rounded-xl border border-charcoal/10 px-4 py-3 text-base text-charcoal outline-none transition-colors focus:ring-2 focus:ring-teal/20',
            disabled ? 'bg-cream/30' : 'bg-white',
            multiline && 'resize-y',
          )}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-teal">My Wishes</h1>
          <p className="mt-1 text-base text-charcoal-light">
            Your advance care preferences — last updated {wishes.lastUpdated}
          </p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className={clsx(
            'flex items-center gap-1.5 rounded-2xl px-5 py-3 text-base font-semibold text-white',
            editing ? 'bg-sage' : 'bg-teal',
          )}
        >
          {editing ? <><Save className="h-4 w-4" /> Save</> : <><Edit3 className="h-4 w-4" /> Edit</>}
        </button>
      </div>

      {/* Completion & Review Reminder */}
      {(() => {
        const fields = [
          { label: 'Goals of care', done: wishes.goalsOfCare !== 'undecided' },
          { label: 'Code status', done: wishes.codeStatus !== 'undecided' },
          { label: 'Preferred place', done: wishes.preferredPlace !== 'undecided' },
          { label: 'Decision makers', done: !!wishes.primarySurrogate.name },
          { label: 'Living will', done: wishes.hasLivingWill },
          { label: 'Power of attorney', done: wishes.hasPOA },
          { label: 'Personal wishes', done: !!wishes.personalWishes.trim() },
        ];
        const doneCount = fields.filter(f => f.done).length;
        const pct = Math.round((doneCount / fields.length) * 100);
        const daysSinceReview = Math.floor((Date.now() - new Date(wishes.lastReviewDate).getTime()) / 86400000);
        const needsReview = daysSinceReview > 90;
        return (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-charcoal">Completion</span>
                <span className="text-sm font-bold text-teal">{pct}%</span>
              </div>
              <div className="h-3 rounded-full bg-cream overflow-hidden">
                <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {fields.map(f => (
                  <span key={f.label} className={clsx(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    f.done ? 'bg-sage/10 text-sage' : 'bg-charcoal/5 text-charcoal/40',
                  )}>
                    {f.done ? '✓' : '○'} {f.label}
                  </span>
                ))}
              </div>
            </div>
            {needsReview && (
              <div className="flex items-center gap-3 rounded-2xl bg-amber/10 px-5 py-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Review recommended</p>
                  <p className="text-xs text-charcoal-light">
                    Last reviewed {daysSinceReview} days ago. We recommend reviewing your wishes with your family and care team every 3 months.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── Section 1: Goals of Care ─── */}
      <SectionHeader id="goals" title="Goals of Care" icon={Heart} />
      {expandedSection === 'goals' && (
        <div className="space-y-4 rounded-2xl bg-white p-5">
          <RadioGroup
            name="goalsOfCare"
            value={wishes.goalsOfCare}
            options={GOALS_OPTIONS}
            onChange={(v) => update('goalsOfCare', v)}
            disabled={!editing}
          />
          <TextField
            label="My thoughts about my care goals"
            value={wishes.goalsNotes}
            onChange={(v) => update('goalsNotes', v)}
            multiline
            disabled={!editing}
          />
        </div>
      )}

      {/* ─── Section 2: Medical Preferences ─── */}
      <SectionHeader id="medical" title="Medical Preferences" icon={FileText} count={5} />
      {expandedSection === 'medical' && (
        <div className="space-y-4 rounded-2xl bg-white p-5">
          <div>
            <p className="mb-2 text-base font-semibold text-charcoal">Code Status</p>
            <RadioGroup
              name="codeStatus"
              value={wishes.codeStatus}
              options={[
                { value: 'full_code', label: 'Full Code', desc: 'Attempt all resuscitation measures' },
                { value: 'dnr', label: 'Do Not Resuscitate (DNR)', desc: 'No CPR if heart stops' },
                { value: 'dni', label: 'Do Not Intubate (DNI)', desc: 'No breathing tube' },
                { value: 'dnr_dni', label: 'DNR + DNI', desc: 'No CPR and no breathing tube' },
                { value: 'undecided', label: 'Undecided' },
              ]}
              onChange={(v) => update('codeStatus', v)}
              disabled={!editing}
            />
          </div>

          <div className="h-px bg-charcoal/5" />

          {[
            { field: 'hospitalPref' as const, label: 'Would you want to go to the hospital?', options: [{ value: 'yes', label: 'Yes' }, { value: 'comfort_only', label: 'Only for comfort' }, { value: 'no', label: 'No' }, { value: 'undecided', label: 'Undecided' }] },
            { field: 'icuPref' as const, label: 'Would you want ICU treatment?', options: PREFERENCE_OPTIONS },
            { field: 'ventilatorPref' as const, label: 'Would you want a ventilator (breathing machine)?', options: PREFERENCE_OPTIONS },
            { field: 'feedingTubePref' as const, label: 'Would you want a feeding tube?', options: PREFERENCE_OPTIONS },
          ].map((item) => (
            <div key={item.field}>
              <p className="mb-2 text-base font-semibold text-charcoal">{item.label}</p>
              <div className="flex flex-wrap gap-2">
                {item.options.map((opt) => {
                  const isSelected = wishes[item.field] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => editing && update(item.field, opt.value)}
                      className={clsx(
                        'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                        isSelected ? 'border-teal bg-teal/5 text-teal' : 'border-charcoal/10 bg-white text-charcoal-light',
                        !editing && !isSelected && 'opacity-40',
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Section 3: Preferred Place ─── */}
      <SectionHeader id="place" title="Where I Want to Be" icon={Home} />
      {expandedSection === 'place' && (
        <div className="space-y-4 rounded-2xl bg-white p-5">
          <p className="text-base text-charcoal-light">Where would you prefer to receive care in the final phase?</p>
          <div className="grid grid-cols-2 gap-3">
            {PLACE_OPTIONS.map((opt) => {
              const isSelected = wishes.preferredPlace === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => editing && update('preferredPlace', opt.value)}
                  className={clsx(
                    'flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all',
                    isSelected ? 'border-teal bg-teal/5' : 'border-charcoal/10 bg-white',
                    !editing && !isSelected && 'opacity-40',
                  )}
                >
                  <opt.icon className={clsx('h-6 w-6', isSelected ? 'text-teal' : 'text-charcoal-light')} />
                  <span className={clsx('text-base font-semibold', isSelected ? 'text-teal' : 'text-charcoal')}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Section 4: My People ─── */}
      <SectionHeader id="people" title="My Decision Makers" icon={Users} />
      {expandedSection === 'people' && (
        <div className="space-y-4 rounded-2xl bg-white p-5">
          {(['primarySurrogate', 'alternateSurrogate'] as const).map((type) => (
            <div key={type}>
              <p className="mb-2 text-base font-bold text-charcoal">
                {type === 'primarySurrogate' ? 'Primary Decision Maker' : 'Alternate Decision Maker'}
              </p>
              <div className="space-y-2">
                <TextField label="Full Name" value={wishes[type].name} onChange={(v) => updateSurrogate(type, 'name', v)} disabled={!editing} />
                <TextField label="Relationship" value={wishes[type].relationship} onChange={(v) => updateSurrogate(type, 'relationship', v)} disabled={!editing} />
                <div>
                  <label className="mb-1 block text-sm font-semibold text-charcoal-light">Phone</label>
                  <div className="flex items-center gap-2">
                    <input
                      value={wishes[type].phone}
                      onChange={(e) => editing && updateSurrogate(type, 'phone', e.target.value)}
                      disabled={!editing}
                      className={clsx(
                        'flex-1 rounded-xl border border-charcoal/10 px-4 py-3 text-base text-charcoal outline-none',
                        !editing ? 'bg-cream/30' : 'bg-white',
                      )}
                    />
                    <a
                      href={`tel:${wishes[type].phone.replace(/\s/g, '')}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              {type === 'primarySurrogate' && <div className="mt-3 h-px bg-charcoal/5" />}
            </div>
          ))}
        </div>
      )}

      {/* ─── Section 5: Spiritual & Cultural ─── */}
      <SectionHeader id="spiritual" title="Spiritual & Cultural Preferences" icon={Heart} />
      {expandedSection === 'spiritual' && (
        <div className="space-y-3 rounded-2xl bg-white p-5">
          <TextField label="Religion / Faith" value={wishes.religion} onChange={(v) => update('religion', v)} disabled={!editing} />
          <TextField label="Ritual or ceremony preferences" value={wishes.ritualPreferences} onChange={(v) => update('ritualPreferences', v)} multiline disabled={!editing} />
          <TextField label="Dietary restrictions" value={wishes.dietaryRestrictions} onChange={(v) => update('dietaryRestrictions', v)} disabled={!editing} />
        </div>
      )}

      {/* ─── Section 6: Legal Documents ─── */}
      <SectionHeader id="legal" title="Legal Documents" icon={FileText} />
      {expandedSection === 'legal' && (
        <div className="space-y-3 rounded-2xl bg-white p-5">
          {[
            { field: 'hasLivingWill' as const, dateField: 'livingWillDate' as const, label: 'Living Will / Advance Directive' },
            { field: 'hasPOA' as const, dateField: 'poaDate' as const, label: 'Power of Attorney (Medical)' },
          ].map((doc) => (
            <div key={doc.field} className="flex items-center justify-between rounded-xl bg-cream/50 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    'flex h-9 w-9 items-center justify-center rounded-xl',
                    wishes[doc.field] ? 'bg-sage/15' : 'bg-charcoal/5',
                  )}
                >
                  {wishes[doc.field]
                    ? <CheckCircle2 className="h-4 w-4 text-sage" />
                    : <FileText className="h-4 w-4 text-charcoal-light" />}
                </div>
                <div>
                  <p className="text-base font-semibold text-charcoal">{doc.label}</p>
                  <p className="text-sm text-charcoal-light">
                    {wishes[doc.field] ? `Completed on ${wishes[doc.dateField]}` : 'Not yet completed'}
                  </p>
                </div>
              </div>
              {editing && (
                <button
                  onClick={() => update(doc.field, !wishes[doc.field])}
                  className="rounded-xl bg-cream px-4 py-2 text-sm font-medium text-charcoal-light"
                >
                  Toggle
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Section 7: Personal Wishes ─── */}
      <SectionHeader id="personal" title="In My Own Words" icon={Edit3} />
      {expandedSection === 'personal' && (
        <div className="rounded-2xl bg-white p-5">
          <p className="mb-2 text-sm text-charcoal-light">
            Anything else you want your care team and family to know — in your own words.
          </p>
          <textarea
            value={wishes.personalWishes}
            onChange={(e) => editing && update('personalWishes', e.target.value)}
            disabled={!editing}
            rows={4}
            className={clsx(
              'w-full resize-y rounded-xl border border-charcoal/10 px-4 py-3 text-base text-charcoal outline-none',
              !editing ? 'bg-cream/30' : 'bg-white',
            )}
          />
        </div>
      )}

      {/* Privacy Notice */}
      <div className="rounded-2xl bg-teal/5 p-5">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal" />
          <p className="text-sm leading-relaxed text-charcoal-light">
            Your advance care preferences are shared only with your care team and designated decision makers.
            You can update these at any time. We recommend reviewing with your family and care team regularly.
          </p>
        </div>
      </div>

      {/* Saved Toast */}
      {saved && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-2xl bg-teal px-5 py-3 text-base font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" /> Wishes saved successfully
        </div>
      )}
    </div>
  );
}
