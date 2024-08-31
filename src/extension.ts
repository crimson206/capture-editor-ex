import * as vscode from 'vscode';
import { 
    captureCurrent, 
    captureFiles,
    captureFilesCommandPalette 
} from './commands/editorCapture';

export function activate(context: vscode.ExtensionContext) {

    const config = vscode.workspace.getConfiguration('captureEditor');
    const developerMode = config.get<boolean>('developerMode', false);

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

    context.workspaceState.update('developerMode', developerMode);
}

export function deactivate() {}