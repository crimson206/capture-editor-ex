import * as vscode from 'vscode';
import path from 'path';

export async function saveHTMLToFile(html: string, originalUri: vscode.Uri): Promise<void> {
    const originalFilePath = originalUri.fsPath;
    const originalFileName = path.basename(originalFilePath);
    const originalExtension = path.extname(originalFilePath);
    const originalNameWithoutExt = path.basename(originalFilePath, originalExtension);
    
    const newFileName = `${originalNameWithoutExt}${originalExtension}_highlighted.html`;
    const savePath = path.join(path.dirname(originalFilePath), newFileName);

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${originalFileName} - Highlighted</title>
</head>
<body>
    ${html}
</body>
</html>`;

    try {
        await vscode.workspace.fs.writeFile(vscode.Uri.file(savePath), Buffer.from(fullHtml, 'utf-8'));
        vscode.window.showInformationMessage(`Highlighted HTML saved to ${savePath}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to save file: ${error}`);
    }
}