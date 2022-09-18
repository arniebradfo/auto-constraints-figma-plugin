# Auto Constraints Figma Plugin
Apply constraints layout automatically based on child placement within parent frame. Similar to how Adobe XD handles constraints in "Auto Layout" mode.

(Currently in Development)

## Commands
- AutoConstrain All Children
- Frame and AutoConstrain Children
- AutoConstrain Self
- Run Plugin window to AutoConstrain Self onSelectionChange if move or resized

## Pseudo code
- if child centered in parent
  - if childWidth is less than 50% of parentWidth
    - then center
    - else fix both sides
- else if childSide is within 15% of ParentSide
  - then fix side
  - else center side

