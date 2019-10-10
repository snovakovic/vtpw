import * as vscode from 'vscode';
import {
	SHADOW_TS_FILE_EXTENSION,
	VUE_FILE_EXTENSION,
	commentOutVueComponentTags,
	revertCommentingOutOfVueTags,
	removeFileIfExists,
	writeFile,
	getVueFileLocationFromShadowTsFile,
	getShadowTsFileLocationFromVueFile,
	setCursorPositionOfActiveFileTo,
} from './helpers';

export function activate(context: vscode.ExtensionContext) {
	// Check if we are saving shadow TS file. If we are sync content to the original vue file
	vscode.workspace.onDidSaveTextDocument((doc) => {
		if(doc.fileName.endsWith(SHADOW_TS_FILE_EXTENSION)) {
			const tsFileContent = doc.getText();
			const validVueFileContent = revertCommentingOutOfVueTags(tsFileContent);
			const vueFileLocation = getVueFileLocationFromShadowTsFile(doc.fileName);
			writeFile(vueFileLocation, validVueFileContent);
		}
	});

	let disposable = vscode.commands.registerCommand('extension.toggleShadowTsFile', async () => {
		const { activeTextEditor } = vscode.window;
		const { workspace } = vscode;

		if (!activeTextEditor || !workspace || !workspace.workspaceFolders) {
			vscode.window.showWarningMessage(`Works only for .vue files`);
			return;
		}

		const activeFileLocation = activeTextEditor.document.fileName;

		// If command is executed in shadow TS file ffirst save it then
		// remove it form disk and focus to original vue file
		if(activeFileLocation.endsWith(SHADOW_TS_FILE_EXTENSION)) {
			const shadowTsFileCursorSelection = activeTextEditor.selection;
			removeFileIfExists(activeFileLocation);
			const vueFileLocation = getVueFileLocationFromShadowTsFile(activeFileLocation);
			const vueFileUri = vscode.Uri.file(vueFileLocation);
			await vscode.window.showTextDocument(vueFileUri);

			setCursorPositionOfActiveFileTo(shadowTsFileCursorSelection);

			return; // Stop execution
		}

		if (!activeFileLocation.endsWith(VUE_FILE_EXTENSION)) {
			vscode.window.showWarningMessage(`Works only in .vue or .vtpw.ts files`);
			return; // Stop execution
		}

		const vueFileLocation = activeFileLocation;
		const vueFileCursorSelection = activeTextEditor.selection;
		const vueFileContent = activeTextEditor.document.getText();
		const validTsFileContent = commentOutVueComponentTags(vueFileContent);

		// Create new .vtpw.ts file next to .vue file
		// Have to be in same location in order for all imports to work as expected
		const tsFileLocation = getShadowTsFileLocationFromVueFile(vueFileLocation);
		await writeFile(tsFileLocation, validTsFileContent);

		// Bring focus to newly created ts file (TODO: cursor position??)
		// const tsFileDocument = await workspace.openTextDocument(tsFileLocation);
		const tsFileUri = vscode.Uri.file(tsFileLocation);
		await vscode.window.showTextDocument(tsFileUri);

		setCursorPositionOfActiveFileTo(vueFileCursorSelection);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
