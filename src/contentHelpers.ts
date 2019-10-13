import * as vscode from 'vscode';

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

export function commentOutVueComponentTags(vueFileContent:string) {
  return vueFileContent
    // Comment out first occurenace of <template> tag allowing spaces as e.g < template >
    .replace(/(<\s*template\s*>)/, '/*$1')
    // Comment out last occurance of </template> tag allowing spaces as e.g </ template>
    .replace(/(<\s*\/\s*template\s*>)(?![\s\S]*<\s*\/\s*template\s*>)/, '$1*/')
    // Comment out first occurenace of <script **> tag allowing spaces any any text after script
    // as e.g <script lang="ts">
    .replace(/(<\s*script ?.*>)/, '/*$1')
    // Comment out first occurenace of </script> tag allowing spaces
    .replace(/(<\s*\/\s*script\s*>)/, '$1*/')
    // Comment out all occurenace of <style **> tag allowing spaces any any text after stle
    // as e.g <script lang="scss" scoped>
    .replace(/(<\s*style ?.*>)/g, '/*$1')
    // Comment out all occurenace of </style> tag allowing spaces
    .replace(/(<\s*\/\s*style\s*>)/g, '$1*/');
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

// Helpers

function last(arr:any[]) {
  return arr[arr.length -1];
}
