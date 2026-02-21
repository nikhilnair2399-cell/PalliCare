'use client';

import { TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { usePainDiary } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PAIN_DIARY } from '@/lib/patient-mock-data';
import { painColor } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PainDiaryPage() {
  const diaryQuery = usePainDiary();
  const { data: rawDiary } = useWithFallback(diaryQuery, MOCK_PAIN_DIARY);
  const diary = rawDiary as any;

  const entries: any[] = diary.entries || diary.data || [];
  const avgPain = entries.length > 0
    ? (entries.reduce((sum: number, e: any) => sum + (e.pain_score ?? e.score ?? 0), 0) / entries.length).toFixed(1)
    : '0';
  const maxPain = entries.length > 0
    ? Math.max(...entries.map((e: any) => e.pain_score ?? e.score ?? 0))
    : 0;
  const breakthroughs = entries.filter((e: any) => (e.pain_score ?? e.score ?? 0) >= 7).length;

  const chartData = entries.slice(-30).map((e: any) => ({
    date: new Date(e.date || e.logged_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    score: e.pain_score ?? e.score ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Pain Diary</h1>
        <p className="text-sm text-charcoal-light">
          Track pain trends over time to help your care team manage your comfort
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Pain (30d)"
          value={String(avgPain)}
          change="Last 30 days average"
          changeType="info"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          title="Peak Pain"
          value={String(maxPain)}
          change="Highest recorded"
          changeType={maxPain >= 7 ? 'alert' : 'info'}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Breakthroughs"
          value={String(breakthroughs)}
          change="Episodes above 7/10"
          changeType={breakthroughs > 0 ? 'alert' : 'increase'}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          title="Entries"
          value={String(entries.length)}
          change="Total diary entries"
          changeType="info"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {/* Pain Trend Chart */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        <div className="border-b border-sage-light/20 px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-teal">Pain Trend (Last 30 Days)</h2>
        </div>
        <div className="p-5">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,203,181,0.2)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4A4A4A' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#4A4A4A' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid rgba(168,203,181,0.3)',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={7} stroke="#C25A45" strokeDasharray="4 4" label={{ value: 'Severe', fontSize: 10, fill: '#C25A45' }} />
                <ReferenceLine y={4} stroke="#E8A838" strokeDasharray="4 4" label={{ value: 'Moderate', fontSize: 10, fill: '#E8A838' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2A6B6B"
                  strokeWidth={2}
                  dot={{ fill: '#2A6B6B', r: 3 }}
                  activeDot={{ r: 5, fill: '#2A6B6B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Entries Table */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        <div className="border-b border-sage-light/20 px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-teal">Recent Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sage-light/20 bg-cream/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-charcoal/60">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-charcoal/60">Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-charcoal/60">Qualities</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-charcoal/60">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-light/10">
              {entries.slice(0, 10).map((entry: any, i: number) => (
                <tr key={i} className="transition-colors hover:bg-cream/20">
                  <td className="px-5 py-3 text-sm text-charcoal">
                    {new Date(entry.date || entry.logged_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-block min-w-[2.5rem] rounded-full px-2.5 py-0.5 text-center text-xs font-bold text-white"
                      style={{ backgroundColor: painColor(entry.pain_score ?? entry.score ?? 0) }}
                    >
                      {entry.pain_score ?? entry.score ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-charcoal-light">
                    {(entry.qualities || entry.pain_qualities || []).join(', ') || '-'}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-xs text-charcoal-light">
                    {entry.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
