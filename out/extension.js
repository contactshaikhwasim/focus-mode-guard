"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// src/extension.ts
const vscode = require("vscode");
const focusManager_1 = require("./focusManager");
const commands_1 = require("./commands");
const eventHandlers_1 = require("./eventHandlers");
const constants_1 = require("./constants");
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel(constants_1.EXTENSION_NAME);
    const focusManager = focusManager_1.FocusManager.getInstance(context);
    focusManager.setOutputChannel(outputChannel);
    const enableCommand = new commands_1.EnableFocusCommand(focusManager, outputChannel);
    const disableCommand = new commands_1.DisableFocusCommand(focusManager, outputChannel);
    const statusCommand = new commands_1.StatusFocusCommand(focusManager, outputChannel);
    const eventHandler = new eventHandlers_1.FocusEventHandler(focusManager, outputChannel);
    context.subscriptions.push(outputChannel, enableCommand, disableCommand, statusCommand, eventHandler);
    outputChannel.appendLine(`[${new Date().toISOString()}] Extension activated`);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map