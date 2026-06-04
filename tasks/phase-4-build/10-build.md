# Task 10: Build Configuration & Distribution

> Status: Pending | Deps: 06-09 (all components exist) | Source: `package.json`, `rollup.config.js`, type declarations

## Motivation

With all 31 components rewritten, the library needs proper build configuration for distribution:
- TypeScript declarations (`.d.ts`) for downstream consumers
- ESM + CJS dual output
- CSS bundle (Tailwind utilities + global styles)
- Correct `package.json` entry points
- No styled-components leakage in the bundle

## What to build

### 1. Barrel exports (`src/index.ts`)

Ensure every component is exported:

```ts
// src/index.ts

// Style reset
export { styleReset } from "./common/styleReset";

// Theme
export { ThemeProvider } from "./TailwindTheme/ThemeProvider";
export type { ThemeName } from "./TailwindTheme/ThemeProvider";

// Components (31 total)
export { Anchor } from "./Anchor/Anchor";
export type { AnchorProps } from "./Anchor/Anchor";

export { AppBar } from "./AppBar/AppBar";
export type { AppBarProps } from "./AppBar/AppBar";

export { Avatar } from "./Avatar/Avatar";
export type { AvatarProps } from "./Avatar/Avatar";

export { Button } from "./Button/Button";
export type { ButtonProps } from "./Button/Button";

export { Checkbox } from "./Checkbox/Checkbox";
export type { CheckboxProps } from "./Checkbox/Checkbox";

export { ColorInput } from "./ColorInput/ColorInput";
export type { ColorInputProps } from "./ColorInput/ColorInput";

export { Counter } from "./Counter/Counter";
export type { CounterProps } from "./Counter/Counter";

export { DatePicker } from "./DatePicker/DatePicker";
export type { DatePickerProps } from "./DatePicker/DatePicker";

export { Frame } from "./Frame/Frame";
export type { FrameProps } from "./Frame/Frame";

export { GroupBox } from "./GroupBox/GroupBox";
export type { GroupBoxProps } from "./GroupBox/GroupBox";

export { Handle } from "./Handle/Handle";
export type { HandleProps } from "./Handle/Handle";

export { Hourglass } from "./Hourglass/Hourglass";
export type { HourglassProps } from "./Hourglass/Hourglass";

export { MenuList } from "./MenuList/MenuList";
export { MenuListItem } from "./MenuList/MenuListItem";
export type { MenuListProps } from "./MenuList/MenuList";
export type { MenuListItemProps } from "./MenuList/MenuListItem";

export { Monitor } from "./Monitor/Monitor";
export type { MonitorProps } from "./Monitor/Monitor";

export { NumberInput } from "./NumberInput/NumberInput";
export type { NumberInputProps } from "./NumberInput/NumberInput";

export { ProgressBar } from "./ProgressBar/ProgressBar";
export type { ProgressBarProps } from "./ProgressBar/ProgressBar";

export { Radio } from "./Radio/Radio";
export type { RadioProps } from "./Radio/Radio";

export { ScrollView } from "./ScrollView/ScrollView";
export type { ScrollViewProps } from "./ScrollView/ScrollView";

export { Select } from "./Select/Select";
export type { SelectProps } from "./Select/Select";

export { Separator } from "./Separator/Separator";
export type { SeparatorProps } from "./Separator/Separator";

export { Slider } from "./Slider/Slider";
export type { SliderProps } from "./Slider/Slider";

export { Table } from "./Table/Table";
export type { TableProps } from "./Table/Table";

export { Tabs, Tab, TabBody } from "./Tabs/Tabs";
export type { TabsProps, TabProps, TabBodyProps } from "./Tabs/Tabs";

export { TextInput } from "./TextInput/TextInput";
export type { TextInputProps } from "./TextInput/TextInput";

export { Toolbar } from "./Toolbar/Toolbar";
export type { ToolbarProps } from "./Toolbar/Toolbar";

export { Tooltip } from "./Tooltip/Tooltip";
export type { TooltipProps } from "./Tooltip/Tooltip";

export { TreeView } from "./TreeView/TreeView";
export type { TreeViewProps } from "./TreeView/TreeView";

export { Window, WindowHeader, WindowContent } from "./Window/Window";
export type { WindowProps, WindowHeaderProps, WindowContentProps } from "./Window/Window";

// Common types
export type { CommonStyledProps } from "./types";
```

### 2. TypeScript declarations

Ensure `tsconfig.json` generates declaration files:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./dist",
    "emitDeclarationOnly": true,
    "declarationMap": true
  }
}
```

Add `types` field to `package.json`:
```json
{
  "types": "./dist/index.d.ts"
}
```

### 3. Vite library mode configuration

Verify `vite.config.ts` produces correct output:

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
      name: "React95Tailwind",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        // Preserve CSS imports as separate file
        assetFileNames: "react95-tailwind.[ext]",
      },
    },
    cssCodeSplit: false, // Single CSS file for the library
  },
});
```

### 4. CSS output

The build should produce a single CSS file (`dist/react95-tailwind.css`) containing:
- Tailwind preflight (reset)
- `@theme` tokens
- Global styles (font, scrollbar, focus outline, border utilities)
- Component-specific `@keyframes` (progress-bar-tile)

Consumer imports:
```ts
// In consumer's app:
import "react95-tailwind/dist/react95-tailwind.css";
import { Button, Frame, Window } from "react95-tailwind";
```

### 5. Package.json finalization

```json
{
  "name": "react95-tailwind",
  "version": "0.1.0",
  "description": "Windows 95 UI components for React, rebuilt with Tailwind CSS",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./dist/react95-tailwind.css": "./dist/react95-tailwind.css"
  },
  "files": [
    "/dist"
  ],
  "sideEffects": [
    "**/*.css"
  ],
  "peerDependencies": {
    "react": ">= 16.8.0",
    "react-dom": ">= 16.8.0"
  },
  "dependencies": {
    "clsx": "^2.0.0"
  },
  "keywords": [
    "react",
    "windows95",
    "tailwindcss",
    "components",
    "design-system",
    "retro-ui"
  ],
  "license": "MIT"
}
```

### 6. Dev server

Add `npm run dev` script that serves a test page:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "oxlint src",
    "format": "oxfmt src",
    "fix": "npm run format && npm run lint"
  }
}
```

Create `index.html` at root for dev server:

```html
<!doctype html>
<html data-theme="original">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/src/global.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/dev/main.tsx"></script>
  </body>
</html>
```

Create `dev/main.tsx` as a test page rendering all components:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Button, Frame, Window, Tabs, Tab, TabBody, /* ... all components */ } from "../src";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="p-8 flex flex-col gap-4 bg-desktop-background min-h-screen">
    <h1 className="text-header-text text-xl font-bold">React95 Tailwind -- Component Test</h1>
    {/* Render every component in every state */}
  </div>
);
```

### Files

Create:

```
index.html                            # Dev server entry
dev/
  main.tsx                            # Test page rendering all components
```

Modify:

```
src/index.ts                          # Finalize barrel exports
package.json                          # Finalize metadata + scripts
vite.config.ts                        # Verify library mode output
tsconfig.json                         # Verify declaration generation
```

## Acceptance criteria

- [ ] `npm run build` produces `dist/index.mjs`, `dist/index.cjs`, `dist/index.d.ts`, `dist/react95-tailwind.css`
- [ ] ESM output contains no styled-components imports
- [ ] CJS output works with `require("react95-tailwind")`
- [ ] TypeScript declarations resolve all component types (`ButtonProps`, etc.)
- [ ] CSS file contains all `@theme` tokens, border utilities, and component animations
- [ ] `npm run dev` opens test page with all 31 components visible
- [ ] Bundle size: `< 50KB gzipped` (JS) + `< 10KB gzipped` (CSS) -- excluding React
- [ ] `npm run lint` passes on all source files
- [ ] `npm run format` passes on all source files
