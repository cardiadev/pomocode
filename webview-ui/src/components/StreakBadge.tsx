import type { ReactElement } from 'react';

interface StreakBadgeProps {
  currentStreakDays: number;
  onClick: () => void;
}

export function StreakBadge({ currentStreakDays, onClick }: StreakBadgeProps): ReactElement {
  return (
    <button type="button" className="streak-badge" onClick={onClick} aria-label="View streak calendar and badges">
      <span className="streak-flame" aria-hidden="true">
        🔥
      </span>
      <span className="streak-count">{currentStreakDays}</span>
      <span className="streak-label">day streak</span>
    </button>
  );
}
