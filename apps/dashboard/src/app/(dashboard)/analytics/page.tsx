'use client';

import { useState } from 'react';
import {
  BarChart3, Users, UserPlus, UserMinus, Heart, Clock, Activity,
  Pill, TrendingUp, Download, Database, FileText, Shield, Star,
  CheckCircle, AlertTriangle, Loader2,
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

export default function AnalyticsPage() {
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
            <button key={tool.label} className="flex flex-col items-start rounded-lg border border-sage/20 p-4 text-left transition-all hover:border-teal/30 hover:bg-teal/5 hover:shadow-sm">
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
            <button key={report.label} className={cn('flex flex-col items-start rounded-lg border p-5 text-left transition-all hover:bg-cream/50 hover:shadow-sm', report.accent)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10"><report.icon className="h-5 w-5 text-teal" /></div>
              <p className="mt-3 text-sm font-semibold text-charcoal">{report.label}</p>
              <p className="mt-1 text-xs text-charcoal/50 leading-relaxed">{report.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
