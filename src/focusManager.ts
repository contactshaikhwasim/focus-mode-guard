// src/focusManager.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FOCUS_LIST_KEY, FOCUS_ENABLED_KEY } from './constants';

export class FocusManager {
  private static instance: FocusManager | null = null;
  private focusList: string[] = [];
  private enabled: boolean = false;
  private outputChannel: vscode.OutputChannel | null = null;

  private constructor(private context: vscode.ExtensionContext) {
    this.loadState();
  }

  public static getInstance(context?: vscode.ExtensionContext): FocusManager {
    if (!FocusManager.instance && context) {
      FocusManager.instance = new FocusManager(context);
    }
    if (!FocusManager.instance) {
      throw new Error('FocusManager must be initialized with context.');
    }
    return FocusManager.instance;
  }

  public setOutputChannel(channel: vscode.OutputChannel) {
    this.outputChannel = channel;
  }

  private loadState() {
    try {
      this.focusList = this.context.workspaceState.get<string[]>(FOCUS_LIST_KEY, []);
      this.enabled = this.context.workspaceState.get<boolean>(FOCUS_ENABLED_KEY, false);
      this.log('Loaded state: enabled=' + this.enabled + ', list=' + JSON.stringify(this.focusList));
    } catch (e) {
      this.log('Error loading state: ' + e);
      this.focusList = [];
      this.enabled = false;
    }
  }

  private async saveState() {
    try {
      await this.context.workspaceState.update(FOCUS_LIST_KEY, this.focusList);
      await this.context.workspaceState.update(FOCUS_ENABLED_KEY, this.enabled);
      this.log('Saved state: enabled=' + this.enabled + ', list=' + JSON.stringify(this.focusList));
    } catch (e) {
      this.log('Error saving state: ' + e);
    }
  }

  public enable(paths: string[]) {
    this.focusList = paths.filter(p => fs.existsSync(p)); // Sanitize: only existing paths
    this.enabled = true;
    this.saveState();
  }

  public disable() {
    this.enabled = false;
    this.saveState();
  }

  public addToFocus(addPath: string) {
    if (!fs.existsSync(addPath)) {
      this.log('Attempt to add non-existent path: ' + addPath);
      return;
    }
    if (!this.focusList.includes(addPath)) {
      this.focusList.push(addPath);
      this.saveState();
    }
  }

  public isFocusEnabled(): boolean {
    return this.enabled;
  }

  public allowOpen(filePath: string): boolean {
    if (!this.enabled) return true;
    return this.focusList.some(focus => {
      if (focus === filePath) return true;
      try {
        if (fs.statSync(focus).isDirectory() && filePath.startsWith(path.join(focus, path.sep))) {
          return true;
        }
      } catch (e) {
        this.log(`Error checking focus item ${focus}: ${e}`);
      }
      return false;
    });
  }

  public getStatus(): string {
    if (!this.enabled) return 'Focus Mode is disabled.';
    return this.focusList.length > 0
      ? 'Focus Mode enabled with: ' + this.focusList.map(p => path.basename(p)).join(', ')
      : 'Focus Mode enabled but no items in focus list.';
  }

  private log(msg: string) {
    if (this.outputChannel) {
      this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
    }
  }
}