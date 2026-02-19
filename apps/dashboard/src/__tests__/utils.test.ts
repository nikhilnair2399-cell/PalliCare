import { describe, test, expect } from 'vitest';
import { painLevel, painColor, relativeTime, calculateMEDD, surgeryCountdown } from '../lib/utils';

describe('painLevel', () => {
  test('returns none for score 0', () => {
    expect(painLevel(0)).toBe('none');
  });

  test('returns mild for scores 1-3', () => {
    expect(painLevel(1)).toBe('mild');
    expect(painLevel(2)).toBe('mild');
    expect(painLevel(3)).toBe('mild');
  });

  test('returns moderate for scores 4-6', () => {
    expect(painLevel(4)).toBe('moderate');
    expect(painLevel(5)).toBe('moderate');
    expect(painLevel(6)).toBe('moderate');
  });

  test('returns severe for scores 7-10', () => {
    expect(painLevel(7)).toBe('severe');
    expect(painLevel(8)).toBe('severe');
    expect(painLevel(9)).toBe('severe');
    expect(painLevel(10)).toBe('severe');
  });
});

describe('painColor', () => {
  test('returns sage green for score 0', () => {
    expect(painColor(0)).toBe('#7BA68C');
  });

  test('returns amber for score 6', () => {
    expect(painColor(6)).toBe('#E8A838');
  });

  test('returns terra cotta for score 8', () => {
    expect(painColor(8)).toBe('#D4856B');
  });

  test('returns deep red for score 10', () => {
    expect(painColor(10)).toBe('#A83232');
  });

  test('clamps negative scores to 0', () => {
    expect(painColor(-1)).toBe('#7BA68C');
  });

  test('clamps scores above 10', () => {
    expect(painColor(15)).toBe('#A83232');
  });

  test('rounds fractional scores', () => {
    expect(painColor(5.7)).toBe('#E8A838'); // rounds to 6
    expect(painColor(3.2)).toBe('#C5D68E'); // rounds to 3
  });
});

describe('relativeTime', () => {
  test('returns "just now" for very recent times', () => {
    const now = new Date();
    expect(relativeTime(now)).toBe('just now');
  });

  test('returns minutes ago for recent times', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000);
    expect(relativeTime(fiveMinAgo)).toBe('5 min ago');
  });

  test('returns hours ago for same-day times', () => {
    const threeHrsAgo = new Date(Date.now() - 3 * 60 * 60_000);
    expect(relativeTime(threeHrsAgo)).toBe('3 hr ago');
  });

  test('returns days ago for recent past', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60_000);
    expect(relativeTime(twoDaysAgo)).toBe('2d ago');
  });

  test('accepts string dates', () => {
    const now = new Date();
    const result = relativeTime(now.toISOString());
    expect(result).toBe('just now');
  });

  test('returns formatted date for older times', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60_000);
    const result = relativeTime(twoWeeksAgo);
    // Should be a formatted date string like "5 Feb"
    expect(result).toMatch(/\d{1,2}\s\w+/);
  });
});

describe('calculateMEDD', () => {
  test('oral morphine factor is 1', () => {
    expect(calculateMEDD('morphine_oral', 30)).toBe(30);
  });

  test('IV morphine factor is 3', () => {
    expect(calculateMEDD('morphine_iv', 10)).toBe(30);
  });

  test('oxycodone factor is 1.5', () => {
    expect(calculateMEDD('oxycodone', 20)).toBe(30);
  });

  test('tramadol factor is 0.1', () => {
    expect(calculateMEDD('tramadol', 200)).toBe(20);
  });

  test('codeine factor is 0.15', () => {
    expect(calculateMEDD('codeine', 100)).toBe(15);
  });

  test('unknown drug defaults to factor 1', () => {
    expect(calculateMEDD('unknown_drug', 50)).toBe(50);
  });

  test('fentanyl patch factor is 2.4', () => {
    expect(calculateMEDD('fentanyl_patch', 25)).toBe(60);
  });

  test('hydromorphone oral factor is 4', () => {
    expect(calculateMEDD('hydromorphone_oral', 8)).toBe(32);
  });

  test('tapentadol factor is 0.4', () => {
    expect(calculateMEDD('tapentadol', 100)).toBe(40);
  });
});

describe('surgeryCountdown', () => {
  test('returns Surgery Today for today', () => {
    const today = new Date();
    // Set to end of today to ensure positive/zero diff
    today.setHours(23, 59, 59);
    expect(surgeryCountdown(today)).toBe('Surgery Today');
  });

  test('returns Surgery Tomorrow for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0);
    expect(surgeryCountdown(tomorrow)).toBe('Surgery Tomorrow');
  });

  test('returns T-N days for future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    future.setHours(12, 0, 0);
    const result = surgeryCountdown(future);
    expect(result).toMatch(/T-\d+ days/);
  });

  test('returns Post-op Day N for past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 3);
    const result = surgeryCountdown(yesterday);
    expect(result).toMatch(/Post-op Day \d+/);
  });

  test('accepts string dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    future.setHours(12, 0, 0);
    const result = surgeryCountdown(future.toISOString());
    expect(result).toMatch(/T-\d+ days/);
  });
});
