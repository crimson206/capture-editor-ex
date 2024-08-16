import * as vscode from 'vscode';
import * as yaml from 'js-yaml';

export interface Command {
    command: string;
    args?: any[];
}

export interface RunConfig {
    execute: boolean;
    vscode: Command[];
}

export async function parseRunConfig(uri: vscode.Uri): Promise<RunConfig> {
    try {
        const content = await vscode.workspace.fs.readFile(uri);
        const config = yaml.load(content.toString()) as RunConfig;
        return {
            execute: config.execute || false,
            vscode: Array.isArray(config.vscode) ? config.vscode : []
        };
    } catch (error) {
        vscode.window.showErrorMessage(`Error parsing run.vscode: ${error}`);
        return { execute: false, vscode: [] };
    }
}

export async function deactivateRunVSCode(uri: vscode.Uri, value: boolean) {
    try {
        const config = await parseRunConfig(uri);
        config.execute = value;

        const yamlString = yaml.dump(config);
        await vscode.workspace.fs.writeFile(uri, Buffer.from(yamlString));

        vscode.window.showInformationMessage(`File updated: ${uri.fsPath}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Error updating execute flag: ${error}`);
    }
}