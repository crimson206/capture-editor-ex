import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { fetchActiveEditorHTML, fetchSelectedHTML } from '../utils/htmlUtils';
import { saveHTMLToFile, getFilesInFolder } from '../utils/fileUtils';

export async function captureCurrent(context: vscode.ExtensionContext) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }
    const highlightHtml = await fetchActiveEditorHTML(context);
    await saveHTMLToFile(highlightHtml, activeEditor.document.uri);
}

export async function copySelected(context: vscode.ExtensionContext) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }
    
    if (!activeEditor.selection.isEmpty) {
        const highlightHtml = await fetchSelectedHTML(context);
        await vscode.env.clipboard.writeText(highlightHtml);
        vscode.window.showInformationMessage('Selected text copied as HTML');
    } else {
        vscode.window.showWarningMessage('No text selected');
    }
}

export async function _captureFiles(context: vscode.ExtensionContext, filePaths: string[]) {
    const editors: vscode.TextEditor[] = [];
    let newColumn: vscode.ViewColumn | undefined;

    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        const document = await vscode.workspace.openTextDocument(filePath);
        
        // For the first file, create a new editor group
        if (i === 0) {
            newColumn = vscode.ViewColumn.Beside;
        }

        const editor = await vscode.window.showTextDocument(document, { viewColumn: newColumn, preview: false });
        editors.push(editor);

        // Update newColumn to use the same column for subsequent files
        newColumn = editor.viewColumn;

        const highlightHtml = await fetchActiveEditorHTML(context);
        await saveHTMLToFile(highlightHtml, document.uri);
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

export async function captureFolder(context: vscode.ExtensionContext, folderPath: string) {
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        vscode.window.showErrorMessage('Invalid folder path provided');
        return;
    }

    const filePaths = await getFilesInFolder(folderPath);

    await captureFiles(context, filePaths);
}


export async function captureSelectedFolder(context: vscode.ExtensionContext, folderUri: vscode.Uri) {
    const folderPath = folderUri.fsPath;

    if (!folderPath) {
        vscode.window.showErrorMessage('No folder selected');
        return;
    }

    const filePaths = await getFilesInFolder(folderPath);

    if (filePaths.length === 0) {
        vscode.window.showInformationMessage('No files found in the selected folder');
        return;
    }

    // 사용자에게 캡처할 파일 수를 확인
    const proceed = await vscode.window.showWarningMessage(
        `Are you sure you want to capture ${filePaths.length} files from "${path.basename(folderPath)}"?`,
        'Yes', 'No'
    );

    if (proceed !== 'Yes') {
        return;
    }

    await captureFiles(context, filePaths);
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