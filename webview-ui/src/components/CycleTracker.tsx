import type { ReactElement } from 'react';
import type { SessionType } from '../../../shared/protocol';

interface CycleTrackerProps {
  completedFocusSessionsInCycle: number;
  sessionsBeforeLongBreak: number;
  sessionType: SessionType;
  cycleStep: number;
  totalCycleSteps: number;
  todayCount: number;
  dailyTargetPomodoros: number;
  roundsCompletedToday: number;
}

interface StepItem {
  stepNumber: number;
  label: string;
  type: SessionType;
  icon: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function CycleTracker({
  completedFocusSessionsInCycle,
  sessionsBeforeLongBreak,
  sessionType,
  cycleStep,
  totalCycleSteps,
  todayCount,
  dailyTargetPomodoros,
  roundsCompletedToday,
}: CycleTrackerProps): ReactElement {
  const steps: StepItem[] = [];

  for (let i = 0; i < sessionsBeforeLongBreak; i += 1) {
    const focusStepNum = i * 2 + 1;
    let focusStatus: StepItem['status'] = 'upcoming';
    if (focusStepNum < cycleStep) {
      focusStatus = 'completed';
    } else if (focusStepNum === cycleStep) {
      focusStatus = 'current';
    }

    steps.push({
      stepNumber: focusStepNum,
      label: `Focus ${i + 1}`,
      type: 'focus',
      icon: '🔥',
      status: focusStatus,
    });

    if (i < sessionsBeforeLongBreak - 1) {
      const breakStepNum = (i + 1) * 2;
      let breakStatus: StepItem['status'] = 'upcoming';
      if (breakStepNum < cycleStep) {
        breakStatus = 'completed';
      } else if (breakStepNum === cycleStep) {
        breakStatus = 'current';
      }

      steps.push({
        stepNumber: breakStepNum,
        label: `Break ${i + 1}`,
        type: 'shortBreak',
        icon: '☕',
        status: breakStatus,
      });
    } else {
      const longBreakStepNum = totalCycleSteps;
      let lbStatus: StepItem['status'] = 'upcoming';
      if (longBreakStepNum < cycleStep) {
        lbStatus = 'completed';
      } else if (longBreakStepNum === cycleStep) {
        lbStatus = 'current';
      }

      steps.push({
        stepNumber: longBreakStepNum,
        label: 'Long Break',
        type: 'longBreak',
        icon: '🌴',
        status: lbStatus,
      });
    }
  }

  const actualPercentage = Math.round((todayCount / Math.max(1, dailyTargetPomodoros)) * 100);
  const barPercentage = Math.min(100, actualPercentage);
  const isGoalReached = todayCount >= dailyTargetPomodoros && dailyTargetPomodoros > 0;

  const currentFocusIndex =
    sessionType === 'longBreak'
      ? sessionsBeforeLongBreak
      : Math.min(completedFocusSessionsInCycle + 1, sessionsBeforeLongBreak);

  return (
    <div className="cycle-tracker">
      {/* Daily Target Progress Bar */}
      <div className={`daily-goal-box${isGoalReached ? ' daily-goal-box--achieved' : ''}`}>
        <div className="daily-goal-header">
          <span className="daily-goal-title">
            {isGoalReached ? '🎉 Daily Target' : '🎯 Daily Target'}
          </span>
          <span className="daily-goal-metric">
            {todayCount} / {dailyTargetPomodoros} ({actualPercentage}%)
          </span>
        </div>
        <div className="daily-goal-bar">
          <div
            className={`daily-goal-fill${isGoalReached ? ' daily-goal-fill--achieved' : ''}`}
            style={{ width: `${barPercentage}%` }}
          />
        </div>
      </div>

      {/* Cycle Header & Summary */}
      <div className="cycle-header">
        <div className="cycle-main-label">
          {sessionType === 'longBreak'
            ? '🌴 Long Break · Cycle Complete!'
            : `🍅 Pomodoro ${currentFocusIndex} of ${sessionsBeforeLongBreak} (Round ${roundsCompletedToday + 1})`}
        </div>
        <div className="cycle-step-counter">
          Step {cycleStep} of {totalCycleSteps} in cycle
        </div>
      </div>

      {/* Interactive Step-by-Step Cycle Elements */}
      <div className="cycle-steps-grid" role="list" aria-label="Cycle Elements">
        {steps.map((step) => {
          return (
            <div
              key={step.stepNumber}
              className={`cycle-step-badge cycle-step-badge--${step.type} cycle-step-badge--${step.status}`}
              title={`${step.label} (${step.status})`}
              role="listitem"
            >
              <span className="cycle-step-icon">{step.status === 'completed' ? '✓' : step.icon}</span>
              <span className="cycle-step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
