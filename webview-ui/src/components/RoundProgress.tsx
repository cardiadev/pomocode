import type { ReactElement } from 'react';
import type { SessionType } from '../../../shared/protocol';

interface RoundProgressProps {
  completedFocusSessionsInCycle: number;
  sessionsBeforeLongBreak: number;
  sessionType: SessionType;
}

export function RoundProgress({
  completedFocusSessionsInCycle,
  sessionsBeforeLongBreak,
  sessionType,
}: RoundProgressProps): ReactElement {
  const dots = Array.from({ length: sessionsBeforeLongBreak }, (_, index) =>
    sessionType === 'longBreak' ? true : index < completedFocusSessionsInCycle,
  );

  return (
    <div className="round-progress">
      <div className="round-progress-dots" aria-hidden="true">
        {dots.map((filled, index) => (
          <span key={index} className={`round-dot${filled ? ' round-dot--filled' : ''}`} />
        ))}
      </div>
      <span className="round-progress-label">
        {sessionType === 'longBreak'
          ? 'Round complete — enjoy your long break'
          : `Pomodoro ${Math.min(completedFocusSessionsInCycle + 1, sessionsBeforeLongBreak)} of ${sessionsBeforeLongBreak} this round`}
      </span>
    </div>
  );
}
