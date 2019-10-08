import * as vscode from 'vscode';
import * as fs from 'fs';
import {
	commentOutVueComponentTags,
	revertCommentingOutOfVueTags,
	removeFileIfExists,
	promisify,
} from './utils';

const writeFile = promisify(fs.writeFile);

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.vtpw', async () => {
		const { activeTextEditor } = vscode.window;
		const { workspace } = vscode;

		if (!activeTextEditor || !workspace || !workspace.workspaceFolders) {
			vscode.window.showWarningMessage(`Works only for .vue files`);
			return;
		}

		const vueFileLocation = activeTextEditor.document.fileName;
		if (!vueFileLocation.endsWith('.vue')) {
			vscode.window.showWarningMessage(`Works only for .vue files`);
			return;
		}

		const vueFileContent = activeTextEditor.document.getText();
		const validTsFileContent = commentOutVueComponentTags(vueFileContent);

		// Create new .vtpw.ts file next to .vue file
		// Have to be in same location in order for all imports to work as expected
		const tsFileLocation = `${vueFileLocation.replace('.vue', '.vtpw.ts')}`;
		await writeFile(tsFileLocation, validTsFileContent);

		// Bring focus to newly created ts file (TODO: cursor position??)
		// const tsFileDocument = await workspace.openTextDocument(tsFileLocation);
		const tsFileUri = vscode.Uri.file(tsFileLocation);
		vscode.window.showTextDocument(tsFileUri);

		// On saving shadow ts file sync changes back to vue file
		workspace.onDidSaveTextDocument((doc) => {
			if(tsFileLocation === doc.fileName) {
				const tsFileContent = doc.getText();
				const validVueFileContent = revertCommentingOutOfVueTags(tsFileContent);

				writeFile(vueFileLocation, validVueFileContent);
			}
		});

		// On closing shadow ts file remove it from disk
		// TODO: not triggered when closing new file???
		// Maybe on other change check => vscode.window.visibleTextEditors and close if not in list
		// Keeping destroyed flag or something
		workspace.onDidCloseTextDocument((doc) => {
			if(tsFileLocation === doc.fileName) {
				removeFileIfExists(tsFileLocation);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
