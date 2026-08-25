import * as vscode from 'vscode';
import { TimerEngine } from './timer/timerEngine';
import { StatusBarController } from './statusBar/statusBarController';
import { PanelProvider } from './webview/panelProvider';
import { SettingsService } from './storage/settingsService';
import { HistoryStore } from './storage/historyStore';
import { GoalsStore } from './storage/goalsStore';
import { DataService } from './storage/dataService';
import { computeStats } from '../shared/statsUtils';
import { NotificationService } from './notifications/notificationService';
import { registerCommands } from './commands/registerCommands';

export function activate(context: vscode.ExtensionContext): void {
  const settingsService = new SettingsService();
  const historyStore = new HistoryStore(context.globalState);
  const goalsStore = new GoalsStore(context.globalState);
  const notificationService = new NotificationService(() => settingsService.read());
  const timerEngine = new TimerEngine(() => settingsService.read());
  const statusBarController = new StatusBarController();
  const extensionVersion = (context.extension.packageJSON as { version?: string }).version ?? '0.0.0';
  const dataService = new DataService(settingsService, historyStore, goalsStore, extensionVersion);

  const panelProvider = new PanelProvider(
    context.extensionUri,
    timerEngine,
    settingsService,
    historyStore,
    goalsStore,
    dataService,
    extensionVersion,
  );

  context.subscriptions.push(
    settingsService,
    historyStore,
    goalsStore,
    timerEngine,
    statusBarController,
    vscode.window.registerWebviewViewProvider('pomocode.panelView', panelProvider, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    timerEngine.onDidChangeState((snapshot) => {
      statusBarController.render(snapshot);
      panelProvider.postMessage({ type: 'timer/update', payload: snapshot });
    }),
    timerEngine.onSessionStarted((sessionType) => {
      notificationService.notifySessionStarted(sessionType);
    }),
    timerEngine.onSessionCompleted((event) => {
      const allGoals = goalsStore.getAll();
      const goalTitles = event.goalIds
        ?.map((id) => allGoals.find((g) => g.id === id)?.text)
        .filter((t): t is string => Boolean(t));

      void historyStore.addEntry({
        id: `${event.startedAt}-${event.sessionType}`,
        type: event.sessionType,
        startedAt: event.startedAt,
        endedAt: event.endedAt,
        durationMinutes: event.durationMinutes,
        completed: event.completed,
        goalIds: event.goalIds,
        goalTitles: goalTitles && goalTitles.length > 0 ? goalTitles : undefined,
      });

      if (event.completed && event.goalIds && event.goalIds.length > 0) {
        void goalsStore.incrementPomodoroCount(event.goalIds);
      }

      notificationService.notifySessionCompleted(event.sessionType, event.nextSessionType);
    }),
    settingsService.onDidChange((settings) => {
      panelProvider.postMessage({ type: 'settings/sync', payload: settings });
    }),
    historyStore.onDidChange((entries) => {
      const settings = settingsService.read();
      panelProvider.postMessage({
        type: 'history/sync',
        payload: { entries, stats: computeStats(entries, settings.dailyTargetPomodoros) },
      });
    }),
    goalsStore.onDidChange((goals) => {
      panelProvider.postMessage({ type: 'goals/sync', payload: goals });
    }),
  );

  registerCommands(context, timerEngine, historyStore, dataService);
}

export function deactivate(): void {
  // All state is cleaned up via context.subscriptions disposables.
}

