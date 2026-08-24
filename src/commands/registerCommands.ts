import * as vscode from 'vscode';
import type { TimerEngine } from '../timer/timerEngine';

interface QuickMenuItem extends vscode.QuickPickItem {
  action: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

async function showQuickMenu(timerEngine: TimerEngine): Promise<void> {
  const snapshot = timerEngine.getSnapshot();
  const items: QuickMenuItem[] = [];

  if (snapshot.status === 'running') {
    items.push({ label: '$(debug-pause) Pause', action: () => timerEngine.pause() });
  } else if (snapshot.status === 'paused') {
    items.push({ label: '$(play) Resume', action: () => timerEngine.resume() });
  } else {
    items.push({ label: '$(play) Start Focus Session', action: () => timerEngine.start() });
  }

  if (snapshot.status !== 'idle') {
    items.push({ label: '$(debug-step-over) Skip to Next Session', action: () => timerEngine.skip() });
    items.push({ label: '$(debug-restart) Reset Timer', action: () => timerEngine.reset() });
  }

  items.push({
    label: '$(layout-panel-left) Open PomoCode Panel',
    action: () => void vscode.commands.executeCommand('pomocode.panelView.focus'),
  });

  const title =
    snapshot.status === 'idle' ? 'PomoCode' : `PomoCode — ${formatTime(snapshot.remainingSeconds)} remaining`;

  const picked = await vscode.window.showQuickPick(items, {
    title,
    placeHolder: 'Choose a PomoCode action',
  });

  picked?.action();
}

export function registerCommands(context: vscode.ExtensionContext, timerEngine: TimerEngine): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('pomocode.start', () => timerEngine.start()),
    vscode.commands.registerCommand('pomocode.pause', () => timerEngine.pause()),
    vscode.commands.registerCommand('pomocode.resume', () => timerEngine.resume()),
    vscode.commands.registerCommand('pomocode.reset', () => timerEngine.reset()),
    vscode.commands.registerCommand('pomocode.skip', () => timerEngine.skip()),
    vscode.commands.registerCommand('pomocode.openPanel', () => {
      void vscode.commands.executeCommand('pomocode.panelView.focus');
    }),
    vscode.commands.registerCommand('pomocode.showQuickMenu', () => void showQuickMenu(timerEngine)),
  );
}
