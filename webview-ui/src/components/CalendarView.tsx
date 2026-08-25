import { useMemo, useState, type ReactElement } from 'react';
import type { HistoryEntry, StatsSnapshot } from '../../../shared/protocol';
import { getCompletedFocusDayKeys, toLocalDayKey, formatDayLabel } from '../../../shared/statsUtils';
import { BADGES } from '../../../shared/badges';

interface CalendarViewProps {
  entries: HistoryEntry[];
  stats: StatsSnapshot;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

export function CalendarView({ entries, stats }: CalendarViewProps): ReactElement {
  const activeDayKeys = useMemo(() => getCompletedFocusDayKeys(entries), [entries]);
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const todayKey = toLocalDayKey(today.toISOString());
  const [selectedDayKey, setSelectedDayKey] = useState<string>(todayKey);

  const viewedDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewedDate.getFullYear();
  const month = viewedDate.getMonth();
  const monthLabel = viewedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const cells = buildMonthGrid(year, month);

  // Group entries by day for fast lookup
  const dayEntriesMap = useMemo(() => {
    const map = new Map<string, HistoryEntry[]>();
    for (const entry of entries) {
      const key = toLocalDayKey(entry.endedAt);
      const list = map.get(key) ?? [];
      list.push(entry);
      map.set(key, list);
    }
    return map;
  }, [entries]);

  const selectedDayEntries = dayEntriesMap.get(selectedDayKey) ?? [];
  const selectedFocusEntries = selectedDayEntries.filter((e) => e.type === 'focus' && e.completed);
  const selectedFocusMinutes = selectedFocusEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
  const selectedRounds = selectedDayEntries.filter((e) => e.type === 'longBreak' && e.completed).length;

  return (
    <div className="calendar-view">
      {/* Streak Hero Banner */}
      <div className="streak-hero-card">
        <div className="streak-hero-content">
          <span className="streak-hero-flame" aria-hidden="true">
            🔥
          </span>
          <div className="streak-hero-details">
            <span className="streak-hero-count">{stats.currentStreakDays}</span>
            <span className="streak-hero-label">day streak</span>
          </div>
        </div>
        <div className="streak-hero-stats">
          <div className="streak-stat-mini">
            <span className="streak-stat-mini-val">{stats.todayCount}</span>
            <span className="streak-stat-mini-lbl">Today</span>
          </div>
          <div className="streak-stat-mini">
            <span className="streak-stat-mini-val">{stats.weekCount}</span>
            <span className="streak-stat-mini-lbl">This Week</span>
          </div>
          <div className="streak-stat-mini">
            <span className="streak-stat-mini-val">{stats.allTimeCount}</span>
            <span className="streak-stat-mini-lbl">Total</span>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="calendar-card">
        <div className="calendar-nav">
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => setMonthOffset((value) => value - 1)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="calendar-month-title">{monthLabel}</span>
          <div className="calendar-nav-right">
            {monthOffset !== 0 && (
              <button type="button" className="calendar-today-btn" onClick={() => setMonthOffset(0)}>
                Today
              </button>
            )}
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => setMonthOffset((value) => Math.min(value + 1, 0))}
              disabled={monthOffset >= 0}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>

        <div className="calendar-weekdays">
          {WEEKDAY_LABELS.map((label, index) => (
            <span key={index} className="calendar-weekday-cell">
              {label}
            </span>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((date, index) => {
            if (!date) {
              return <span key={index} className="calendar-cell calendar-cell--empty" />;
            }
            const dayKey = toLocalDayKey(date.toISOString());
            const daySessions = dayEntriesMap.get(dayKey) ?? [];
            const completedFocusCount = daySessions.filter((e) => e.type === 'focus' && e.completed).length;
            const isActive = activeDayKeys.has(dayKey);
            const isToday = dayKey === todayKey;
            const isSelected = dayKey === selectedDayKey;

            return (
              <button
                key={index}
                type="button"
                className={`calendar-cell${isActive ? ' calendar-cell--active' : ''}${isToday ? ' calendar-cell--today' : ''}${isSelected ? ' calendar-cell--selected' : ''}`}
                onClick={() => setSelectedDayKey(dayKey)}
                title={`${date.toLocaleDateString()}: ${completedFocusCount} focus sessions`}
              >
                <span className="calendar-cell-day">{date.getDate()}</span>
                {completedFocusCount > 0 && (
                  <span className="calendar-cell-badge">
                    🔥{completedFocusCount > 1 ? completedFocusCount : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector */}
      <div className="day-inspector-card">
        <div className="day-inspector-header">
          <h3 className="day-inspector-title">{formatDayLabel(selectedDayKey)} ({selectedDayKey})</h3>
          <div className="day-inspector-summary">
            <span className="day-chip">🔥 {selectedFocusEntries.length} focus</span>
            <span className="day-chip">⏱️ {selectedFocusMinutes}m</span>
            {selectedRounds > 0 && <span className="day-chip">🌴 {selectedRounds} round</span>}
          </div>
        </div>

        {selectedDayEntries.length === 0 ? (
          <p className="day-inspector-empty">No activity recorded for this day.</p>
        ) : (
          <ul className="day-inspector-list">
            {selectedDayEntries.map((entry) => (
              <li key={entry.id} className={`day-inspector-item day-inspector-item--${entry.type}`}>
                <span className="day-item-type">{entry.type === 'focus' ? '🔥 Focus' : entry.type === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break'}</span>
                <span className="day-item-duration">{entry.durationMinutes}m</span>
                {entry.goalTitles && entry.goalTitles.length > 0 && (
                  <span className="day-item-goal">🎯 {entry.goalTitles.join(', ')}</span>
                )}
                <span className={`day-item-status ${entry.completed ? 'status-ok' : 'status-skip'}`}>
                  {entry.completed ? 'Completed' : 'Skipped'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Badges Section */}
      <div className="badges-section-card">
        <h3 className="section-title">Achievements &amp; Badges</h3>
        <div className="badges-grid">
          {BADGES.map((badge) => {
            const unlocked = badge.isUnlocked(stats);
            return (
              <div
                key={badge.id}
                className={`badge-tile${unlocked ? ' badge-tile--unlocked' : ''}`}
                title={badge.description}
              >
                <span className="badge-emoji">{badge.emoji}</span>
                <span className="badge-label">{badge.label}</span>
                <span className="badge-status">{unlocked ? 'Unlocked' : 'Locked'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
