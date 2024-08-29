import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';

export async function fetchHighlightedHTML(context: vscode.ExtensionContext): Promise<string> {
    const clipboardText = await vscode.env.clipboard.readText();

    vscode.commands.executeCommand('editor.action.selectAll');
    vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
    vscode.commands.executeCommand('cancelSelection');

    /** 
    const webview = vscode.window.createWebviewPanel('codetohtml', 'Code to HTML', vscode.ViewColumn.One, {
        enableScripts: true
    });

    const htmlUri = path.resolve(context.extensionPath, 'webview/html/get-html.html');
    const htmlContent = fs.readFileSync(htmlUri, 'utf-8');
    webview.webview.html = htmlContent;
    */

    const webview = vscode.window.createWebviewPanel('codetohtml', 'Code to HTML', vscode.ViewColumn.One, {
        enableScripts: true
    });

    const htmlUri = path.resolve(context.extensionPath, 'webview/html/get-html.html');
    const htmlContent = fs.readFileSync(htmlUri, 'utf-8');

    const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'webview-dist', 'script.js'));
    const scriptUri = webview.webview.asWebviewUri(scriptPathOnDisk);

    webview.webview.html = htmlContent.replace('${scriptUri}', scriptUri.toString());



    const highlightHTML = await new Promise<string>((resolve) => {
        webview.webview.onDidReceiveMessage((message) => {
            if (message.command === 'sendHighlightedHTML') {
                resolve(message.result);
            }
        });

        webview.webview.postMessage({ command: 'requestHighlightedHTML' });
    });
    
    // webview.dispose();

    await vscode.env.clipboard.writeText(clipboardText);

    return highlightHTML;
}