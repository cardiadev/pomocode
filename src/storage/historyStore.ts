import * as vscode from 'vscode';
import type { HistoryEntry } from '../../shared/protocol';
import { toLocalDayKey } from '../../shared/statsUtils';

const HISTORY_KEY = 'pomocode.history.entries';
const MAX_ENTRIES = 1000;

export class HistoryStore {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<HistoryEntry[]>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  constructor(private readonly globalState: vscode.Memento) {}

  getAll(): HistoryEntry[] {
    return this.globalState.get<HistoryEntry[]>(HISTORY_KEY, []);
  }

  async addEntry(entry: HistoryEntry): Promise<void> {
    const entries = this.getAll();
    entries.push(entry);
    if (entries.length > MAX_ENTRIES) {
      entries.splice(0, entries.length - MAX_ENTRIES);
    }
    await this.globalState.update(HISTORY_KEY, entries);
    this.onDidChangeEmitter.fire(entries);
  }

  async replaceHistory(newEntries: HistoryEntry[]): Promise<void> {
    const entries = newEntries.slice(-MAX_ENTRIES);
    await this.globalState.update(HISTORY_KEY, entries);
    this.onDidChangeEmitter.fire(entries);
  }

  async clearToday(): Promise<number> {
    const todayKey = toLocalDayKey(new Date().toISOString());
    const all = this.getAll();
    const remaining = all.filter((e) => toLocalDayKey(e.endedAt) !== todayKey);
    const removedCount = all.length - remaining.length;
    await this.replaceHistory(remaining);
    return removedCount;
  }

  async clearThisWeek(): Promise<number> {
    const now = new Date();
    const dayIndex = now.getDay();
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - dayIndex);

    const all = this.getAll();
    const remaining = all.filter((e) => new Date(e.endedAt) < weekStart);
    const removedCount = all.length - remaining.length;
    await this.replaceHistory(remaining);
    return removedCount;
  }

  async clear(): Promise<void> {
    await this.globalState.update(HISTORY_KEY, []);
    this.onDidChangeEmitter.fire([]);
  }

  dispose(): void {
    this.onDidChangeEmitter.dispose();
  }
}
