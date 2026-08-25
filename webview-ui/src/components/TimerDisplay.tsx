import type { ReactElement } from 'react';
import type { TimerSnapshot } from '../../../shared/protocol';

const SESSION_LABELS: Record<TimerSnapshot['sessionType'], string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const RADIUS = 96;
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
      <svg viewBox="0 0 220 220" className="timer-ring" role="img" aria-label={`${SESSION_LABELS[timer.sessionType]} timer`}>
        <circle className="timer-ring-track" cx="110" cy="110" r={RADIUS} />
        <circle
          className={`timer-ring-progress timer-ring-progress--${timer.sessionType}`}
          cx="110"
          cy="110"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
        <text x="110" y="106" textAnchor="middle" className="timer-time">
          {formatTime(timer.remainingSeconds)}
        </text>
        <text x="110" y="138" textAnchor="middle" className="timer-session-label">
          {SESSION_LABELS[timer.sessionType]}
        </text>
      </svg>
      {timer.status === 'paused' && <div className="timer-paused-badge">Paused</div>}
    </div>
  );
}
