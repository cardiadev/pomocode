import { useState, type FormEvent, type ReactElement } from 'react';
import type { Goal } from '../../../shared/protocol';

interface GoalsListProps {
  goals: Goal[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function GoalsList({ goals, onAdd, onToggle, onRemove }: GoalsListProps): ReactElement {
  const [draft, setDraft] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed);
    setDraft('');
  }

  const pendingGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <div className="goals-list">
      <h2 className="section-title">Goals</h2>
      <form className="goals-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What are you working towards?"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={140}
        />
        <button type="submit" className="btn btn--primary btn--small">
          Add
        </button>
      </form>

      {goals.length === 0 ? (
        <p className="goals-empty">No goals yet. Add one to keep your sessions pointed at something.</p>
      ) : (
        <ul>
          {[...pendingGoals, ...completedGoals].map((goal) => (
            <li key={goal.id} className={`goal-item${goal.completed ? ' goal-item--completed' : ''}`}>
              <label className="goal-checkbox">
                <input type="checkbox" checked={goal.completed} onChange={() => onToggle(goal.id)} />
                <span>{goal.text}</span>
              </label>
              <button
                type="button"
                className="goal-remove"
                aria-label={`Remove goal: ${goal.text}`}
                onClick={() => onRemove(goal.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
