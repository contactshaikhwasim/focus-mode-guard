# Focus Mode Guard – Multi-Select with Dynamic Override

## Description

This Visual Studio Code extension enforces a focus mode where users can only open pre-selected files or folders. Attempting to open restricted files or folders requires user confirmation by typing the filename or folder name. If another valid file or folder is typed, it is added to the focus list automatically.

The extension follows SRE principles (reliability, observability, resilience, failure isolation) and software design patterns (Singleton, Observer, Command, Strategy).

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

- **Enable Focus Mode**: Run command `Focus Mode: Enable` (Ctrl+Shift+P > Focus Mode: Enable) and select files/folders.
- **Disable Focus Mode**: Run `Focus Mode: Disable`.
- **Check Status**: Run `Focus Mode: Status` to see the current focus list.

## Packaging the Extension

To package the extension for distribution or installation:

1. Ensure you have Node.js installed.
2. Install the VS Code Extension Manager globally: