import * as vscode from 'vscode';
import * as fs from 'fs';
import { last } from './utils';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.vtpw', async () => {
		const { activeTextEditor } = vscode.window;
		const { workspace } = vscode;

		if (!activeTextEditor || !workspace || !workspace.workspaceFolders) {
			vscode.window.showWarningMessage(`No active .vue files`);
			return;
		}
		const activeFileLocation = activeTextEditor.document.fileName;

		if (!activeFileLocation.endsWith('.vue')) {
			vscode.window.showWarningMessage(`Works only for .vue single file components`);
			return;
		}

		const activeFileName = last(activeFileLocation.split('/'));
		vscode.window.showInformationMessage(`active file => ${activeFileLocation}`);

		const activeFileContent = activeTextEditor.document.getText();

		// TODO: rootPath is depricated (can have multiple workspace)
		// Maybe best to pick based on activeFileName??
		var dir = `${workspace.rootPath}/vtpw_temp`;
		// TODO convert to async asn use fsStat (as exists is depricated)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		// TODO change to async version
		const tsFile = `${dir}/${activeFileName.replace('vue', '.vtpw.ts')}`;
		fs.copyFileSync(activeFileLocation, tsFile);

		const tsFileDocument = await workspace.openTextDocument(tsFile);
		vscode.window.showTextDocument(tsFileDocument);

		workspace.onDidSaveTextDocument((doc) => {
			console.log('text documetn saved');
		});

		// Display a message box to the user
		vscode.window.showInformationMessage(`Folder created ${vscode.workspace.rootPath}`);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
