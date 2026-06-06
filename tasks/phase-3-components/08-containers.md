# Task 08: Container Components

> Status: Pending | Deps: 05, 06 | Source: `src/Window/`, `src/Tabs/`, `src/MenuList/`, `src/AppBar/`, `src/Table/`, `src/Tooltip/`

## Motivation

Container components are compound -- they have sub-components and internal state relationships. The most critical is `Window` (the library's signature component), followed by `Tabs` (multi-row tab layout), `MenuList` (hover invert pattern), and `Table` (7 sub-components, the most fragmented).

## What to build

### 1. Window (`src/Window/`)

**Original:** 3 files: `Window.tsx` (72 lines), `WindowHeader.tsx`, `WindowContent.tsx`. The iconic Win95 window with title bar.

**Window component:**
```tsx
import React, { forwardRef } from 'react';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

export interface WindowProps extends React.HTMLAttributes<HTMLDivElement>, CommonStyledProps {
  resizable?: boolean;
  shadow?: boolean;
}

export const Window = forwardRef<HTMLDivElement, WindowProps>(
  ({ resizable = false, shadow = true, children, className, as: Component = 'div', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'bg-material p-[3px] border-window',
        shadow && 'shadow-[var(--shadow-out)]',
        className
      )}
      {...rest}
    >
      {children}
      {resizable && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[repeating-linear-gradient(135deg,var(--color-border-darkest),var(--color-border-darkest)_1px,transparent_1px,transparent_2px)]" />
      )}
    </Component>
  )
);
Window.displayName = 'Window';
```

**WindowHeader component:**
```tsx
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

const windowHeaderVariants = cva(
  'flex items-center justify-between px-1 h-[30px] select-none',
  {
    variants: {
      active: {
        true: 'bg-header-background text-header-text',
        false: 'bg-header-not-active-background text-header-not-active-text'
      }
    },
    defaultVariants: {
      active: true
    }
  }
);

export interface WindowHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof windowHeaderVariants>,
    CommonStyledProps {}

export const WindowHeader = forwardRef<HTMLDivElement, WindowHeaderProps>(
  ({ active, children, className, as: Component = 'div', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn(windowHeaderVariants({ active }), className)}
      {...rest}
    >
      {children}
    </Component>
  )
);
WindowHeader.displayName = 'WindowHeader';
```

**WindowContent component:**
```tsx
export const WindowContent = forwardRef<HTMLDivElement, WindowContentProps>(
  ({ children, className, as: Component = 'div', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn('p-4', className)}
      {...rest}
    >
      {children}
    </Component>
  )
);
WindowContent.displayName = 'WindowContent';
```

### 2. Tabs (`src/Tabs/`)

**Original:** 3 files: `Tabs.tsx` (110 lines), `Tab.tsx`, `TabBody.tsx`. Multi-row tab layout.

**Tabs component (container):**
```tsx
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, rows, className, as: Component = 'div', style, ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'flex flex-wrap border-b-2 border-border-dark',
        className
      )}
      style={{
        ...(rows ? { maxHeight: `calc(${rows} * 30px + 2px)` } : {}),
        ...style
      }}
      {...rest}
    >
      {children}
    </Component>
  )
);
Tabs.displayName = 'Tabs';
```

**Tab component:**
```tsx
const tabVariants = cva(
  'border-raised px-3 py-1 bg-material text-material-text font-sans focus-visible:focus-outline',
  {
    variants: {
      selected: {
        true: 'border-sunken -mb-[2px] border-b-canvas bg-canvas'
      },
      disabled: {
        true: 'text-disabled'
      }
    },
    defaultVariants: {
      selected: false,
      disabled: false
    }
  }
);

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ selected, disabled, children, className, as: Component = 'button', ...rest }, ref) => (
    <Component
      ref={ref}
      disabled={disabled ?? undefined}
      className={cn(tabVariants({ selected, disabled }), className)}
      {...rest}
    >
      {children}
    </Component>
  )
);
Tab.displayName = 'Tab';
```

**TabBody component:**
```tsx
export const TabBody = forwardRef<HTMLDivElement, TabBodyProps>(
  ({ children, className, as: Component = 'div', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn('border-sunken bg-canvas p-4', className)}
      {...rest}
    >
      {children}
    </Component>
  )
);
TabBody.displayName = 'TabBody';
```

### 3. MenuList (`src/MenuList/`)

**Original:** 36 lines + `MenuListItem.tsx`. Hover invert color pattern (`bg-hover-background text-material-text-invert`).

**MenuList container:**
```tsx
export const MenuList = forwardRef<HTMLUListElement, MenuListProps>(
  ({ fullWidth, inline, shadow = true, children, className, as: Component = 'ul', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'list-none p-[2px] m-0 border-window bg-material',
        shadow && 'shadow-[var(--shadow-out)]',
        inline && 'inline-flex',
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  )
);
MenuList.displayName = 'MenuList';
```

**MenuListItem:**
```tsx
const menuListItemVariants = cva(
  'flex items-center px-2 py-1 cursor-pointer text-material-text hover:bg-hover-background hover:text-material-text-invert',
  {
    variants: {
      disabled: {
        true: 'text-disabled pointer-events-none'
      },
      primary: {
        true: 'font-bold'
      },
      square: {
        true: 'aspect-square'
      }
    },
    defaultVariants: {
      disabled: false,
      primary: false,
      square: false
    }
  }
);

export const MenuListItem = forwardRef<HTMLLIElement, MenuListItemProps>(
  ({ disabled, square, primary, children, className, as: Component = 'li', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn(menuListItemVariants({ disabled, square, primary }), className)}
      {...rest}
    >
      {children}
    </Component>
  )
);
MenuListItem.displayName = 'MenuListItem';
```

### 4. AppBar

**Original:** 45 lines. `<header>` with border + positioning.

```tsx
const appBarVariants = cva(
  'bg-material shadow-[var(--shadow-out)] p-[2px] flex items-center',
  {
    variants: {
      position: {
        fixed: 'fixed bottom-0 left-0 right-0 z-50',
        static: 'static',
        sticky: 'sticky bottom-0'
      }
    },
    defaultVariants: {
      position: 'fixed'
    }
  }
);

export const AppBar = forwardRef<HTMLElement, AppBarProps>(
  ({ position, children, className, as: Component = 'header', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn(appBarVariants({ position }), className)}
      {...rest}
    >
      {children}
    </Component>
  )
);
AppBar.displayName = 'AppBar';
```

### 5. Table (`src/Table/`)

**Original:** 45 lines + 6 sub-component files. Standard table with Win95 borders.

| Sub-component | Tailwind (Shadcn-style) |
|---------------|-------------------------|
| `Table` | `cn('border-sunken border-collapse w-full bg-canvas', className)` |
| `TableHead` | `cn('bg-material', className)` |
| `TableBody` | `className` |
| `TableRow` | `cn('border-b border-border-light', className)` |
| `TableHeadCell` | `cn('border-raised px-2 py-1 text-left font-bold text-material-text', className)` |
| `TableDataCell` | `cn('px-2 py-1 text-material-text', className)` |

### 6. Tooltip

**Original:** ~80 lines. Hover-based tooltip with Win95 border.

```tsx
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, text, delay = 1000, className, as: Component = 'div', ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const showTooltip = () => { timerRef.current = setTimeout(() => setShow(true), delay); };
    const hideTooltip = () => { clearTimeout(timerRef.current); setShow(false); };

    return (
      <Component ref={ref} className={cn('relative inline-block', className)} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} {...rest}>
        {children}
        {show && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 border-window bg-tooltip px-3 py-2 text-sm whitespace-nowrap shadow-[var(--shadow-tooltip)]">
            {text}
          </div>
        )}
      </Component>
    );
  },
);
Tooltip.displayName = 'Tooltip';
```

### Files

Create:

```
src/Window/
  Window.tsx
  WindowHeader.tsx
  WindowContent.tsx
  index.ts
src/Tabs/
  Tabs.tsx
  Tab.tsx
  TabBody.tsx
  index.ts
src/MenuList/
  MenuList.tsx
  MenuListItem.tsx
  index.ts
src/AppBar/
  AppBar.tsx
  index.ts
src/Table/
  Table.tsx
  TableBody.tsx
  TableDataCell.tsx
  TableHead.tsx
  TableHeadCell.tsx
  TableRow.tsx
  index.ts
src/Tooltip/
  Tooltip.tsx
  index.ts
```

Modify:

```
src/index.ts    # Add exports for all 6 container components + their sub-components
```

Delete:

```
src/Window/*.tsx               # Old versions
src/Tabs/*.tsx                 # Old versions
src/MenuList/*.tsx             # Old versions
src/AppBar/AppBar.tsx          # Old version
src/Table/*.tsx                # Old versions
src/Tooltip/Tooltip.tsx        # Old version
# All .spec.tsx and .stories.tsx files (re-added in Task 11)
```

## Acceptance criteria

- [ ] Window renders with material bg, title bar with active/inactive states, content area
- [ ] Window resize handle renders diagonal grip pattern
- [ ] Tabs render with horizontal tab bar, selected tab overlaps border
- [ ] Tab selected state shows `-mb-[2px]` border-blend effect
- [ ] MenuList renders with window border, hover invert colors on items
- [ ] MenuListItem shows hover background + text invert
- [ ] AppBar renders fixed-position bottom bar (configurable position)
- [ ] Table renders with Win95 3D borders on cells
- [ ] Tooltip shows on hover after delay, hides on mouse leave
- [ ] All sub-components exported (WindowHeader, WindowContent, Tab, TabBody, etc.)
- [ ] All components support `as` polymorphic prop
- [ ] Visual output matches original `react95@4` components exactly
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
