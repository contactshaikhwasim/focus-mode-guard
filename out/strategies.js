"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationContext = exports.FolderNameStrategy = exports.FileNameStrategy = void 0;
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
class FileNameStrategy {
    validate(input, filePath) {
        if (input === path.basename(filePath)) {
            return { action: 'temp_open' };
        }
        return { action: 'invalid' };
    }
}
exports.FileNameStrategy = FileNameStrategy;
class FolderNameStrategy {
    validate(input, filePath) {
        const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!root)
            return { action: 'invalid' };
        let currentDir = path.dirname(filePath);
        while (currentDir !== root && currentDir !== path.dirname(root)) {
            if (path.basename(currentDir) === input) {
                try {
                    if (fs.statSync(currentDir).isDirectory()) {
                        return { action: 'add', pathToAdd: currentDir };
                    }
                }
                catch (e) {
                    // Ignore, treat as invalid
                }
            }
            currentDir = path.dirname(currentDir);
        }
        return { action: 'invalid' };
    }
}
exports.FolderNameStrategy = FolderNameStrategy;
class ValidationContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    validate(input, filePath) {
        return this.strategy.validate(input, filePath);
    }
}
exports.ValidationContext = ValidationContext;
//# sourceMappingURL=strategies.js.map