import * as vscode from 'vscode';
import type { PomoCodeSettings } from '../../shared/protocol';

const SECTION = 'pomocode';

export class SettingsService {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<PomoCodeSettings>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  private readonly configListener: vscode.Disposable;

  constructor() {
    this.configListener = vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(SECTION)) {
        this.onDidChangeEmitter.fire(this.read());
      }
    });
  }

  read(): PomoCodeSettings {
    const config = vscode.workspace.getConfiguration(SECTION);
    return {
      focusDuration: config.get<number>('focusDuration', 25),
      shortBreakDuration: config.get<number>('shortBreakDuration', 5),
      longBreakDuration: config.get<number>('longBreakDuration', 15),
      sessionsBeforeLongBreak: config.get<number>('sessionsBeforeLongBreak', 4),
      autoStartNextSession: config.get<boolean>('autoStartNextSession', false),
      enableNotifications: config.get<boolean>('enableNotifications', true),
      enableNativeNotifications: config.get<boolean>('enableNativeNotifications', true),
      enableSound: config.get<boolean>('enableSound', true),
    };
  }

  async update<K extends keyof PomoCodeSettings>(key: K, value: PomoCodeSettings[K]): Promise<void> {
    const config = vscode.workspace.getConfiguration(SECTION);
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  dispose(): void {
    this.configListener.dispose();
    this.onDidChangeEmitter.dispose();
  }
}
