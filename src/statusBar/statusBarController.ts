import * as vscode from 'vscode';
import type { SessionType, TimerSnapshot } from '../../shared/protocol';

const SESSION_ICONS: Record<SessionType, string> = {
  focus: '$(flame)',
  shortBreak: '$(coffee)',
  longBreak: '$(coffee)',
};

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export class StatusBarController implements vscode.Disposable {
  private readonly item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'pomocode.showQuickMenu';
    this.item.name = 'PomoCode';
    this.render({
      status: 'idle',
      sessionType: 'focus',
      remainingSeconds: 0,
      totalSeconds: 0,
      completedFocusSessionsInCycle: 0,
      sessionsBeforeLongBreak: 4,
      justCompleted: false,
    });
    this.item.show();
  }

  render(snapshot: TimerSnapshot): void {
    const icon = SESSION_ICONS[snapshot.sessionType];
    const label = SESSION_LABELS[snapshot.sessionType];

    if (snapshot.status === 'idle') {
      this.item.text = `${icon} PomoCode`;
      this.item.tooltip = 'PomoCode: click for quick actions.';
      return;
    }

    const time = formatTime(snapshot.remainingSeconds);
    const statusSuffix = snapshot.status === 'paused' ? ' (paused)' : '';
    const roundPosition =
      snapshot.sessionType === 'longBreak'
        ? snapshot.sessionsBeforeLongBreak
        : Math.min(snapshot.completedFocusSessionsInCycle + 1, snapshot.sessionsBeforeLongBreak);
    this.item.text = `${icon} ${time} ${label} (${roundPosition}/${snapshot.sessionsBeforeLongBreak})${statusSuffix}`;
    this.item.tooltip = 'PomoCode: click for quick actions.';
  }

  dispose(): void {
    this.item.dispose();
  }
}
