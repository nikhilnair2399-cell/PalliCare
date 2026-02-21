'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, Lightbulb, Clock } from 'lucide-react';
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

      {/* Weekly Comparison */}
      {(() => {
        const now = Date.now();
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const thisWeek = entries.filter((e: any) => {
          const d = new Date(e.date || e.logged_at || 0).getTime();
          return now - d < weekMs;
        });
        const lastWeek = entries.filter((e: any) => {
          const d = new Date(e.date || e.logged_at || 0).getTime();
          return now - d >= weekMs && now - d < weekMs * 2;
        });
        const thisAvg = thisWeek.length > 0 ? thisWeek.reduce((s: number, e: any) => s + (e.pain_score ?? e.score ?? 0), 0) / thisWeek.length : null;
        const lastAvg = lastWeek.length > 0 ? lastWeek.reduce((s: number, e: any) => s + (e.pain_score ?? e.score ?? 0), 0) / lastWeek.length : null;
        const diff = thisAvg !== null && lastAvg !== null ? thisAvg - lastAvg : null;
        const thisBt = thisWeek.filter((e: any) => (e.pain_score ?? e.score ?? 0) >= 7).length;
        const lastBt = lastWeek.filter((e: any) => (e.pain_score ?? e.score ?? 0) >= 7).length;

        if (thisAvg === null) return null;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-charcoal/40">
                <Calendar className="h-3.5 w-3.5" /> This Week
              </div>
              <p className="mt-2 font-heading text-3xl font-bold text-charcoal">{thisAvg.toFixed(1)}</p>
              <p className="text-sm text-charcoal-light">avg pain &middot; {thisBt} breakthrough{thisBt !== 1 ? 's' : ''}</p>
              {diff !== null && (
                <div className={`mt-3 flex items-center gap-1.5 text-sm font-medium ${diff < -0.5 ? 'text-sage-dark' : diff > 0.5 ? 'text-terra' : 'text-charcoal/50'}`}>
                  {diff < -0.5 ? <TrendingDown className="h-4 w-4" /> : diff > 0.5 ? <TrendingUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                  {diff < -0.5 ? `${Math.abs(diff).toFixed(1)} lower` : diff > 0.5 ? `${diff.toFixed(1)} higher` : 'Stable'} vs last week
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-charcoal/40">
                <Calendar className="h-3.5 w-3.5" /> Last Week
              </div>
              <p className="mt-2 font-heading text-3xl font-bold text-charcoal">{lastAvg !== null ? lastAvg.toFixed(1) : '—'}</p>
              <p className="text-sm text-charcoal-light">{lastAvg !== null ? `avg pain · ${lastBt} breakthrough${lastBt !== 1 ? 's' : ''}` : 'No data recorded'}</p>
              {lastAvg !== null && (
                <p className="mt-3 text-sm text-charcoal/40">{lastWeek.length} entries logged</p>
              )}
            </div>
          </div>
        );
      })()}

      {/* Pain Pattern Insights */}
      {entries.length >= 3 && (() => {
        const insights: string[] = [];
        const recent5 = entries.slice(0, 5).map((e: any) => e.pain_score ?? e.score ?? 0);
        const avgRecent = recent5.reduce((s: number, v: number) => s + v, 0) / recent5.length;
        if (avgRecent <= 3) insights.push('Your recent pain scores are well-controlled. Keep up the medication schedule!');
        if (avgRecent >= 7) insights.push('Your recent pain is elevated. Consider using breakthrough medication and inform your care team.');
        const qualities = entries.flatMap((e: any) => e.qualities || e.pain_qualities || []);
        const qualityCounts: Record<string, number> = {};
        qualities.forEach((q: string) => { qualityCounts[q] = (qualityCounts[q] || 0) + 1; });
        const topQuality = Object.entries(qualityCounts).sort((a, b) => b[1] - a[1])[0];
        if (topQuality && topQuality[1] >= 2) insights.push(`"${topQuality[0]}" is your most common pain quality — share this with your doctor.`);
        const scores = entries.map((e: any) => e.pain_score ?? e.score ?? 0);
        const improving = scores.length >= 4 && scores[0] < scores[scores.length - 1];
        if (improving) insights.push('Your pain trend shows improvement over time. Your treatment plan is working.');

        if (insights.length === 0) return null;
        return (
          <div className="rounded-2xl bg-teal/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-teal">Pain Insights</h3>
            </div>
            <div className="space-y-2">
              {insights.slice(0, 3).map((insight, i) => (
                <p key={i} className="text-sm text-charcoal/70">&bull; {insight}</p>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Pain Pattern Heatmap — Time of Day × Day of Week */}
      {entries.length >= 5 && (() => {
        const TIME_SLOTS = [
          { label: 'Morning', range: [5, 12] },
          { label: 'Afternoon', range: [12, 17] },
          { label: 'Evening', range: [17, 21] },
          { label: 'Night', range: [21, 5] },
        ];
        const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const grid: Record<string, { sum: number; count: number }> = {};
        DAYS.forEach(d => TIME_SLOTS.forEach(t => { grid[`${d}-${t.label}`] = { sum: 0, count: 0 }; }));

        entries.forEach((e: any) => {
          const dt = new Date(e.date || e.logged_at || Date.now());
          const day = DAYS[dt.getDay()];
          const hour = dt.getHours();
          const slot = TIME_SLOTS.find(t =>
            t.range[0] < t.range[1]
              ? hour >= t.range[0] && hour < t.range[1]
              : hour >= t.range[0] || hour < t.range[1]
          );
          if (slot) {
            const key = `${day}-${slot.label}`;
            grid[key].sum += (e.pain_score ?? e.score ?? 0);
            grid[key].count += 1;
          }
        });

        const cellColor = (avg: number | null) => {
          if (avg === null) return 'bg-charcoal/5';
          if (avg <= 2) return 'bg-sage/30';
          if (avg <= 4) return 'bg-amber/20';
          if (avg <= 6) return 'bg-amber/50';
          if (avg <= 8) return 'bg-terra/40';
          return 'bg-terra/70';
        };

        const worstSlot = Object.entries(grid)
          .filter(([, v]) => v.count > 0)
          .sort((a, b) => (b[1].sum / b[1].count) - (a[1].sum / a[1].count))[0];
        const bestSlot = Object.entries(grid)
          .filter(([, v]) => v.count > 0)
          .sort((a, b) => (a[1].sum / a[1].count) - (b[1].sum / b[1].count))[0];

        return (
          <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Pain Pattern Heatmap</h3>
            </div>
            <p className="text-sm text-charcoal-light mb-4">Average pain by time of day and day of week</p>

            {/* Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[28rem]">
                {/* Column headers */}
                <div className="grid grid-cols-[5rem_repeat(7,1fr)] gap-1 mb-1">
                  <div />
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-charcoal/50">{d}</div>
                  ))}
                </div>
                {/* Rows */}
                {TIME_SLOTS.map(slot => (
                  <div key={slot.label} className="grid grid-cols-[5rem_repeat(7,1fr)] gap-1 mb-1">
                    <div className="flex items-center text-xs font-medium text-charcoal/60">{slot.label}</div>
                    {DAYS.map(day => {
                      const cell = grid[`${day}-${slot.label}`];
                      const avg = cell.count > 0 ? cell.sum / cell.count : null;
                      return (
                        <div
                          key={day}
                          className={`flex items-center justify-center rounded-lg h-10 text-xs font-bold ${cellColor(avg)} ${avg !== null ? 'text-charcoal/80' : 'text-charcoal/20'}`}
                          title={avg !== null ? `${day} ${slot.label}: avg ${avg.toFixed(1)} (${cell.count} entries)` : 'No data'}
                        >
                          {avg !== null ? avg.toFixed(1) : '—'}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-2 text-xs text-charcoal/50">
              <span>Low pain</span>
              <div className="flex gap-0.5">
                {['bg-sage/30', 'bg-amber/20', 'bg-amber/50', 'bg-terra/40', 'bg-terra/70'].map((c, i) => (
                  <div key={i} className={`h-3 w-6 rounded ${c}`} />
                ))}
              </div>
              <span>High pain</span>
            </div>

            {/* Insight */}
            {worstSlot && bestSlot && (
              <div className="mt-3 space-y-1">
                <p className="text-sm text-charcoal/60">
                  <span className="font-semibold text-terra">{worstSlot[0].replace('-', ' ')}</span> has your highest average pain ({(worstSlot[1].sum / worstSlot[1].count).toFixed(1)})
                </p>
                <p className="text-sm text-charcoal/60">
                  <span className="font-semibold text-sage-dark">{bestSlot[0].replace('-', ' ')}</span> has your lowest average pain ({(bestSlot[1].sum / bestSlot[1].count).toFixed(1)})
                </p>
              </div>
            )}
          </div>
        );
      })()}

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
