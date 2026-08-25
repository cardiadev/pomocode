import * as vscode from 'vscode';
import type { Goal, HistoryEntry, PomoCodeExportData, PomoCodeSettings } from '../../shared/protocol';
import type { GoalsStore } from './goalsStore';
import type { HistoryStore } from './historyStore';
import type { SettingsService } from './settingsService';

export class DataService {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly historyStore: HistoryStore,
    private readonly goalsStore: GoalsStore,
    private readonly extensionVersion: string,
  ) {}

  getExportData(): PomoCodeExportData {
    return {
      version: this.extensionVersion,
      exportedAt: new Date().toISOString(),
      settings: this.settingsService.read(),
      goals: this.goalsStore.getAll(),
      history: this.historyStore.getAll(),
    };
  }

  async exportToFile(): Promise<boolean> {
    const data = this.getExportData();
    const jsonString = JSON.stringify(data, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    const defaultFileName = `pomocode-backup-${dateStr}.json`;

    const uri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(defaultFileName),
      filters: {
        'JSON Files': ['json'],
        'All Files': ['*'],
      },
      saveLabel: 'Export PomoCode Data',
      title: 'Export PomoCode Data',
    });

    if (!uri) {
      return false;
    }

    try {
      const buffer = Buffer.from(jsonString, 'utf-8');
      await vscode.workspace.fs.writeFile(uri, buffer);
      void vscode.window.showInformationMessage(`PomoCode: Data successfully exported to ${uri.fsPath}`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`PomoCode: Failed to export data: ${message}`);
      return false;
    }
  }

  async copyToClipboard(): Promise<boolean> {
    try {
      const data = this.getExportData();
      const jsonString = JSON.stringify(data, null, 2);
      await vscode.env.clipboard.writeText(jsonString);
      void vscode.window.showInformationMessage('PomoCode: JSON backup copied to clipboard.');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`PomoCode: Failed to copy to clipboard: ${message}`);
      return false;
    }
  }

  async importFromFile(): Promise<{ success: boolean; message: string }> {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: {
        'JSON Files': ['json'],
        'All Files': ['*'],
      },
      openLabel: 'Import PomoCode Backup',
      title: 'Import PomoCode Data',
    });

    if (!uris || uris.length === 0 || !uris[0]) {
      return { success: false, message: 'Import cancelled' };
    }

    const targetUri = uris[0];

    try {
      const fileBytes = await vscode.workspace.fs.readFile(targetUri);
      const fileText = Buffer.from(fileBytes).toString('utf-8');
      const parsed = JSON.parse(fileText) as Partial<PomoCodeExportData>;

      if (!parsed || (typeof parsed !== 'object')) {
        throw new Error('Invalid JSON file format.');
      }

      const hasHistory = Array.isArray(parsed.history);
      const hasGoals = Array.isArray(parsed.goals);

      if (!hasHistory && !hasGoals && !parsed.settings) {
        throw new Error('File does not contain valid PomoCode data (no history, goals or settings found).');
      }

      const confirm = await vscode.window.showWarningMessage(
        'Importing this backup will update your goals, history, and settings. Do you want to proceed?',
        { modal: true },
        'Import Data',
      );

      if (confirm !== 'Import Data') {
        return { success: false, message: 'Import cancelled by user.' };
      }

      if (hasHistory) {
        await this.historyStore.replaceHistory(parsed.history as HistoryEntry[]);
      }

      if (hasGoals) {
        await this.goalsStore.replaceGoals(parsed.goals as Goal[]);
      }

      if (parsed.settings && typeof parsed.settings === 'object') {
        const settingsEntries = Object.entries(parsed.settings) as [keyof PomoCodeSettings, never][];
        await Promise.all(
          settingsEntries
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => this.settingsService.update(key, value)),
        );
      }

      const message = `Successfully imported ${(parsed.history?.length ?? 0)} history entries and ${(parsed.goals?.length ?? 0)} goals.`;
      void vscode.window.showInformationMessage(`PomoCode: ${message}`);
      return { success: true, message };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`PomoCode: Import failed: ${message}`);
      return { success: false, message };
    }
  }
}
