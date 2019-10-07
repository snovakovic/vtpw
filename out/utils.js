"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = (arr) => arr[arr.length - 1];
function commentOutVueComponentTags(vueFile) {
    // TODO: improve with regex to be more flexible
    return vueFile
        .replace('<template>', '/*vtpw<template>')
        .replace('</template>', '</template>vtpw*/')
        .replace('<style', '/*vtpw<style')
        .replace('</style>', '</style>vtpw*/')
        .replace('<script lang="ts">', '/*vtpw<script lang="ts">vtpw*/')
        .replace('</script>', '/*vtpw</script>vtpw*/');
}
exports.commentOutVueComponentTags = commentOutVueComponentTags;
function revertCommentingOutOfVueTags(tsFile) {
    // TODO: improve with regex to be more flexible
    return tsFile
        .replace('/*vtpw<template>', '<template>')
        .replace('</template>vtpw*/', '</template>')
        .replace('/*vtpw<style', '<style')
        .replace('</style>vtpw*/', '</style>')
        .replace('/*vtpw<script lang="ts">vtpw*/', '<script lang="ts">')
        .replace('/*vtpw</script>vtpw*/', '</script>');
}
exports.revertCommentingOutOfVueTags = revertCommentingOutOfVueTags;
//# sourceMappingURL=utils.js.map