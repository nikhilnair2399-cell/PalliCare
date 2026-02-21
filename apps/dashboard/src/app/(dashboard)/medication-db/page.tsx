'use client';

import { useState } from 'react';
import {
  Pill,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Beaker,
  BookOpen,
  Calculator,
  Shield,
  Info,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePalliativeMedications, useMedicationSearch } from '@/lib/hooks';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ------------------------------------------------------------------ */
/*  Mock data — matches seed.ts medication_database entries            */
/* ------------------------------------------------------------------ */

type Medication = {
  id: string;
  generic_name: string;
  brand_names: string[];
  hindi_name: string;
  drug_class: string;
  category: string;
  route: string[];
  dosage_forms: string;
  indication_palliative: string;
  common_doses: string;
  max_dose: string;
  renal_adjustment: string;
  hepatic_adjustment: string;
  side_effects: string[];
  interactions: string[];
  is_opioid: boolean;
  medd_factor: number | null;
  who_ladder_step: number | null;
  schedule: string;
  nlem: boolean;
};

const MEDICATIONS: Medication[] = [
  {
    id: '1',
    generic_name: 'Morphine Sulfate',
    brand_names: ['Morcontin', 'MS Contin', 'Morphitec'],
    hindi_name: '\u092e\u0949\u0930\u094d\u092b\u0940\u0928',
    drug_class: 'Opioid Analgesic',
    category: 'opioid',
    route: ['Oral', 'IV', 'SC', 'Rectal'],
    dosage_forms: 'Tablets (IR/SR), Injection, Oral Solution',
    indication_palliative: 'Moderate to severe pain, dyspnea in terminal illness',
    common_doses: 'IR: 5-15mg Q4H; SR: 15-30mg Q12H',
    max_dose: 'No ceiling dose; titrate to effect',
    renal_adjustment: 'Reduce dose 50% if eGFR <30. Active metabolites accumulate.',
    hepatic_adjustment: 'Reduce dose; increased bioavailability in cirrhosis.',
    side_effects: ['Constipation', 'Nausea', 'Sedation', 'Respiratory depression', 'Pruritus'],
    interactions: ['Benzodiazepines', 'MAOIs', 'Alcohol', 'Other CNS depressants'],
    is_opioid: true,
    medd_factor: 1.0,
    who_ladder_step: 3,
    schedule: 'Schedule H (Narcotic)',
    nlem: true,
  },
  {
    id: '2',
    generic_name: 'Oxycodone',
    brand_names: ['OxyContin', 'Oxygin'],
    hindi_name: '\u0911\u0915\u094d\u0938\u0940\u0915\u094b\u0921\u094b\u0928',
    drug_class: 'Opioid Analgesic',
    category: 'opioid',
    route: ['Oral'],
    dosage_forms: 'Tablets (IR/CR)',
    indication_palliative: 'Moderate to severe pain when morphine not tolerated',
    common_doses: 'IR: 5-10mg Q4-6H; CR: 10-20mg Q12H',
    max_dose: 'No ceiling dose; titrate to effect',
    renal_adjustment: 'Start at 50-75% dose if eGFR <30.',
    hepatic_adjustment: 'Start at 33-50% dose in moderate-severe impairment.',
    side_effects: ['Constipation', 'Nausea', 'Dizziness', 'Somnolence'],
    interactions: ['CYP3A4 inhibitors', 'Benzodiazepines', 'Alcohol'],
    is_opioid: true,
    medd_factor: 1.5,
    who_ladder_step: 3,
    schedule: 'Schedule H (Narcotic)',
    nlem: false,
  },
  {
    id: '3',
    generic_name: 'Fentanyl',
    brand_names: ['Durogesic', 'Fentanora'],
    hindi_name: '\u092b\u0947\u0902\u091f\u093e\u0928\u093f\u0932',
    drug_class: 'Opioid Analgesic',
    category: 'opioid',
    route: ['Transdermal', 'IV', 'SL'],
    dosage_forms: 'Patches, Injection, Sublingual tablets',
    indication_palliative: 'Severe pain requiring continuous opioid; dysphagia patients',
    common_doses: 'Patch: 12-25 mcg/h Q72H; IV: 25-50 mcg bolus',
    max_dose: 'Titrate per response. Patch up to 300 mcg/h.',
    renal_adjustment: 'Safer than morphine in renal failure; no active metabolites.',
    hepatic_adjustment: 'Reduce dose; prolonged half-life.',
    side_effects: ['Constipation', 'Nausea', 'Application site reactions', 'Respiratory depression'],
    interactions: ['CYP3A4 inhibitors', 'Benzodiazepines', 'Serotonergic drugs'],
    is_opioid: true,
    medd_factor: null,
    who_ladder_step: 3,
    schedule: 'Schedule H (Narcotic)',
    nlem: false,
  },
  {
    id: '4',
    generic_name: 'Tramadol',
    brand_names: ['Ultram', 'Contramal', 'Tramazac'],
    hindi_name: '\u091f\u094d\u0930\u093e\u092e\u093e\u0921\u094b\u0932',
    drug_class: 'Opioid Analgesic (Weak)',
    category: 'opioid',
    route: ['Oral', 'IV'],
    dosage_forms: 'Capsules, Tablets (IR/SR), Injection',
    indication_palliative: 'Mild to moderate pain; step 2 WHO ladder',
    common_doses: '50-100mg Q4-6H',
    max_dose: '400mg/day (300mg if >75 years)',
    renal_adjustment: 'Max 200mg/day if eGFR <30. Avoid in dialysis.',
    hepatic_adjustment: 'Max 200mg/day in cirrhosis. Avoid IR formulations.',
    side_effects: ['Nausea', 'Dizziness', 'Constipation', 'Seizures (rare)'],
    interactions: ['SSRIs/SNRIs (serotonin syndrome)', 'MAOIs', 'Carbamazepine'],
    is_opioid: true,
    medd_factor: 0.1,
    who_ladder_step: 2,
    schedule: 'Schedule H',
    nlem: true,
  },
  {
    id: '5',
    generic_name: 'Paracetamol',
    brand_names: ['Crocin', 'Dolo', 'Calpol'],
    hindi_name: '\u092a\u0948\u0930\u093e\u0938\u093f\u091f\u093e\u092e\u094b\u0932',
    drug_class: 'Non-opioid Analgesic',
    category: 'non_opioid',
    route: ['Oral', 'IV', 'Rectal'],
    dosage_forms: 'Tablets, Syrup, IV infusion, Suppositories',
    indication_palliative: 'Mild pain, fever, WHO ladder step 1, opioid-sparing adjunct',
    common_doses: '500mg-1g Q4-6H',
    max_dose: '4g/day (2g/day in hepatic impairment)',
    renal_adjustment: 'No adjustment needed. Safe in renal impairment.',
    hepatic_adjustment: 'Max 2g/day. Avoid in severe liver disease.',
    side_effects: ['Hepatotoxicity (overdose)', 'Rash (rare)'],
    interactions: ['Warfarin (increased INR)', 'Alcohol (hepatotoxicity risk)'],
    is_opioid: false,
    medd_factor: null,
    who_ladder_step: 1,
    schedule: 'OTC',
    nlem: true,
  },
  {
    id: '6',
    generic_name: 'Gabapentin',
    brand_names: ['Gabapin', 'Neurontin'],
    hindi_name: '\u0917\u0948\u092c\u093e\u092a\u0947\u0902\u091f\u093f\u0928',
    drug_class: 'Anticonvulsant / Neuropathic Adjuvant',
    category: 'adjuvant',
    route: ['Oral'],
    dosage_forms: 'Capsules, Tablets',
    indication_palliative: 'Neuropathic pain, anxiety in palliative setting',
    common_doses: 'Start 100-300mg TDS; target 900-3600mg/day',
    max_dose: '3600mg/day',
    renal_adjustment: 'Reduce dose per CrCl. 200-700mg/day if CrCl 15-29.',
    hepatic_adjustment: 'No adjustment required.',
    side_effects: ['Somnolence', 'Dizziness', 'Peripheral edema', 'Ataxia'],
    interactions: ['Antacids (reduce absorption)', 'Morphine (increased gabapentin levels)'],
    is_opioid: false,
    medd_factor: null,
    who_ladder_step: null,
    schedule: 'Schedule H',
    nlem: true,
  },
  {
    id: '7',
    generic_name: 'Ondansetron',
    brand_names: ['Emeset', 'Zofran', 'Vomikind'],
    hindi_name: '\u0913\u0902\u0921\u0947\u0928\u0938\u0947\u091f\u094d\u0930\u0949\u0928',
    drug_class: '5-HT3 Antagonist',
    category: 'antiemetic',
    route: ['Oral', 'IV'],
    dosage_forms: 'Tablets (regular/ODT), Injection',
    indication_palliative: 'Chemotherapy-induced and opioid-induced nausea/vomiting',
    common_doses: '4-8mg Q8H',
    max_dose: '24mg/day',
    renal_adjustment: 'No adjustment needed.',
    hepatic_adjustment: 'Max 8mg/day in severe hepatic impairment.',
    side_effects: ['Headache', 'Constipation', 'QT prolongation'],
    interactions: ['Apomorphine (contraindicated)', 'Serotonergic drugs'],
    is_opioid: false,
    medd_factor: null,
    who_ladder_step: null,
    schedule: 'Schedule H',
    nlem: true,
  },
  {
    id: '8',
    generic_name: 'Dexamethasone',
    brand_names: ['Decadron', 'Dexona'],
    hindi_name: '\u0921\u0947\u0915\u094d\u0938\u093e\u092e\u0947\u0925\u093e\u0938\u094b\u0928',
    drug_class: 'Corticosteroid',
    category: 'adjuvant',
    route: ['Oral', 'IV', 'IM'],
    dosage_forms: 'Tablets, Injection',
    indication_palliative: 'Cerebral edema, spinal cord compression, appetite stimulant, anti-emetic adjunct, nausea',
    common_doses: 'Anti-emetic: 4-8mg/day; Cerebral edema: 8-16mg/day',
    max_dose: 'Context-dependent; taper when possible',
    renal_adjustment: 'No specific adjustment.',
    hepatic_adjustment: 'Use with caution; monitor glucose.',
    side_effects: ['Hyperglycemia', 'Insomnia', 'Oral candidiasis', 'Proximal myopathy', 'GI bleeding'],
    interactions: ['NSAIDs (GI risk)', 'Warfarin', 'Antidiabetics'],
    is_opioid: false,
    medd_factor: null,
    who_ladder_step: null,
    schedule: 'Schedule H',
    nlem: true,
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'opioid', label: 'Opioids' },
  { key: 'non_opioid', label: 'Non-opioids' },
  { key: 'adjuvant', label: 'Adjuvants' },
  { key: 'antiemetic', label: 'Anti-emetics' },
];

const WHO_STEP_COLORS: Record<number, string> = {
  1: 'bg-sage/20 text-sage',
  2: 'bg-amber/10 text-amber',
  3: 'bg-terra/10 text-terra',
};

// -- Equianalgesic conversion table -------------------------------------------
// Factor: multiply source dose by factor to get oral morphine equivalent (MEDD)
const OPIOID_CONVERSIONS = [
  { id: 'morphine_po', name: 'Morphine (Oral)', factor: 1.0, unit: 'mg/day', step: 3 },
  { id: 'morphine_iv', name: 'Morphine (IV/SC)', factor: 3.0, unit: 'mg/day', step: 3 },
  { id: 'oxycodone_po', name: 'Oxycodone (Oral)', factor: 1.5, unit: 'mg/day', step: 3 },
  { id: 'hydromorphone_po', name: 'Hydromorphone (Oral)', factor: 4.0, unit: 'mg/day', step: 3 },
  { id: 'hydromorphone_iv', name: 'Hydromorphone (IV)', factor: 20.0, unit: 'mg/day', step: 3 },
  { id: 'fentanyl_patch', name: 'Fentanyl (Patch)', factor: 2.4, unit: 'mcg/h', step: 3 },
  { id: 'fentanyl_iv', name: 'Fentanyl (IV)', factor: 0.3, unit: 'mcg/day', step: 3 },
  { id: 'tramadol_po', name: 'Tramadol (Oral)', factor: 0.1, unit: 'mg/day', step: 2 },
  { id: 'codeine_po', name: 'Codeine (Oral)', factor: 0.15, unit: 'mg/day', step: 2 },
  { id: 'tapentadol_po', name: 'Tapentadol (Oral)', factor: 0.4, unit: 'mg/day', step: 3 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function mapApiMed(m: any): Medication {
  return {
    id: m.id,
    generic_name: m.generic_name || m.name || '',
    brand_names: m.brand_names || [],
    hindi_name: m.hindi_name || '',
    drug_class: m.drug_class || m.category || '',
    category: m.category || 'adjuvant',
    route: m.routes || m.route || [],
    dosage_forms: m.dosage_forms || '',
    indication_palliative: m.indication_palliative || m.indications || '',
    common_doses: m.common_doses || m.dosing || '',
    max_dose: m.max_dose || '',
    renal_adjustment: m.renal_adjustment || '',
    hepatic_adjustment: m.hepatic_adjustment || '',
    side_effects: m.side_effects || [],
    interactions: m.interactions || [],
    is_opioid: m.is_opioid || false,
    medd_factor: m.medd_factor ?? null,
    who_ladder_step: m.who_ladder_step ?? null,
    schedule: m.schedule || '',
    nlem: m.nlem || false,
  };
}

export default function MedicationDbPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sprint 23 — Equianalgesic Calculator state
  const [showCalc, setShowCalc] = useState(false);
  const [sourceOpioid, setSourceOpioid] = useState('morphine_po');
  const [sourceDose, setSourceDose] = useState('');
  const [targetOpioid, setTargetOpioid] = useState('oxycodone_po');

  const sourceConv = OPIOID_CONVERSIONS.find((o) => o.id === sourceOpioid)!;
  const targetConv = OPIOID_CONVERSIONS.find((o) => o.id === targetOpioid)!;
  const doseNum = parseFloat(sourceDose) || 0;
  const medd = doseNum * sourceConv.factor;
  const targetDose = targetConv.factor > 0 ? medd / targetConv.factor : 0;
  const targetReduced75 = targetDose * 0.75;
  const targetReduced50 = targetDose * 0.50;

  // Fetch from API — fallback to mock
  const palliativeQuery = usePalliativeMedications();
  const searchApiQuery = useMedicationSearch(searchQuery);
  const { data: rawMeds, isLoading, isFromApi } = useWithFallback(palliativeQuery, MEDICATIONS);

  const apiMedications: Medication[] = isFromApi
    ? (Array.isArray(rawMeds) ? rawMeds : (rawMeds as any)?.data || []).map(mapApiMed)
    : MEDICATIONS;

  // If user is searching and API is live, prefer search results
  const searchResults = searchQuery.length >= 2 && searchApiQuery.data
    ? (Array.isArray(searchApiQuery.data) ? searchApiQuery.data : (searchApiQuery.data as any)?.data || []).map(mapApiMed)
    : null;

  const baseMeds: Medication[] = searchResults || apiMedications;

  const filtered = baseMeds.filter((med: Medication) => {
    const matchesSearch =
      !searchQuery ||
      med.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.brand_names.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
      med.hindi_name.includes(searchQuery) ||
      med.drug_class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = category === 'all' || med.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">
          Medication Reference
        </h1>
        <p className="mt-1 text-sm text-charcoal/60">
          Palliative care drug database with dosing, interactions, and MEDD conversion
        </p>
        {isLoading && <Loader2 className="mt-1 h-4 w-4 animate-spin text-teal" />}
        {!isFromApi && !isLoading && (
          <span className="mt-1 inline-block rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-semibold text-amber">Demo Data</span>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search by name, brand, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-sage-light/30 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={cn(
                'rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                category === cat.key
                  ? 'bg-teal text-white'
                  : 'bg-white border border-sage-light/30 text-charcoal/60 hover:border-teal hover:text-teal',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frequently Prescribed */}
      <div className="rounded-xl border border-teal/20 bg-teal/5 p-4">
        <p className="text-xs font-bold text-teal uppercase mb-2">Frequently Prescribed — Quick Access</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Morphine Sulfate', 'Gabapentin', 'Ondansetron', 'Paracetamol', 'Lactulose', 'Dexamethasone'].map(name => {
            const med = baseMeds.find(m => m.generic_name === name);
            return (
              <button
                key={name}
                onClick={() => {
                  if (med) { setExpandedId(expandedId === med.id ? null : med.id); setSearchQuery(''); setCategory('all'); }
                }}
                className="flex-shrink-0 rounded-lg border border-teal/20 bg-white px-3 py-2 text-xs font-semibold text-charcoal hover:bg-teal/5 hover:border-teal/40 transition-colors"
              >
                <Pill className="inline h-3 w-3 mr-1 text-teal" />
                {name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* MEDD Quick Reference Card */}
      <div className="rounded-xl border border-amber/20 bg-amber/5 p-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-amber" />
          <h3 className="text-sm font-bold text-amber">MEDD Quick Reference</h3>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {MEDICATIONS.filter((m) => m.is_opioid && m.medd_factor !== null).map((m) => (
            <div key={m.id} className="rounded-lg bg-white p-2 text-center">
              <p className="text-xs font-semibold text-charcoal">{m.generic_name.split(' ')[0]}</p>
              <p className="text-lg font-bold text-amber">{m.medd_factor}x</p>
              <p className="text-[10px] text-charcoal/40">
                Step {m.who_ladder_step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sprint 23 — Equianalgesic Calculator */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        <button
          onClick={() => setShowCalc(!showCalc)}
          className="flex w-full items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
              <Calculator className="h-5 w-5 text-teal" />
            </div>
            <div className="text-left">
              <h2 className="font-heading text-lg font-bold text-teal">Opioid Equianalgesic Calculator</h2>
              <p className="text-xs text-charcoal/50">Convert between opioids with MEDD and cross-tolerance adjustment</p>
            </div>
          </div>
          {showCalc ? <ChevronUp className="h-5 w-5 text-charcoal/30" /> : <ChevronDown className="h-5 w-5 text-charcoal/30" />}
        </button>

        {showCalc && (
          <div className="border-t border-sage-light/20 p-5">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Input side */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-charcoal">Source Opioid</h3>
                <div>
                  <label className="text-xs font-semibold text-charcoal/60 uppercase">Drug & Route</label>
                  <select
                    value={sourceOpioid}
                    onChange={(e) => setSourceOpioid(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2.5 text-sm text-charcoal focus:border-teal focus:outline-none"
                  >
                    {OPIOID_CONVERSIONS.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} — Step {o.step}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/60 uppercase">
                    Total Daily Dose ({sourceConv.unit})
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={sourceDose}
                    onChange={(e) => setSourceDose(e.target.value)}
                    placeholder={`Enter dose in ${sourceConv.unit}`}
                    className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none"
                  />
                </div>
                <div className="rounded-lg bg-teal/5 p-3">
                  <p className="text-xs text-charcoal/60">
                    Conversion factor: <span className="font-bold text-teal">{sourceConv.factor}x</span>
                    {' '}&rarr; MEDD = {sourceDose || '0'} &times; {sourceConv.factor} = <span className="font-bold text-teal">{medd.toFixed(1)} mg morphine PO/day</span>
                  </p>
                </div>

                <div className="border-t border-sage/10 pt-4">
                  <h3 className="text-sm font-bold text-charcoal">Target Opioid</h3>
                  <div className="mt-2">
                    <label className="text-xs font-semibold text-charcoal/60 uppercase">Convert To</label>
                    <select
                      value={targetOpioid}
                      onChange={(e) => setTargetOpioid(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2.5 text-sm text-charcoal focus:border-teal focus:outline-none"
                    >
                      {OPIOID_CONVERSIONS.map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Result side */}
              <div className="space-y-4">
                {/* MEDD result */}
                <div className="rounded-xl bg-teal/5 border border-teal/20 p-5 text-center">
                  <p className="text-xs font-semibold text-teal uppercase">Morphine Equivalent Daily Dose</p>
                  <p className="mt-2 text-4xl font-bold text-teal">{medd.toFixed(1)}</p>
                  <p className="text-sm text-charcoal/50">mg oral morphine/day</p>
                  {medd > 200 && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs font-bold text-alert-critical">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      High dose (&gt;200 mg MEDD) — specialist review recommended
                    </div>
                  )}
                  {medd > 90 && medd <= 200 && (
                    <p className="mt-2 text-[10px] text-amber font-semibold">
                      &gt;90 mg MEDD — consider naloxone co-prescription
                    </p>
                  )}
                </div>

                {/* Converted dose */}
                {doseNum > 0 && (
                  <div className="rounded-xl border border-sage-light/30 p-5">
                    <p className="text-xs font-semibold text-charcoal/60 uppercase mb-3">
                      Equivalent {targetConv.name} Dose
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg bg-amber/5 border border-amber/20 p-3">
                        <div>
                          <p className="text-xs text-charcoal/60">Full calculated dose</p>
                          <p className="text-lg font-bold text-charcoal">{targetDose.toFixed(1)} <span className="text-xs font-normal text-charcoal/50">{targetConv.unit}</span></p>
                        </div>
                        <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-bold text-amber">100%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-sage/5 border border-sage/20 p-3">
                        <div>
                          <p className="text-xs text-alert-success font-semibold">Recommended (75%)</p>
                          <p className="text-lg font-bold text-alert-success">{targetReduced75.toFixed(1)} <span className="text-xs font-normal text-charcoal/50">{targetConv.unit}</span></p>
                        </div>
                        <span className="rounded-full bg-alert-success/10 px-2 py-0.5 text-[10px] font-bold text-alert-success">25% reduction</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-sage/5 border border-sage/20 p-3">
                        <div>
                          <p className="text-xs text-charcoal/60">Conservative (50%)</p>
                          <p className="text-lg font-bold text-charcoal">{targetReduced50.toFixed(1)} <span className="text-xs font-normal text-charcoal/50">{targetConv.unit}</span></p>
                        </div>
                        <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-bold text-sage">50% reduction</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clinical warnings */}
                <div className="rounded-lg border border-alert-critical/10 bg-alert-critical/5 p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-alert-critical uppercase">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Clinical Safety Notes
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-charcoal/70">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-alert-critical" />
                      <span><b>Incomplete cross-tolerance:</b> Always reduce calculated dose by 25-50% when rotating opioids</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-alert-critical" />
                      <span><b>Fentanyl patches:</b> Steady state takes 12-24h. Remove 12h before starting new opioid</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-alert-critical" />
                      <span><b>Methadone:</b> Has non-linear conversion ratios — consult specialist for MEDD &gt;100 mg</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber" />
                      <span><b>Renal impairment:</b> Avoid morphine (active metabolites). Prefer fentanyl or hydromorphone</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber" />
                      <span>This calculator is a clinical aid only — always use clinical judgement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Equianalgesic reference table */}
            <div className="mt-6 border-t border-sage/10 pt-4">
              <h4 className="text-sm font-bold text-charcoal mb-2">Quick Equianalgesic Reference</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sage-light/20 text-left">
                      <th className="py-2 pr-4 text-xs font-semibold text-charcoal/50">Opioid</th>
                      <th className="py-2 pr-4 text-xs font-semibold text-charcoal/50">Route</th>
                      <th className="py-2 pr-4 text-xs font-semibold text-charcoal/50">Equianalgesic Dose</th>
                      <th className="py-2 pr-4 text-xs font-semibold text-charcoal/50">MEDD Factor</th>
                      <th className="py-2 text-xs font-semibold text-charcoal/50">WHO Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OPIOID_CONVERSIONS.map((o) => (
                      <tr key={o.id} className="border-b border-sage-light/10">
                        <td className="py-2 pr-4 font-medium text-charcoal">{o.name.split(' (')[0]}</td>
                        <td className="py-2 pr-4 text-charcoal/70">{o.name.match(/\(([^)]+)\)/)?.[1] || ''}</td>
                        <td className="py-2 pr-4 text-charcoal/70">{o.factor !== 0 ? `${(30 / o.factor).toFixed(1)} ${o.unit.replace('/day', '')}` : '—'}</td>
                        <td className="py-2 pr-4">
                          <span className="font-bold text-teal">{o.factor}x</span>
                        </td>
                        <td className="py-2">
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', WHO_STEP_COLORS[o.step])}>
                            Step {o.step}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[10px] text-charcoal/40">
                Equianalgesic dose = amount equivalent to 30 mg oral morphine. Based on AAHPM, Oxford Handbook of Palliative Care, and WHO guidelines.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Interaction Check */}
      {(() => {
        // Check for common interaction pairs among selected/expanded meds
        const INTERACTION_PAIRS: { drugs: [string, string]; severity: 'major' | 'moderate'; warning: string }[] = [
          { drugs: ['Morphine Sulfate', 'Gabapentin'], severity: 'moderate', warning: 'Additive CNS depression — monitor sedation and respiratory rate' },
          { drugs: ['Morphine Sulfate', 'Ondansetron'], severity: 'moderate', warning: 'Ondansetron may reduce morphine analgesic efficacy via serotonin pathway' },
          { drugs: ['Morphine Sulfate', 'Oxycodone'], severity: 'major', warning: 'Concurrent full-agonist opioids — high risk of respiratory depression. Use only one as background.' },
          { drugs: ['Fentanyl', 'Oxycodone'], severity: 'major', warning: 'Dual opioid regimen — increased respiratory depression risk. Ensure single background opioid.' },
          { drugs: ['Tramadol', 'Ondansetron'], severity: 'moderate', warning: 'Ondansetron may reduce tramadol efficacy; both affect serotonin pathways' },
          { drugs: ['Dexamethasone', 'Paracetamol'], severity: 'moderate', warning: 'Steroids may increase hepatotoxicity risk with high-dose paracetamol (>3g/day)' },
        ];
        const drugNames = baseMeds.map((m: any) => m.generic_name);
        const activeInteractions = INTERACTION_PAIRS.filter(
          (pair) => drugNames.includes(pair.drugs[0]) && drugNames.includes(pair.drugs[1]),
        );
        if (activeInteractions.length === 0) return null;
        return (
          <div className="rounded-xl border border-amber/30 bg-amber/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber" />
              <h3 className="text-sm font-bold text-amber">Potential Interactions in Database</h3>
            </div>
            <div className="space-y-2">
              {activeInteractions.slice(0, 4).map((pair, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={cn(
                    'mt-0.5 h-2 w-2 rounded-full flex-shrink-0',
                    pair.severity === 'major' ? 'bg-alert-critical' : 'bg-amber',
                  )} />
                  <div>
                    <p className="text-xs font-semibold text-charcoal">
                      {pair.drugs[0]} + {pair.drugs[1]}
                      <span className={cn(
                        'ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase',
                        pair.severity === 'major' ? 'bg-alert-critical/10 text-alert-critical' : 'bg-amber/10 text-amber',
                      )}>
                        {pair.severity}
                      </span>
                    </p>
                    <p className="text-[10px] text-charcoal/50">{pair.warning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Medication cards */}
      <div className="space-y-3">
        {filtered.map((med) => {
          const isExpanded = expandedId === med.id;
          return (
            <div
              key={med.id}
              className="rounded-xl border border-sage-light/30 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Collapsed header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : med.id)}
                className="flex w-full items-center gap-4 p-4 text-left"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal/10">
                  <Pill className="h-5 w-5 text-teal" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-charcoal">
                      {med.generic_name}
                    </span>
                    <span className="text-xs text-charcoal/40">
                      ({med.hindi_name})
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-charcoal/50">{med.drug_class}</span>
                    <span className="text-charcoal/20">&middot;</span>
                    <span className="text-xs text-charcoal/50">
                      {med.brand_names.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {med.who_ladder_step && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        WHO_STEP_COLORS[med.who_ladder_step],
                      )}
                    >
                      WHO Step {med.who_ladder_step}
                    </span>
                  )}
                  {med.is_opioid && (
                    <span className="rounded-full bg-alert-critical/10 px-2 py-0.5 text-[10px] font-bold text-alert-critical">
                      Opioid
                    </span>
                  )}
                  {med.nlem && (
                    <span className="rounded-full bg-alert-success/10 px-2 py-0.5 text-[10px] font-bold text-alert-success">
                      NLEM
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-charcoal/30" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-charcoal/30" />
                  )}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-sage-light/20 px-4 pb-4 pt-3">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Dosing */}
                    <div className="space-y-3">
                      <div className="rounded-lg bg-teal/5 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-teal uppercase">
                          <Beaker className="h-3.5 w-3.5" />
                          Dosing
                        </h4>
                        <div className="mt-2 space-y-1.5 text-sm text-charcoal/70">
                          <p><span className="font-semibold">Common:</span> {med.common_doses}</p>
                          <p><span className="font-semibold">Max:</span> {med.max_dose}</p>
                          <p><span className="font-semibold">Route:</span> {med.route.join(', ')}</p>
                          <p><span className="font-semibold">Forms:</span> {med.dosage_forms}</p>
                        </div>
                      </div>

                      <div className="rounded-lg bg-cream/50 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-charcoal/60 uppercase">
                          <BookOpen className="h-3.5 w-3.5" />
                          Indication (Palliative)
                        </h4>
                        <p className="mt-1.5 text-sm text-charcoal/70 leading-relaxed">
                          {med.indication_palliative}
                        </p>
                      </div>

                      {med.is_opioid && med.medd_factor !== null && (
                        <div className="rounded-lg bg-amber/5 p-3">
                          <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber uppercase">
                            <Calculator className="h-3.5 w-3.5" />
                            MEDD Conversion
                          </h4>
                          <p className="mt-1.5 text-sm text-charcoal/70">
                            Factor: <span className="font-bold text-amber">{med.medd_factor}x</span>
                            {' '}&mdash; 30mg oral morphine = {(30 / med.medd_factor).toFixed(0)}mg oral {med.generic_name.split(' ')[0]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Safety */}
                    <div className="space-y-3">
                      <div className="rounded-lg bg-terra/5 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-terra uppercase">
                          <Shield className="h-3.5 w-3.5" />
                          Dose Adjustments
                        </h4>
                        <div className="mt-2 space-y-1.5 text-sm text-charcoal/70">
                          <p><span className="font-semibold">Renal:</span> {med.renal_adjustment}</p>
                          <p><span className="font-semibold">Hepatic:</span> {med.hepatic_adjustment}</p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-alert-critical/10 bg-alert-critical/5 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-alert-critical uppercase">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Side Effects
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {med.side_effects.map((se, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-white px-2 py-0.5 text-xs text-charcoal/60 border border-alert-critical/10"
                            >
                              {se}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg bg-charcoal/5 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-charcoal/60 uppercase">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Interactions
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {med.interactions.map((ix, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-white px-2 py-0.5 text-xs text-charcoal/60 border border-charcoal/10"
                            >
                              {ix}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-charcoal/40">
                        <Info className="h-3.5 w-3.5" />
                        <span>Schedule: {med.schedule}</span>
                        <span>&middot;</span>
                        <span>{med.nlem ? 'Included in NLEM' : 'Not in NLEM'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-sage-light/30 bg-white p-12 text-center">
            <Pill className="mx-auto h-10 w-10 text-charcoal/20" />
            <p className="mt-3 text-sm text-charcoal/50">
              No medications found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
