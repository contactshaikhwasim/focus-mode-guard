# Focus Mode Guard – Multi-Select with Dynamic Override

![Installs](https://img.shields.io/visual-studio-marketplace/i/WasimShaikh.focus-mode-guard)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/WasimShaikh.focus-mode-guard)
![Rating](https://img.shields.io/visual-studio-marketplace/r/WasimShaikh.focus-mode-guard)
![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-3178C6?logo=typescript&logoColor=white)

 - [Download from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)

## Description

This Visual Studio Code extension enforces a focus mode where users can only open pre-selected files or folders. Attempting to open restricted files or folders requires user confirmation by typing the filename or folder name. If another valid file or folder is typed, it is added to the focus list automatically.

## Features

- Enable/Disable Focus Mode
- Manage focus list with multiple entries
- Restrict file opening with modal confirmation
- Dynamic override to add new files/folders
- Persistence across reloads
- Structured logging in Output Channel

## Installation

1. Download the `.vsix` file from the releases or package it yourself.
2. In VS Code, go to Extensions view (Ctrl+Shift+X), click the ... menu, and select "Install from VSIX...".
3. Select the downloaded `.vsix` file.

## Usage

- **Enable Focus Mode**: Run command `Focus Mode Guard: Enable` (Ctrl+Shift+P > Focus Mode Guard: Enable) and select files/folders.
- **Disable Focus Mode**: Run `Focus Mode Guard: Disable`.
- **Check Status**: Run `Focus Mode Guard: Status` to see the current focus list.

## Packaging the Extension

To package the extension for distribution or installation:

1. Ensure you have Node.js installed.
2. Install the VS Code Extension Manager globally: