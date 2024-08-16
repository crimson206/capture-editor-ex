import * as vscode from 'vscode';
import { 
    captureCurrent, 
    captureFiles,
    captureFilesCommandPalette 
} from './commands/editorCapture';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(
        vscode.commands.registerCommand('editor-capture.captureCurrent', () => captureCurrent(context))
    );


    context.subscriptions.push(
        vscode.commands.registerCommand('editor-capture.captureFiles', (filePaths: string[]) => 
            captureFiles(context, filePaths)
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('editor-capture.captureFilesCommandPalette', () => 
            captureFilesCommandPalette (context)
        )
    );
}

export function deactivate() {}