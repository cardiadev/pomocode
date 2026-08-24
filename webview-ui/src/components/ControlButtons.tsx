import type { ReactElement } from 'react';
import type { TimerCommand, TimerSnapshot } from '../../../shared/protocol';

interface ControlButtonsProps {
  timer: TimerSnapshot;
  onCommand: (command: TimerCommand) => void;
}

export function ControlButtons({ timer, onCommand }: ControlButtonsProps): ReactElement {
  const primaryAction: { label: string; command: TimerCommand } =
    timer.status === 'running'
      ? { label: 'Pause', command: 'pause' }
      : timer.status === 'paused'
        ? { label: 'Resume', command: 'resume' }
        : { label: 'Start', command: 'start' };

  return (
    <div className="control-buttons">
      <button type="button" className="btn btn--primary" onClick={() => onCommand(primaryAction.command)}>
        {primaryAction.label}
      </button>
      <button type="button" className="btn btn--secondary" onClick={() => onCommand('skip')}>
        Skip
      </button>
      <button type="button" className="btn btn--secondary" onClick={() => onCommand('reset')}>
        Reset
      </button>
    </div>
  );
}
