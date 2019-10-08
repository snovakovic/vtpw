import * as fs from 'fs';

export const last = <T>(arr:T[]) => arr[arr.length - 1];

export function removeFileIfExists(location:string) {
  fs.stat(location, (err) => {
    if (!err) {
      fs.unlink(location, () => {});
    }
  });
}

// TODO: js-flock??
export function promisify(fn:any) {
  return function(this:any, ...args:any[]) {
    return new Promise((resolve, reject) => {
      args.push((err:any, ...result:any[]) => {
        if (err) {
          return reject(err);
        }

        return resolve(result[0]);
      });

      fn.apply(this, args);
    });
  };
}

export function commentOutVueComponentTags(vueFile:string) {
  // TODO: improve with regex to be more flexible
  return vueFile
    .replace('<template>', '/*vtpw<template>')
    .replace('</template>', '</template>vtpw*/')
    .replace('<style', '/*vtpw<style')
    .replace('</style>', '</style>vtpw*/')
    .replace('<script lang="ts">', '/*vtpw<script lang="ts">vtpw*/')
    .replace('</script>', '/*vtpw</script>vtpw*/');
}

export function revertCommentingOutOfVueTags(tsFile:string) {
    // TODO: improve with regex to be more flexible
  return tsFile
    .replace('/*vtpw<template>', '<template>')
    .replace('</template>vtpw*/', '</template>')
    .replace('/*vtpw<style', '<style')
    .replace('</style>vtpw*/', '</style>')
    .replace('/*vtpw<script lang="ts">vtpw*/', '<script lang="ts">')
    .replace('/*vtpw</script>vtpw*/', '</script>');
}
