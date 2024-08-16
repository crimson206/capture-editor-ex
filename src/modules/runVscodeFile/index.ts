import * as vscode from 'vscode';
import { setupFileWatcher } from './fileWatcher';
import { executeCommands } from './commandExecutor';
import { parseRunConfig, deactivateRunVSCode } from './configParser';

export function activateRunVscodeFile(context: vscode.ExtensionContext) {
    setupFileWatcher(context, handleRunVscodeFile);
}

async function handleRunVscodeFile(uri: vscode.Uri) {
    const config = await parseRunConfig(uri);

    if (config.execute) {
        const activeEditor = vscode.window.activeTextEditor;
        
        // Close the run.vscode file if it's open
        for (const editor of vscode.window.visibleTextEditors) {
            if (editor.document.uri.fsPath === uri.fsPath) {
                await vscode.window.showTextDocument(editor.document, editor.viewColumn);
                await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                break;
            }
        }

        // Ensure the original active editor is still active
        if (activeEditor && activeEditor.document.uri.fsPath !== uri.fsPath) {
            await vscode.window.showTextDocument(activeEditor.document, activeEditor.viewColumn);
        }

        // Execute commands
        await executeCommands(config.vscode);

        // Update execute flag
        await deactivateRunVSCode(uri, false);
    }
}


