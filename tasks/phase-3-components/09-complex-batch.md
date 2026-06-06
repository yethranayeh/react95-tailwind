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
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

const progressBarVariants = cva('relative border-sunken h-[22px] overflow-hidden', {
  variants: {
    variant: {
      default: '',
      tile: ''
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ variant = 'default', value = 0, hideValue = false, className, as: Component = 'div', ...rest }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <Component ref={ref} className={cn('relative', className)} {...rest}>
        <div className={cn(progressBarVariants({ variant }))}>
          <div
            className={cn(
              'h-full bg-progress transition-all duration-300',
              variant === 'tile' && 'bg-progress-tile animate-progress-tile'
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
        {!hideValue && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-material-text">
            {clampedValue}%
          </div>
        )}
      </Component>
    );
  },
);
ProgressBar.displayName = 'ProgressBar';
```

**CSS animation (in global.css):**
```css
@keyframes progress-tile {
  from { background-position: 0 0; }
  to { background-position: 16px 0; }
}
.bg-progress-tile {
  background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
  background-size: 16px 16px;
}
.animate-progress-tile {
  animation: progress-tile 1s linear infinite;
}
```

### 2. Counter

**Original:** ~80 lines. A multi-digit counter display with individual digit rendering.

**Tailwind approach:** Port the `Digit` component to render each digit's segments with Tailwind.

```tsx
export const Counter = forwardRef<HTMLDivElement, CounterProps>(
  ({ value, minHeight, minWidth, className, as: Component = 'div', ...rest }, ref) => (
    <Component
      ref={ref}
      className={cn('inline-flex bg-black p-1 border-sunken', className)}
      {...rest}
    >
      {/* Map digits to <Digit /> components */}
    </Component>
  )
);
Counter.displayName = 'Counter';
```

### 3. DatePicker

**Original:** ~150 lines. A calendar-like date picker with month/year navigation.

```tsx
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ className, as: Component = 'div', ...rest }, ref) => {
    // State and navigation logic...

    return (
      <Component ref={ref} className={cn('border-sunken bg-canvas p-2 inline-block', className)} {...rest}>
        <div className="flex items-center justify-between mb-2">
          <Button variant="thin" square size="sm" onClick={prevMonth}>◀</Button>
          <span className="text-material-text font-bold">{monthLabel} {year}</span>
          <Button variant="thin" square size="sm" onClick={nextMonth}>▶</Button>
        </div>
        {/* Calendar grid... */}
      </Component>
    );
  }
);
DatePicker.displayName = 'DatePicker';
```

### 4. TreeView

**Original:** ~120 lines. Hierarchical tree with expand/collapse, keyboard navigation.

```tsx
export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  ({ items, className, as: Component = 'div', ...rest }, ref) => (
    <Component ref={ref} role="tree" className={cn('bg-canvas border-field p-1', className)} {...rest}>
      {/* Recursive <TreeViewNode /> components */}
    </Component>
  )
);
TreeView.displayName = 'TreeView';
```

### 5. ColorInput

**Original:** ~50 lines. Wraps a native `<input type="color">` with Win95 border styling.

```tsx
export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, disabled, as: Component = 'div', ...rest }, ref) => (
    <Component className={cn('border-field bg-canvas p-[2px] inline-block', className)}>
      <input
        ref={ref}
        type="color"
        disabled={disabled}
        className="w-8 h-6 border-0 p-0 cursor-pointer bg-transparent"
        {...rest}
      />
    </Component>
  ),
);
ColorInput.displayName = 'ColorInput';
```

### 6. NumberInput

**Original:** ~60 lines. Wraps `TextInput` with up/down stepper buttons.

```tsx
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, as: Component = 'div', ...rest }, ref) => (
    <Component className={cn('inline-flex', className)}>
      <TextInput type="number" className="rounded-none" {...rest} />
      <div className="flex flex-col ml-[2px]">
        <Button variant="thin" square size="sm" tabIndex={-1}>▲</Button>
        <Button variant="thin" square size="sm" tabIndex={-1}>▼</Button>
      </div>
    </Component>
  ),
);
NumberInput.displayName = 'NumberInput';
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
src/global.css                     # Add @keyframes progress-tile and utility classes
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
