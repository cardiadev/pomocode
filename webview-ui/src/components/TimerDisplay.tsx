import type { ReactElement } from 'react';
import type { TimerSnapshot } from '../../../shared/protocol';
import { TomatoIcon, PlayIcon, PauseIcon } from './Icons';

const SESSION_LABELS: Record<TimerSnapshot['sessionType'], string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const RADIUS = 94;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface TimerDisplayProps {
  timer: TimerSnapshot;
  todayCount?: number;
}

export function TimerDisplay({ timer, todayCount }: TimerDisplayProps): ReactElement {
  const progress = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer-display">
      {/* Top-Left Corner: Status Pill Badge */}
      <div className={`timer-corner-badge timer-status-badge timer-status-badge--${timer.status}`}>
        {timer.status === 'running' && <PlayIcon size={11} className="timer-status-icon timer-status-icon--running" />}
        {timer.status === 'paused' && <PauseIcon size={11} className="timer-status-icon timer-status-icon--paused" />}
        {timer.status === 'idle' && <span className="timer-status-dot" />}
        <span className="timer-status-text">
          {timer.status === 'running' ? 'Running' : timer.status === 'paused' ? 'Paused' : 'Ready'}
        </span>
      </div>

      {/* Top-Right Corner: Daily Pomodoros Pill Badge */}
      {todayCount !== undefined && (
        <div
          className={`timer-corner-badge timer-today-pill${todayCount > 0 ? ' timer-today-pill--active' : ''}`}
          title={`${todayCount} pomodoro${todayCount === 1 ? '' : 's'} completed today`}
        >
          <TomatoIcon size={13} className="timer-today-tomato-icon" />
          <span className="timer-today-count">{todayCount}</span>
        </div>
      )}

      {/* Main SVG Circular Ring */}
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
        <text x="110" y="114" textAnchor="middle" className="timer-time">
          {formatTime(timer.remainingSeconds)}
        </text>
        <text x="110" y="144" textAnchor="middle" className="timer-session-label">
          {SESSION_LABELS[timer.sessionType]}
        </text>
      </svg>
    </div>
  );
}
