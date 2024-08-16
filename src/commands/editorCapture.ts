import * as vscode from 'vscode';
import path from 'path';
import { fetchHighlightedHTML } from '../utils/htmlUtils';
import { saveHTMLToFile } from '../utils/fileUtils';
import { fetchHighlightedHTMLs } from './fetchFiles';

export async function captureCurrent(context: vscode.ExtensionContext) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }
    const highlightHtml = await fetchHighlightedHTML(context);
    await saveHTMLToFile(highlightHtml, activeEditor.document.uri);
}

export async function _captureFiles(context: vscode.ExtensionContext, filePaths: string[]) {
    const highlightHtmls = await fetchHighlightedHTMLs(context, filePaths);

    for (let i = 0; i < filePaths.length; i++) {
        await saveHTMLToFile(highlightHtmls[i], vscode.Uri.file(filePaths[i]));
    }

    vscode.window.showInformationMessage(`Captured ${filePaths.length} files successfully`);
}

export async function captureFiles(context: vscode.ExtensionContext, filePaths: string[]) {
    if (!filePaths || filePaths.length === 0) {
        vscode.window.showErrorMessage('No file paths provided');
        return;
    }

    await _captureFiles(context, filePaths);
}

export async function captureFilesCommandPalette (context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    const input = await vscode.window.showInputBox({
        prompt: 'Enter file paths (relative to workspace root, separated by commas)',
        placeHolder: 'e.g., src/file1.ts, src/file2.js, test/file3.py'
    });

    if (!input) {
        vscode.window.showInformationMessage('No file paths entered');
        return;
    }

    const relativePaths = input.split(',').map(p => p.trim());
    const absolutePaths = relativePaths.map(p => path.join(rootPath, p));

    // Validate file existence
    const invalidPaths = absolutePaths.filter(p => !vscode.workspace.fs.stat(vscode.Uri.file(p)));
    if (invalidPaths.length > 0) {
        vscode.window.showErrorMessage(`Some files do not exist: ${invalidPaths.join(', ')}`);
        return;
    }

    await _captureFiles(context, absolutePaths);
}