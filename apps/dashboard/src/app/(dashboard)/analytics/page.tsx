'use client';

import { useState } from 'react';
import {
  BarChart3, Users, UserPlus, UserMinus, Heart, Clock, Activity,
  Pill, TrendingUp, Download, Database, FileText, Shield, Star,
  CheckCircle, AlertTriangle, Loader2, X, CheckCircle2,
  Brain, ScrollText, Utensils, Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDepartmentSummary, usePainDistribution, useQualityMetrics } from '@/lib/hooks';
import { useWithFallback } from '@/lib/use-api-status';

/* eslint-disable @typescript-eslint/no-explicit-any */

// -- Pain color helper --------------------------------------------------------
const PAIN_COLORS: Record<number, string> = {
  0: '#7BA68C', 1: '#8DB89A', 2: '#A0C9A8', 3: '#C5D68E', 4: '#E8D86A',
  5: '#E8C44A', 6: '#E8A838', 7: '#E08830', 8: '#D4856B', 9: '#C25A45', 10: '#A83232',
};

// -- Mock data (fallback) -----------------------------------------------------
const MOCK_OVERVIEW = [
  { label: 'Active Patients', value: 32, icon: Users, color: 'bg-teal/10 text-teal', change: '+3 this month' },
  { label: 'New This Month', value: 5, icon: UserPlus, color: 'bg-sage/10 text-sage', change: 'vs 4 last month' },
  { label: 'Discharged', value: 3, icon: UserMinus, color: 'bg-amber/10 text-amber', change: '2 palliative, 1 curative' },
  { label: 'Deceased', value: 1, icon: Heart, color: 'bg-terra/10 text-terra', change: 'Expected death at home' },
];

const MOCK_QUALITY = [
  { label: 'Time to First Pain Assessment', value: '2.3', unit: 'hrs', target: '<4 hrs', status: 'good' as const, icon: Clock },
  { label: 'Time to Adequate Pain Control', value: '18', unit: 'hrs', target: '<24 hrs', status: 'good' as const, icon: Activity },
  { label: 'Avg Pain NRS at Discharge', value: '3.2', unit: '/10', target: '<4', status: 'good' as const, icon: TrendingUp },
  { label: 'Patient Satisfaction', value: '4.2', unit: '/5', target: '>4.0', status: 'good' as const, icon: Star },
  { label: 'PRO Completion Rate', value: '78', unit: '%', target: '>80%', status: 'warning' as const, icon: CheckCircle },
];

const MOCK_OPIOID = [
  { label: 'Average MEDD', value: '68', unit: 'mg/day', detail: 'Across all active patients' },
  { label: 'Opioid Rotation Rate', value: '12', unit: '%', detail: '4 of 32 patients this quarter' },
  { label: 'NDPS Compliance', value: '100', unit: '%', detail: 'All registers up to date' },
];

const MOCK_DISTRIBUTION = [
  { nrs: 0, count: 2 }, { nrs: 1, count: 3 }, { nrs: 2, count: 4 }, { nrs: 3, count: 5 },
  { nrs: 4, count: 6 }, { nrs: 5, count: 4 }, { nrs: 6, count: 3 }, { nrs: 7, count: 3 },
  { nrs: 8, count: 1 }, { nrs: 9, count: 1 }, { nrs: 10, count: 0 },
];

// Sprint 24 — Enhanced analytics mock data
const MOCK_PPS_DISTRIBUTION = [
  { bracket: '10-20%', count: 3, color: 'bg-alert-critical' },
  { bracket: '30-40%', count: 6, color: 'bg-terra' },
  { bracket: '50-60%', count: 12, color: 'bg-amber' },
  { bracket: '70-80%', count: 8, color: 'bg-sage' },
  { bracket: '90-100%', count: 3, color: 'bg-teal' },
];

const MOCK_SYMPTOM_BURDEN = [
  { symptom: 'Pain', prevalence: 88, avgSeverity: 5.4, trend: 'stable' as const },
  { symptom: 'Fatigue', prevalence: 75, avgSeverity: 5.8, trend: 'worsening' as const },
  { symptom: 'Constipation', prevalence: 63, avgSeverity: 4.4, trend: 'stable' as const },
  { symptom: 'Insomnia', prevalence: 56, avgSeverity: 5.1, trend: 'worsening' as const },
  { symptom: 'Anxiety', prevalence: 47, avgSeverity: 4.6, trend: 'improving' as const },
  { symptom: 'Nausea', prevalence: 44, avgSeverity: 3.2, trend: 'improving' as const },
  { symptom: 'Dyspnea', prevalence: 38, avgSeverity: 4.1, trend: 'stable' as const },
  { symptom: 'Appetite Loss', prevalence: 69, avgSeverity: 4.9, trend: 'worsening' as const },
];

const MOCK_SCREENING_RATES = {
  phq9: { screened: 26, total: 32, rate: 81 },
  gad7: { screened: 22, total: 32, rate: 69 },
  mustRisk: { screened: 28, total: 32, rate: 88 },
  caregiverDistress: { avgScore: 5.2, highDistress: 8 },
};

const MOCK_GOALS_DOCS = {
  goalsDocumented: { count: 28, total: 32, rate: 88 },
  advanceDirective: { count: 18, total: 32, rate: 56 },
  codeStatus: { count: 30, total: 32, rate: 94 },
  preferredPlace: { count: 24, total: 32, rate: 75 },
};

export default function AnalyticsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);

  function handleExport(label: string) {
    setToast(`Generating ${label}...`);
    setTimeout(() => setToast(`${label} ready for download`), 1500);
    setTimeout(() => setToast(null), 4000);
  }

  const summaryQuery = useDepartmentSummary();
  const painQuery = usePainDistribution();
  const qualityQuery = useQualityMetrics();

  const { data: summaryData, isFromApi: summaryLive } = useWithFallback(summaryQuery, {});
  const { data: painData, isFromApi: painLive } = useWithFallback(painQuery, MOCK_DISTRIBUTION);
  const { data: qualityData, isFromApi: qualityLive } = useWithFallback(qualityQuery, MOCK_QUALITY);

  const isLive = summaryLive || painLive || qualityLive;
  const s = summaryData as any;

  // Build overview cards from API or fallback
  const PATIENT_OVERVIEW = summaryLive ? [
    { label: 'Active Patients', value: s.active_patients ?? s.activePatients ?? 32, icon: Users, color: 'bg-teal/10 text-teal', change: 'Live from API' },
    { label: 'New This Month', value: s.new_this_month ?? s.newThisMonth ?? 5, icon: UserPlus, color: 'bg-sage/10 text-sage', change: 'Live' },
    { label: 'Discharged', value: s.discharged ?? 3, icon: UserMinus, color: 'bg-amber/10 text-amber', change: 'Live' },
    { label: 'Deceased', value: s.deceased ?? 1, icon: Heart, color: 'bg-terra/10 text-terra', change: 'Live' },
  ] : MOCK_OVERVIEW;

  const QUALITY_METRICS = qualityLive
    ? (Array.isArray(qualityData) ? qualityData : (qualityData as any)?.metrics || MOCK_QUALITY)
    : MOCK_QUALITY;

  const OPIOID_METRICS = summaryLive ? [
    { label: 'Average MEDD', value: String(s.avg_medd ?? '68'), unit: 'mg/day', detail: 'Across all active patients' },
    { label: 'Opioid Rotation Rate', value: String(s.opioid_rotation_rate ?? '12'), unit: '%', detail: `${s.opioid_rotations ?? 4} of ${s.active_patients ?? 32} patients` },
    { label: 'NDPS Compliance', value: String(s.ndps_compliance ?? '100'), unit: '%', detail: 'All registers up to date' },
  ] : MOCK_OPIOID;

  const PAIN_DISTRIBUTION = painLive
    ? (Array.isArray(painData) ? painData : (painData as any)?.distribution || MOCK_DISTRIBUTION)
    : MOCK_DISTRIBUTION;

  const maxDistribution = Math.max(...PAIN_DISTRIBUTION.map((d: any) => d.count));
  const mildCount = PAIN_DISTRIBUTION.filter((d: any) => d.nrs <= 3).reduce((s: number, d: any) => s + d.count, 0);
  const modCount = PAIN_DISTRIBUTION.filter((d: any) => d.nrs >= 4 && d.nrs <= 6).reduce((s: number, d: any) => s + d.count, 0);
  const sevCount = PAIN_DISTRIBUTION.filter((d: any) => d.nrs >= 7).reduce((s: number, d: any) => s + d.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-teal" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-teal">Analytics &amp; Research</h1>
            <p className="text-sm text-charcoal-light">Department metrics, pain analytics, medication outcomes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-charcoal/50">
          {!isLive && <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-semibold text-amber">Demo</span>}
          <Clock className="h-4 w-4" />
          Data as of: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Patient Overview Cards */}
      <div>
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal mb-3">
          <Users className="h-4 w-4 text-teal" /> Patient Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PATIENT_OVERVIEW.map((item: any) => (
            <div key={item.label} className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal-light">{item.label}</p>
                  <p className="mt-1 font-heading text-3xl font-bold text-charcoal">{item.value}</p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-2 text-xs text-charcoal/50">{item.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Metrics */}
      <div>
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal mb-3">
          <Activity className="h-4 w-4 text-teal" /> Quality Metrics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {QUALITY_METRICS.map((metric: any) => {
            const MetricIcon = metric.icon || Activity;
            return (
              <div key={metric.label} className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <MetricIcon className="h-4 w-4 text-teal" />
                  <p className="text-xs font-medium text-charcoal/60 leading-tight">{metric.label}</p>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-charcoal">{metric.value}</span>
                  <span className="text-sm text-charcoal/50">{metric.unit}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={cn('h-2 w-2 rounded-full', metric.status === 'good' ? 'bg-alert-success' : 'bg-amber')} />
                  <span className="text-[10px] text-charcoal/50">Target: {metric.target}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="rounded-xl border border-teal/20 bg-teal/5 p-5">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-teal mb-3">
          <Lightbulb className="h-4 w-4" /> Key Insights
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            sevCount > 0 && `${sevCount} patient${sevCount > 1 ? 's' : ''} with severe pain (NRS ≥ 7) — review breakthrough protocols`,
            MOCK_SYMPTOM_BURDEN.filter(s => s.trend === 'worsening').length > 0 &&
              `${MOCK_SYMPTOM_BURDEN.filter(s => s.trend === 'worsening').map(s => s.symptom).join(', ')} trending worse across census`,
            MOCK_SCREENING_RATES.gad7.rate < 80 && `GAD-7 screening at ${MOCK_SCREENING_RATES.gad7.rate}% — below 80% target`,
            MOCK_GOALS_DOCS.advanceDirective.rate < 70 && `Advance directives only ${MOCK_GOALS_DOCS.advanceDirective.rate}% complete — 14 patients missing`,
            MOCK_SCREENING_RATES.caregiverDistress.highDistress > 5 &&
              `${MOCK_SCREENING_RATES.caregiverDistress.highDistress} caregivers with high distress — consider support referrals`,
            MOCK_PPS_DISTRIBUTION[0].count > 0 && `${MOCK_PPS_DISTRIBUTION[0].count} patients bed-bound (PPS 10-20%) — escalate comfort measures`,
          ].filter(Boolean).map((insight, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-white p-3">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-teal" />
              <p className="text-sm text-charcoal/70">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: Opioid Utilization + Pain Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Opioid Utilization */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <Pill className="h-4 w-4 text-teal" /> Opioid Utilization
          </h2>
          <div className="mt-4 space-y-4">
            {OPIOID_METRICS.map((metric: any) => (
              <div key={metric.label} className="rounded-lg border border-sage/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal/70">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-charcoal">{metric.value}</span>
                    <span className="text-sm text-charcoal/50">{metric.unit}</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-charcoal/40">{metric.detail}</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-sage/10">
                  <div className="h-1.5 rounded-full bg-teal transition-all" style={{ width: `${Math.min(parseFloat(metric.value), 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-alert-success/10 p-3">
            <Shield className="h-5 w-5 text-alert-success" />
            <div>
              <p className="text-sm font-semibold text-alert-success">NDPS Fully Compliant</p>
              <p className="text-xs text-charcoal/50">Last audit: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Pain Distribution Chart */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <BarChart3 className="h-4 w-4 text-teal" /> Pain Distribution (Current Census)
          </h2>
          <p className="mt-1 text-xs text-charcoal/50">Number of patients at each NRS level</p>
          <div className="mt-4 space-y-2">
            {PAIN_DISTRIBUTION.map((item: any) => (
              <div key={item.nrs} className="flex items-center gap-3">
                <div className="w-8 text-right">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold"
                    style={{ backgroundColor: PAIN_COLORS[item.nrs], color: item.nrs >= 6 ? '#fff' : '#2D2D2D' }}>
                    {item.nrs}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-5 rounded" style={{ position: 'relative' }}>
                    <div className="h-5 rounded transition-all"
                      style={{ width: maxDistribution > 0 ? `${(item.count / maxDistribution) * 100}%` : '0%', backgroundColor: PAIN_COLORS[item.nrs], opacity: 0.7, minWidth: item.count > 0 ? '8px' : '0px' }} />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-bold text-charcoal">{item.count}</span>
                  <span className="text-xs text-charcoal/40 ml-1">pts</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-sage/10 pt-4">
            <div className="text-center"><p className="text-xs text-charcoal/50">Mild (0-3)</p><p className="text-lg font-bold text-alert-success">{mildCount}</p></div>
            <div className="text-center"><p className="text-xs text-charcoal/50">Moderate (4-6)</p><p className="text-lg font-bold text-amber">{modCount}</p></div>
            <div className="text-center"><p className="text-xs text-charcoal/50">Severe (7-10)</p><p className="text-lg font-bold text-alert-critical">{sevCount}</p></div>
          </div>
        </div>
      </div>

      {/* Sprint 24 — Functional Status Distribution + Symptom Burden */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* PPS Distribution */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <Activity className="h-4 w-4 text-teal" /> Functional Status (PPS Distribution)
          </h2>
          <p className="mt-1 text-xs text-charcoal/50">Current census by Palliative Performance Scale bracket</p>
          <div className="mt-4 space-y-3">
            {MOCK_PPS_DISTRIBUTION.map((item) => {
              const maxCount = Math.max(...MOCK_PPS_DISTRIBUTION.map((d) => d.count));
              return (
                <div key={item.bracket} className="flex items-center gap-3">
                  <span className="w-16 text-xs font-semibold text-charcoal/60 text-right">{item.bracket}</span>
                  <div className="flex-1 h-6 rounded bg-sage/5 relative">
                    <div
                      className={cn('h-6 rounded transition-all', item.color)}
                      style={{ width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`, minWidth: item.count > 0 ? '8px' : '0px', opacity: 0.7 }}
                    />
                  </div>
                  <span className="w-16 text-sm font-bold text-charcoal">{item.count} <span className="text-xs font-normal text-charcoal/40">pts</span></span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-sage/10 pt-3">
            <div className="text-center">
              <p className="text-xs text-charcoal/50">Bed-bound</p>
              <p className="text-lg font-bold text-alert-critical">{MOCK_PPS_DISTRIBUTION[0].count}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-charcoal/50">Limited</p>
              <p className="text-lg font-bold text-amber">{MOCK_PPS_DISTRIBUTION[1].count + MOCK_PPS_DISTRIBUTION[2].count}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-charcoal/50">Ambulatory</p>
              <p className="text-lg font-bold text-sage">{MOCK_PPS_DISTRIBUTION[3].count + MOCK_PPS_DISTRIBUTION[4].count}</p>
            </div>
          </div>
        </div>

        {/* Symptom Burden */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <Heart className="h-4 w-4 text-teal" /> Symptom Burden Overview
          </h2>
          <p className="mt-1 text-xs text-charcoal/50">Prevalence and severity across active patients</p>
          <div className="mt-4 space-y-2">
            {MOCK_SYMPTOM_BURDEN.sort((a, b) => b.prevalence - a.prevalence).map((item) => (
              <div key={item.symptom} className="flex items-center gap-3">
                <span className="w-24 text-xs font-medium text-charcoal/70 truncate">{item.symptom}</span>
                <div className="flex-1 h-4 rounded-full bg-sage/10 relative">
                  <div
                    className="h-4 rounded-full transition-all"
                    style={{
                      width: `${item.prevalence}%`,
                      backgroundColor: item.avgSeverity >= 5 ? '#D4856B' : item.avgSeverity >= 3 ? '#E8A838' : '#7BA68C',
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span className="w-10 text-xs font-bold text-charcoal text-right">{item.prevalence}%</span>
                <span className={cn(
                  'w-4 text-[10px]',
                  item.trend === 'worsening' ? 'text-alert-critical' :
                  item.trend === 'improving' ? 'text-alert-success' : 'text-charcoal/30'
                )}>
                  {item.trend === 'worsening' ? '\u2191' : item.trend === 'improving' ? '\u2193' : '\u2014'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-charcoal/40 border-t border-sage/10 pt-2">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-terra/70" /> Severe (&ge;5)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber/70" /> Moderate (3-4)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sage/70" /> Mild (&lt;3)</span>
            <span className="ml-auto">&uarr; worsening &darr; improving</span>
          </div>
        </div>
      </div>

      {/* Sprint 24 — Psychosocial Screening + Goals-of-Care Documentation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Psychosocial Screening */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <Brain className="h-4 w-4 text-teal" /> Psychosocial Screening Rates
          </h2>
          <p className="mt-1 text-xs text-charcoal/50">Active census screening compliance</p>
          <div className="mt-4 space-y-4">
            {[
              { label: 'PHQ-9 (Depression)', ...MOCK_SCREENING_RATES.phq9, target: 80, icon: Brain },
              { label: 'GAD-7 (Anxiety)', ...MOCK_SCREENING_RATES.gad7, target: 80, icon: Brain },
              { label: 'MUST (Nutrition Risk)', ...MOCK_SCREENING_RATES.mustRisk, target: 85, icon: Utensils },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-sage/10 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-charcoal/40" />
                    <span className="text-sm font-medium text-charcoal/70">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-lg font-bold',
                      item.rate >= item.target ? 'text-alert-success' : item.rate >= item.target - 10 ? 'text-amber' : 'text-alert-critical'
                    )}>
                      {item.rate}%
                    </span>
                    <span className="text-[10px] text-charcoal/40">{item.screened}/{item.total}</span>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-sage/10">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.rate}%`,
                      backgroundColor: item.rate >= item.target ? '#7BA68C' : item.rate >= item.target - 10 ? '#E8A838' : '#C25A45',
                    }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-charcoal/40">Target: {item.target}%</p>
              </div>
            ))}
            {/* Caregiver distress summary */}
            <div className="rounded-lg bg-lavender/20 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal/70">Caregiver Distress</span>
                <span className="text-lg font-bold text-charcoal">{MOCK_SCREENING_RATES.caregiverDistress.avgScore}/10</span>
              </div>
              <p className="mt-1 text-xs text-charcoal/50">
                {MOCK_SCREENING_RATES.caregiverDistress.highDistress} caregivers with high distress (&ge;7/10)
              </p>
            </div>
          </div>
        </div>

        {/* Goals-of-Care Documentation */}
        <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <ScrollText className="h-4 w-4 text-teal" /> Goals-of-Care Documentation
          </h2>
          <p className="mt-1 text-xs text-charcoal/50">Advance planning documentation completeness</p>
          <div className="mt-4 space-y-4">
            {[
              { label: 'Goals of Care Documented', ...MOCK_GOALS_DOCS.goalsDocumented, target: 90 },
              { label: 'Code Status Documented', ...MOCK_GOALS_DOCS.codeStatus, target: 95 },
              { label: 'Preferred Place of Death', ...MOCK_GOALS_DOCS.preferredPlace, target: 80 },
              { label: 'Advance Directive on File', ...MOCK_GOALS_DOCS.advanceDirective, target: 70 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal/70">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-bold',
                      item.rate >= item.target ? 'text-alert-success' : item.rate >= item.target - 15 ? 'text-amber' : 'text-alert-critical'
                    )}>
                      {item.rate}%
                    </span>
                    <span className="text-[10px] text-charcoal/40">{item.count}/{item.total}</span>
                  </div>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-sage/10 relative">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.rate}%`,
                      backgroundColor: item.rate >= item.target ? '#7BA68C' : item.rate >= item.target - 15 ? '#E8A838' : '#C25A45',
                    }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute top-0 h-2 w-0.5 bg-charcoal/30"
                    style={{ left: `${item.target}%` }}
                    title={`Target: ${item.target}%`}
                  />
                </div>
                <p className="mt-0.5 text-[10px] text-charcoal/40">Target: {item.target}%</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-teal/5 border border-teal/10 p-3">
            <p className="text-xs text-teal font-semibold">
              Overall Documentation Score: {Math.round((MOCK_GOALS_DOCS.goalsDocumented.rate + MOCK_GOALS_DOCS.codeStatus.rate + MOCK_GOALS_DOCS.preferredPlace.rate + MOCK_GOALS_DOCS.advanceDirective.rate) / 4)}%
            </p>
            <p className="text-[10px] text-charcoal/50 mt-0.5">Average across all 4 documentation categories</p>
          </div>
        </div>
      </div>

      {/* Research Export */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal"><Database className="h-4 w-4 text-teal" /> Research &amp; Export</h2>
        <p className="mt-1 text-xs text-charcoal/50">De-identified data export tools for research and quality improvement</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Export CSV', icon: Download, desc: 'De-identified patient data' },
            { label: 'Cohort Builder', icon: Users, desc: 'Define research cohorts' },
            { label: 'Publication Charts', icon: BarChart3, desc: 'Generate publication-ready figures' },
            { label: 'REDCap Integration', icon: Database, desc: 'Push to REDCap project' },
          ].map((tool) => (
            <button key={tool.label} onClick={() => handleExport(tool.label)} className="flex flex-col items-start rounded-lg border border-sage/20 p-4 text-left transition-all hover:border-teal/30 hover:bg-teal/5 hover:shadow-sm active:scale-[0.98]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10"><tool.icon className="h-4 w-4 text-teal" /></div>
              <p className="mt-3 text-sm font-semibold text-charcoal">{tool.label}</p>
              <p className="mt-0.5 text-xs text-charcoal/50">{tool.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Regulatory Reports */}
      <div className="rounded-xl border border-sage-light/30 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal"><FileText className="h-4 w-4 text-teal" /> Regulatory Reports</h2>
        <p className="mt-1 text-xs text-charcoal/50">Generate compliance and quality reports for institutional accreditation</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Generate NABH Quality Report', desc: 'National Accreditation Board for Hospitals quality indicators including pain management, patient safety, and medication error rates.', icon: Shield, accent: 'border-teal/20 hover:border-teal/40' },
            { label: 'NAAC Outcome Metrics', desc: 'Patient outcome data formatted for National Assessment and Accreditation Council reporting requirements.', icon: TrendingUp, accent: 'border-sage/20 hover:border-sage/40' },
            { label: 'NDPS Quarterly Report', desc: 'Narcotic Drugs and Psychotropic Substances register summary, consumption tracking, and wastage documentation.', icon: AlertTriangle, accent: 'border-amber/20 hover:border-amber/40' },
          ].map((report) => (
            <button key={report.label} onClick={() => setShowReportModal(report.label)} className={cn('flex flex-col items-start rounded-lg border p-5 text-left transition-all hover:bg-cream/50 hover:shadow-sm active:scale-[0.98]', report.accent)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10"><report.icon className="h-5 w-5 text-teal" /></div>
              <p className="mt-3 text-sm font-semibold text-charcoal">{report.label}</p>
              <p className="mt-1 text-xs text-charcoal/50 leading-relaxed">{report.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowReportModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-teal">{showReportModal}</h3>
              <button onClick={() => setShowReportModal(null)} className="rounded-lg p-1 hover:bg-sage/10"><X className="h-5 w-5 text-charcoal/40" /></button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-cream/50 p-4">
                <p className="text-sm text-charcoal/70">This report will be generated using de-identified data from the past 90 days. The report follows institutional formatting guidelines.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Date Range</label>
                <select className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">Format</label>
                <select className="mt-1 w-full rounded-lg border border-sage-light/50 px-3 py-2 text-sm text-charcoal focus:border-teal focus:outline-none">
                  <option>PDF Report</option>
                  <option>Excel Spreadsheet</option>
                  <option>CSV Data</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowReportModal(null)} className="rounded-lg border border-sage/30 px-4 py-2 text-xs font-semibold text-charcoal/60 hover:bg-sage/5">Cancel</button>
                <button onClick={() => { handleExport(showReportModal); setShowReportModal(null); }} className="rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal/90">
                  <Download className="mr-1.5 inline h-3.5 w-3.5" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lg toast-slide-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
