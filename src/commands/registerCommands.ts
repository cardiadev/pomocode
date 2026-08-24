import * as vscode from 'vscode';
import type { TimerEngine } from '../timer/timerEngine';

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
  );
}
