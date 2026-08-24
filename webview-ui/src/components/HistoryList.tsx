import type { ReactElement } from 'react';
import type { HistoryEntry } from '../../../shared/protocol';

const SESSION_LABELS: Record<HistoryEntry['type'], string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

function formatWhen(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface HistoryListProps {
  entries: HistoryEntry[];
}

export function HistoryList({ entries }: HistoryListProps): ReactElement {
  const recentEntries = [...entries].reverse().slice(0, 25);

  return (
    <div className="history-list">
      <h2 className="section-title">History</h2>
      {recentEntries.length === 0 ? (
        <p className="history-empty">No sessions yet. Start a focus session to see it here.</p>
      ) : (
        <ul>
          {recentEntries.map((entry) => (
            <li key={entry.id} className={`history-item history-item--${entry.type}`}>
              <span className="history-item-type">{SESSION_LABELS[entry.type]}</span>
              <span className="history-item-duration">{entry.durationMinutes}m</span>
              <span className="history-item-when">{formatWhen(entry.endedAt)}</span>
              {!entry.completed && <span className="history-item-skipped">Skipped</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
