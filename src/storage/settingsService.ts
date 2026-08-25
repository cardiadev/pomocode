import * as vscode from 'vscode';
import type { CompletionSound, NativeNotificationSound, PomoCodeSettings } from '../../shared/protocol';

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
      dailyTargetPomodoros: config.get<number>('dailyTargetPomodoros', 8),
      autoStartNextSession: config.get<boolean>('autoStartNextSession', false),
      enableNotifications: config.get<boolean>('enableNotifications', true),
      enableNativeNotifications: config.get<boolean>('enableNativeNotifications', true),
      nativeNotificationSound: config.get<NativeNotificationSound>('nativeNotificationSound', 'Glass'),
      enableSound: config.get<boolean>('enableSound', true),
      completionSound: config.get<CompletionSound>('completionSound', 'chime'),
      accentColor: config.get<string>('accentColor', '#f97316'),
      focusColor: config.get<string>('focusColor', '#f97316'),
      shortBreakColor: config.get<string>('shortBreakColor', '#22c55e'),
      longBreakColor: config.get<string>('longBreakColor', '#38bdf8'),
      fontFamily: config.get<string>('fontFamily', 'Google Sans'),
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
