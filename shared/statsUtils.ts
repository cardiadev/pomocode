import type { HistoryEntry, StatsSnapshot } from './protocol';

export function toLocalDayKey(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDayLabel(dayKey: string): string {
  const parts = dayKey.split('-').map(Number);
  const year = parts[0] ?? new Date().getFullYear();
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const todayKey = toLocalDayKey(today.toISOString());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDayKey(yesterday.toISOString());

  if (dayKey === todayKey) {
    return 'Today';
  }
  if (dayKey === yesterdayKey) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
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

export function getCompletedFocusDayKeys(entries: HistoryEntry[]): Set<string> {
  const keys = new Set<string>();
  for (const entry of entries) {
    if (entry.type === 'focus') {
      keys.add(toLocalDayKey(entry.endedAt));
    }
  }
  return keys;
}

export interface DayHistoryGroup {
  dayKey: string;
  dateLabel: string;
  totalFocusMinutes: number;
  completedFocusCount: number;
  roundsCompleted: number;
  entries: HistoryEntry[];
}

export function groupHistoryByDay(entries: HistoryEntry[]): DayHistoryGroup[] {
  const groupsMap = new Map<string, HistoryEntry[]>();

  // Process in reverse chronological order
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (!entry) {
      continue;
    }
    const key = toLocalDayKey(entry.endedAt);
    const list = groupsMap.get(key) ?? [];
    list.push(entry);
    groupsMap.set(key, list);
  }

  const result: DayHistoryGroup[] = [];
  for (const [dayKey, dayEntries] of groupsMap.entries()) {
    let totalFocusMinutes = 0;
    let completedFocusCount = 0;
    let roundsCompleted = 0;

    for (const item of dayEntries) {
      if (item.type === 'focus') {
        completedFocusCount += 1;
        totalFocusMinutes += item.durationMinutes;
      } else if (item.type === 'longBreak') {
        roundsCompleted += 1;
      }
    }

    result.push({
      dayKey,
      dateLabel: formatDayLabel(dayKey),
      totalFocusMinutes,
      completedFocusCount,
      roundsCompleted,
      entries: dayEntries,
    });
  }

  return result;
}

export function computeStats(entries: HistoryEntry[], dailyTarget = 8): StatsSnapshot {
  const now = new Date();
  const todayKey = toLocalDayKey(now.toISOString());
  const weekStart = startOfLocalWeek(now);

  const focusEntries = entries.filter((entry) => entry.type === 'focus');
  const roundEntries = entries.filter((entry) => entry.type === 'longBreak');
  const roundsCompletedToday = roundEntries.filter(
    (entry) => toLocalDayKey(entry.endedAt) === todayKey,
  ).length;

  let todayCount = 0;
  let weekCount = 0;
  let todayMinutes = 0;
  let weekMinutes = 0;
  let allTimeMinutes = 0;
  const focusDayKeys = new Set<string>();

  for (const entry of focusEntries) {
    const entryDate = new Date(entry.endedAt);
    const entryDayKey = toLocalDayKey(entry.endedAt);
    focusDayKeys.add(entryDayKey);

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
    allTimeCount: focusEntries.length,
    todayMinutes,
    weekMinutes,
    allTimeMinutes,
    currentStreakDays: computeStreakDays(focusDayKeys),
    roundsCompletedToday,
    roundsCompletedAllTime: roundEntries.length,
    dailyTargetPomodoros: dailyTarget,
  };
}
