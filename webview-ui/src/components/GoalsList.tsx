import { useState, type FormEvent, type ReactElement } from 'react';
import type { Goal } from '../../../shared/protocol';
import { CheckIcon, FlameIcon } from './Icons';

interface GoalsListProps {
  goals: Goal[];
  onAdd: (text: string) => void;
  onComplete: (id: string) => void;
  onReopen: (id: string) => void;
  onRemove: (id: string) => void;
}

export function GoalsList({ goals, onAdd, onComplete, onReopen, onRemove }: GoalsListProps): ReactElement {
  const [draft, setDraft] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed);
    setDraft('');
  }

  const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <div className="goals-list">
      <div className="goals-header">
        <h2 className="section-title">Goals ({activeGoals.length})</h2>
      </div>

      <form className="goals-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What are you working towards?"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={140}
        />
        <button type="submit" className="btn btn--primary btn--small">
          Add Goal
        </button>
      </form>

      {activeGoals.length === 0 ? (
        <p className="goals-empty">No active goals. Add one to target your focus sessions!</p>
      ) : (
        <ul className="goals-items">
          {activeGoals.map((goal) => (
            <li key={goal.id} className="goal-item">
              <button
                type="button"
                className="goal-complete-btn"
                title="Mark goal as completed"
                aria-label={`Complete goal: ${goal.text}`}
                onClick={() => onComplete(goal.id)}
              >
                <CheckIcon size={12} />
              </button>
              <div className="goal-content">
                <span className="goal-text">{goal.text}</span>
                {(goal.pomodoroCount ?? 0) > 0 && (
                  <span className="goal-pomo-count" title={`${goal.pomodoroCount} pomodoros dedicated to this goal`}>
                    <FlameIcon size={11} className="goal-flame-icon" />
                    <span>{goal.pomodoroCount}</span>
                  </span>
                )}
              </div>
              <button
                type="button"
                className="goal-remove"
                aria-label={`Remove goal: ${goal.text}`}
                onClick={() => onRemove(goal.id)}
                title="Delete goal"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {completedGoals.length > 0 && (
        <div className="completed-goals-section">
          <button
            type="button"
            className="completed-goals-toggle"
            onClick={() => setShowCompleted((prev) => !prev)}
            aria-expanded={showCompleted}
          >
            <span>
              {showCompleted ? '▼' : '►'} Completed Goals ({completedGoals.length})
            </span>
          </button>

          {showCompleted && (
            <ul className="goals-items goals-items--completed">
              {completedGoals.map((goal) => (
                <li key={goal.id} className="goal-item goal-item--completed">
                  <span className="goal-completed-check">
                    <CheckIcon size={11} />
                  </span>
                  <div className="goal-content">
                    <span className="goal-text">{goal.text}</span>
                    {(goal.pomodoroCount ?? 0) > 0 && (
                      <span className="goal-pomo-count">
                        <FlameIcon size={11} className="goal-flame-icon" />
                        <span>{goal.pomodoroCount}</span>
                      </span>
                    )}
                  </div>
                  <div className="goal-actions">
                    <button
                      type="button"
                      className="goal-reopen-btn"
                      title="Reopen goal"
                      onClick={() => onReopen(goal.id)}
                    >
                      ↺
                    </button>
                    <button
                      type="button"
                      className="goal-remove"
                      aria-label={`Remove goal: ${goal.text}`}
                      onClick={() => onRemove(goal.id)}
                      title="Delete goal"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
