import * as vscode from 'vscode';
import { execFile } from 'node:child_process';
import type { PomoCodeSettings, SessionType } from '../../shared/protocol';

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Focus session',
  shortBreak: 'Short break',
  longBreak: 'Long break',
};

function escapeForAppleScript(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function showNativeNotification(title: string, message: string, soundName: string): void {
  if (process.platform !== 'darwin') {
    return;
  }
  const soundClause = soundName === 'None' ? '' : ` sound name "${escapeForAppleScript(soundName)}"`;
  const script = `display notification "${escapeForAppleScript(message)}" with title "${escapeForAppleScript(title)}"${soundClause}`;
  execFile('osascript', ['-e', script], () => {
    // Native notifications are a best-effort enhancement; ignore failures silently.
  });
}

export class NotificationService {
  constructor(private readonly getSettings: () => PomoCodeSettings) {}

  notifySessionStarted(sessionType: SessionType): void {
    const settings = this.getSettings();
    const message = `${SESSION_LABELS[sessionType]} started.`;
    if (settings.enableNotifications) {
      void vscode.window.showInformationMessage(`PomoCode: ${message}`);
    }
    if (settings.enableNativeNotifications) {
      showNativeNotification('PomoCode', message, settings.nativeNotificationSound);
    }
  }

  notifySessionCompleted(completedSessionType: SessionType, nextSessionType: SessionType): void {
    const settings = this.getSettings();
    const message = `${SESSION_LABELS[completedSessionType]} complete. Next up: ${SESSION_LABELS[nextSessionType]}.`;
    if (settings.enableNotifications) {
      void vscode.window.showInformationMessage(`PomoCode: ${message}`);
    }
    if (settings.enableNativeNotifications) {
      showNativeNotification('PomoCode', message, settings.nativeNotificationSound);
    }
  }
}
