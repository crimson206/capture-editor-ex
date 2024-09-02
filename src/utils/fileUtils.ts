import * as vscode from 'vscode';
import path from 'path';

export async function saveHTMLToFile(html: string, originalUri: vscode.Uri): Promise<void> {
    const originalFilePath = originalUri.fsPath;
    const originalFileName = path.basename(originalFilePath);
    const originalExtension = path.extname(originalFilePath);
    const originalNameWithoutExt = path.basename(originalFilePath, originalExtension);
    
    const newFileName = `${originalNameWithoutExt}${originalExtension}_highlighted.md`;
    const savePath = path.join(path.dirname(originalFilePath), newFileName);

    try {
        await vscode.workspace.fs.writeFile(vscode.Uri.file(savePath), Buffer.from(html, 'utf-8'));
        vscode.window.showInformationMessage(`Highlighted HTML saved to ${savePath}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to save file: ${error}`);
    }
}