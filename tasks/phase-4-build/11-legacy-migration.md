# Task 11: Legacy Components, Stories & Tests

> Status: Pending | Deps: 10 | Source: `src/legacy/`, `*.stories.tsx`, `*.spec.tsx`, `test/`

## Motivation

The original library has:
- **12 legacy/deprecated components** in `src/legacy/` -- still exported for backward compatibility
- **Storybook stories** for every component (visual development + documentation)
- **Jest tests** for component behavior

To be a complete replacement, we must carry these over.

## What to build

### 1. Legacy components (`src/legacy/`)

The 12 legacy components map to current components:

| Legacy | Maps to | Migration |
|--------|---------|-----------|
| `Bar` | `AppBar` | Re-export with deprecation warning |
| `Cutout` | `Frame variant="field"` | Thin wrapper |
| `Desktop` | `div` with `bg-desktop-background` | Simple `<div>` |
| `Divider` | `Separator` | Re-export with deprecation warning |
| `Fieldset` | `GroupBox` | Re-export with deprecation warning |
| `List` | `MenuList` | Re-export with deprecation warning |
| `ListItem` | `MenuListItem` | Re-export with deprecation warning |
| `NumberField` | `NumberInput` | Re-export with deprecation warning |
| `Panel` | `Frame variant="window"` | Thin wrapper |
| `Progress` | `ProgressBar` | Re-export with deprecation warning |
| `TextField` | `TextInput` | Re-export with deprecation warning |
| `Tree` | `TreeView` | Re-export with deprecation warning |

**Implementation pattern:**
```tsx
// src/legacy/Bar.tsx
import { AppBar } from "../AppBar/AppBar";

/** @deprecated Use `AppBar` instead. */
export const Bar = AppBar;
```

Add a `console.warn` in dev mode:
```tsx
import { useEffect } from "react";
import { AppBar, type AppBarProps } from "../AppBar/AppBar";

export function Bar(props: AppBarProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.warn("react95-tailwind: `Bar` is deprecated. Use `AppBar` instead.");
    }
  }, []);
  return <AppBar {...props} />;
}
```

### 2. Tests (Vitest migration)

Replace Jest with Vitest (same test syntax, Vite-native, faster):

**Install:**
```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Porting approach:**
- Each `*.spec.tsx` file becomes `*.test.tsx`
- `jest-styled-components` assertions → visual snapshot tests or DOM assertions
- Replace jest mocks with vi mocks (`jest.fn()` → `vi.fn()`)
- `jest.setTimeout` → `vi.setConfig({ testTimeout: ... })`

**Test structure for each component:**
```tsx
// src/Button/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("border-raised");
  });

  it("renders active state", () => {
    render(<Button active>Active</Button>);
    const button = screen.getByRole("button", { name: "Active" });
    expect(button).toHaveClass("border-sunken");
    expect(button).toHaveClass("bg-hatched");
  });

  it("renders disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("pointer-events-none");
  });

  it("supports as prop", () => {
    render(<Button as="a" href="/test">Link</Button>);
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("href", "/test");
  });
});
```

**Key testing strategy:**
- Unit tests focus on **props → classes** mapping (does `variant="flat"` produce the correct Tailwind class?)
- Component interaction tests use `@testing-library/react` (existing pattern, drop `jest-styled-components`)
- Visual regression: Instead of `jest-styled-components` snapshot tests, use Playwright screenshots (optional, lower priority)

**Test at minimum these 5 components** (most likely to regress):
1. Button (all variants, sizes, states)
2. Frame (all variants)
3. Window (header active/inactive, resize handle)
4. Tabs (selected tab, multi-row)
5. Slider (controlled/uncontrolled, keyboard navigation)

### 3. Stories (Storybook)

Re-add Storybook for visual development and documentation:

```bash
npx storybook@latest init
```

**Approach:**
- Use `@storybook/react-vite` (Vite-native, no webpack)
- Port existing stories, dropping all styled-components references
- Each story renders the component with all prop combinations

**Example Button story:**
```tsx
// src/Button/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["default", "raised", "flat", "thin"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    primary: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "OK" } };
export const Active: Story = { args: { children: "Pressed", active: true } };
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };
export const Primary: Story = { args: { children: "Primary", primary: true } };
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["default", "raised", "flat", "thin"] as const).map((variant) => (
        <Button key={variant} variant={variant}>{variant}</Button>
      ))}
    </div>
  ),
};
```

### Files

Create:

```
src/legacy/
  Bar.tsx
  Cutout.tsx
  Desktop.tsx
  Divider.tsx
  Fieldset.tsx
  List.tsx
  ListItem.tsx
  NumberField.tsx
  Panel.tsx
  Progress.tsx
  TextField.tsx
  Tree.tsx
src/Button/Button.test.tsx
src/Frame/Frame.test.tsx
src/Window/Window.test.tsx
src/Tabs/Tabs.test.tsx
src/Slider/Slider.test.tsx
src/Button/Button.stories.tsx                    # Start with Button, expand gradually
```

Modify:

```
src/index.ts                                     # Add legacy exports with @deprecated JSDoc
package.json                                     # Add vitest + storybook scripts
vite.config.ts                                   # Ensure test config works with vitest
```

Delete:

```
test/                                            # Old Jest test directory
src/*/**.spec.tsx                                # Old Jest spec files (replaced by .test.tsx)
src/*/**.stories.tsx                             # Old Storybook 6 stories (replaced)
```

## Acceptance criteria

- [ ] All 12 legacy components re-export current equivalents
- [ ] Legacy components log deprecation warning in dev mode
- [ ] `npm test` runs vitest with at least 5 component test files
- [ ] All tests pass (Button, Frame, Window, Tabs, Slider)
- [ ] `npm run storybook` opens Storybook with at least 10 component stories
- [ ] Legacy barrel exports maintain backward compatibility
- [ ] `npm run build` passes (tests excluded from dist)
- [ ] `npm run lint` passes
