# Agent Notes

## Current Progress (as of 2026-06-06)

Tasks 01, 02, 03, and 04 are completed. The project structure is set up with Vite, Tailwind v4, and the necessary tokens and style engine utilities.

### Completed Tasks Recap:
- **Task 01**: Project scaffold, dependencies, and configuration.
- **Task 02**: Theme tokens migrated to CSS custom properties and Tailwind `@theme`.
- **Task 03**: Style engine rewritten as Tailwind utility classes (borders, hatched backgrounds, etc.).
- **Task 04**: Migrate the `Frame` component.

### Next Steps:
- **Task 05**: Migrate the `Button` component.
  - **Source**: `src/Button/Button.tsx`.
  - **Status**: Pending.
  - **Reference**: `tasks/phase-2-primitives/05-button.md`.

## Key Information for Future Agents:
- **Style Engine Mapping**: `src/common/styleEngine.ts` contains `borderStyleMap` which maps old `BorderStyles` to the new Tailwind classes (e.g., `window` -> `border-window`).
- **Tailwind v4 @theme**: Custom colors and shadows are defined in `src/global.css` using CSS custom properties prefixed with `--t-` (for switchable tokens) which are then mapped to `--color-*` in the `@theme` block.
- **Theme Switching**: Handled by setting `data-theme` on the root element. `src/TailwindTheme/ThemeProvider.tsx` provides a React context for this.
- **Migration Script**: `src/TailwindTheme/generate-themes.mjs` was used to generate the CSS tokens from the original theme files.
- **`StyledButton` Alias**: Remember to maintain `StyledButton` as an exported alias for the `Button` component when migrating Task 05, as legacy CSS selectors might depend on it.
- **Circular References**: Avoid using Tailwind theme variables (e.g., `--color-canvas`) inside the `@theme` block itself to define other variables if it causes circularity. Use the underlying CSS custom properties (e.g., `--t-canvas`) instead.
