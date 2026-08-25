import { useState, type ReactElement } from 'react';
import type { TimerCommand, TimerSnapshot } from '../../../shared/protocol';
import { WarningIcon } from './Icons';

interface ControlButtonsProps {
  timer: TimerSnapshot;
  onCommand: (command: TimerCommand) => void;
}

export function ControlButtons({ timer, onCommand }: ControlButtonsProps): ReactElement {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const primaryAction: { label: string; command: TimerCommand } =
    timer.status === 'running'
      ? { label: 'Pause', command: 'pause' }
      : timer.status === 'paused'
        ? { label: 'Resume', command: 'resume' }
        : { label: 'Start', command: 'start' };

  function handleResetClick(): void {
    setShowResetConfirm(true);
  }

  function handleConfirmReset(): void {
    setShowResetConfirm(false);
    onCommand('reset');
  }

  function handleCancelReset(): void {
    setShowResetConfirm(false);
  }

  return (
    <div className="control-container">
      <div className="control-buttons">
        <button type="button" className="btn btn--primary" onClick={() => onCommand(primaryAction.command)}>
          {primaryAction.label}
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => onCommand('skip')}>
          Skip
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleResetClick}>
          Reset
        </button>
      </div>

      {showResetConfirm && (
        <div className="confirm-modal-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <div className="confirm-modal-icon">
              <WarningIcon size={32} />
            </div>
            <div className="confirm-modal-content">
              <h4>Reset Current Session?</h4>
              <p>Are you sure you want to reset the current timer? Your progress in this session will restart.</p>
            </div>
            <div className="confirm-modal-actions">
              <button type="button" className="btn btn--ghost" onClick={handleCancelReset}>
                Cancel
              </button>
              <button type="button" className="btn btn--danger" onClick={handleConfirmReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
