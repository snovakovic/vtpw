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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
var fs = require('fs');
const last = (arr) => arr[arr.length - 1];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vetur-typescript-performance-workraound" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.vtpw', () => __awaiter(this, void 0, void 0, function* () {
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
        const tsFile = `${dir}/${activeFileName.replace('vue', 'ts')}`;
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