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
const utils_1 = require("./utils");
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
        const activeFileContent = activeTextEditor.document.getText();
        const validTsFileContent = utils_1.commentOutVueComponentTags(activeFileContent);
        // Create new .vtpw.ts file next to .vue file
        // Have to be in same location in order for all imports to work as expected
        const tsFileLocation = `${activeFileLocation.replace('.vue', '.vtpw.ts')}`;
        // TODO: change to async version
        fs.writeFileSync(tsFileLocation, validTsFileContent);
        // Bring focus to newly created ts file (TODO: cursor position??)
        const tsFileDocument = yield workspace.openTextDocument(tsFileLocation);
        vscode.window.showTextDocument(tsFileDocument);
        workspace.onDidSaveTextDocument((doc) => {
            console.log('text documetn saved');
        });
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map