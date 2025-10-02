"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusFocusCommand = exports.DisableFocusCommand = exports.EnableFocusCommand = void 0;
// src/commands.ts
const vscode = require("vscode");
class EnableFocusCommand {
    constructor(focusManager, outputChannel) {
        this.focusManager = focusManager;
        this.outputChannel = outputChannel;
        this.disposable = vscode.commands.registerCommand('focusMode.enable', () => this.execute());
    }
    async execute() {
        try {
            const options = {
                canSelectMany: true,
                canSelectFiles: true,
                canSelectFolders: true,
                openLabel: 'Select for Focus Mode',
                title: 'Select Files/Folders for Focus Mode'
            };
            const uris = await vscode.window.showOpenDialog(options);
            if (!uris || uris.length === 0)
                return;
            const paths = uris.map(uri => uri.fsPath);
            this.focusManager.enable(paths);
            vscode.window.showInformationMessage('Focus Mode enabled.');
            this.log(`Enabled with paths: ${JSON.stringify(paths)}`);
        }
        catch (e) {
            this.log(`Error enabling: ${e}`);
            vscode.window.showErrorMessage('Failed to enable Focus Mode.');
        }
    }
    log(msg) {
        this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.EnableFocusCommand = EnableFocusCommand;
class DisableFocusCommand {
    constructor(focusManager, outputChannel) {
        this.focusManager = focusManager;
        this.outputChannel = outputChannel;
        this.disposable = vscode.commands.registerCommand('focusMode.disable', () => this.execute());
    }
    execute() {
        try {
            this.focusManager.disable();
            vscode.window.showInformationMessage('Focus Mode disabled.');
            this.log('Disabled');
        }
        catch (e) {
            this.log(`Error disabling: ${e}`);
            vscode.window.showErrorMessage('Failed to disable Focus Mode.');
        }
    }
    log(msg) {
        this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.DisableFocusCommand = DisableFocusCommand;
class StatusFocusCommand {
    constructor(focusManager, outputChannel) {
        this.focusManager = focusManager;
        this.outputChannel = outputChannel;
        this.disposable = vscode.commands.registerCommand('focusMode.status', () => this.execute());
    }
    execute() {
        try {
            const status = this.focusManager.getStatus();
            vscode.window.showInformationMessage(status);
            this.log('Status requested: ' + status);
        }
        catch (e) {
            this.log(`Error getting status: ${e}`);
            vscode.window.showErrorMessage('Failed to get Focus Mode status.');
        }
    }
    log(msg) {
        this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.StatusFocusCommand = StatusFocusCommand;
//# sourceMappingURL=commands.js.map