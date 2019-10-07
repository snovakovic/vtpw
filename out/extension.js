"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.vtpw', () => __awaiter(this, void 0, void 0, function* () {
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
        const tsFileDocument = yield workspace.openTextDocument(tsFile);
        vscode.window.showTextDocument(tsFileDocument);
        workspace.onDidSaveTextDocument((doc) => {
            console.log('text documetn saved');
        });
        // Display a message box to the user
        vscode.window.showInformationMessage(`Folder created ${vscode.workspace.rootPath}`);
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map