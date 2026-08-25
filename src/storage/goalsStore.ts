import * as vscode from 'vscode';
import type { Goal } from '../../shared/protocol';

const GOALS_KEY = 'pomocode.goals.entries';
const MAX_GOALS = 200;

export class GoalsStore {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<Goal[]>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  constructor(private readonly globalState: vscode.Memento) {}

  getAll(): Goal[] {
    return this.globalState.get<Goal[]>(GOALS_KEY, []);
  }

  async add(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const goals = this.getAll();
    goals.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      pomodoroCount: 0,
    });
    if (goals.length > MAX_GOALS) {
      goals.splice(0, goals.length - MAX_GOALS);
    }
    await this.globalState.update(GOALS_KEY, goals);
    this.onDidChangeEmitter.fire(goals);
  }

  async toggle(id: string): Promise<void> {
    const goals = this.getAll();
    const target = goals.find((goal) => goal.id === id);
    if (!target) {
      return;
    }
    target.completed = !target.completed;
    target.completedAt = target.completed ? new Date().toISOString() : undefined;
    await this.globalState.update(GOALS_KEY, goals);
    this.onDidChangeEmitter.fire(goals);
  }

  async complete(id: string): Promise<void> {
    const goals = this.getAll();
    const target = goals.find((goal) => goal.id === id);
    if (!target) {
      return;
    }
    target.completed = true;
    target.completedAt = new Date().toISOString();
    await this.globalState.update(GOALS_KEY, goals);
    this.onDidChangeEmitter.fire(goals);
  }

  async reopen(id: string): Promise<void> {
    const goals = this.getAll();
    const target = goals.find((goal) => goal.id === id);
    if (!target) {
      return;
    }
    target.completed = false;
    target.completedAt = undefined;
    await this.globalState.update(GOALS_KEY, goals);
    this.onDidChangeEmitter.fire(goals);
  }

  async incrementPomodoroCount(goalIds: string[]): Promise<void> {
    if (!goalIds || goalIds.length === 0) {
      return;
    }
    const goals = this.getAll();
    let changed = false;
    for (const id of goalIds) {
      const target = goals.find((g) => g.id === id);
      if (target) {
        target.pomodoroCount = (target.pomodoroCount ?? 0) + 1;
        changed = true;
      }
    }
    if (changed) {
      await this.globalState.update(GOALS_KEY, goals);
      this.onDidChangeEmitter.fire(goals);
    }
  }

  async remove(id: string): Promise<void> {
    const goals = this.getAll().filter((goal) => goal.id !== id);
    await this.globalState.update(GOALS_KEY, goals);
    this.onDidChangeEmitter.fire(goals);
  }

  async replaceGoals(newGoals: Goal[]): Promise<void> {
    const goals = newGoals.slice(0, MAX_GOALS);
    await this.globalState.update(GOALS_KEY, goals);
    this.onDidChangeEmitter.fire(goals);
  }

  dispose(): void {
    this.onDidChangeEmitter.dispose();
  }
}
