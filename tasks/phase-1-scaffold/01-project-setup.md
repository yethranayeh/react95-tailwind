# Task 01: Project Scaffold

> Status: Pending | Deps: None

## Motivation

The current `react95` library uses styled-components for all styling, Rollup + Babel for building, Storybook 6 for development, and React 17. We need a modern foundation:

- **Vite** for build (fast HMR, native ESM, library mode)
- **Tailwind v4** for styling (zero-runtime, utility classes)
- **TypeScript** for types (retain existing `tsconfig.json` structure)
- **React 18** as the peer dependency target

The public API (`src/index.ts`) and all component names/props must remain identical. This is a **direct replacement** -- consumers should be able to swap `react95` for `react95-tailwind` without code changes.

## What to build

### Project structure (target)

```
react95-tailwind/
  src/
    index.ts              # Barrel exports (same public API)
    types.ts              # CommonStyledProps + shared types (adapted for non-SC)
    TailwindTheme/
      index.ts            # Tailwind @theme config object
      tokens.ts           # 27 color tokens + shadow tokens as CSS custom properties
    common/
      index.ts            # Style utilities (border, hatched, focus, etc.) -- no SC
      hooks/              # useControlledOrUncontrolled, useEventCallback, useForkRef, useId, useIsFocusVisible
        index.ts
        useControlledOrUncontrolled.ts
        useEventCallback.ts
        useForkRef.ts
        useId.ts
        useIsFocusVisible.ts
      utils/              # clamp, getSize, noOp, events.ts
        index.ts
      styleReset.ts       # Base CSS reset (CSS string, no SC dependency)
  vite.config.ts          # Vite config with Tailwind plugin + library mode
  tsconfig.json           # Updated for Vite
  package.json            # Updated deps
  tailwind.config.ts      # Tailwind v4 config (or CSS-first config)
```

### Remove (everything from old stack)

```
.babelrc
.eslintrc.js
.prettierrc
.firebaserc
firebase.json
jest.config.js
rollup.config.js
tsconfig.build.index.json
tsconfig.build.themes.json
src/common/themes/              # 61 theme files (replace with CSS custom properties)
types/                          # Move into src/ properly
.storybook/                     # Will be re-added in Task 11
test/                           # Will be re-added in Task 11
docs/                           # Not needed yet
```

### Tooling setup

| Tool | Old | New |
|------|-----|-----|
| Bundler | Rollup | Vite (library mode) |
| Transpiler | Babel | esbuild (built into Vite) |
| CSS | styled-components | Tailwind v4 |
| Lint | ESLint | oxlint (match portfolio convention) |
| Format | Prettier | oxfmt |
| Test | Jest + jest-styled-components | Vitest (migrate in Task 11) |
| Dev server | Storybook 6 | Vite dev server (Storybook in Task 11) |

### Dependencies to install

```
# Core
react, react-dom (peer: >= 16.8.0)
tailwindcss @tailwindcss/vite
clsx

# Dev
vite @vitejs/plugin-react
typescript @types/react @types/react-dom
oxlint oxfmt
```

### Dependencies to remove

```
styled-components
@types/styled-components
rollup + all rollup plugins
babel + all babel plugins
jest + @testing-library/* (re-add in Task 11 with vitest)
eslint + all eslint plugins
prettier
firebase-tools
semantic-release
commitizen
cross-env
```

### Configuration files

**`vite.config.ts`** -- library mode:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "React95",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
```

**`package.json`** -- key fields:
```json
{
  "name": "react95-tailwind",
  "version": "0.0.0-development",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["/dist"],
  "peerDependencies": {
    "react": ">= 16.8.0",
    "react-dom": ">= 16.8.0"
  }
}
```

**`tsconfig.json`** -- adapted for Vite:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "declarationDir": "./dist",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### Global CSS entry point

Create `src/global.css`:

```css
@import "tailwindcss";

@theme {
  /* Will be populated in Task 02 */
}

/* Global resets carried from styleReset */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Font faces carried from original */
```

### Files

Create:

```
src/
  global.css
  index.ts                             # Start with empty barrel, fill as components are built
  types.ts                             # CommonStyledProps + shared types (no SC dependency)
  common/
    index.ts                           # Style utilities (stubs -- filled in Task 03)
    hooks/
      index.ts
      useControlledOrUncontrolled.ts   # Ported from original, no changes needed
      useEventCallback.ts              # Ported from original
      useForkRef.ts                    # Ported from original
      useId.ts                         # Ported from original
      useIsFocusVisible.ts             # Ported from original
    utils/
      index.ts                         # clamp, getSize, noOp, events.ts
    styleReset.ts                      # CSS string, extracted from styled-components
vite.config.ts
tsconfig.json
tailwind.config.ts                     # If using JS config style, or just CSS-first
```

Modify:

```
package.json                           # Update deps, scripts, entry points
```

Delete:

```
.babelrc
.eslintrc.js
.prettierrc
.firebaserc
firebase.json
jest.config.js
rollup.config.js
tsconfig.build.index.json
tsconfig.build.themes.json
types/                                # Move contents into src/ if needed
src/common/themes/                    # 61 theme files replaced by CSS variables in Task 02
src/common/styleReset.js              # Replaced by .ts version
src/common/system.ts                  # Move blockSizes into utils
src/common/constants.ts               # Move into utils
```

## Acceptance criteria

- [ ] `npm run build` produces `dist/index.mjs` and `dist/index.cjs`
- [ ] Build is zero styled-components dependency (verify with `npm ls styled-components` -- should not appear)
- [ ] `npm run dev` starts Vite dev server
- [ ] `npm run lint` passes (oxlint)
- [ ] `npm run format` passes (oxfmt)
- [ ] Common hooks (5 hooks) ported and type-safe
- [ ] Common utils (clamp, getSize, noOp, events) ported
- [ ] `styleReset` exported as string (no styled-components dependency)
- [ ] `CommonStyledProps` type defined (polymorphic `as` prop)
- [ ] `blockSizes` (`sm: '28px'`, `md: '36px'`, `lg: '44px'`) preserved
- [ ] `KEYBOARD_KEY_CODES` preserved
