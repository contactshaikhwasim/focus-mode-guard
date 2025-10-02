import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export interface ValidationResult {
  action: 'temp_open' | 'add' | 'invalid';
  pathToAdd?: string;
}

export interface ValidationStrategy {
  validate(input: string, filePath: string): ValidationResult;
}

export class FileNameStrategy implements ValidationStrategy {
  validate(input: string, filePath: string): ValidationResult {
    if (input === path.basename(filePath)) {
      return { action: 'temp_open' };
    }
    return { action: 'invalid' };
  }
}

export class FolderNameStrategy implements ValidationStrategy {
  validate(input: string, filePath: string): ValidationResult {
    const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!root) return { action: 'invalid' };

    let currentDir = path.dirname(filePath);
    while (currentDir !== root && currentDir !== path.dirname(root)) {
      if (path.basename(currentDir) === input) {
        try {
          if (fs.statSync(currentDir).isDirectory()) {
            return { action: 'add', pathToAdd: currentDir };
          }
        } catch (e) {
          // Ignore, treat as invalid
        }
      }
      currentDir = path.dirname(currentDir);
    }
    return { action: 'invalid' };
  }
}

export class ValidationContext {
  private strategy: ValidationStrategy;

  constructor(strategy: ValidationStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: ValidationStrategy) {
    this.strategy = strategy;
  }

  public validate(input: string, filePath: string): ValidationResult {
    return this.strategy.validate(input, filePath);
  }
}