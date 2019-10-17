<p align="center">
  <img 
       src="https://raw.githubusercontent.com/snovakovic/vtpw/master/logo.png" 
       alt="logo"
       width="150"
   />
</p>

# **V**etur **T**ypeScript **P**erformance **W**orkaround

Plugin is crated to mitigate performance issues of popular vetur plugin when `.vue` single file components are used in combination with TypeScript.

You can check more about performance issues on some of dedicated issues opened in vetur project:

* https://github.com/vuejs/vetur/issues/1051
* https://github.com/vuejs/vetur/issues/784
* https://github.com/vuejs/vetur/issues/547

## Features

Main feature of this plugin is to enable quick seamless toggling between `.vue` single file components and "shadow" `.vtpw.ts` files without losing any context. All the change done in shadow `.vtpw.ts` file will be synced back to original `.vue` file on save.

The reason to toggle from `.vue` to `.vtpw.ts` is to get the same VS Code editor experiance as when working with any other TS file. No more performance issues, lagging or incomplete autocomple that occure in `.vue` single files components due to vetur. Check the gif's below to see comparison of typing same code in `.vue` and `.vtpw.ts` file

## Usage

It's recomended to add `*.vtpw.ts` to `.gitignore` to avoid shadow ts files showing up in git changes and to avoid unintentional commit of those files to source controll.

Default shortcut to toggle between `.vue` and `.vtwp.ts` files is `ctrl+a+,`

#### Programming in `.vue` file (example 1)

In gif below we are trying to create `user` computed property with `IUser` interface, As you can noticed we need to manually import dependencies as editor is not doing that for us (as it should). You can also notice that other intelisense features are eather slow or limited. 

![preview](https://raw.githubusercontent.com/snovakovic/vtpw/master/vue-file.gif)

#### Programming in `.vtpw.ts` file (example 2)

In here we are trying to do the same thing as in first example but this time before starting to type anything to `.vue` file we press `ctrl+alt-,` shortcut to position us to shadow `vtpw.ts` file (as you can notice we haven't lost any context by doing so)

Now the developer experiance is much more enjojable with VS Code auto importing dependencies and live suggestions showing up without any lagging. 

![preview](https://raw.githubusercontent.com/snovakovic/vtpw/master/vtpw.gif)


## Extension Settings

* `vtpw.toggleShadowTsFile`: Default shortcut `ctrl+alt+,`. If triggered while in `.vue` file
it will crate new shadow `.vtpw.ts` file (and bring focus to it) that on save will sync changes back to original vue file.
If same command is triggered while in `.vtpw.ts` file it will save changes (if any) remove that file from disk
and bring back focus to original `.vue` file.

* `vtpw.removeShadowTsFiles`: Removes all shadow `.vtpw.ts` files from project (if any). For now shadow files are removed only
by triggering `vtpw.toggleShadowTsFile` when in shadow TS file. It's in plan to do automated cleaning of those files in next version of plugin but for now you can use this command to avoid piling up of `.vtpw.ts` files.

## Known Issues

1) At the time of wiritng there is no auto cleaning/removing of shadow `vtpw.ts` files from the project/disk when they are not longer used. If you press toggle shortcut `ctrl+alt+,`. while in `.vtpw.ts` file it will be removed from the disk. But if you don't toggle back to original `vue` file from `.vtpw.ts` that won't happen. As a workaround for now you can invoke `vtpw.removeShadowTsFiles` command. 

## Release Notes

### 0.0.1

Initial release.
