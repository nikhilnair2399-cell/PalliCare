import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Get pain severity level from NRS score */
export function painLevel(score: number): 'none' | 'mild' | 'moderate' | 'severe' {
  if (score === 0) return 'none';
  if (score <= 3) return 'mild';
  if (score <= 6) return 'moderate';
  return 'severe';
}

/** Get pain color from NRS score (matches PalliCare design system) */
export function painColor(score: number): string {
  const colors = [
    '#7BA68C', // 0 - sage
    '#8DB89A', // 1
    '#A0C9A8', // 2
    '#C5D68E', // 3
    '#E8D86A', // 4
    '#E8C44A', // 5
    '#E8A838', // 6 - amber
    '#E08830', // 7
    '#D4856B', // 8 - terra
    '#C25A45', // 9
    '#A83232', // 10
  ];
  return colors[Math.min(Math.max(Math.round(score), 0), 10)];
}

/** Format date relative to now */
export function relativeTime(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Calculate Morphine Equivalent Daily Dose (MEDD) */
export function calculateMEDD(
  drug: string,
  dailyDoseMg: number,
): number {
  const factors: Record<string, number> = {
    morphine_oral: 1,
    morphine_iv: 3,
    fentanyl_patch: 2.4, // per mcg/hr
    oxycodone: 1.5,
    hydromorphone_oral: 4,
    hydromorphone_iv: 20,
    methadone: 4, // simplified; dose-dependent
    tramadol: 0.1,
    codeine: 0.15,
    tapentadol: 0.4,
  };
  return dailyDoseMg * (factors[drug] || 1);
}

/** Surgery countdown display */
export function surgeryCountdown(surgeryDate: Date | string): string {
  const d = typeof surgeryDate === 'string' ? new Date(surgeryDate) : surgeryDate;
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);

  if (diffDays < 0) return `Post-op Day ${Math.abs(diffDays)}`;
  if (diffDays === 0) return 'Surgery Today';
  if (diffDays === 1) return 'Surgery Tomorrow';
  return `T-${diffDays} days`;
}
