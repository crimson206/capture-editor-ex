import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';

export async function saveHTMLToFile(html: string, originalUri: vscode.Uri): Promise<void> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(originalUri);
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }

    const relativePath = path.relative(workspaceFolder.uri.fsPath, originalUri.fsPath);
    const highlightedFolderPath = path.join(workspaceFolder.uri.fsPath, 'highlighted');
    
    // Keep the original extension and add .md
    const newFileName = path.basename(relativePath) + '.md';
    const newFilePath = path.join(highlightedFolderPath, path.dirname(relativePath), newFileName);

    // Ensure the directory exists
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.dirname(newFilePath)));

    try {
        await vscode.workspace.fs.writeFile(vscode.Uri.file(newFilePath), Buffer.from(html, 'utf-8'));
        vscode.window.showInformationMessage(`Highlighted HTML saved to ${newFilePath}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to save file: ${error}`);
    }
}

export async function getFilesInFolder(folderPath: string): Promise<string[]> {
    const files: string[] = [];

    const items = await fs.promises.readdir(folderPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(folderPath, item.name);

        if (item.isDirectory()) {
            // 재귀적으로 하위 폴더의 파일들을 가져옴
            files.push(...await getFilesInFolder(itemPath));
        } else {
            // 파일인 경우 목록에 추가
            files.push(itemPath);
        }
    }

    return files;
}