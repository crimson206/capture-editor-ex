import * as vscode from 'vscode';
import { 
    captureCurrent, 
    captureFiles,
    captureFilesCommandPalette,
    copySelected,
    captureFolder,
    captureSelectedFolder
} from './commands/editorCapture';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(
        vscode.commands.registerCommand('copy-html.captureCurrent', () => captureCurrent(context))
    );


    context.subscriptions.push(
        vscode.commands.registerCommand('copy-html.captureFiles', (filePaths: string[]) => 
            captureFiles(context, filePaths)
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copy-html.captureFilesCommandPalette', () => 
            captureFilesCommandPalette (context)
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copy-html.copySelected', () => copySelected(context))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copy-html.captureFolder', (folderPath: string) => 
            captureFolder(context, folderPath)
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copy-html.captureSelectedFolder', (uri: vscode.Uri) => {
            captureSelectedFolder(context, uri);
        })
    );
}

export function deactivate() {}