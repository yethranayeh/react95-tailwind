# Task 09: Complex Components (Batch 2)

> Status: Pending | Deps: 07, 08 | Source: `src/ProgressBar/`, `src/Counter/`, `src/DatePicker/`, `src/TreeView/`, `src/ColorInput/`, `src/NumberInput/`

## Motivation

These six components are the most complex in the library. They combine form inputs, state management, keyboard navigation, and animated rendering. Each is substantial enough to warrant individual attention.

## What to build

### 1. ProgressBar

**Original:** 164 lines. Determinate progress bar with `default` and `tile` variants. Uses `useEffect` + `requestAnimationFrame` for tile animation.

**Tailwind approach:**
- `default` variant: solid fill bar with gradient animation via CSS
- `tile` variant: repeating tile blocks animated via CSS `@keyframes`
- `hideValue` prop hides percentage text
- Value range: 0-100

```tsx
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ variant = "default", value = 0, hideValue = false, className, ...rest }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div ref={ref} className={clsx("relative", className)} {...rest}>
        {variant === "default" ? (
          <div className="border-sunken h-[22px] relative">
            <div
              className="h-full bg-progress transition-all duration-300"
              style={{ width: `${clampedValue}%` }}
            />
          </div>
        ) : (
          <div className="border-sunken h-[22px] relative overflow-hidden">
            <div
              className="h-full bg-progress"
              style={{
                width: `${clampedValue}%`,
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
                backgroundSize: "16px 16px",
                animation: "progress-bar-tile 1s linear infinite",
              }}
            />
          </div>
        )}
        {!hideValue && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-material-text">
            {clampedValue}%
          </div>
        )}
      </div>
    );
  },
);
```

**CSS animation:**
```css
@keyframes progress-bar-tile {
  from { background-position: 0 0; }
  to { background-position: 16px 0; }
}
```

**Key decision:** The original uses `requestAnimationFrame` in a `useEffect`. We replace this with a pure CSS `@keyframes` animation -- simpler, no JS runtime cost, same visual.

### 2. Counter

**Original:** ~80 lines. A multi-digit counter display with individual digit rendering.

**Tailwind approach:** Port the `Digit` component to render each digit's segments with Tailwind. The digit rendering uses a segment-based approach (7-segment style or custom bitmap).

```tsx
// Digit.tsx -- renders a single digit
const DIGIT_PATTERNS: Record<string, boolean[]> = {
  "0": [true, true, true, true, true, true, false],
  "1": [false, true, true, false, false, false, false],
  // ... through "9"
};

export const Digit = ({ digit }: { digit: string }) => {
  const segments = DIGIT_PATTERNS[digit] ?? DIGIT_PATTERNS["0"];
  return (
    <div className="relative w-4 h-6">
      {/* 7 segments rendered as absolutely positioned divs */}
      {segments.map((on, i) => (
        <div
          key={i}
          className={clsx("absolute", on ? "bg-material-text" : "bg-material-text-disabled")}
          style={SEGMENT_STYLES[i]}
        />
      ))}
    </div>
  );
};
```

**Key decision:** This is a pure visual component with no styled-components dependency. The digit segment positions are hardcoded in `SEGMENT_STYLES`. Port from original with Tailwind classes for the segment coloring.

### 3. DatePicker

**Original:** ~150 lines. A calendar-like date picker with month/year navigation.

**Tailwind approach:** Pure CSS grid layout for the calendar. State management (selected date, current month) via React state. No styled-components needed.

```tsx
// Structure (simplified)
<div className="border-sunken bg-canvas p-2 inline-block">
  {/* Month/Year navigation */}
  <div className="flex items-center justify-between mb-2">
    <button className="border-thin-raised bg-material px-2 py-0" onClick={prevMonth}>◀</button>
    <span className="text-material-text font-bold">{monthLabel} {year}</span>
    <button className="border-thin-raised bg-material px-2 py-0" onClick={nextMonth}>▶</button>
  </div>
  {/* Day of week headers */}
  <div className="grid grid-cols-7 gap-0 text-center">
    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
      <div key={d} className="text-xs font-bold text-material-text px-2 py-1">{d}</div>
    ))}
  </div>
  {/* Calendar grid */}
  <div className="grid grid-cols-7 gap-0 text-center">
    {days.map((day, i) => (
      <button
        key={i}
        className={clsx(
          "px-2 py-1 text-sm",
          day.selected && "bg-header-background text-header-text",
          day.today && "font-bold",
          !day.selected && "text-material-text hover:bg-hover-background hover:text-material-text-invert",
        )}
        onClick={() => selectDay(day)}
      >
        {day.number}
      </button>
    ))}
  </div>
</div>
```

### 4. TreeView

**Original:** ~120 lines. Hierarchical tree with expand/collapse, keyboard navigation, icon support.

**Tailwind approach:**
- Tree nodes: indented with `pl-{level * 16}` inline style
- Expand/collapse toggle: `border-thin-raised` button with `+` / `-` text
- Selected node: `bg-header-background text-header-text`
- Focus: `focus-visible:focus-outline`
- Keyboard navigation: ArrowUp/Down/Left/Right, Enter, Space (already ported `KEYBOARD_KEY_CODES` in Task 01)

```tsx
// Simplified node structure
<div role="tree">
  {items.map(item => (
    <div key={item.id} role="treeitem" tabIndex={0} className="outline-none">
      <div
        className={clsx(
          "flex items-center gap-1 px-1 py-[2px] cursor-pointer select-none",
          item.selected && "bg-header-background text-header-text",
        )}
        style={{ paddingLeft: `${item.level * 16 + 4}px` }}
        onClick={() => toggleNode(item)}
        onKeyDown={(e) => handleKeyDown(e, item)}
      >
        {item.hasChildren && (
          <span className="border-thin-raised bg-material w-4 h-4 inline-flex items-center justify-center text-xs">
            {item.expanded ? "-" : "+"}
          </span>
        )}
        {item.icon && <img src={item.icon} alt="" className="w-4 h-4" />}
        <span>{item.label}</span>
      </div>
      {item.expanded && item.children && (
        <TreeViewNode items={item.children} /> {/* recursive */}
      )}
    </div>
  ))}
</div>
```

### 5. ColorInput

**Original:** ~50 lines. Wraps a native `<input type="color">` with Win95 border styling.

```tsx
export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, disabled, ...rest }, ref) => (
    <div className={clsx("border-field bg-canvas p-[2px] inline-block", className)}>
      <input
        ref={ref}
        type="color"
        disabled={disabled}
        className="w-8 h-6 border-0 p-0 cursor-pointer bg-transparent"
        {...rest}
      />
    </div>
  ),
);
```

### 6. NumberInput

**Original:** ~60 lines. Wraps `TextInput` with up/down stepper buttons.

**Tailwind approach:** Uses our new `TextInput` (Task 07) + two `Button` components (Task 05, `variant="thin"` + `square`):

```tsx
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, ...rest }, ref) => (
    <div className={clsx("inline-flex", className)}>
      <TextInput ref={ref} type="number" className="rounded-none" {...rest} />
      <div className="flex flex-col ml-[2px]">
        <Button variant="thin" square size="sm" onClick={stepUp} tabIndex={-1}>
          ▲
        </Button>
        <Button variant="thin" square size="sm" onClick={stepDown} tabIndex={-1}>
          ▼
        </Button>
      </div>
    </div>
  ),
);
```

### Files

Create:

```
src/ProgressBar/
  ProgressBar.tsx
  index.ts
src/Counter/
  Counter.tsx
  Digit.tsx
  index.ts
src/DatePicker/
  DatePicker.tsx
  index.ts
src/TreeView/
  TreeView.tsx
  index.ts
src/ColorInput/
  ColorInput.tsx
  index.ts
src/NumberInput/
  NumberInput.tsx
  index.ts
```

Modify:

```
src/global.css                     # Add @keyframes progress-bar-tile
src/index.ts                       # Add exports for all 6 components
```

Delete:

```
src/ProgressBar/ProgressBar.tsx    # Old version
src/Counter/*.tsx                  # Old versions
src/DatePicker/DatePicker.tsx      # Old version
src/TreeView/TreeView.tsx          # Old version
src/ColorInput/ColorInput.tsx      # Old version
src/NumberInput/NumberInput.tsx    # Old version
# All .spec.tsx and .stories.tsx files (re-added in Task 11)
```

## Acceptance criteria

- [ ] ProgressBar default variant shows solid fill bar
- [ ] ProgressBar tile variant shows animated tile pattern (pure CSS, no JS animation)
- [ ] ProgressBar `hideValue` hides percentage text
- [ ] Counter renders digits with correct 7-segment patterns
- [ ] DatePicker renders calendar grid with month/year navigation
- [ ] DatePicker navigation buttons match original style
- [ ] TreeView renders hierarchical tree with expand/collapse
- [ ] TreeView supports keyboard navigation (ArrowUp/Down/Left/Right)
- [ ] ColorInput wraps native color picker with Win95 border
- [ ] NumberInput wraps TextInput with up/down stepper buttons
- [ ] All components support `as` polymorphic prop
- [ ] Visual output matches original `react95@4` components exactly
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
