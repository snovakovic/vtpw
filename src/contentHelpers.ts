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
    .replace(/(<\s*script ?.*>)/, '/*$1*/')
    // Comment out first occurenace of </script> tag allowing spaces
    .replace(/(<\s*\/\s*script\s*>)/, '/*$1*/')
    // Comment out all occurenace of <style **> tag allowing spaces any any text after stle
    // as e.g <script lang="scss" scoped>
    .replace(/(<\s*style ?.*>)/g, '/*$1')
    // Comment out all occurenace of </style> tag allowing spaces
    .replace(/(<\s*\/\s*style\s*>)/g, '$1*/');
}

export function revertCommentingOutOfVueTags(tsFileContent:string) {
  return tsFileContent
    .replace(/\/\*(<\s*template\s*>)/, '$1')
    .replace(/(<\s*\/\s*template\s*>)(?![\s\S]*<\s*\/\s*template\s*>)\*\//, '$1')
    .replace(/\/\*(<\s*script ?.*>)\*\//, '$1')
    .replace(/\/\*(<\s*\/\s*script\s*>)\*\//, '$1')
    .replace(/\/\*(<\s*style ?.*>)/g, '$1')
    .replace(/(<\s*\/\s*style\s*>)\*\//g, '$1');
}

// Helpers

function last(arr:any[]) {
  return arr[arr.length -1];
}
