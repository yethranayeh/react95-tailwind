# Task 12: Final Verification & Release

> Status: Pending | Deps: 11 | Source: All 31 components (visual regression), original `react95@4` reference

## Motivation

Before publishing `react95-tailwind`, we must verify:
1. **Visual parity** -- every component looks identical to `react95@4`
2. **API compatibility** -- consumers can swap imports without code changes
3. **Bundle quality** -- no styled-components leakage, reasonable size
4. **Accessibility** -- keyboard navigation, focus management, ARIA attributes
5. **Theme switching** -- all 61 themes render correctly

## What to build

### 1. Visual regression checklist

Build a comparison page side-by-side with the original library:

```tsx
// dev/compare.tsx
import * as Original from "react95";
import * as Tailwind from "../src";

function ComparisonTable() {
  return (
    <table>
      <thead><tr><th>Component</th><th>Original (react95@4)</th><th>Tailwind (ours)</th></tr></thead>
      <tbody>
        {/* For each component, render both versions side by side */}
        <tr>
          <td>Button (default)</td>
          <td><Original.Button>OK</Original.Button></td>
          <td><Tailwind.Button>OK</Tailwind.Button></td>
        </tr>
        {/* ... repeat for all variants, sizes, states ... */}
      </tbody>
    </table>
  );
}
```

Checklist (every variant of every component):

| Component | States to verify |
|-----------|-----------------|
| Anchor | default, hover, visited, underline=false |
| AppBar | fixed, static, sticky, with Toolbar + children |
| Avatar | with image, no image (children), noBorder, square, sizes 32/48/64/96 |
| Button | default/raised/flat/thin, sm/md/lg, active, disabled, primary, square, fullWidth, focus-visible |
| Checkbox | checked, unchecked, indeterminate, disabled, with/without label |
| ColorInput | default |
| Counter | numbers 0-999 |
| DatePicker | default, with selected date |
| Frame | window/button/field/status variants |
| GroupBox | with/without label, disabled |
| Handle | sizes 20/35/50 |
| Hourglass | sizes 16/32/48 |
| MenuList + MenuListItem | default, disabled, primary, with hover state, with focus |
| Monitor | with children |
| NumberInput | default, with value |
| ProgressBar | default/tile, values 0/25/50/75/100, hideValue |
| Radio | checked, unchecked, disabled, with/without label |
| ScrollView | with shadow, without shadow |
| Select | open/closed, selected option |
| Separator | horizontal/vertical, sizes |
| Slider | horizontal/vertical, with marks, controlled/uncontrolled |
| Table | with data rows, head cells |
| Tabs + Tab + TabBody | single row, multi-row (rows=2), selected tab, disabled tab |
| TextInput | default/flat, multiline, disabled, with placeholder |
| Toolbar | default, noPadding |
| Tooltip | visible/hidden, with delay |
| TreeView | expanded/collapsed, selected node, keyboard navigation |
| Window + Header + Content | active/inactive header, resizable, with shadow |

### 2. Theme switching verification

Test at least 5 representative themes:
- `original` (classic teal + grey)
- `storm` (dark theme)
- `hotdog` (red/yellow)
- `lilac` (purple)
- `marine` (blue/green)

Each theme should render identically to the original library's rendering.

### 3. API compatibility

Verify these patterns work identically to original:

```tsx
// Named imports
import { Button, ButtonProps } from "react95-tailwind";
import { Window, WindowHeader, WindowContent } from "react95-tailwind";

// Polymorphic as prop
<Button as="a" href="/link">Link Button</Button>
<Frame as="section" variant="window">Section</Frame>

// Ref forwarding
const ref = useRef<HTMLButtonElement>(null);
<Button ref={ref}>Focusable</Button>

// Compound components
<Window>
  <WindowHeader active>Title</WindowHeader>
  <WindowContent>Content</WindowContent>
</Window>

// Controlled/uncontrolled
<Slider value={50} onChange={setValue} />
<Slider defaultValue={50} />

// Deprecated components (still work, show warning)
import { Bar } from "react95-tailwind"; // console.warn in dev
```

### 4. Accessibility audit

| Check | All components |
|-------|---------------|
| Keyboard navigation | Slider (arrow keys), TreeView (arrows + enter/space), Select (enter/escape) |
| Focus management | All interactive components have visible focus rings (`.focus-outline`) |
| ARIA roles | Slider (`role="slider"`), TreeView (`role="tree"`/`treeitem`), Tabs (`role="tablist"`/`tab`), Checkbox/Radio (`role` from native input) |
| Screen reader labels | All inputs have accessible labels (via `label` prop or `aria-label`) |
| Disabled state | Disabled controls excluded from tab order, visual feedback |

### 5. Bundle analysis

```bash
npm run build
npx vite-bundle-visualizer  # or ls -lh dist/
```

Target sizes:
- JS (ESM): < 50KB gzipped (excluding peer deps)
- CSS: < 10KB gzipped
- No `styled-components` in bundle

### 6. Publish checklist

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm test` passes all tests
- [ ] `dist/` contains: `index.mjs`, `index.cjs`, `index.d.ts`, `react95-tailwind.css`
- [ ] `package.json` has correct `main`, `module`, `types`, `exports`, `files`
- [ ] Version bumped to `1.0.0` (final release)
- [ ] `npm pack` produces correct tarball (dry-run: check contents)
- [ ] README.md updated with Tailwind usage instructions
- [ ] `npm publish` (or test with `npm pack --dry-run` first)

### Files

Create:

```
dev/
  compare.tsx                         # Side-by-side comparison with original react95@4
```

Modify:

```
README.md                             # Updated for Tailwind version
```

## Acceptance criteria

- [ ] All 31 components pass visual comparison against original `react95@4`
- [ ] All state combinations from checklist verified
- [ ] 5 themes render correctly
- [ ] API compatibility verified (named imports, `as` prop, ref forwarding, compound components)
- [ ] Keyboard navigation works on Slider, TreeView, Tabs, Select
- [ ] Bundle sizes within targets (JS < 50KB gzipped, CSS < 10KB gzipped)
- [ ] Zero styled-components in bundle
- [ ] `npm pack --dry-run` shows correct file contents
- [ ] README has installation + usage instructions for Tailwind version
- [ ] Ready to publish as `react95-tailwind@1.0.0`
