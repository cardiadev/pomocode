import { useState, type FormEvent, type ReactElement } from 'react';
import type { Goal } from '../../../shared/protocol';
import { TargetIcon, TomatoIcon, CheckIcon } from './Icons';

interface SessionGoalSelectorProps {
  goals: Goal[];
  activeGoalIds: string[];
  onSelectGoals: (goalIds: string[]) => void;
  onAddGoal: (text: string) => void;
}

export function SessionGoalSelector({
  goals,
  activeGoalIds,
  onSelectGoals,
  onAddGoal,
}: SessionGoalSelectorProps): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickDraft, setQuickDraft] = useState('');

  const activeGoals = goals.filter((g) => !g.completed);
  const selectedGoals = activeGoals.filter((g) => activeGoalIds.includes(g.id));

  function handleToggleGoal(id: string): void {
    if (activeGoalIds.includes(id)) {
      onSelectGoals(activeGoalIds.filter((gid) => gid !== id));
    } else {
      onSelectGoals([...activeGoalIds, id]);
    }
  }

  function handleQuickAdd(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = quickDraft.trim();
    if (!trimmed) {
      return;
    }
    onAddGoal(trimmed);
    setQuickDraft('');
  }

  return (
    <div className="session-goal-selector">
      <div className="session-goal-bar">
        <button
          type="button"
          className="session-goal-toggle"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          <TargetIcon size={14} className="session-goal-icon-svg" />
          <span className="session-goal-summary">
            {selectedGoals.length === 0
              ? 'Focusing on: (No goal selected)'
              : `Focusing on: ${selectedGoals.map((g) => g.text).join(', ')}`}
          </span>
          <span className="session-goal-chevron">{isExpanded ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Selected Goal Chips */}
      {selectedGoals.length > 0 && !isExpanded && (
        <div className="session-goal-chips">
          {selectedGoals.map((goal) => (
            <span key={goal.id} className="goal-chip">
              <span className="goal-chip-text">{goal.text}</span>
              <button
                type="button"
                className="goal-chip-remove"
                onClick={() => handleToggleGoal(goal.id)}
                aria-label={`Unlink ${goal.text}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Expanded Goal Picker */}
      {isExpanded && (
        <div className="session-goal-picker">
          <form className="session-goal-quick-add" onSubmit={handleQuickAdd}>
            <input
              type="text"
              placeholder="Add &amp; focus on a new goal…"
              value={quickDraft}
              onChange={(e) => setQuickDraft(e.target.value)}
              maxLength={120}
            />
            <button type="submit" className="btn btn--primary btn--small">
              + Add
            </button>
          </form>

          {activeGoals.length === 0 ? (
            <p className="session-goal-empty">No active goals yet. Add one above to link with your sessions!</p>
          ) : (
            <div className="session-goal-options">
              {activeGoals.map((goal) => {
                const isSelected = activeGoalIds.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    className={`session-goal-option${isSelected ? ' session-goal-option--selected' : ''}`}
                    onClick={() => handleToggleGoal(goal.id)}
                  >
                    <span className="session-goal-option-check">
                      {isSelected ? <CheckIcon size={12} /> : '○'}
                    </span>
                    <span className="session-goal-option-text">{goal.text}</span>
                    {(goal.pomodoroCount ?? 0) > 0 && (
                      <span className="goal-pomo-badge">
                        <span>{goal.pomodoroCount}</span>
                        <TomatoIcon size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
