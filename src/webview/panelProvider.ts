import * as vscode from 'vscode';
import type { HostMessage, PomoCodeSettings, TimerCommand, WebviewMessage } from '../../shared/protocol';
import type { TimerEngine } from '../timer/timerEngine';
import type { SettingsService } from '../storage/settingsService';
import type { HistoryStore } from '../storage/historyStore';
import type { GoalsStore } from '../storage/goalsStore';
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
      case 'goals/add':
        void this.goalsStore.add(message.payload.text);
        return;
      case 'goals/toggle':
        void this.goalsStore.toggle(message.payload.id);
        return;
      case 'goals/remove':
        void this.goalsStore.remove(message.payload.id);
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
    this.postMessage({ type: 'timer/update', payload: this.timerEngine.getSnapshot() });
    this.postMessage({ type: 'settings/sync', payload: this.settingsService.read() });
    const entries = this.historyStore.getAll();
    this.postMessage({ type: 'history/sync', payload: { entries, stats: computeStats(entries) } });
    this.postMessage({ type: 'goals/sync', payload: this.goalsStore.getAll() });
    this.postMessage({ type: 'meta/sync', payload: { version: this.extensionVersion } });
  }
}
