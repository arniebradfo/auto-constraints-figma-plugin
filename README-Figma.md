Apply constraints layout automatically based on and object's placement within parent frame. Similar to how [Adobe XD handles constraints in "Responsive Resize: Auto" mode](https://helpx.adobe.com/xd/help/using-responsive-resize.html).

For Example, a node in the top right corner of a frame will automatically receive Top, Right constraints.

## Commands

**Auto Constrain Selection**: apply Auto Constraints to the selected object

**Frame and Auto Constrain Selection**: Frame the selected objects and auto constrain to the new frame

**Ungroup and Auto Constrain Selection**: Ungroup the selected objects and auto constrain children to the new parent frame

**Watch Mode** _(beta)_: PluginUI to Auto Constrain Selection whenever object selection changes
- This applies Auto Constraints to every element as it is selected and as it is deselected.
- **Ignore Selection**: Watch Mode will not apply Auto Constraints to this node. Similar to XD's "Responsive Resize: Manual"

## Set Keyboard Shortcuts on macOS
Auto Constraint commands mimic native Figma commands for Frame (**⎇⌘G**) and Ungroup (**⇧⌘G**). Setting a keybinding will allow you to replace the native commands with this plugin's version. However, you cannot override native Figma keybindings, only make new ones. My preference is to assign the same patterns to the **F** key instead of **G**.

1. Navigate to: System Preferences > Keyboard > Shortcuts > App Shortcuts > click "+"
2. Select Application: "Figma.app" and set shortcut for plugin commands by pasting in the "Menu Title" in this format: `Plugins->Plugin Name->Plugin Command`

- Auto Constrain Selection: `Plugins->Auto Constraints->Selection` - **⌃F**
- Frame and Auto Constrain Selection: `Plugins->Auto Constraints->Frame Selection` - **⎇⌘F**
- UnGroup and Auto Constrain Selection: `Plugins->Auto Constraints->Ungroup Selection` - **⇧⌘F**

[Read more on Apple support](https://support.apple.com/guide/mac-help/create-keyboard-shortcuts-for-apps-mchlp2271/mac)

---

[Github Repo](https://github.com/arniebradfo/auto-constraints-figma-plugin)