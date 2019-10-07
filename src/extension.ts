import * as vscode from 'vscode';
import * as fs from 'fs';

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

		vscode.window.showInformationMessage(`active file => ${activeFileLocation}`);

		// const activeFileContent = activeTextEditor.document.getText();

		// Create new .vtpw.ts file next to .vue file
		// Have to be in same location in order for all imports to work as expected
		const tsFile = `${activeFileLocation.replace('.vue', '.vtpw.ts')}`;

		// TODO: check to async version
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
