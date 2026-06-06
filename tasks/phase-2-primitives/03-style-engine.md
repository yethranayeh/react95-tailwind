# Task 03: Style Engine

> Status: Complete | Deps: 01, 02 | Source: `src/common/index.ts` (285 lines of styled-components mixins)

## Motivation

The original library's visual identity comes from 5 key style utilities, all implemented as styled-components template literal mixins:

| Utility | Purpose |
|---------|---------|
| `createBorderStyles` | 3D Windows border (raised/sunken/bevel) with `box-shadow` inner borders |
| `createBoxStyles` | Base box model (display, background, color from theme) |
| `createHatchedBackground` | Checkered pattern for active/selected states |
| `focusOutline` | Dotted focus ring for keyboard navigation |
| `createScrollbars` | Custom WebKit scrollbars with triangle arrow SVGs |
| `createFlatBoxStyles` | Flat design variant (no 3D borders) |
| `createDisabledTextStyles` | Greyed-out text with white shadow for disabled state |

These are called from `styled.div` template literals and compile to static CSS. In Tailwind, they become **composable utility classes** and **CSS custom properties**.

## What to build

### 1. Border styles (`createBorderStyles`)

This is the heart of the Win95 look. The original generates 8 border styles:

| Style | Visual | Used by |
|-------|--------|---------|
| `button` | Raised button bevel | Button (default), Tab, WindowHeader button |
| `buttonPressed` | Sunken button bevel | Button (active), Tab (selected) |
| `buttonThin` | Thin raised bevel | Button (thin variant) |
| `buttonThinPressed` | Thin sunken bevel | Button (thin + active) |
| `field` | Sunken field border | Frame (field), TextInput, Select |
| `grouping` | Grouping border | GroupBox |
| `status` | Status bar border | AppBar, Toolbar (implicit) |
| `window` | Window outer bevel | Window, MenuList |

**Approach:** Create Tailwind utility classes using `@utility` or custom CSS classes:

```css
/* src/TailwindTheme/borders.css -- loaded into global.css */
.border-w95 {
  border-width: 2px;
  border-style: solid;
}

/* Raised/Sunken achieved via border-color + box-shadow */
.border-raised {
  border-color: var(--color-border-lightest);
  box-shadow: var(--shadow-out);
  /* shadow-out: inset 1px border-lightest, inset 0 0 0 1px border-dark, 1px 1px border-darkest */
}

.border-sunken {
  border-color: var(--color-border-darkest);
  box-shadow: var(--shadow-in);
}

.border-thin-raised {
  border: 1px solid;
  border-color: var(--color-border-lightest) var(--color-border-darkest) var(--color-border-darkest) var(--color-border-lightest);
}

.border-thin-sunken {
  border: 1px solid;
  border-color: var(--color-border-darkest) var(--color-border-lightest) var(--color-border-lightest) var(--color-border-darkest);
}

.border-field {
  border-color: var(--color-border-darkest) var(--color-border-lightest) var(--color-border-lightest) var(--color-border-darkest);
  box-shadow: var(--shadow-in);
}

.border-grouping {
  border-color: var(--color-border-light) var(--color-border-darkest) var(--color-border-darkest) var(--color-border-light);
}

.border-window {
  border-color: var(--color-border-lightest);
  box-shadow: var(--shadow-out);
}
```

### 2. Base box styles (`createBoxStyles`)

Simple mapping to Tailwind utilities:

| Original | Tailwind |
|----------|----------|
| `background: theme.material` | Tailwind sets this via theme. Components use `bg-material` |
| `color: theme.materialText` | `text-material-text` |
| `box-sizing: border-box` | Default in Tailwind preflight |

No separate component needed -- just use Tailwind classes directly.

### 3. Hatched background (`createHatchedBackground`)

The checkered pattern is a CSS `linear-gradient` trick:

```css
.bg-hatched {
  background-image:
    linear-gradient(45deg, var(--color-checkmark) 25%, transparent 25%),
    linear-gradient(-45deg, var(--color-checkmark) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--color-checkmark) 75%),
    linear-gradient(-45deg, transparent 75%, var(--color-checkmark) 75%);
  background-size: 4px 4px;
  background-position: 0 0, 0 2px, 2px -2px, -2px 0;
}
```

The original `createHatchedBackground` supports configurable `mainColor`, `secondaryColor`, and `pixelSize`. We can hardcode these to the default values since this is only used for button active states and checkbox checkmarks in the original library.

### 4. Focus outline

```css
.focus-outline:focus-visible {
  outline: 1px dotted var(--color-border-darkest);
  outline-offset: -4px;
}
```

### 5. Scrollbars (`createScrollbars`)

The original generates custom WebKit scrollbar styles with base64-encoded triangle SVG arrows:

```css
.custom-scrollbar::-webkit-scrollbar { width: 16px; height: 16px; }
.custom-scrollbar::-webkit-scrollbar-track { background: var(--color-canvas); }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-material);
  box-shadow: var(--shadow-out);
}
.custom-scrollbar::-webkit-scrollbar-button {
  background: var(--color-material);
  box-shadow: var(--shadow-out);
  display: block;
  height: 16px;
  width: 16px;
}
/* ... button pseudo-elements with triangle SVGs ... */
```

For Firefox compatibility, use `scrollbar-width: thin; scrollbar-color: var(--color-material) var(--color-canvas);`.

### 6. Disabled text styles

```css
.text-disabled {
  color: var(--color-material-text-disabled);
  text-shadow: 1px 1px var(--color-material-text-disabled-shadow);
}
```

### 7. Flat variant styles

```css
.bg-flat {
  background: var(--color-flat-light);
}
.bg-flat-disabled {
  background: var(--color-canvas);
  color: var(--color-material-text-disabled);
}
```

### Utility function: `getSize`

Ported from original -- converts number to px string, passes strings through:

```ts
export function getSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}
```

### Files

Create:

```
src/TailwindTheme/
  borders.css                         # Border utility classes
  components.css                      # Hatched bg, focus outline, scrollbar, disabled text, flat variants
src/common/
  styleEngine.ts                      # getSize + any shared type helpers
```

Modify:

```
src/global.css                        # Import borders.css and components.css
```

## Acceptance criteria

- [x] `border-raised` renders correct 3-color bevel matching original `createBorderStyles({style:'button'})`
- [x] `border-sunken` renders correct sunken bevel matching original `createBorderStyles({style:'buttonPressed'})`
- [x] `border-field` renders text input border matching original `Frame variant="field"`
- [x] `bg-hatched` renders checkered pattern matching original `createHatchedBackground()`
- [x] `focus-outline` renders 1px dotted outline on `:focus-visible` matching original
- [x] `.custom-scrollbar` renders styled scrollbars with triangle arrows matching original `createScrollbars()`
- [x] `.text-disabled` renders greyed text with white shadow matching original
- [x] `.bg-flat` / `.bg-flat-disabled` render flat variant styling matching original
- [x] `getSize` utility produces same output as original
- [x] No visual difference from original library for any border/flat/disabled/scrollbar state
- [x] `npm run build` passes
- [x] `npm run lint` passes
