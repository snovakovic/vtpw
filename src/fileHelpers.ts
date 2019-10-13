import * as vscode from 'vscode';
import * as fs from 'fs';

export const SHADOW_TS_FILE_EXTENSION = '.vtpw.ts';
export const VUE_FILE_EXTENSION = '.vue';

export function showFileNotCompatibleWarningMessage() {
  vscode
    .window
    .showWarningMessage(`Works only in ${VUE_FILE_EXTENSION} or ${SHADOW_TS_FILE_EXTENSION} files`);
}

export function getVueFileLocationFromShadowTsFile(tsFileLocation:string) {
  return `${tsFileLocation
      .replace(SHADOW_TS_FILE_EXTENSION, VUE_FILE_EXTENSION)}`;
}

export function getShadowTsFileLocationFromVueFile(vueFileLocation:string) {
  return `${vueFileLocation.replace(VUE_FILE_EXTENSION, SHADOW_TS_FILE_EXTENSION)}`;
}

export function isVueFile(path:string) {
  return path.endsWith(VUE_FILE_EXTENSION);
}

export function isShadowTsFile(path:string) {
  return path.endsWith(SHADOW_TS_FILE_EXTENSION);
}

export async function findAllShadowTsFilesInProject() {
  return vscode.workspace.findFiles(`**/*${SHADOW_TS_FILE_EXTENSION}`);
}

export function removeFileIfExists(location:string) {
  fs.stat(location, (err) => {
    if (!err) {
      fs.unlink(location, () => {});
    }
  });
}

export function writeFile(path:string, content:string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}
