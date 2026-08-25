import { useMemo, useState, type ReactElement } from 'react';
import type { HistoryEntry, SessionType } from '../../../shared/protocol';
import { groupHistoryByDay, type DayHistoryGroup } from '../../../shared/statsUtils';

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const SESSION_ICONS: Record<SessionType, string> = {
  focus: '🔥',
  shortBreak: '☕',
  longBreak: '🌴',
};

function formatTimeOnly(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface HistoryListProps {
  entries: HistoryEntry[];
}

export function HistoryList({ entries }: HistoryListProps): ReactElement {
  const [filterType, setFilterType] = useState<'all' | 'focus' | 'break'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filterType === 'focus' && entry.type !== 'focus') {
        return false;
      }
      if (filterType === 'break' && entry.type === 'focus') {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesType = SESSION_LABELS[entry.type].toLowerCase().includes(query);
        const matchesGoal = entry.goalTitles?.some((t) => t.toLowerCase().includes(query)) ?? false;
        return matchesType || matchesGoal;
      }
      return true;
    });
  }, [entries, filterType, searchTerm]);

  const dayGroups: DayHistoryGroup[] = useMemo(() => {
    return groupHistoryByDay(filteredEntries);
  }, [filteredEntries]);

  return (
    <div className="history-list-view">
      <div className="history-controls">
        <div className="history-filter-pills">
          <button
            type="button"
            className={`filter-pill${filterType === 'all' ? ' filter-pill--active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Sessions ({entries.length})
          </button>
          <button
            type="button"
            className={`filter-pill${filterType === 'focus' ? ' filter-pill--active' : ''}`}
            onClick={() => setFilterType('focus')}
          >
            🔥 Focus Only
          </button>
          <button
            type="button"
            className={`filter-pill${filterType === 'break' ? ' filter-pill--active' : ''}`}
            onClick={() => setFilterType('break')}
          >
            ☕ Breaks Only
          </button>
        </div>

        <input
          type="text"
          className="history-search"
          placeholder="Filter by goal or session…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {dayGroups.length === 0 ? (
        <div className="history-empty-card">
          <p className="history-empty">
            {entries.length === 0
              ? 'No sessions yet. Start a focus session to see your day-by-day history here.'
              : 'No sessions match your search filter.'}
          </p>
        </div>
      ) : (
        <div className="history-days">
          {dayGroups.map((group) => (
            <div key={group.dayKey} className="history-day-card">
              <div className="history-day-header">
                <div className="history-day-title">
                  <span className="history-day-name">{group.dateLabel}</span>
                  <span className="history-day-date">({group.dayKey})</span>
                </div>
                <div className="history-day-stats">
                  <span className="day-stat-chip">🔥 {group.completedFocusCount} focus</span>
                  <span className="day-stat-chip">⏱️ {group.totalFocusMinutes}m</span>
                  {group.roundsCompleted > 0 && (
                    <span className="day-stat-chip day-stat-chip--round">🌴 {group.roundsCompleted} round</span>
                  )}
                </div>
              </div>

              <ul className="history-day-items">
                {group.entries.map((entry) => (
                  <li key={entry.id} className={`history-item history-item--${entry.type}`}>
                    <div className="history-item-main">
                      <span className="history-item-icon">{SESSION_ICONS[entry.type]}</span>
                      <span className="history-item-type">{SESSION_LABELS[entry.type]}</span>
                      <span className="history-item-duration">{entry.durationMinutes}m</span>
                      <span className="history-item-time">
                        {formatTimeOnly(entry.startedAt)} - {formatTimeOnly(entry.endedAt)}
                      </span>
                    </div>

                    <div className="history-item-details">
                      {entry.goalTitles && entry.goalTitles.length > 0 && (
                        <div className="history-item-goals">
                          {entry.goalTitles.map((title, idx) => (
                            <span key={idx} className="history-goal-chip">
                              🎯 {title}
                            </span>
                          ))}
                        </div>
                      )}
                      <span
                        className={`history-status-badge ${entry.completed ? 'history-status--done' : 'history-status--skipped'}`}
                      >
                        {entry.completed ? 'Completed' : 'Skipped'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
