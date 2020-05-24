import * as vscode from 'vscode';
import { Range } from 'vscode';

export function getCursorAndScrollPosition(editor:vscode.TextEditor) {
  const visibleRange = last(editor.visibleRanges);

  return {
    selection: new vscode.Selection(
      editor.selection.anchor,
      editor.selection.active,
    ),
    visibleRange: visibleRange && new Range(visibleRange.start, visibleRange.end),
  };
}

export function setCursorAndScrollPosition({ editor, setTo }: {
  editor?: vscode.TextEditor,
  setTo: ReturnType<typeof getCursorAndScrollPosition>,
}) {
  if (editor) {
    editor.selection = setTo.selection;
    editor.revealRange(setTo.visibleRange);
  }
}

export function commentOutVueComponentTags(vueFileContent:string) {
  return vueFileContent
    // Comment out first occurrence of <template **> tag allowing spaces as e.g < template >
    // as e.g <template lang="pug">
    .replace(/(<\s*template ?.*>)/, '/*$1')
    // Comment out last occurrence of </template> tag allowing spaces as e.g </ template>
    .replace(/(<\s*\/\s*template\s*>)(?![\s\S]*<\s*\/\s*template\s*>)/, '$1*/')
    // Comment out first occurrence of <script **> tag allowing spaces any any text after script
    // as e.g <script lang="ts">
    .replace(/(<\s*script ?.*>)/, '/*$1*/')
    // Comment out first occurrence of </script> tag allowing spaces
    .replace(/(<\s*\/\s*script\s*>)/, '/*$1*/')
    // Escape /* some comment */ type of the comments inside of the style tags with 
    // /* some comment *./ so that it don't mess up with commenting whole style section
    // For more info check issue: https://github.com/snovakovic/vtpw/issues/3
    .replace(/(?<=(<\s*style ?.*>)([\s\S]*))(\*\/)(?=([\s\S]*)(<\s*\/\s*style\s*>))/g, "\*.\/")
    // Comment out all occurrence of <style **> tag allowing spaces and any text after style
    // as e.g <script lang="scss" scoped>
    .replace(/(<\s*style ?.*>)/g, '/*$1')
    // Comment out all occurrence of </style> tag allowing spaces
    .replace(/(<\s*\/\s*style\s*>)/g, '$1*/');
}

export function revertCommentingOutOfVueTags(tsFileContent:string) {
  return tsFileContent
    .replace(/\/\*(<\s*template ?.*>)/, '$1')
    .replace(/(<\s*\/\s*template\s*>)(?![\s\S]*<\s*\/\s*template\s*>)\*\//, '$1')
    .replace(/\/\*(<\s*script ?.*>)\*\//, '$1')
    .replace(/\/\*(<\s*\/\s*script\s*>)\*\//, '$1')
    .replace(/(?<=(<\s*style ?.*>)([\s\S]*))(\*.\/)(?=([\s\S]*)(<\s*\/\s*style\s*>))/g, "\*\/")
    .replace(/\/\*(<\s*style ?.*>)/g, '$1')
    .replace(/(<\s*\/\s*style\s*>)\*\//g, '$1');
}

// Helpers

function last<T>(arr:T[]):T {
  return arr[arr.length -1];
}
