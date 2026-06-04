# Task 08: Container Components

> Status: Pending | Deps: 05, 06 | Source: `src/Window/`, `src/Tabs/`, `src/MenuList/`, `src/AppBar/`, `src/Table/`, `src/Tooltip/`

## Motivation

Container components are compound -- they have sub-components and internal state relationships. The most critical is `Window` (the library's signature component), followed by `Tabs` (multi-row tab layout), `MenuList` (hover invert pattern), and `Table` (7 sub-components, the most fragmented).

## What to build

### 1. Window (`src/Window/`)

**Original:** 3 files: `Window.tsx` (72 lines), `WindowHeader.tsx`, `WindowContent.tsx`. The iconic Win95 window with title bar.

**Window component:**
```tsx
export const Window = forwardRef<HTMLDivElement, WindowProps>(
  ({ resizable = false, shadow = true, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "bg-material p-[3px]",
        shadow && "shadow-[var(--shadow-out)]",
        className,
      )}
      {...rest}
    >
      {children}
      {resizable && <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[repeating-linear-gradient(135deg,var(--color-border-darkest),var(--color-border-darkest)_1px,transparent_1px,transparent_2px)]" />}
    </div>
  ),
);
```

**WindowHeader component:**
```tsx
export const WindowHeader = forwardRef<HTMLDivElement, WindowHeaderProps>(
  ({ active = true, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "flex items-center justify-between px-1 h-[30px] select-none",
        active
          ? "bg-header-background text-header-text"
          : "bg-header-not-active-background text-header-not-active-text",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
```

**WindowContent component:**
```tsx
export const WindowContent = forwardRef<HTMLDivElement, WindowContentProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx("p-4", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
```

**Key decisions:**
- Title bar gradient: The original uses a subtle gradient. Tailwind version uses solid color (header-background). If gradient is essential, add a custom class.
- Header buttons (minimize/maximize/close): These use `Button` (Task 05) with `variant="default"` and `square` + `size="sm"`. The original's `WindowHeader` imports `StyledButton` -- we'll compose the same way.
- Resize handle: CSS `repeating-linear-gradient` pattern, identical to original approach.
- `WindowHeader` renders children. Consumer composes title text + buttons  inside it. This is unchanged.

### 2. Tabs (`src/Tabs/`)

**Original:** 3 files: `Tabs.tsx` (110 lines), `Tab.tsx`, `TabBody.tsx`. Multi-row tab layout.

**Tabs component (container):**
```tsx
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, rows, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "flex flex-wrap border-b-2 border-border-dark",
        rows && `flex-wrap`,
        className,
      )}
      style={rows ? { maxHeight: `calc(${rows} * 30px + 2px)` } : undefined}
      {...rest}
    >
      {children}
    </div>
  ),
);
```

**Tab component:**
```tsx
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ selected = false, disabled = false, children, className, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={clsx(
        "border-raised px-3 py-1 bg-material text-material-text font-sans",
        "focus-visible:focus-outline",
        selected && "border-sunken -mb-[2px] border-b-canvas bg-canvas",
        disabled && "text-disabled",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  ),
);
```

**TabBody component:**
```tsx
export const TabBody = forwardRef<HTMLDivElement, TabBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={clsx("border-sunken bg-canvas p-4", className)} {...rest}>
      {children}
    </div>
  ),
);
```

**Key decisions:**
- Selected tab: `-mb-[2px]` negative margin to overlap the border, `border-b-canvas` to blend with content. This is the classic tab UI trick.
- Multi-row (`rows` prop): Controls `maxHeight` via inline style. Complex multi-row layout kept as-is from original.

### 3. MenuList (`src/MenuList/`)

**Original:** 36 lines + `MenuListItem.tsx`. Hover invert color pattern (`bg-hover-background text-material-text-invert`).

**MenuList container:**
```tsx
export const MenuList = forwardRef<HTMLUListElement, MenuListProps>(
  ({ fullWidth, inline, shadow = true, children, className, ...rest }, ref) => (
    <ul
      ref={ref}
      className={clsx(
        "list-none p-[2px] m-0 border-window bg-material",
        shadow && "shadow-[var(--shadow-out)]",
        inline && "inline-flex",
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  ),
);
```

**MenuListItem:**
```tsx
export const MenuListItem = forwardRef<HTMLLIElement, MenuListItemProps>(
  ({ disabled, square, primary, size, children, className, ...rest }, ref) => (
    <li
      ref={ref}
      className={clsx(
        "flex items-center px-2 py-1 cursor-pointer text-material-text",
        "hover:bg-hover-background hover:text-material-text-invert",
        disabled && "text-disabled pointer-events-none",
        primary && "font-bold",
        square && "aspect-square",
        className,
      )}
      {...rest}
    >
      {children}
    </li>
  ),
);
```

### 4. AppBar

**Original:** 45 lines. `<header>` with border + positioning.

```tsx
export const AppBar = forwardRef<HTMLElement, AppBarProps>(
  ({ position = "fixed", children, className, ...rest }, ref) => (
    <header
      ref={ref}
      className={clsx(
        "bg-material shadow-[var(--shadow-out)] p-[2px] flex items-center",
        position === "fixed" && "fixed bottom-0 left-0 right-0 z-50",
        position === "static" && "static",
        position === "sticky" && "sticky bottom-0",
        className,
      )}
      {...rest}
    >
      {children}
    </header>
  ),
);
```

### 5. Table (`src/Table/`)

**Original:** 45 lines + 6 sub-component files. Standard table with Win95 borders.

Each sub-component is a thin styled element:

| Sub-component | Tailwind |
|---------------|----------|
| `Table` | `<table className="border-sunken border-collapse w-full bg-canvas">` |
| `TableHead` | `<thead className="bg-material">` |
| `TableBody` | `<tbody>` |
| `TableRow` | `<tr className="border-b border-border-light">` |
| `TableHeadCell` | `<th className="border-raised px-2 py-1 text-left font-bold text-material-text">` |
| `TableDataCell` | `<td className="px-2 py-1 text-material-text">` |

### 6. Tooltip

**Original:** ~80 lines. Hover-based tooltip with Win95 border.

```tsx
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, text, delay = 1000, className, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const showTooltip = () => { timerRef.current = setTimeout(() => setShow(true), delay); };
    const hideTooltip = () => { clearTimeout(timerRef.current); setShow(false); };

    return (
      <div ref={ref} className={clsx("relative inline-block", className)} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} {...rest}>
        {children}
        {show && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 border-window bg-tooltip px-3 py-2 text-sm whitespace-nowrap shadow-[var(--shadow-tooltip)]">
            {text}
          </div>
        )}
      </div>
    );
  },
);
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
