import type { HistoryEntry, StatsSnapshot } from '../../shared/protocol';

function toLocalDayKey(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfLocalWeek(reference: Date): Date {
  const dayIndex = reference.getDay();
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - dayIndex);
  return start;
}

function computeStreakDays(completedFocusDayKeys: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (completedFocusDayKeys.has(toLocalDayKey(cursor.toISOString()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function computeStats(entries: HistoryEntry[]): StatsSnapshot {
  const now = new Date();
  const todayKey = toLocalDayKey(now.toISOString());
  const weekStart = startOfLocalWeek(now);

  const completedFocusEntries = entries.filter((entry) => entry.type === 'focus' && entry.completed);

  let todayCount = 0;
  let weekCount = 0;
  let todayMinutes = 0;
  let weekMinutes = 0;
  let allTimeMinutes = 0;
  const completedFocusDayKeys = new Set<string>();

  for (const entry of completedFocusEntries) {
    const entryDate = new Date(entry.endedAt);
    const entryDayKey = toLocalDayKey(entry.endedAt);
    completedFocusDayKeys.add(entryDayKey);

    allTimeMinutes += entry.durationMinutes;

    if (entryDayKey === todayKey) {
      todayCount += 1;
      todayMinutes += entry.durationMinutes;
    }

    if (entryDate >= weekStart) {
      weekCount += 1;
      weekMinutes += entry.durationMinutes;
    }
  }

  return {
    todayCount,
    weekCount,
    allTimeCount: completedFocusEntries.length,
    todayMinutes,
    weekMinutes,
    allTimeMinutes,
    currentStreakDays: computeStreakDays(completedFocusDayKeys),
  };
}
