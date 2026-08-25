import type { ReactElement } from 'react';
import { FlameIcon } from './Icons';

interface StreakBadgeProps {
  currentStreakDays: number;
  completedToday?: boolean;
  onClick: () => void;
}

export function StreakBadge({ currentStreakDays, completedToday, onClick }: StreakBadgeProps): ReactElement {
  return (
    <button
      type="button"
      className={`streak-badge${completedToday ? ' streak-badge--active-today' : ''}`}
      onClick={onClick}
      aria-label="View streak calendar and badges"
      title={completedToday ? "Today's streak completed!" : 'Complete 1 pomodoro to keep your daily streak active!'}
    >
      <FlameIcon size={14} className="streak-flame-svg" />
      <span className="streak-count">{currentStreakDays}</span>
      <span className="streak-label">day streak</span>
    </button>
  );
}
