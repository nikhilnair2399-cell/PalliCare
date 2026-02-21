'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { usePainDiary } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_PAIN_DIARY } from '@/lib/patient-mock-data';
import { painColor } from '@/lib/utils';

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
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Pain Diary</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Track your pain trends to help your care team manage your comfort
        </p>
      </div>

      {/* Hero: Pain Trend Chart */}
      <div className="rounded-2xl bg-white p-6">
        <h2 className="text-lg font-semibold text-charcoal">Pain Trend (Last 30 Days)</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,203,181,0.15)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#4A4A4A' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#4A4A4A' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
              />
              <ReferenceLine y={7} stroke="#C25A45" strokeDasharray="4 4" label={{ value: 'Severe', fontSize: 11, fill: '#C25A45' }} />
              <ReferenceLine y={4} stroke="#E8A838" strokeDasharray="4 4" label={{ value: 'Moderate', fontSize: 11, fill: '#E8A838' }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2A6B6B"
                strokeWidth={2.5}
                dot={{ fill: '#2A6B6B', r: 3 }}
                activeDot={{ r: 6, fill: '#2A6B6B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inline Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal-light">
          <span>Average: <strong className="text-charcoal">{avgPain}</strong></span>
          <span>&middot;</span>
          <span>Peak: <strong className="text-charcoal">{maxPain}</strong></span>
          <span>&middot;</span>
          <span>{breakthroughs} breakthrough episode{breakthroughs !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Timeline Entries */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Recent Entries</h2>
        <div className="space-y-3">
          {entries.slice(0, 10).map((entry: any, i: number) => {
            const score = entry.pain_score ?? entry.score ?? 0;
            const qualities = (entry.qualities || entry.pain_qualities || []).join(', ');
            return (
              <div key={i} className="rounded-2xl bg-white p-5">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: painColor(score) }}
                  >
                    {score}
                  </span>
                  <div className="flex-1">
                    <p className="text-base font-medium text-charcoal">
                      {new Date(entry.date || entry.logged_at || Date.now()).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {qualities && (
                      <p className="mt-0.5 text-sm text-charcoal-light">{qualities}</p>
                    )}
                    {entry.notes && (
                      <p className="mt-1 text-sm text-charcoal/50 italic">{entry.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {entries.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center">
              <p className="text-base text-charcoal/40">No pain entries recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
