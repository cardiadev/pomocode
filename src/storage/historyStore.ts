import * as vscode from 'vscode';
import type { HistoryEntry } from '../../shared/protocol';

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

  dispose(): void {
    this.onDidChangeEmitter.dispose();
  }
}
