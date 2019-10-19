import * as vscode from 'vscode';
import {
	isVueFile,
	isShadowTsFile,
	findAllShadowTsFilesInProject,
	getVueFileLocationFromShadowTsFile,
	getShadowTsFileLocationFromVueFile,
	showFileNotCompatibleWarningMessage,
	removeFileIfExists,
	writeFile,
} from './fileHelpers';
import {
	commentOutVueComponentTags,
	revertCommentingOutOfVueTags,
	mirrorCursorAndScrollPosition,
} from './contentHelpers';

export function activate(context: vscode.ExtensionContext) {
	// Check if we are saving shadow TS file. If we are sync content to the original vue file
	vscode.workspace.onDidSaveTextDocument((doc) => {
		if(isShadowTsFile(doc.fileName)) {
			syncShadowTsFileChangesWithVueFile(doc);
		}
	});

	// Toggle between shadow TS file and vue file
	const toggleShadowTsFileDisposable = vscode.commands.registerCommand('vtpw.toggleShadowTsFile', async () => {
		const { activeTextEditor } = vscode.window;
		if (!activeTextEditor) {
			showFileNotCompatibleWarningMessage();
			return;
		}

		const activeFileLocation = activeTextEditor.document.fileName;

		if(isShadowTsFile(activeFileLocation)) {
			removeActiveShadowTsFileAndPositionBackToOriginalVueFile(activeTextEditor);
		} else if (isVueFile(activeFileLocation)) {
			createShadowTsFileFromActiveVueFile(activeTextEditor);
		} else {
			showFileNotCompatibleWarningMessage();
		}
	});

	// Remove all shadow TS files from project
	let removeShadowTsFilesDisposable = vscode.commands.registerCommand('vtpw.removeShadowTsFiles', async () => {
		const shadowTsFiles = await findAllShadowTsFilesInProject();

		if(!shadowTsFiles.length) {
			vscode.window.showInformationMessage(`No shadow ts files found`);
			return;
		}

		await Promise.all(
			shadowTsFiles.map(file => removeFileIfExists(file.path))
		);

		vscode.window.showInformationMessage(`Removed ${shadowTsFiles.length} shadow ts files`);
	});

	context.subscriptions.push(toggleShadowTsFileDisposable);
	context.subscriptions.push(removeShadowTsFilesDisposable);
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
	mirrorCursorAndScrollPosition({
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
	mirrorCursorAndScrollPosition({
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
