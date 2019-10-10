import * as vscode from 'vscode';
import {
	commentOutVueComponentTags,
	revertCommentingOutOfVueTags,
	removeFileIfExists,
	writeFile,
} from './helpers';

const SHADOW_TS_FILE_EXTENSION = '.vtpw.ts';
const VUE_FILE_EXTENSION = '.vue';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.vtpw', async () => {
		const { activeTextEditor } = vscode.window;
		const { workspace } = vscode;

		if (!activeTextEditor || !workspace || !workspace.workspaceFolders) {
			vscode.window.showWarningMessage(`Works only for .vue files`);
			return;
		}

		const activeFileLocation = activeTextEditor.document.fileName;

		// If command is executed in shadow .ts file save it, remove it and point back to vue file
		// point back to origi
		if(activeFileLocation.endsWith(SHADOW_TS_FILE_EXTENSION)) {
			removeFileIfExists(activeFileLocation);
			const vueFileLocation = `${activeFileLocation.replace(SHADOW_TS_FILE_EXTENSION, VUE_FILE_EXTENSION)}`;
			const vueFileUri = vscode.Uri.file(vueFileLocation);
			vscode.window.showTextDocument(vueFileUri);
			return; // Stop execution
		}

		if (!activeFileLocation.endsWith(VUE_FILE_EXTENSION)) {
			vscode.window.showWarningMessage(`Works only for .vue files`);
			return;
		}

		const vueFileLocation = activeFileLocation;
		const vueFileContent = activeTextEditor.document.getText();
		const validTsFileContent = commentOutVueComponentTags(vueFileContent);

		// Create new .vtpw.ts file next to .vue file
		// Have to be in same location in order for all imports to work as expected
		const tsFileLocation = `${vueFileLocation.replace(VUE_FILE_EXTENSION, SHADOW_TS_FILE_EXTENSION)}`;
		await writeFile(tsFileLocation, validTsFileContent);

		// Bring focus to newly created ts file (TODO: cursor position??)
		// const tsFileDocument = await workspace.openTextDocument(tsFileLocation);
		const tsFileUri = vscode.Uri.file(tsFileLocation);
		vscode.window.showTextDocument(tsFileUri);

		// On saving shadow ts file sync changes back to vue file
		// TODO: this seams to be called as many times as commadn have been executed time command is called (improve)
		workspace.onDidSaveTextDocument((doc) => {
			if(tsFileLocation === doc.fileName) {
				const tsFileContent = doc.getText();
				const validVueFileContent = revertCommentingOutOfVueTags(tsFileContent);

				writeFile(vueFileLocation, validVueFileContent);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
