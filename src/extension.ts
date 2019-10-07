import * as vscode from 'vscode';
import * as fs from 'fs';
import { commentOutVueComponentTags } from './utils';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.vtpw', async () => {
		const { activeTextEditor } = vscode.window;
		const { workspace } = vscode;

		if (!activeTextEditor || !workspace || !workspace.workspaceFolders) {
			vscode.window.showWarningMessage(`Works only for .vue files`);
			return;
		}

		const activeFileLocation = activeTextEditor.document.fileName;
		if (!activeFileLocation.endsWith('.vue')) {
			vscode.window.showWarningMessage(`Works only for .vue files`);
			return;
		}

		const activeFileContent = activeTextEditor.document.getText();
		const validTsFileContent = commentOutVueComponentTags(activeFileContent);

		// Create new .vtpw.ts file next to .vue file
		// Have to be in same location in order for all imports to work as expected
		const tsFileLocation = `${activeFileLocation.replace('.vue', '.vtpw.ts')}`;

		// TODO: change to async version
		fs.writeFileSync(tsFileLocation, validTsFileContent);

		// Bring focus to newly created ts file (TODO: cursor position??)
		const tsFileDocument = await workspace.openTextDocument(tsFileLocation);
		vscode.window.showTextDocument(tsFileDocument);

		workspace.onDidSaveTextDocument((doc) => {
			console.log('text documetn saved');
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
