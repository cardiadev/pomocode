import * as vscode from 'vscode';
import type { HostMessage, PomoCodeSettings, TimerCommand, WebviewMessage } from '../../shared/protocol';
import type { TimerEngine } from '../timer/timerEngine';
import type { SettingsService } from '../storage/settingsService';
import type { HistoryStore } from '../storage/historyStore';
import type { GoalsStore } from '../storage/goalsStore';
import type { DataService } from '../storage/dataService';
import type { NotificationService } from '../notifications/notificationService';
import { computeStats } from '../../shared/statsUtils';
import { buildPanelHtml } from './html';

export class PanelProvider implements vscode.WebviewViewProvider {
  private view: vscode.WebviewView | undefined;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly timerEngine: TimerEngine,
    private readonly settingsService: SettingsService,
    private readonly historyStore: HistoryStore,
    private readonly goalsStore: GoalsStore,
    private readonly dataService: DataService,
    private readonly notificationService: NotificationService,
    private readonly extensionVersion: string,
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };
    webviewView.webview.html = buildPanelHtml(webviewView.webview, this.extensionUri);

    webviewView.webview.onDidReceiveMessage((message: WebviewMessage) => {
      this.handleWebviewMessage(message);
    });

    webviewView.onDidDispose(() => {
      this.view = undefined;
    });
  }

  postMessage(message: HostMessage): void {
    void this.view?.webview.postMessage(message);
  }

  private handleWebviewMessage(message: WebviewMessage): void {
    switch (message.type) {
      case 'webview/ready':
        this.sendFullState();
        return;
      case 'command':
        this.handleCommand(message.payload.command);
        return;
      case 'settings/update':
        this.handleSettingsUpdate(message.payload);
        return;
      case 'settings/previewNativeSound':
        this.notificationService.playNativeSound(message.payload.sound);
        return;
      case 'goals/add':
        void this.goalsStore.add(message.payload.text);
        return;
      case 'goals/toggle':
        void this.goalsStore.toggle(message.payload.id);
        return;
      case 'goals/complete':
        void this.goalsStore.complete(message.payload.id);
        return;
      case 'goals/reopen':
        void this.goalsStore.reopen(message.payload.id);
        return;
      case 'goals/remove':
        void this.goalsStore.remove(message.payload.id);
        return;
      case 'timer/setActiveGoals':
        this.timerEngine.setActiveGoalIds(message.payload.goalIds);
        return;
      case 'data/exportJson':
        void this.dataService.exportToFile();
        return;
      case 'data/copyJson':
        void this.dataService.copyToClipboard();
        return;
      case 'data/importJson':
        void this.dataService.importFromFile();
        return;
      case 'data/clear':
        void this.dataService.clearData(message.payload.scope);
        return;
      case 'openExternal':
        void vscode.env.openExternal(vscode.Uri.parse(message.payload.url));
        return;
    }
  }

  private handleCommand(command: TimerCommand): void {
    switch (command) {
      case 'start':
        this.timerEngine.start();
        return;
      case 'pause':
        this.timerEngine.pause();
        return;
      case 'resume':
        this.timerEngine.resume();
        return;
      case 'reset':
        this.timerEngine.reset();
        return;
      case 'skip':
        this.timerEngine.skip();
        return;
    }
  }

  private handleSettingsUpdate(partial: Partial<PomoCodeSettings>): void {
    const entries = Object.entries(partial) as [keyof PomoCodeSettings, never][];
    for (const [key, value] of entries) {
      void this.settingsService.update(key, value);
    }
  }

  private sendFullState(): void {
    const settings = this.settingsService.read();
    this.postMessage({ type: 'timer/update', payload: this.timerEngine.getSnapshot() });
    this.postMessage({ type: 'settings/sync', payload: settings });
    const entries = this.historyStore.getAll();
    this.postMessage({ type: 'history/sync', payload: { entries, stats: computeStats(entries, settings.dailyTargetPomodoros) } });
    this.postMessage({ type: 'goals/sync', payload: this.goalsStore.getAll() });
    this.postMessage({ type: 'meta/sync', payload: { version: this.extensionVersion } });
  }
}
