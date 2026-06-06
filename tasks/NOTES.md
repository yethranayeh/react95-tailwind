# Agent Notes

## Current Progress (as of 2026-06-06)

Tasks 01, 02, 03, 04, and 05 are completed. The project has pivoted to Shadcn conventions for component authoring.

### Completed Tasks Recap:
- **Task 01**: Project scaffold, dependencies, and configuration.
- **Task 02**: Theme tokens migrated to CSS custom properties and Tailwind `@theme`.
- **Task 03**: Style engine rewritten as Tailwind utility classes (borders, hatched backgrounds, etc.).
- **Task 04**: Migrate the `Frame` component (using CVA/cn).
- **Task 05**: Migrate the `Button` component (using CVA/cn).

### Next Steps:
- **Task 06**: Migrate Simple Components (Anchor, Separator, Handle, Toolbar, Hourglass, Avatar, Monitor).
  - **Reference**: `tasks/phase-3-components/06-simple-batch.md`.
- **Task 07**: Migrate Form Components (TextInput, Radio, Checkbox, GroupBox, Select, Slider).
  - **Reference**: `tasks/phase-3-components/07-form-components.md`.

## Key Information for Future Agents:
- **Shadcn Conventions**: ALL new components MUST follow the Shadcn-style authoring pattern:
  - Use `class-variance-authority` (CVA) for managing component variants.
  - Use the `cn` utility (`src/common/utils/index.ts`) for merging classes.
  - Use `React.forwardRef` for all components.
  - Implement the `as` polymorphic prop for element/component injection.
  - The incoming `className` prop must always be merged last using `cn`.
- **Style Engine Mapping**: `src/common/styleEngine.ts` contains `borderStyleMap` which maps old `BorderStyles` to the new Tailwind classes (e.g., `window` -> `border-window`).
- **Tailwind v4 @theme**: Custom colors and shadows are defined in `src/global.css` using CSS custom properties prefixed with `--t-` (for switchable tokens) which are then mapped to `--color-*` in the `@theme` block.
- **Theme Switching**: Handled by setting `data-theme` on the root element. `src/TailwindTheme/ThemeProvider.tsx` provides a React context for this.
- **`StyledButton` Alias**: Remember to maintain `StyledButton` as an exported alias for the `Button` component, as legacy CSS selectors might depend on it.
- **Circular References**: Avoid using Tailwind theme variables (e.g., `--color-canvas`) inside the `@theme` block itself to define other variables if it causes circularity. Use the underlying CSS custom properties (e.g., `--t-canvas`) instead.
