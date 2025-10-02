// src/eventHandlers.ts
import * as vscode from 'vscode';
import * as path from 'path';
import { FocusManager } from './focusManager';
import { ValidationContext, FileNameStrategy, FolderNameStrategy, ValidationResult } from './strategies';

export class FocusEventHandler implements vscode.Disposable {
  private disposable: vscode.Disposable;

  constructor(
    private focusManager: FocusManager,
    private outputChannel: vscode.OutputChannel
  ) {
    this.disposable = vscode.workspace.onDidOpenTextDocument(doc => this.handleOpen(doc));
  }

  private async handleOpen(doc: vscode.TextDocument) {
    try {
      if (doc.uri.scheme !== 'file') return;
      const filePath = doc.uri.fsPath;
      this.log(`Document opened: ${filePath}`);

      if (!this.focusManager.isFocusEnabled() || this.focusManager.allowOpen(filePath)) {
        this.log(`Access allowed for ${filePath}`);
        return;
      }

      this.log(`Access restricted for ${filePath}`);
      const basename = path.basename(filePath);
      const prompt = `⚠️ Restricted Access\nYou are in Focus Mode. Access to '${basename}' is restricted.\nType the filename/folder name to confirm override:`;
      const input = await vscode.window.showInputBox({ prompt, placeHolder: basename });
      const trimmedInput = input?.trim();

      if (!trimmedInput) {
        this.log(`No input provided, closing ${filePath}`);
        this.closeEditor();
        return;
      }

      const validationContext = new ValidationContext(new FileNameStrategy());
      let result: ValidationResult = validationContext.validate(trimmedInput, filePath);

      if (result.action === 'invalid') {
        validationContext.setStrategy(new FolderNameStrategy());
        result = validationContext.validate(trimmedInput, filePath);
      }

      if (result.action === 'temp_open') {
        this.log(`Temporary access granted for ${filePath}`);
        // Do nothing, keep open
      } else if (result.action === 'add') {
        const addPath = result.pathToAdd!;
        this.focusManager.addToFocus(addPath);
        vscode.window.showInformationMessage(`${path.basename(addPath)} added to Focus Mode.`);
        this.log(`Added ${addPath} to focus list`);
        if (this.focusManager.allowOpen(filePath)) {
          this.log(`Access now granted for ${filePath} after add`);
          // Do nothing, keep open
        } else {
          this.log(`Access still restricted for ${filePath} after add`);
          this.closeEditor();
        }
      } else {
        vscode.window.showErrorMessage('Incorrect input.');
        this.log(`Invalid input '${trimmedInput}', closing ${filePath}`);
        this.closeEditor();
      }
    } catch (e) {
      this.log(`Error handling open for ${doc.uri.fsPath}: ${e}`);
      // Default to allow (failure isolation)
    }
  }

  private log(msg: string) {
    this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
  }

  private closeEditor() {
    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  }

  dispose() {
    this.disposable.dispose();
  }
}