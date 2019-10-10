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
	showFileNotCompatibleWarningMessage,
	mirorCursorAndScrollPosition,
} from './helpers';

export function activate(context: vscode.ExtensionContext) {
	// Check if we are saving shadow TS file. If we are sync content to the original vue file
	vscode.workspace.onDidSaveTextDocument((doc) => {
		if(doc.fileName.endsWith(SHADOW_TS_FILE_EXTENSION)) {
			syncShadowTsFileChangesWithVueFile(doc);
		}
	});

	let disposable = vscode.commands.registerCommand('vtpw.toggleShadowTsFile', async () => {
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

// Implementations

async function createShadowTsFileFromActiveVueFile(vueFileTextEditor:vscode.TextEditor) {
	const vueFileLocation = vueFileTextEditor.document.fileName;
	const vueFileContent = vueFileTextEditor.document.getText();

	// 1) Save vue file changes
	await vueFileTextEditor.document.save();

	// 2) Comment out vue component tags to get valid TS content
	const validTsFileContent = commentOutVueComponentTags(vueFileContent);

	// 3) Create new shadow TS file next to original vue file
	const tsFileLocation = getShadowTsFileLocationFromVueFile(vueFileLocation);
	await writeFile(tsFileLocation, validTsFileContent);

	// 4) Open newly created TS shadow file
	const tsFileUri = vscode.Uri.file(tsFileLocation);
	await vscode.window.showTextDocument(tsFileUri);

	// 5) Set cursor and scroll position of ts file to last position of vue file
	mirorCursorAndScrollPosition({
		from: vueFileTextEditor,
		to: vscode.window.activeTextEditor,
	});
}

async function removeActiveShadowTsFileAndPositionBackToOriginalVueFile(shadowTsFileTextEditor:vscode.TextEditor) {
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
	mirorCursorAndScrollPosition({
		from: shadowTsFileTextEditor,
		to: vscode.window.activeTextEditor,
	});
}

async function syncShadowTsFileChangesWithVueFile(tsFile:vscode.TextDocument) {
	const tsFileContent = tsFile.getText();
	const validVueFileContent = revertCommentingOutOfVueTags(tsFileContent);
	const vueFileLocation = getVueFileLocationFromShadowTsFile(tsFile.fileName);
	return writeFile(vueFileLocation, validVueFileContent);
}
