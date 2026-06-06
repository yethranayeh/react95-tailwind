# React95 Tailwind Rewrite -- Sprint Overview

> Goal: Fork the `react95@4` library (styled-components) and rewrite every component
> using Tailwind v4 utilities and CSS custom properties. Zero styled-components. Zero
> runtime CSS-in-JS. Same public API, same Win95 look.

## Phases

| Phase | Name       | Tasks  | Status     |
| ----- | ---------- | ------ | ---------- |
| 1     | Scaffold   | 01-02  | ✅ Complete |
| 2     | Primitives | 03-05  | 🔄 In Progress |
| 3     | Components | 06-09  | ⬜ Pending |
| 4     | Build      | 10-12  | ⬜ Pending |

---

## Phase 1: Scaffold -- Project setup and theme tokens

| Task | File                                                      | Description                              | Deps | Status |
| ---- | --------------------------------------------------------- | ---------------------------------------- | ---- | ------ |
| 01   | [01-project-setup.md](phase-1-scaffold/01-project-setup.md)     | Vite + Tailwind v4 + TypeScript scaffold. Remove all styled-components/Rollup/Babel tooling. | None | ✅     |
| 02   | [02-theme-tokens.md](phase-1-scaffold/02-theme-tokens.md)       | Port 27-color `Theme` type + 61 built-in themes to Tailwind `@theme` + CSS custom properties. | None | ✅     |

## Phase 2: Primitives -- Core style engine and base components

| Task | File                                                              | Description                                         | Deps | Status |
| ---- | ----------------------------------------------------------------- | --------------------------------------------------- | ---- | ------ |
| 03   | [03-style-engine.md](phase-2-primitives/03-style-engine.md)       | Rewrite `createBorderStyles`, `createHatchedBackground`, `focusOutline`, `createScrollbars`, `createDisabledTextStyles` as Tailwind utility classes and custom properties. | 01, 02 | ✅     |
| 04   | [04-frame.md](phase-2-primitives/04-frame.md)                     | `Frame` component -- the base building block. Recreate 3D bevel borders using the style engine. | 03 | ✅     |
| 05   | [05-button.md](phase-2-primitives/05-button.md)                   | `Button` component -- the most complex primitive. 4 variants (default/raised/flat/thin), 3 sizes, active/disabled/primary states. | 04 | ⬜     |

## Phase 3: Components -- Full component library

| Task | File                                                              | Description                                                | Deps      | Status |
| ---- | ----------------------------------------------------------------- | ---------------------------------------------------------- | --------- | ------ |
| 06   | [06-simple-batch.md](phase-3-components/06-simple-batch.md)       | `Anchor`, `Separator`, `Handle`, `Toolbar`, `Hourglass`, `Avatar`, `Monitor` -- 7 simple/stateless components. | 03, 04    | ⬜     |
| 07   | [07-form-components.md](phase-3-components/07-form-components.md) | `TextInput`, `Radio`, `Checkbox` (via `SwitchBase`), `GroupBox`, `Select`, `Slider` -- all form controls. | 05, 06    | ⬜     |
| 08   | [08-containers.md](phase-3-components/08-containers.md)           | `Window` (+ `WindowHeader` + `WindowContent`), `Tabs` (+ `Tab` + `TabBody`), `MenuList` (+ `MenuListItem`), `AppBar`, `Table` (+ 6 sub-components), `Tooltip`. | 05, 06    | ⬜     |
| 09   | [09-complex-batch.md](phase-3-components/09-complex-batch.md)     | `ProgressBar`, `Counter`, `DatePicker`, `TreeView`, `ColorInput`, `NumberInput` -- stateful components with complex logic. | 07, 08    | ⬜     |

## Phase 4: Build -- Distribution and verification

| Task | File                                                      | Description                        | Deps  | Status |
| ---- | --------------------------------------------------------- | ---------------------------------- | ----- | ------ |
| 10   | [10-build.md](phase-4-build/10-build.md)                  | Barrel exports, TypeScript declarations, package.json config, Vite library mode, bundle analysis. | 06-09 | ⬜     |
| 11   | [11-legacy-migration.md](phase-4-build/11-legacy-migration.md) | Port and update legacy/deprecated components (Bar, Cutout, Desktop, Divider, Fieldset, etc.). Port stories. Port tests. | 10    | ⬜     |
| 12   | [12-verification.md](phase-4-build/12-verification.md)    | Visual regression against original library. API compatibility check. Accessibility audit. Publish. | 11    | ⬜     |

---

## Dependencies

```
Phase 1:   01 ──┬── 03 ── 04 ── 05
           02 ──┘            │  │
                              ├── 06 ──┬── 07 ──┐
                              │        │        ├── 09
                              │        ├── 08 ──┘
                              │        │
                              └──┬─────┘
                                 │
Phase 4:                        │
   10 ── 11 ── 12   (requires 06-09) ──┘
```

Tasks 01 and 02 have no dependencies and can be worked in parallel.
Tasks 06, 07, 08 can be worked in parallel after 05 completes.

---

## Visual preservation rule

No component visual should change. The entire Win95 look (3D borders, hatched backgrounds,
focus outlines, scrollbar styling, hover/active/disabled states) must render identically
to the original `react95@4` library. If a diff looks different, it's a bug.

---

## Status legend

- ⬜ Pending
- 🔄 In Progress
- ✅ Complete
- ❌ Blocked
