import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';

export async function fetchHighlightedHTMLs(context: vscode.ExtensionContext, filePaths: string[]): Promise<string[]> {
    const results: string[] = [];

    // 현재 클립보드 내용을 백업
    const clipboardText = await vscode.env.clipboard.readText();

    for (const filePath of filePaths) {
        // 파일 열기
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        // 하이라이트된 HTML 가져오기
        vscode.commands.executeCommand('editor.action.selectAll');
        vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
        vscode.commands.executeCommand('cancelSelection');

        const webview = vscode.window.createWebviewPanel('codetohtml', 'Code to HTML', vscode.ViewColumn.One, {
            enableScripts: true
        });

        const htmlUri = path.resolve(context.extensionPath, 'webview/html/get-html.html');
        const htmlContent = fs.readFileSync(htmlUri, 'utf-8');
        webview.webview.html = htmlContent;

        const highlightHTML = await new Promise<string>((resolve) => {
            webview.webview.onDidReceiveMessage((message) => {
                if (message.command === 'sendHighlightedHTML') {
                    resolve(message.result);
                }
            });

            webview.webview.postMessage({ command: 'requestHighlightedHTML' });
        });
        webview.dispose();

        results.push(highlightHTML);
    }

    // 이전 클립보드 내용 복원
    await vscode.env.clipboard.writeText(clipboardText);

    return results;
}
