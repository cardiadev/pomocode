import * as vscode from 'vscode';
import { execFile } from 'node:child_process';
import type { PomoCodeSettings, SessionType } from '../../shared/protocol';

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Focus session',
  shortBreak: 'Short break',
  longBreak: 'Long break',
};

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
    const safeTitle = title.replace(/["\\]/g, '\\$&');
    const safeMessage = message.replace(/["\\]/g, '\\$&');
    const safeAppName = appName.replace(/["\\]/g, '\\$&');

    // Tell the host IDE application to display the notification
    // This displays the macOS notification banner with the VS Code icon instead of Script Editor.
    const script = `tell application "${safeAppName}" to display notification "${safeMessage}" with title "${safeTitle}"`;
    execFile('osascript', ['-e', script], (error) => {
      if (error) {
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
