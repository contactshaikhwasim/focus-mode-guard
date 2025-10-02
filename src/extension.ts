// src/extension.ts
import * as vscode from 'vscode';
import { FocusManager } from './focusManager';
import { EnableFocusCommand, DisableFocusCommand, StatusFocusCommand } from './commands';
import { FocusEventHandler } from './eventHandlers';
import { EXTENSION_NAME } from './constants';

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel(EXTENSION_NAME);
  const focusManager = FocusManager.getInstance(context);
  focusManager.setOutputChannel(outputChannel);

  const enableCommand = new EnableFocusCommand(focusManager, outputChannel);
  const disableCommand = new DisableFocusCommand(focusManager, outputChannel);
  const statusCommand = new StatusFocusCommand(focusManager, outputChannel);
  const eventHandler = new FocusEventHandler(focusManager, outputChannel);

  context.subscriptions.push(
    outputChannel,
    enableCommand,
    disableCommand,
    statusCommand,
    eventHandler
  );

  outputChannel.appendLine(`[${new Date().toISOString()}] Extension activated`);
}

export function deactivate() {}