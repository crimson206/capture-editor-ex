import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';

async function saveClipboard(): Promise<string> {
    return await vscode.env.clipboard.readText();
}

async function restoreClipboard(text: string): Promise<void> {
    await vscode.env.clipboard.writeText(text);
}

function selectAllText(): void {
    vscode.commands.executeCommand('editor.action.selectAll');
}

function copyWithSyntaxHighlighting(): void {
    vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
}

function cancelSelection(): void {
    vscode.commands.executeCommand('cancelSelection');
}

function createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
    const webview = vscode.window.createWebviewPanel('copyHTML', 'Copy HTML', vscode.ViewColumn.One, {
        enableScripts: true
    });

    const htmlUri = path.resolve(context.extensionPath, 'webview/html/get-html.html');
    let htmlContent = fs.readFileSync(htmlUri, 'utf-8');

    const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'webview-dist', 'script.js'));
    const scriptUri = webview.webview.asWebviewUri(scriptPathOnDisk);

    webview.webview.html = htmlContent.replace('${scriptUri}', scriptUri.toString());

    return webview;
}

async function getHighlightedHTMLFromWebview(webview: vscode.WebviewPanel): Promise<string> {
    return new Promise<string>((resolve) => {
        webview.webview.onDidReceiveMessage((message) => {
            if (message.command === 'sendHighlightedHTML') {
                resolve(message.result);
            }
        });

        webview.webview.postMessage({ command: 'requestHighlightedHTML' });
    });
}

export async function fetchActiveEditorHTML(context: vscode.ExtensionContext): Promise<string> {
    const originalClipboard = await saveClipboard();

    selectAllText();
    copyWithSyntaxHighlighting();
    cancelSelection();

    const webview = createWebviewPanel(context);
    const highlightHTML = await getHighlightedHTMLFromWebview(webview);

    if (webview) {
        webview.dispose();
    }
    await restoreClipboard(originalClipboard);

    return highlightHTML;
}

export async function fetchSelectedHTML(context: vscode.ExtensionContext): Promise<string> {
    const originalClipboard = await saveClipboard();

    copyWithSyntaxHighlighting();

    const webview = createWebviewPanel(context);
    const highlightHTML = await getHighlightedHTMLFromWebview(webview);

    if (webview) {
        webview.dispose();
    }
    await restoreClipboard(originalClipboard);

    return highlightHTML;
}