import type { ReactElement } from 'react';

interface StreakBadgeProps {
  currentStreakDays: number;
}

export function StreakBadge({ currentStreakDays }: StreakBadgeProps): ReactElement {
  return (
    <div className="streak-badge">
      <span className="streak-flame" aria-hidden="true">
        🔥
      </span>
      <span className="streak-count">{currentStreakDays}</span>
      <span className="streak-label">day streak</span>
    </div>
  );
}
