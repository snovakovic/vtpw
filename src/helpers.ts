import * as fs from 'fs';
import * as vscode from 'vscode';

export const SHADOW_TS_FILE_EXTENSION = '.vtpw.ts';
export const VUE_FILE_EXTENSION = '.vue';

// VS Code plugin helpers

export function mirorCursorAndScrollPosition({ from, to } : {
  from:vscode.TextEditor,
  to?:vscode.TextEditor,
}) {
  if (!to) {
    return;
  }

  to.selection = new vscode.Selection(
    from.selection.anchor,
    from.selection.active,
  );

  to.revealRange(last(from.visibleRanges));
}

export function showFileNotCompatibleWarningMessage() {
  vscode
    .window
    .showWarningMessage(`Works only in ${VUE_FILE_EXTENSION} or ${SHADOW_TS_FILE_EXTENSION} files`);
}

// File system helpers

export function getVueFileLocationFromShadowTsFile(tsFileLocation:string) {
  return `${tsFileLocation
      .replace(SHADOW_TS_FILE_EXTENSION, VUE_FILE_EXTENSION)}`;

}

export function getShadowTsFileLocationFromVueFile(vueFileLocation:string) {
  return `${vueFileLocation.replace(VUE_FILE_EXTENSION, SHADOW_TS_FILE_EXTENSION)}`;
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

// Formating code helpers

export function commentOutVueComponentTags(vueFile:string) {
  // TODO: improve with regex to be more flexible

  return replaceLastOccuranceOfString(vueFile, '</template>', '</template>*/')
    .replace('<template>', '/*<template>')
    // NOTE: can be multiple style tags on page
    .replace(new RegExp('<style', 'g'), '/*<style')
    .replace(new RegExp('</style>', 'g'), '</style>*/')
    .replace('<script lang="ts">', '/*<script lang="ts">*/')
    .replace('</script>', '/*</script>*/');
}

export function revertCommentingOutOfVueTags(tsFile:string) {
    // TODO: improve with regex to be more flexible
  return tsFile
    .replace('/*<template>', '<template>')
    .replace('</template>*/', '</template>')
    // NOTE: can be multiple style tags on page
    .replace('/*<style', '<style')
    .replace('</style>*/', '</style>')
    .replace('/*<style', '<style')
    .replace('</style>*/', '</style>')
    // TODO: regex not working look into why??
    // .replace(new RegExp('\/\*<style', 'g'), '<style')
    // .replace(new RegExp('<\/style>\*\/', 'g'), '</style>')
    .replace('/*<script lang="ts">*/', '<script lang="ts">')
    .replace('/*</script>*/', '</script>');
}

// General helpers

export const last = (arr:any[]) => arr[arr.length -1];

export function replaceLastOccuranceOfString(text:string, oldWord:string, newWord:string) {
  var idx = text.lastIndexOf(oldWord);

  // slice the string in 2, one from the start to the lastIndexOf
  // and then replace the word in the rest
  if(idx !== -1) {
    text = text.slice(0, idx) + text.slice(idx).replace(oldWord, newWord);
  }

  return text;
}
