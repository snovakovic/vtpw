<p align="center">
  <img 
       src="https://raw.githubusercontent.com/snovakovic/vtpw/master/logo.png" 
       alt="logo"
       width="150"
   />
</p>

# **V**etur **T**ypeScript **P**erformance **W**orkaround

This plugin was crated to mitigate performance issues of popular vetur plugin when `.vue` single file components are used in combination with TypeScript.

You can check more about performance issues on some of dedicated issues opened in vetur project:

* https://github.com/vuejs/vetur/issues/1051
* https://github.com/vuejs/vetur/issues/784
* https://github.com/vuejs/vetur/issues/547

## Features

The main feature of this plugin is to enable quick and seamless toggling between `.vue` single file components and "shadow" `.vtpw.ts` files without losing any context. All the changes done in shadow `.vtpw.ts` file will be synced back to original `.vue` file on save.

The reason to toggle from `.vue` to `.vtpw.ts` is to get the same VS Code editor experience as when working with any other TS file. No more performance issues, lagging or incomplete autocomple that occur in `.vue` single files components due to vetur plugin. Check the gif's below to see comparison of typing same code in `.vue` and `.vtpw.ts` file

## Usage

It's recommended to add `*.vtpw.ts` to `.gitignore` to avoid shadow ts files showing up in git changeset and to avoid unintentional commit of those files to source controll.

Default shortcut to toggle between `.vue` and `.vtwp.ts` files is `ctrl+a+,`

#### Programming in `.vue` file (example 1)

In gif below we are trying to create `user` computed property with `IUser` interface, As you can noticed we need to manually import dependencies as editor is not doing that for us (as it should). You can also notice that other intellisense features are either slow or limited. 

![preview](https://raw.githubusercontent.com/snovakovic/vtpw/master/vue-file.gif)

#### Programming in `.vtpw.ts` file (example 2)

In here we are trying to do the same thing as in the first example, but this time before starting to type anything in `.vue` file we press `ctrl+alt-,` shortcut to position us to shadow `vtpw.ts` file (as you can notice we haven't lost any context by doing so)

Now the developer experience is much more enjoyable with VS Code auto importing dependencies and suggestions showing up as we type without any lagging. 

![preview](https://raw.githubusercontent.com/snovakovic/vtpw/master/vtpw.gif)


## Commands

* `vtpw.toggleShadowTsFile`: (default shortcut `ctrl+alt+,`)
  * If in `.vue` file it will create shadow `.vtpw.ts` file and focus editor to it (on the same line cursor was position in `.vue` file)
  * If in `.vtpw.ts` file it will save changes in that file, remove that file from the disk and focus editor to original `.vue` file (on the same line curso was position in `.vtpw.ts` file)

* `vtpw.removeShadowTsFiles`: Removes all shadow `.vtpw.ts` files from project (if any). NOTE: this command will not save usaved changes in `vtpw.ts` files. 

## Known Issues

1) At the time of wiritng there is no auto cleaning/removing of shadow `vtpw.ts` files from the project/disk when they are no longer used. If you toggle from `.vtpw.ts` to `.vue` file with `vtpw.toggleShadowTsFile`it will be removed from the disk but if you don't do that those shadow fils will stay on disk. For now as a workaround you can invoke `vtpw.removeShadowTsFiles` command to remove all shadow `.vtpw.ts` files from the project.  

## Release Notes

### 0.0.1

Initial release.
