// src/commands.ts
import * as vscode from 'vscode';
import { FocusManager } from './focusManager';
import { EXTENSION_NAME } from './constants';

export interface Command {
  execute(): Promise<void> | void;
}

export class EnableFocusCommand implements Command, vscode.Disposable {
  private disposable: vscode.Disposable;

  constructor(
    private focusManager: FocusManager,
    private outputChannel: vscode.OutputChannel
  ) {
    this.disposable = vscode.commands.registerCommand('focusMode.enable', () => this.execute());
  }

  async execute() {
    try {
      const options: vscode.OpenDialogOptions = {
        canSelectMany: true,
        canSelectFiles: true,
        canSelectFolders: true,
        openLabel: 'Select for Focus Mode',
        title: 'Select Files/Folders for Focus Mode'
      };
      const uris = await vscode.window.showOpenDialog(options);
      if (!uris || uris.length === 0) return;

      const paths = uris.map(uri => uri.fsPath);
      this.focusManager.enable(paths);
      vscode.window.showInformationMessage('Focus Mode enabled.');
      this.log(`Enabled with paths: ${JSON.stringify(paths)}`);
    } catch (e) {
      this.log(`Error enabling: ${e}`);
      vscode.window.showErrorMessage('Failed to enable Focus Mode.');
    }
  }

  private log(msg: string) {
    this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
  }

  dispose() {
    this.disposable.dispose();
  }
}

export class DisableFocusCommand implements Command, vscode.Disposable {
  private disposable: vscode.Disposable;

  constructor(
    private focusManager: FocusManager,
    private outputChannel: vscode.OutputChannel
  ) {
    this.disposable = vscode.commands.registerCommand('focusMode.disable', () => this.execute());
  }

  execute() {
    try {
      this.focusManager.disable();
      vscode.window.showInformationMessage('Focus Mode disabled.');
      this.log('Disabled');
    } catch (e) {
      this.log(`Error disabling: ${e}`);
      vscode.window.showErrorMessage('Failed to disable Focus Mode.');
    }
  }

  private log(msg: string) {
    this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
  }

  dispose() {
    this.disposable.dispose();
  }
}

export class StatusFocusCommand implements Command, vscode.Disposable {
  private disposable: vscode.Disposable;

  constructor(
    private focusManager: FocusManager,
    private outputChannel: vscode.OutputChannel
  ) {
    this.disposable = vscode.commands.registerCommand('focusMode.status', () => this.execute());
  }

  execute() {
    try {
      const status = this.focusManager.getStatus();
      vscode.window.showInformationMessage(status);
      this.log('Status requested: ' + status);
    } catch (e) {
      this.log(`Error getting status: ${e}`);
      vscode.window.showErrorMessage('Failed to get Focus Mode status.');
    }
  }

  private log(msg: string) {
    this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
  }

  dispose() {
    this.disposable.dispose();
  }
}