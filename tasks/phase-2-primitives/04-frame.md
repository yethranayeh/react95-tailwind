# Task 04: Frame

> Status: Complete | Deps: 03 | Source: `src/Frame/Frame.tsx` (68 lines)

## Motivation

`Frame` is the simplest styled component in the library and the ideal first component to validate the Tailwind approach. It's a `<div>` with configurable 3D borders. Every other container component builds on the same border pattern.

Original implementation: `styled.div` with `createBorderStyles` that switches border style based on a `variant` prop. Four variants: `window`, `button`, `field`, `status`, plus three deprecated (`outside`, `inside`, `well`).

## What to build

### API (unchanged)

```tsx
import { Frame } from "react95-tailwind";

<Frame variant="field">content</Frame>
<Frame variant="window" as="section">section content</Frame>
<Frame variant="status">status bar content</Frame>
```

### Props (unchanged)

```ts
interface FrameProps extends CommonStyledProps {
  variant?: "window" | "button" | "field" | "status";
  // Deprecated but still accepted:
  // "outside" | "inside" | "well" -- map to existing variants
  children?: React.ReactNode;
}
```

Where `CommonStyledProps` includes `as` (polymorphic) and `className`.

### Implementation

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

const variantClassMap: Record<string, string> = {
  window: "border-window",
  button: "border-raised",
  field: "border-field bg-canvas",
  status: "border-sunken",
  // Deprecated -- map to closest equivalent
  outside: "border-raised",
  inside: "border-sunken",
  well: "border-sunken",
};

export const Frame = forwardRef<HTMLDivElement, FrameProps>(
  ({ variant = "window", as: Component = "div", className, ...rest }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          "border-w95",
          variantClassMap[variant],
          className,
        )}
        {...rest}
      />
    );
  },
);
Frame.displayName = "Frame";
```

### Key design decisions

1. **No `styled()` needed** -- the variant→CSS class mapping replaces `createBorderStyles({style: variant})` entirely.
2. **`as` prop** via React's polymorphic pattern -- identical to original.
3. **`bg-canvas` class** added for `field` variant -- matches original's `background: theme.canvas` for input fields.
4. **Border colors come from CSS custom properties** set by the `data-theme` attribute -- no theme context needed.

### Files

Create:

```
src/Frame/
  Frame.tsx
  index.ts
```

Modify:

```
src/index.ts    # Add `export { Frame, FrameProps } from "./Frame/Frame";`
```

Delete:

```
src/Frame/Frame.tsx         # Old styled-components version (rewritten in place)
src/Frame/Frame.spec.tsx    # Will be re-added in Task 11
src/Frame/Frame.stories.tsx # Will be re-added in Task 11
```

## Acceptance criteria

- [ ] `<Frame variant="window">` renders with `border-window` (raised outer bevel)
- [ ] `<Frame variant="field">` renders with `border-field` (sunken field) + `bg-canvas`
- [ ] `<Frame variant="status">` renders with `border-sunken`
- [ ] `<Frame variant="button">` renders with `border-raised`
- [ ] `as="section"` renders a `<section>` element (polymorphic)
- [ ] `className` merges correctly with variant classes via `clsx`
- [ ] Visual output matches original `react95@4` Frame component exactly
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
