import { useMemo, useState, type ReactElement } from 'react';
import type { HistoryEntry, StatsSnapshot } from '../../../shared/protocol';
import { getCompletedFocusDayKeys, toLocalDayKey } from '../../../shared/statsUtils';
import { BADGES } from '../../../shared/badges';

interface StreakCalendarModalProps {
  entries: HistoryEntry[];
  stats: StatsSnapshot;
  onClose: () => void;
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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

export function StreakCalendarModal({ entries, stats, onClose }: StreakCalendarModalProps): ReactElement {
  const activeDayKeys = useMemo(() => getCompletedFocusDayKeys(entries), [entries]);
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const viewedDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewedDate.getFullYear();
  const month = viewedDate.getMonth();
  const monthLabel = viewedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const cells = buildMonthGrid(year, month);
  const todayKey = toLocalDayKey(today.toISOString());

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Streak &amp; Badges</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="streak-hero">
          <span className="streak-hero-flame" aria-hidden="true">
            🔥
          </span>
          <span className="streak-hero-count">{stats.currentStreakDays}</span>
          <span className="streak-hero-label">day streak</span>
        </div>

        <div className="calendar">
          <div className="calendar-nav">
            <button type="button" onClick={() => setMonthOffset((value) => value - 1)} aria-label="Previous month">
              ‹
            </button>
            <span>{monthLabel}</span>
            <button
              type="button"
              onClick={() => setMonthOffset((value) => Math.min(value + 1, 0))}
              disabled={monthOffset >= 0}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className="calendar-weekdays">
            {WEEKDAY_LABELS.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {cells.map((date, index) => {
              if (!date) {
                return <span key={index} className="calendar-cell calendar-cell--empty" />;
              }
              const dayKey = toLocalDayKey(date.toISOString());
              const isActive = activeDayKeys.has(dayKey);
              const isToday = dayKey === todayKey;
              return (
                <span
                  key={index}
                  className={`calendar-cell${isActive ? ' calendar-cell--active' : ''}${isToday ? ' calendar-cell--today' : ''}`}
                >
                  {isActive ? '🔥' : date.getDate()}
                </span>
              );
            })}
          </div>
        </div>

        <div className="badges-section">
          <h3 className="section-title">Badges</h3>
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
