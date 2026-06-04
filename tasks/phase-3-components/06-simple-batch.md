# Task 06: Simple Components (Batch 1)

> Status: Pending | Deps: 03, 04 | Source: `src/Anchor/`, `src/Separator/`, `src/Handle/`, `src/Toolbar/`, `src/Hourglass/`, `src/Avatar/`, `src/Monitor/`

## Motivation

Seven components have minimal or zero styled-components logic. They're pure layout/style components that map cleanly to Tailwind utilities. Batching them together validates the approach across many component types without blocking on complex form/container components.

## What to build

### 1. Anchor (`src/Anchor/`)

**Original:** 33 lines. A styled `<a>` tag accessing `theme.anchor` and `theme.anchorVisited` colors. Optional `underline` prop.

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ underline = true, as: Component = "a", className, children, ...rest }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        "text-anchor visited:text-anchor-visited cursor-pointer",
        underline && "underline",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  ),
);
Anchor.displayName = "Anchor";
```

### 2. Separator (`src/Separator/`)

**Original:** 29 lines. Vertical or horizontal line with 3D bevel. Uses `getSize()` for dimension.

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "horizontal", size, as: Component = "div", className, ...rest }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        orientation === "horizontal"
          ? "w-full border-t border-border-dark border-b border-border-light h-0"
          : "h-full border-l border-border-dark border-r border-border-light w-0 inline-block",
        className,
      )}
      style={size ? (orientation === "horizontal" ? { width: getSize(size) } : { height: getSize(size) }) : undefined}
      {...rest}
    />
  ),
);
Separator.displayName = "Separator";
```

### 3. Handle (`src/Handle/`)

**Original:** 29 lines. A fixed-size (5px wide by default) vertical grab handle with 3D borders. Used in taskbar tray.

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

export const Handle = forwardRef<HTMLDivElement, HandleProps>(
  ({ size = 35, as: Component = "div", className, ...rest }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        "inline-block h-full",
        "border-l border-border-darkest border-r border-border-lightest",
        className,
      )}
      style={{ width: getSize(size) }}
      {...rest}
    />
  ),
);
Handle.displayName = "Handle";
```

### 4. Toolbar (`src/Toolbar/`)

**Original:** 29 lines. Simple flex container. No props except `noPadding`.

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ noPadding = false, as: Component = "div", className, children, ...rest }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        "flex items-center flex-1",
        !noPadding && "px-1",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  ),
);
Toolbar.displayName = "Toolbar";
```

### 5. Hourglass (`src/Hourglass/`)

**Original:** 38 lines. Displays an animated hourglass icon. Uses a base64-encoded animated GIF as background image.

**Decision:** Carry over the base64 string from the original `base64hourglass.tsx` verbatim. The Tailwind version only changes the wrapper -- the inner GIF rendering is identical.

```tsx
import clsx from "clsx";
import { forwardRef } from "react";
import { base64hourglass } from "./base64hourglass";

export const Hourglass = forwardRef<HTMLDivElement, HourglassProps>(
  ({ size = 32, as: Component = "div", className, ...rest }, ref) => (
    <Component
      ref={ref}
      className={clsx("inline-block bg-center bg-no-repeat bg-contain", className)}
      style={{
        width: getSize(size),
        height: getSize(size),
        backgroundImage: `url("${base64hourglass}")`,
      }}
      {...rest}
    />
  ),
);
Hourglass.displayName = "Hourglass";
```

### 6. Avatar (`src/Avatar/`)

**Original:** 86 lines. Image or icon avatar with optional Win95 border, round/square toggle.

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ noBorder = false, square = false, size = 48, src, children, as: Component = "div", className, ...rest }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center overflow-hidden bg-material",
        !noBorder && "border-raised p-[2px]",
        !square && "rounded-full",
        className,
      )}
      style={{ width: getSize(size), height: getSize(size) }}
      {...rest}
    >
      {src ? (
        <img src={src} alt="" className={clsx("w-full h-full object-cover", !square && "rounded-full")} />
      ) : (
        children
      )}
    </Component>
  ),
);
Avatar.displayName = "Avatar";
```

### 7. Monitor (`src/Monitor/`)

**Original:** ~30 lines. Decorative CRT monitor bezel frame with inset screen area.

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

export const Monitor = forwardRef<HTMLDivElement, MonitorProps>(
  ({ children, as: Component = "div", className, ...rest }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        "relative",
        "bg-material border-w95 p-[3px]",
        className,
      )}
      {...rest}
    >
      <div className="border-field bg-canvas p-2">
        {children}
      </div>
    </Component>
  ),
);
Monitor.displayName = "Monitor";
```

### Files

Create:

```
src/Anchor/
  Anchor.tsx
  index.ts
src/Separator/
  Separator.tsx
  index.ts
src/Handle/
  Handle.tsx
  index.ts
src/Toolbar/
  Toolbar.tsx
  index.ts
src/Hourglass/
  Hourglass.tsx
  base64hourglass.ts   # Copied verbatim from original (base64 GIF string)
  index.ts
src/Avatar/
  Avatar.tsx
  index.ts
src/Monitor/
  Monitor.tsx
  index.ts
```

Modify:

```
src/index.ts           # Add exports for all 7 components
```

Delete:

```
src/Anchor/Anchor.tsx           # Old version (rewritten)
src/Separator/Separator.tsx     # Old version
src/Handle/Handle.tsx           # Old version
src/Toolbar/Toolbar.tsx         # Old version (no props to preserve)
src/Hourglass/Hourglass.tsx     # Old version
src/Avatar/Avatar.tsx           # Old version
src/Monitor/Monitor.tsx         # Old version
# All .spec.tsx and .stories.tsx files in these dirs (re-added in Task 11)
```

## Acceptance criteria

- [ ] Anchor renders blue underlined link (respects `underline` prop)
- [ ] Anchor visited state renders purple
- [ ] Separator renders horizontal/vertical 3D bevel line
- [ ] Separator respects `size` prop
- [ ] Handle renders grab handle with correct 3D border colors
- [ ] Toolbar renders flex container with items centered
- [ ] Hourglass renders animated GIF at configurable size
- [ ] Avatar renders image with optional Win95 border + round/square toggle
- [ ] Monitor renders CRT bezel with inset screen
- [ ] All 7 components support `as` polymorphic prop
- [ ] All 7 components support `className` merging
- [ ] Visual output matches original `react95@4` components exactly
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
