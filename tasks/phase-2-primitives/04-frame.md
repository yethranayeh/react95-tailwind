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
  shadow?: boolean;
}
```

Where `CommonStyledProps` includes `as` (polymorphic) and `className`.

### Implementation (Shadcn-style)

```tsx
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

const frameVariants = cva('relative border-w95', {
  variants: {
    variant: {
      window: 'border-window',
      button: 'border-raised',
      field: 'border-field bg-canvas text-canvas-text',
      status: 'border-sunken',
      // Deprecated -- map to closest equivalent
      outside: 'border-window',
      inside: 'border-sunken',
      well: 'border-sunken'
    },
    shadow: {
      true: 'shadow-tooltip'
    }
  },
  defaultVariants: {
    variant: 'window',
    shadow: false
  }
});

export type FrameProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof frameVariants> &
  CommonStyledProps & {
    children?: React.ReactNode;
  };

const Frame = forwardRef<HTMLDivElement, FrameProps>(
  (
    {
      children,
      shadow,
      variant,
      as: Component = 'div',
      className,
      ...otherProps
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(frameVariants({ variant, shadow }), className)}
        {...otherProps}
      >
        {children}
      </Component>
    );
  }
);

Frame.displayName = 'Frame';

export { Frame, frameVariants };
```

### Key design decisions

1. **Adopting CVA** -- Using `class-variance-authority` for variant management, following Shadcn conventions.
2. **`as` prop** via React's polymorphic pattern -- identical to original.
3. **`bg-canvas` class** added for `field` variant -- matches original's `background: theme.canvas` for input fields.
4. **Border colors come from CSS custom properties** set by the `data-theme` attribute -- no theme context needed.
5. **Preserve `shadow` prop** -- The undocumented `shadow` prop is preserved and mapped to `shadow-tooltip`.

### Files

Create:

```
src/Frame/
  Frame.tsx
  index.ts
```

Modify:

```
src/index.ts    # Add `export { Frame, FrameProps, frameVariants } from "./Frame/Frame";`
```

Delete:

```
src/Frame/Frame.tsx         # Old styled-components version (rewritten in place)
src/Frame/Frame.spec.tsx    # Will be re-added in Task 11
src/Frame/Frame.stories.tsx # Will be re-added in Task 11
```

## Acceptance criteria

- [x] `<Frame variant="window">` renders with `border-window` (raised outer bevel)
- [x] `<Frame variant="field">` renders with `border-field` (sunken field) + `bg-canvas`
- [x] `<Frame variant="status">` renders with `border-sunken`
- [x] `<Frame variant="button">` renders with `border-raised`
- [x] `as="section"` renders a `<section>` element (polymorphic)
- [x] `className` merges correctly with variant classes via `cn`
- [x] Visual output matches original `react95@4` Frame component exactly
- [x] `npm run build` passes
- [x] `npm run lint` passes
