# Task 02: Theme Tokens

> Status: Complete | Deps: None | Source: `src/common/themes/` (61 theme files)

## Motivation

The original library has 61 built-in theme objects, each with 27 color tokens. Themes are injected via styled-components `ThemeProvider`, and every styled component accesses tokens via `${({ theme }) => theme.someToken}`.

We need to:
1. Port the 27-token color system to Tailwind's `@theme` directive
2. Make all 61 themes available via CSS custom properties + `data-theme` attribute
3. Keep the same token names so consumer code (theme switching) works identically

Tailwind v4's `@theme` allows defining custom design tokens that become available as utility classes. CSS custom properties handle runtime theme switching without JavaScript.

## What to build

### Token architecture

```
CSS Custom Properties (runtime, theme-switchable)
  └── Tailwind @theme (build-time, generates utility classes)
        └── React context (ThemeProvider -- optional convenience, maps to data-theme attr)
```

**Approach:** Define all colors as CSS custom properties under `:root` and `[data-theme="..."]` selectors. Then reference them in Tailwind's `@theme` via `var(--color-*)` syntax. This gives us:
- Theme switching via `document.documentElement.setAttribute('data-theme', 'hotdog')`
- Tailwind utility classes like `bg-canvas`, `text-header-text`, `border-border-darkest`
- Zero JavaScript at runtime (except the theme switching itself)

### The 27 color tokens

```ts
// Theme interface (kept for TypeScript, not used at runtime)
interface Theme {
  anchor: string;
  anchorVisited: string;
  borderDark: string;
  borderDarkest: string;
  borderLight: string;
  borderLightest: string;
  canvas: string;
  canvasText: string;
  canvasTextDisabled: string;
  canvasTextDisabledShadow: string;
  canvasTextInvert: string;
  checkmark: string;
  checkmarkDisabled: string;
  desktopBackground: string;
  flatDark: string;
  flatLight: string;
  focusSecondary: string;
  headerBackground: string;
  headerNotActiveBackground: string;
  headerNotActiveText: string;
  headerText: string;
  hoverBackground: string;
  material: string;
  materialDark: string;
  materialText: string;
  materialTextDisabled: string;
  materialTextDisabledShadow: string;
  materialTextInvert: string;
  progress: string;
  tooltip: string;
}
```

### Output format

**`src/TailwindTheme/tokens.css`** -- CSS custom properties:
```css
:root,
[data-theme="original"] {
  --color-anchor: #0000ff;
  --color-anchor-visited: #800080;
  --color-border-dark: #848584;
  --color-border-darkest: #0a0a0a;
  --color-border-light: #dfdfdf;
  --color-border-lightest: #ffffff;
  --color-canvas: #ffffff;
  --color-canvas-text: #0a0a0a;
  /* ... all 27 tokens for the "original" theme ... */
}

[data-theme="storm"] {
  --color-anchor: #0000ff;
  /* ... all 27 tokens for "storm" ... */
}

/* ... 59 more theme blocks ... */
```

**`src/TailwindTheme/tokens.ts`** -- runtime theme map (for theme switching context):
```ts
export const themes = {
  original: { anchor: "var(--color-anchor)", /* ... */ },
  storm: { anchor: "var(--color-anchor)", /* ... */ },
  // ... 59 more
} as const;
```

**`src/global.css`** -- Tailwind `@theme` referencing CSS variables:
```css
@import "tailwindcss";

@theme {
  --color-anchor: var(--color-anchor);
  --color-anchor-visited: var(--color-anchor-visited);
  --color-border-dark: var(--color-border-dark);
  --color-border-darkest: var(--color-border-darkest);
  --color-border-light: var(--color-border-light);
  --color-border-lightest: var(--color-border-lightest);
  --color-canvas: var(--color-canvas);
  --color-canvas-text: var(--color-canvas-text);
  --color-canvas-text-disabled: var(--color-canvas-text-disabled);
  --color-canvas-text-disabled-shadow: var(--color-canvas-text-disabled-shadow);
  --color-canvas-text-invert: var(--color-canvas-text-invert);
  --color-checkmark: var(--color-checkmark);
  --color-checkmark-disabled: var(--color-checkmark-disabled);
  --color-desktop-background: var(--color-desktop-background);
  --color-flat-dark: var(--color-flat-dark);
  --color-flat-light: var(--color-flat-light);
  --color-focus-secondary: var(--color-focus-secondary);
  --color-header-background: var(--color-header-background);
  --color-header-not-active-background: var(--color-header-not-active-background);
  --color-header-not-active-text: var(--color-header-not-active-text);
  --color-header-text: var(--color-header-text);
  --color-hover-background: var(--color-hover-background);
  --color-material: var(--color-material);
  --color-material-dark: var(--color-material-dark);
  --color-material-text: var(--color-material-text);
  --color-material-text-disabled: var(--color-material-text-disabled);
  --color-material-text-disabled-shadow: var(--color-material-text-disabled-shadow);
  --color-material-text-invert: var(--color-material-text-invert);
  --color-progress: var(--color-progress);
  --color-tooltip: var(--color-tooltip);

  /* Shadows (Win95 bevel effects) */
  --shadow-out: inset 1px 1px 0px 1px var(--color-border-lightest),
    inset 0 0 0 1px var(--color-border-dark),
    1px 1px 0 0px var(--color-border-darkest);
  --shadow-in: inset 1px 1px 0px 1px var(--color-border-dark),
    inset 0 0 0 1px var(--color-border-light),
    1px 1px 0 0px var(--color-border-lightest);
  --shadow-tooltip: 4px 4px 10px 0 rgba(0, 0, 0, 0.35);
}
```

### ThemeProvider replacement

The original library's `ThemeProvider` injected tokens via styled-components context. In our Tailwind version, theme switching works by setting `data-theme` on `<html>`:

```tsx
// Optional convenience component (not required, but matches old API surface)
import { createContext, useContext } from "react";

type ThemeName = keyof typeof themes;

const ThemeContext = createContext<{
  theme: ThemeName;
  setTheme: (name: ThemeName) => void;
}>({ theme: "original", setTheme: () => {} });

export function ThemeProvider({ children, theme = "original" }: { children: React.ReactNode; theme?: ThemeName }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme: (n) => document.documentElement.setAttribute("data-theme", n) }}>{children}</ThemeContext.Provider>;
}
```

Note: The ThemeProvider is optional. Setting `data-theme` directly on `<html>` works identically. This is provided for API compatibility with existing consumers.

### Script to generate tokens.css from existing theme files

Since there are 61 themes with 27 tokens each (1647 values), manual transcription is error-prone. Write a Node.js script that:
1. Imports all theme objects from `src/common/themes/`
2. Generates the CSS file with all `[data-theme="..."]` blocks
3. Generates the `tokens.ts` runtime map

This script runs once during Task 02 and produces the final static files.

### Files

Create:

```
src/TailwindTheme/
  tokens.ts                            # Runtime theme map (from generation script)
  tokens.css                           # CSS custom properties for all 61 themes (from generation script)
  ThemeProvider.tsx                     # Optional convenience component
  generate-themes.mjs                   # One-time generation script (runs in Node, not bundled)
src/global.css                         # Updated with @theme block
```

Delete:

```
src/common/themes/                     # All 61 theme TypeScript files
src/common/themes/types.ts             # Theme type (moved to TailwindTheme)
types/themes.d.ts                       # styled-components theme augmentation
```

## Acceptance criteria

- [x] All 27 color tokens appear as Tailwind utility classes (`bg-canvas`, `text-header-text`, etc.)
- [x] All 61 themes available via `data-theme` attribute
- [x] `--shadow-out` and `--shadow-in` CSS custom properties generate correct 3D bevel
- [x] Theme switching works: changing `data-theme` updates all components
- [x] `ThemeProvider` component exported (API-compatible convenience wrapper)
- [x] Generation script produces identical values to original theme files
- [x] `npm run build` passes
- [x] `npm run lint` passes
