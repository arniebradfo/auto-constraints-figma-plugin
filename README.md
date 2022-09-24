![Auto Constraints Logo](./src/app/assets/Logo.svg)

# Auto Constraints Figma Plugin
Apply constraints layout automatically based on child placement within parent frame. Similar to how Adobe XD handles constraints in "Responsive Resize: Auto" mode.


## Commands
- **Auto Constrain Selection**: apply Auto Constraints to the selected object
- **Frame and Auto Constrain Selection**: Frame the selected objects and auto constrain to the new frame
- **UnGroup and Auto Constrain Selection**: Ungroup the selected objects and auto constrain children to the new parent frame
- **Watch Mode** *(beta)*: PluginUI to Auto Constrain Selection whenever object selection changes
  - This applies Auto Constraints to every element as it is selected and as it is deselected. 
- Ignore Node: Watch Mode will not apply Auto Constraints to this node. Similar to XD's "Responsive Resize: Manual"


## Set Keyboard Shortcuts on macOS
Auto Constraint commands mimic native Figma commands for Frame (**⎇⌘G**) and Ungroup (**⎇⌘G**). Setting a keybinding will allow you to replace the native commands with this plugin's version. However, you cannot override native Figma keybindings, only make new ones. My preference is to assign the same patterns to the **F** key instead of **G**.
- Navigate to: System Preferences > Keyboard > Shortcuts > App Shortcuts > click "+"
- Select Application: "Figma.app" and set shortcut for plugin commands by pasting in the "Menu Title" in this format: `Plugins->Plugin Name->Plugin Command`
  - Auto Constrain Selection: `Plugins->Auto Constraints->Selection` - **⌘F**
  - Frame and Auto Constrain Selection: `Plugins->Auto Constraints->Frame Selection` - **⎇⌘F**
  - UnGroup and Auto Constrain Selection: `Plugins->Auto Constraints->Ungroup Selection` - **⇧⌘F**

[Read more on Apple support](https://support.apple.com/guide/mac-help/create-keyboard-shortcuts-for-apps-mchlp2271/mac)


## Logic Summary
How Constraints are auto assigned. Works the same way for both x and y dimensions. For more detail read `./src/plugin/auto-constraints.ts`
- if node is centered in parent
  - if node width is greater than 50% of parent width, then **stretch**
  - else **center**
- else node is *not* centered in parent
  - if node edge is close to the parent edge, **pin to edge** (close is 15% of parent width)
  - else **center**
- if both edges are pinned, then **stretch**, 
  - unless one of the following exceptions is met, then **center**
    - node has "Constrain Proportions" set
    - node is a text node with "Auto Width" or "Auto Height" set
    - node is an Auto Layout frame, with "Resizing" is set to "Hug"
    - node is an Auto Layout frame, with "Resizing" is set to "Fixed" and...
        - node has no children with "Resizing" set to "Fill"
        - "Spacing Mode" is *not* set to "Space Between"


## TODO
- remove React if its not necessary
- Watch Mode
  - add "Manual Constraints" setting to watch mode - experiment with auto detecting "Manual Constraints" by inspecting interaction by inspecting pre/post selection differences in Constraints
  - experiment with hiding UI in watch mode