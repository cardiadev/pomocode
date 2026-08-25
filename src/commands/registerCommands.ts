import * as vscode from 'vscode';
import type { TimerEngine } from '../timer/timerEngine';
import type { HistoryStore } from '../storage/historyStore';
import type { DataService } from '../storage/dataService';
import { computeStats } from '../../shared/statsUtils';

interface QuickMenuItem extends vscode.QuickPickItem {
  action?: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

async function showQuickMenu(
  timerEngine: TimerEngine,
  historyStore: HistoryStore,
  dataService: DataService,
): Promise<void> {
  const snapshot = timerEngine.getSnapshot();
  const stats = computeStats(historyStore.getAll());
  const items: QuickMenuItem[] = [];

  const roundPosition =
    snapshot.sessionType === 'longBreak'
      ? snapshot.sessionsBeforeLongBreak
      : Math.min(snapshot.completedFocusSessionsInCycle + 1, snapshot.sessionsBeforeLongBreak);

  items.push({
    label: `$(flame) ${stats.todayCount}/${stats.dailyTargetPomodoros} pomodoros today · ${stats.roundsCompletedToday} rounds · ${stats.currentStreakDays}d streak`,
    kind: vscode.QuickPickItemKind.Separator,
  });
  items.push({
    label: `$(sync) Round ${roundPosition} of ${snapshot.sessionsBeforeLongBreak} (Step ${snapshot.cycleStep}/${snapshot.totalCycleSteps})`,
    kind: vscode.QuickPickItemKind.Separator,
  });

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

  items.push({
    label: '$(export) Export Data (JSON)',
    action: () => void dataService.exportToFile(),
  });

  items.push({
    label: '$(import) Import Data (JSON)',
    action: () => void dataService.importFromFile(),
  });

  const title =
    snapshot.status === 'idle' ? 'PomoCode' : `PomoCode — ${formatTime(snapshot.remainingSeconds)} remaining`;

  const picked = await vscode.window.showQuickPick(items, {
    title,
    placeHolder: 'Choose a PomoCode action',
  });

  picked?.action?.();
}

export function registerCommands(
  context: vscode.ExtensionContext,
  timerEngine: TimerEngine,
  historyStore: HistoryStore,
  dataService: DataService,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('pomocode.start', () => timerEngine.start()),
    vscode.commands.registerCommand('pomocode.pause', () => timerEngine.pause()),
    vscode.commands.registerCommand('pomocode.resume', () => timerEngine.resume()),
    vscode.commands.registerCommand('pomocode.reset', () => timerEngine.reset()),
    vscode.commands.registerCommand('pomocode.skip', () => timerEngine.skip()),
    vscode.commands.registerCommand('pomocode.exportData', () => void dataService.exportToFile()),
    vscode.commands.registerCommand('pomocode.importData', () => void dataService.importFromFile()),
    vscode.commands.registerCommand('pomocode.openPanel', () => {
      void vscode.commands.executeCommand('pomocode.panelView.focus');
    }),
    vscode.commands.registerCommand('pomocode.showQuickMenu', () => void showQuickMenu(timerEngine, historyStore, dataService)),
  );
}
