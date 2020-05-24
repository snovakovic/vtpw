<p align="center">
  <img
       src="https://raw.githubusercontent.com/snovakovic/vtpw/master/logo.png"
       alt="logo"
       width="150"
   />
</p>

# **V**etur **T**ypeScript **P**erformance **W**orkaround

This plugin was crated to mitigate performance issues of popular vetur plugin when `.vue` single file components are used in combination with TypeScript.

You can check more about performance issues in vetur project issues:

* https://github.com/vuejs/vetur/issues/1051
* https://github.com/vuejs/vetur/issues/784
* https://github.com/vuejs/vetur/issues/547

## Features

The main feature of this plugin is to enable quick and seamless toggling between `.vue` single file components and "shadow" `.vtpw.ts` files without losing any context. All the changes done in shadow `.vtpw.ts` file will be synced back to original `.vue` file on save.

The reason to toggle from `.vue` to `.vtpw.ts` file is to get the same VS Code editor experience as when working with any other TS file. Without performance issues, lagging or incomplete autocomplete that occur in `.vue` single files components due to vetur plugin. Check the gif below to see comparison of typing same code in `.vue` and `.vtpw.ts` file

## Usage

It's recommended to add `*.vtpw.ts` to `.gitignore` to avoid shadow ts files showing up in git changeset and to avoid unintentional commit of those files to source control.

Default shortcut to toggle between `.vue` and shadow `.vtwp.ts` file is `ctrl+alt+,` (or `cmd+alt+,` on mac)

#### Programming in `.vue` file (example 1)

The first example demonstrates current editor experience when working in `.vue` file. In gif example we are trying to create `user` computed property with `IUser` interface. You can notice that editor is not auto importing dependencies and that intellisense is slow and limited.

![preview](https://raw.githubusercontent.com/snovakovic/vtpw/master/vue-example.gif)

#### Programming in `.vtpw.ts` file (example 2)

In the second example we are trying to do the same thing as in the first example, but this time before starting to type anything in `.vue` file we pressed `ctrl+alt-,` shortcut to position us to shadow `vtpw.ts` file. As you can notice we haven't lost any context by doing so. The editor experience is now much more enjoyable with VS Code auto importing dependencies and suggestions showing up as we type without any lagging.

![preview](https://raw.githubusercontent.com/snovakovic/vtpw/master/vtpw-example.gif)


## Commands

* `vtpw.toggleShadowTsFile`: (default shortcut `ctrl+alt+,` or `cmd+alt+,` on mac)
  * If in `.vue` file it will create shadow `.vtpw.ts` file and focus editor to it (on the same line cursor was position in `.vue` file)
  * If in `.vtpw.ts` file it will save changes in that file, remove that file from the disk and focus editor to original `.vue` file (on the same line cursor was position in `.vtpw.ts` file)

* `vtpw.removeShadowTsFiles`: Removes all shadow `.vtpw.ts` files from project (if any). NOTE: this command will not save unsaved changes in `vtpw.ts` files.

## Known Issues

1) At the time of writing there is no auto cleaning/removing of shadow `vtpw.ts` files from the project/disk when they are no longer used. Shadow ts files are removed form the disk if you toggle from `.vtpw.ts` to `.vue` file with `vtpw.toggleShadowTsFile` command, otherwise they stay on the disk. For now as a workaround you can invoke `vtpw.removeShadowTsFiles` command to remove all shadow `.vtpw.ts` files from the project.

## Release Notes

### 0.0.1

Initial release.

### 0.0.5

Allow using plugin on projects that use template languages thanks to @szkabaroli [contribution](https://github.com/snovakovic/vtpw/pull/2)

### 0.1.0

Fixes issue when there is /**/ type of comments inside of the style tag
https://github.com/snovakovic/vtpw/issues/3

### 0.1.2

Fix restoring cursor and scroll position after moving from shadow vtpw file to .vue file