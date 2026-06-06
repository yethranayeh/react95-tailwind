# Task 05: Button

> Status: Pending | Deps: 04 | Source: `src/Button/Button.tsx` (220 lines)

## Motivation

`Button` is the most complex primitive component. It has:
- 4 variants: `default` (raised 3D), `raised` (taller 3D), `flat`, `thin`
- 3 sizes: `sm` (28px), `md` (36px), `lg` (44px)
- Active/pressed state with hatched background + sunken border
- Disabled state with greyed text + text shadow
- Primary mode with thicker outer border (`1px solid border-darkest`)
- `fullWidth` mode
- `square` mode (equal width/height)
- Focus outline (dotted)
- Deprecated `menu` variant

This is the acid test for whether the Tailwind approach works for complex Win95 styling.

## What to build

### API (unchanged)

```tsx
import { Button } from "react95-tailwind";

<Button variant="raised" size="lg" primary active>
  Click me
</Button>
```

### Props (unchanged)

```ts
interface ButtonProps extends CommonStyledProps {
  variant?: "default" | "raised" | "flat" | "thin" | "menu"; // menu deprecated
  size?: "sm" | "md" | "lg";
  active?: boolean;
  disabled?: boolean;
  primary?: boolean;
  fullWidth?: boolean;
  square?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  // ... all HTMLButtonElement props
}
```

### CVA Definition

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center border-w95 text-material-text font-sans select-none cursor-pointer focus-visible:focus-outline disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border-raised bg-material px-2",
        raised: "border-raised bg-material px-2 pt-[5px] pb-[6px]",
        flat: "bg-flat border-0",
        thin: "border-thin-raised bg-material px-1",
        menu: "border-thin-raised bg-material px-1", // deprecated
      },
      size: {
        sm: "h-[28px] min-h-[28px]",
        md: "h-[36px] min-h-[36px]",
        lg: "h-[44px] min-h-[44px]",
      },
      active: {
        true: "",
      },
      primary: {
        true: "border border-solid border-[--color-border-darkest]",
      },
      fullWidth: {
        true: "w-full",
      },
      square: {
        true: "",
      },
      disabled: {
        true: "text-disabled",
      },
    },
    compoundVariants: [
      // Active states
      { variant: "default", active: true, class: "border-sunken bg-hatched" },
      { variant: "raised", active: true, class: "border-sunken bg-hatched pt-[6px] pb-[5px]" },
      { variant: "flat", active: true, class: "bg-flat-disabled border-sunken" },
      { variant: "thin", active: true, class: "border-thin-sunken bg-hatched" },

      // Square sizes
      { square: true, size: "sm", class: "w-[28px]" },
      { square: true, size: "md", class: "w-[36px]" },
      { square: true, size: "lg", class: "w-[44px]" },

      // Disabled states
      { variant: "flat", disabled: true, class: "bg-canvas" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

### Implementation

```tsx
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../common/utils";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      active,
      disabled,
      primary,
      fullWidth,
      square,
      as: Component = "button",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        disabled={disabled}
        className={cn(
          buttonVariants({
            variant,
            size,
            active,
            disabled,
            primary,
            fullWidth,
            square,
          }),
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);
Button.displayName = "Button";
```

### Key decisions

1. **Hatched background**: Uses the `bg-hatched` utility from Task 03. Active state swaps border to `border-sunken` + applies hatched pattern.
2. **Raised variant text shift**: On press, the "raised" variant shifts text down 1px by reducing padding-top and increasing padding-bottom. This mimics the original 3D button press effect.
3. **Primary border**: `primary` adds a 1px solid border on top of the existing bevel, matching the original's thick outline. The color uses `--color-border-darkest` directly since Tailwind can't generate a utility for this one-off case.
4. **No SC dependency**: `$disabled` transient prop is replaced with plain `disabled` -- since this renders a native `<button>`, the disabled attribute is valid DOM.
5. **`StyledButton` export**: The original exports `StyledButton` for `WindowHeader` to compose. We'll export the same component under the same name for compatibility (it's the same component, just not a `styled.button`).
6. **CVA for variants**: Adopting Shadcn's approach using `class-variance-authority` and the `cn` utility for better maintainability and consistency.

### Files

Create:

```
src/Button/
  Button.tsx
  index.ts
```

Modify:

```
src/index.ts    # Add `export { Button, ButtonProps, StyledButton } from "./Button/Button";`
```

Delete:

```
src/Button/Button.tsx         # Old styled-components version (rewritten in place)
src/Button/Button.spec.tsx    # Will be re-added in Task 11
src/Button/Button.stories.tsx # Will be re-added in Task 11
```

## Acceptance criteria

- [ ] Default button renders with raised 3D border, material background, centered text
- [ ] Active state shows sunken border + hatched background
- [ ] Disabled state shows greyed text + text shadow
- [ ] Primary mode shows thick outer border
- [ ] All 4 variants render correctly (default, raised, flat, thin)
- [ ] All 3 sizes render correctly (28px, 36px, 44px height)
- [ ] Square mode renders equal width/height
- [ ] FullWidth mode fills container width
- [ ] Focus-visible shows dotted outline
- [ ] `as="a"` renders an anchor element
- [ ] Visual output matches original `react95@4` Button exactly in all state combinations
- [ ] `StyledButton` export exists for backward compatibility
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
