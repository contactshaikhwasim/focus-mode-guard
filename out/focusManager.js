"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusManager = void 0;
const fs = require("fs");
const path = require("path");
const constants_1 = require("./constants");
class FocusManager {
    constructor(context) {
        this.context = context;
        this.focusList = [];
        this.enabled = false;
        this.outputChannel = null;
        this.loadState();
    }
    static getInstance(context) {
        if (!FocusManager.instance && context) {
            FocusManager.instance = new FocusManager(context);
        }
        if (!FocusManager.instance) {
            throw new Error('FocusManager must be initialized with context.');
        }
        return FocusManager.instance;
    }
    setOutputChannel(channel) {
        this.outputChannel = channel;
    }
    loadState() {
        try {
            this.focusList = this.context.workspaceState.get(constants_1.FOCUS_LIST_KEY, []);
            this.enabled = this.context.workspaceState.get(constants_1.FOCUS_ENABLED_KEY, false);
            this.log('Loaded state: enabled=' + this.enabled + ', list=' + JSON.stringify(this.focusList));
        }
        catch (e) {
            this.log('Error loading state: ' + e);
            this.focusList = [];
            this.enabled = false;
        }
    }
    async saveState() {
        try {
            await this.context.workspaceState.update(constants_1.FOCUS_LIST_KEY, this.focusList);
            await this.context.workspaceState.update(constants_1.FOCUS_ENABLED_KEY, this.enabled);
            this.log('Saved state: enabled=' + this.enabled + ', list=' + JSON.stringify(this.focusList));
        }
        catch (e) {
            this.log('Error saving state: ' + e);
        }
    }
    enable(paths) {
        this.focusList = paths.filter(p => fs.existsSync(p)); // Sanitize: only existing paths
        this.enabled = true;
        this.saveState();
    }
    disable() {
        this.enabled = false;
        this.saveState();
    }
    addToFocus(addPath) {
        if (!fs.existsSync(addPath)) {
            this.log('Attempt to add non-existent path: ' + addPath);
            return;
        }
        if (!this.focusList.includes(addPath)) {
            this.focusList.push(addPath);
            this.saveState();
        }
    }
    isFocusEnabled() {
        return this.enabled;
    }
    allowOpen(filePath) {
        if (!this.enabled)
            return true;
        return this.focusList.some(focus => {
            if (focus === filePath)
                return true;
            try {
                if (fs.statSync(focus).isDirectory() && filePath.startsWith(path.join(focus, path.sep))) {
                    return true;
                }
            }
            catch (e) {
                this.log(`Error checking focus item ${focus}: ${e}`);
            }
            return false;
        });
    }
    getStatus() {
        if (!this.enabled)
            return 'Focus Mode is disabled.';
        return this.focusList.length > 0
            ? 'Focus Mode enabled with: ' + this.focusList.map(p => path.basename(p)).join(', ')
            : 'Focus Mode enabled but no items in focus list.';
    }
    log(msg) {
        if (this.outputChannel) {
            this.outputChannel.appendLine(`[${new Date().toISOString()}] ${msg}`);
        }
    }
}
exports.FocusManager = FocusManager;
FocusManager.instance = null;
//# sourceMappingURL=focusManager.js.map