import * as vscode from 'vscode';
import { execFile } from 'node:child_process';
import type { PomoCodeSettings, SessionType } from '../../shared/protocol';

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Focus session',
  shortBreak: 'Short break',
  longBreak: 'Long break',
};

function escapeAppleScript(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
      this.sendNativeNotification('PomoCode', message, settings.nativeNotificationSound);
    }
  }

  notifySessionCompleted(completedSessionType: SessionType, nextSessionType: SessionType): void {
    const settings = this.getSettings();
    const message = `${SESSION_LABELS[completedSessionType]} complete. Next up: ${SESSION_LABELS[nextSessionType]}.`;
    if (settings.enableNotifications) {
      void vscode.window.showInformationMessage(`PomoCode: ${message}`);
    }
    if (settings.enableNativeNotifications) {
      this.sendNativeNotification('PomoCode', message, settings.nativeNotificationSound);
    }
  }

  sendNativeNotification(title: string, message: string, soundName: PomoCodeSettings['nativeNotificationSound']): void {
    if (process.platform !== 'darwin') {
      return;
    }

    if (soundName && soundName !== 'None') {
      this.playNativeSound(soundName);
    }

    const appName = vscode.env.appName || 'Visual Studio Code';
    const safeTitle = escapeAppleScript(title);
    const safeMessage = escapeAppleScript(message);
    const safeAppName = escapeAppleScript(appName);

    // Attempt to dispatch notification on behalf of the IDE application
    const script = `tell application "${safeAppName}" to display notification "${safeMessage}" with title "${safeTitle}"`;
    execFile('osascript', ['-e', script], (error) => {
      if (error) {
        // If tell application fails, fallback to direct display notification
        const fallbackScript = `display notification "${safeMessage}" with title "${safeTitle}"`;
        execFile('osascript', ['-e', fallbackScript], () => {});
      }
    });
  }

  playNativeSound(soundName: PomoCodeSettings['nativeNotificationSound']): void {
    if (process.platform !== 'darwin' || soundName === 'None') {
      return;
    }
    const soundPath = `/System/Library/Sounds/${soundName}.aiff`;
    execFile('afplay', [soundPath], () => {
      // Best-effort preview
    });
  }
}
