import type { ReactElement } from 'react';
import { FlameIcon } from './Icons';

interface StreakBadgeProps {
  currentStreakDays: number;
  onClick: () => void;
}

export function StreakBadge({ currentStreakDays, onClick }: StreakBadgeProps): ReactElement {
  return (
    <button type="button" className="streak-badge" onClick={onClick} aria-label="View streak calendar and badges">
      <FlameIcon size={14} className="streak-flame-svg" />
      <span className="streak-count">{currentStreakDays}</span>
      <span className="streak-label">day streak</span>
    </button>
  );
}
