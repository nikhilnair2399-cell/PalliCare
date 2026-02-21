'use client';

import { TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { useDailySummary } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PAIN_TRENDS } from '@/lib/patient-mock-data';
import { painColor } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PainDiaryPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const summaryQuery = useDailySummary(
    thirtyDaysAgo.toISOString().split('T')[0],
    now.toISOString().split('T')[0],
  );
  const { data: rawTrends } = useWithFallback(summaryQuery, MOCK_PAIN_TRENDS);
  const trends: any[] = Array.isArray(rawTrends) ? rawTrends : MOCK_PAIN_TRENDS;

  // Calculate summary stats
  const scores = trends.map((t: any) => t.pain_score);
  const avgPain = scores.length > 0 ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1) : '0';
  const maxPain = scores.length > 0 ? Math.max(...scores) : 0;
  const breakthroughs = trends.filter((t: any) => t.breakthrough).length;

  // Recent 7-day trend
  const recent7 = trends.slice(-7);
  const recent7Avg = recent7.length > 0
    ? (recent7.map((t: any) => t.pain_score).reduce((a: number, b: number) => a + b, 0) / recent7.length).toFixed(1)
    : '0';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">
          Pain Diary
        </h1>
        <p className="text-sm text-charcoal-light">
          Track your pain trends over time
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-charcoal-light">30-Day Average</p>
          <p className="mt-1 font-heading text-2xl font-bold" style={{ color: painColor(Number(avgPain)) }}>
            {avgPain}/10
          </p>
        </div>
        <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-charcoal-light">7-Day Average</p>
          <p className="mt-1 font-heading text-2xl font-bold" style={{ color: painColor(Number(recent7Avg)) }}>
            {recent7Avg}/10
          </p>
        </div>
        <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-charcoal-light">Highest Score</p>
          <p className="mt-1 font-heading text-2xl font-bold" style={{ color: painColor(maxPain) }}>
            {maxPain}/10
          </p>
        </div>
        <div className="rounded-xl border border-sage-light/20 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-charcoal-light">Breakthroughs</p>
          <p className="mt-1 font-heading text-2xl font-bold text-terra">
            {breakthroughs}
          </p>
        </div>
      </div>

      {/* 30-Day Pain Trend Chart */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-teal" />
          <h2 className="font-heading text-lg font-bold text-charcoal">
            30-Day Pain Trend
          </h2>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A8CBB520" />

              {/* Severity zones */}
              <ReferenceArea y1={0} y2={3} fill="#7BA68C" fillOpacity={0.05} />
              <ReferenceArea y1={3} y2={6} fill="#E8A838" fillOpacity={0.05} />
              <ReferenceArea y1={6} y2={10} fill="#C25A45" fillOpacity={0.05} />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#4A4A4A' }}
                tickFormatter={(d: string) => {
                  const date = new Date(d);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
                interval={6}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tick={{ fontSize: 10, fill: '#4A4A4A' }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #A8CBB530',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [
                  `${value}/10`,
                  'Pain Score',
                ]}
                labelFormatter={(label: string) =>
                  new Date(label).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                }
              />

              {/* Breakthrough markers */}
              {trends
                .filter((t: any) => t.breakthrough)
                .map((t: any) => (
                  <ReferenceLine
                    key={t.date}
                    x={t.date}
                    stroke="#D4856B"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                ))}

              <Line
                type="monotone"
                dataKey="pain_score"
                stroke="#2A6B6B"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#2A6B6B', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#2A6B6B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] text-charcoal-light">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-6 rounded-full bg-pain-0" /> Mild (0-3)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-6 rounded-full bg-pain-5" /> Moderate (4-6)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-6 rounded-full bg-pain-9" /> Severe (7-10)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0 w-6 border-t border-dashed border-terra" /> Breakthrough
          </span>
        </div>
      </div>

      {/* Breakthrough Episodes */}
      {breakthroughs > 0 && (
        <div className="rounded-2xl border border-terra/20 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-terra" />
            <h2 className="font-heading text-lg font-bold text-charcoal">
              Breakthrough Episodes
            </h2>
          </div>
          <div className="space-y-2">
            {trends
              .filter((t: any) => t.breakthrough)
              .map((t: any) => (
                <div
                  key={t.date}
                  className="flex items-center gap-3 rounded-xl bg-terra/5 p-3"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: painColor(t.pain_score) }}
                  >
                    {t.pain_score}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">
                      Pain: {t.pain_score}/10
                    </p>
                    <p className="text-xs text-charcoal-light">
                      {new Date(t.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        weekday: 'short',
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Body Map Placeholder */}
      <div className="rounded-2xl border border-sage-light/20 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-teal" />
          <h2 className="font-heading text-lg font-bold text-charcoal">
            Pain Locations
          </h2>
        </div>
        <div className="flex h-48 items-center justify-center rounded-xl bg-cream/50">
          <p className="text-sm text-charcoal-light">
            Interactive body map coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
