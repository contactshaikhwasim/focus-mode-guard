"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusEventHandler = void 0;
// src/eventHandlers.ts
const vscode = require("vscode");
const path = require("path");
const strategies_1 = require("./strategies");
class FocusEventHandler {
    constructor(focusManager, outputChannel) {
        this.focusManager = focusManager;
        this.outputChannel = outputChannel;
        this.disposable = vscode.workspace.onDidOpenTextDocument(doc => this.handleOpen(doc));
    }
    async handleOpen(doc) {
        try {
            if (doc.uri.scheme !== 'file')
                return;
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
            const validationContext = new strategies_1.ValidationContext(new strategies_1.FileNameStrategy());
            let result = validationContext.validate(trimmedInput, filePath);
            if (result.action === 'invalid') {
                validationContext.setStrategy(new strategies_1.FolderNameStrategy());
                result = validationContext.validate(trimmedInput, filePath);
            }
            if (result.action === 'temp_open') {
                this.log(`Temporary access granted for ${filePath}`);
                // Do nothing, keep open
            }
            else if (result.action === 'add') {
                const addPath = result.pathToAdd;
                this.focusManager.addToFocus(addPath);
                vscode.window.showInformationMessage(`${path.basename(addPath)} added to Focus Mode.`);
                this.log(`Added ${addPath} to focus list`);
                if (this.focusManager.allowOpen(filePath)) {
                    this.log(`Access now granted for ${filePath} after add`);
                    // Do nothing, keep open
                }
                else {
                    this.log(`Access still restricted for ${filePath} after add`);
                    this.closeEditor();
                }
            }
            else {
                vscode.window.showErrorMessage('Incorrect input.');
                this.log(`Invalid input '${trimmedInput}', closing ${filePath}`);
                this.closeEditor();
            }
        }
        catch (e) {
            this.log(`Error handling open for ${doc.uri.fsPath}: ${e}`);
            // Default to allow (failure isolation)
        }
    }
    log(msg) {
        this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
    }
    closeEditor() {
        vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.FocusEventHandler = FocusEventHandler;
//# sourceMappingURL=eventHandlers.js.map