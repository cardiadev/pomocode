import * as vscode from 'vscode';
import type { PomoCodeSettings, SessionType } from '../../shared/protocol';

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Focus session',
  shortBreak: 'Short break',
  longBreak: 'Long break',
};

export class NotificationService {
  constructor(private readonly getSettings: () => PomoCodeSettings) {}

  notifySessionStarted(sessionType: SessionType): void {
    if (!this.getSettings().enableNotifications) {
      return;
    }
    void vscode.window.showInformationMessage(`PomoCode: ${SESSION_LABELS[sessionType]} started.`);
  }

  notifySessionCompleted(completedSessionType: SessionType, nextSessionType: SessionType): void {
    if (!this.getSettings().enableNotifications) {
      return;
    }
    void vscode.window.showInformationMessage(
      `PomoCode: ${SESSION_LABELS[completedSessionType]} complete. Next up: ${SESSION_LABELS[nextSessionType]}.`,
    );
  }
}
