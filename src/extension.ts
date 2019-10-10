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
			syncShadowTsFileChangesWithVueFile(doc);
		}
	});

	const showFileNotCompatibleWarningMessage = () => vscode
		.window
		.showWarningMessage(`Works only for .vue or .vtpw.ts files`);

	let disposable = vscode.commands.registerCommand('extension.toggleShadowTsFile', async () => {
		const { activeTextEditor } = vscode.window;
		if (!activeTextEditor) {
			showFileNotCompatibleWarningMessage();
			return;
		}

		const activeFileLocation = activeTextEditor.document.fileName;

		if(activeFileLocation.endsWith(SHADOW_TS_FILE_EXTENSION)) {
			removeActiveShadowTsFileAndPositionBackToOriginalVueFile(activeTextEditor);
		} else if (activeFileLocation.endsWith(VUE_FILE_EXTENSION)) {
			createShadowTsFileFromActiveVueFile(activeTextEditor);
		} else {
			showFileNotCompatibleWarningMessage();
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

// Implementations

async function createShadowTsFileFromActiveVueFile(vueFileTextEditor:vscode.TextEditor) {
	const vueFileLocation = vueFileTextEditor.document.fileName;
	const vueFileCursorSelection = vueFileTextEditor.selection;
	const vueFileContent = vueFileTextEditor.document.getText();

	// 1) Comment out vue component tags to get valid TS content
	const validTsFileContent = commentOutVueComponentTags(vueFileContent);

	// 2) Create new shadow TS file next to original vue file
	const tsFileLocation = getShadowTsFileLocationFromVueFile(vueFileLocation);
	await writeFile(tsFileLocation, validTsFileContent);

	// 3) Open newly created TS shadow file
	const tsFileUri = vscode.Uri.file(tsFileLocation);
	await vscode.window.showTextDocument(tsFileUri);

	// 4) Set cursor position of ts file to last cursor position of vue file
	setCursorPositionOfActiveFileTo(vueFileCursorSelection);
}

async function removeActiveShadowTsFileAndPositionBackToOriginalVueFile(shadowTsFileTextEditor:vscode.TextEditor) {
	const tsFileCursorPosition = shadowTsFileTextEditor.selection;
	const tsFileLocation = shadowTsFileTextEditor.document.fileName;

	// 1) Save TS file
	await shadowTsFileTextEditor.document.save();

	// 2) Remove TS file
	removeFileIfExists(tsFileLocation);

	// 3) Open original vue file
	const vueFileLocation = getVueFileLocationFromShadowTsFile(tsFileLocation);
	const vueFileUri = vscode.Uri.file(vueFileLocation);
	await vscode.window.showTextDocument(vueFileUri);

	// 4) Set cursor position of vue file to last cursor position of shadow TS file
	setCursorPositionOfActiveFileTo(tsFileCursorPosition);
}

async function syncShadowTsFileChangesWithVueFile(tsFile:vscode.TextDocument) {
	const tsFileContent = tsFile.getText();
	const validVueFileContent = revertCommentingOutOfVueTags(tsFileContent);
	const vueFileLocation = getVueFileLocationFromShadowTsFile(tsFile.fileName);
	return writeFile(vueFileLocation, validVueFileContent);
}
