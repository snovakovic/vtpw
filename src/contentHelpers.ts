import * as vscode from 'vscode';
import { replaceLastOccuranceOfString, last } from './utils';

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
