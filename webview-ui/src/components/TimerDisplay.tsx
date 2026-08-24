import type { ReactElement } from 'react';
import type { TimerSnapshot } from '../../../shared/protocol';

const SESSION_LABELS: Record<TimerSnapshot['sessionType'], string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface TimerDisplayProps {
  timer: TimerSnapshot;
}

export function TimerDisplay({ timer }: TimerDisplayProps): ReactElement {
  const progress = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer-display">
      <svg viewBox="0 0 180 180" className="timer-ring" role="img" aria-label={`${SESSION_LABELS[timer.sessionType]} timer`}>
        <circle className="timer-ring-track" cx="90" cy="90" r={RADIUS} />
        <circle
          className={`timer-ring-progress timer-ring-progress--${timer.sessionType}`}
          cx="90"
          cy="90"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
        <text x="90" y="86" textAnchor="middle" className="timer-time">
          {formatTime(timer.remainingSeconds)}
        </text>
        <text x="90" y="112" textAnchor="middle" className="timer-session-label">
          {SESSION_LABELS[timer.sessionType]}
        </text>
      </svg>
      {timer.status === 'paused' && <div className="timer-paused-badge">Paused</div>}
    </div>
  );
}
