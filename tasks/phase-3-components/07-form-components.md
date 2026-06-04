# Task 07: Form Components

> Status: Pending | Deps: 05, 06 | Source: `src/TextInput/`, `src/Radio/`, `src/Checkbox/`, `src/GroupBox/`, `src/Select/`, `src/Slider/`

## Motivation

Form components are the second tier of complexity after Button. They share border/focus/disabled patterns with Button but have additional logic:

- **TextInput**: Polymorphic (`<input>` vs `<textarea>` based on `multiline` prop), scrollbar integration
- **Radio/Checkbox**: Share `SwitchBase` pattern (hidden native input + styled visual indicator)
- **GroupBox**: `<fieldset>` + `<legend>` with label truncation
- **Select**: Complex state management (`useSelectState` hook), native fallback
- **Slider**: Most complex form control (ported from MUI), keyboard/mouse/touch support, marks

## What to build

### 1. TextInput

**Original:** 158 lines. `<input>` or `<textarea>` based on `multiline` prop. Uses discriminated union types for props.

**Tailwind implementation:**
```tsx
export const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
  ({ variant = "default", multiline = false, fullWidth = false, shadow = false, className, ...rest }, ref) => {
    const Component = multiline ? "textarea" : "input";
    const variantClass = variant === "flat" ? "bg-flat border-0" : "border-field bg-canvas";

    return (
      <Component
        ref={ref as any}
        className={clsx(
          "px-2 py-1 font-sans text-material-text outline-none",
          "text-disabled-disabled", // applies when :disabled
          variantClass,
          fullWidth && "w-full",
          shadow && "custom-scrollbar",
          className,
        )}
        {...rest}
      />
    );
  },
);
```

**Key decisions:**
- Discriminated union types ported from original (TypeScript-only, no SC dependency)
- `multiline` variant uses `<textarea>` with `resize: none` default (original behavior)
- `shadow` prop enables custom scrollbar (imports `StyledScrollView` equivalent)

### 2. SwitchBase (shared Radio/Checkbox base)

**Original:** `src/common/SwitchBase.ts`. Shared styled-components across Radio and Checkbox.

**Tailwind:** Extract into a reusable component:

```tsx
// src/common/SwitchBase.tsx
interface SwitchBaseProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean; // checkbox only
  label?: string;
  className?: string;
  children: React.ReactNode; // the visual indicator (radio circle / checkbox square)
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export const SwitchBase = forwardRef<HTMLInputElement, SwitchBaseProps>(
  ({ checked, disabled, label, className, children, inputProps, ...rest }, ref) => (
    <label className={clsx("inline-flex items-center gap-2 cursor-pointer", disabled && "pointer-events-none", className)} {...rest}>
      {/* Hidden native input for accessibility */}
      <input
        ref={ref}
        type="checkbox" // radio overrides this
        checked={checked}
        disabled={disabled}
        className="sr-only peer"
        {...inputProps}
      />
      {/* Visual indicator -- responds to peer focus */}
      <span className="w-5 h-5 inline-flex items-center justify-center peer-focus-visible:focus-outline">
        {children}
      </span>
      {/* Label text */}
      {label && <span className={clsx("select-none", disabled && "text-disabled")}>{label}</span>}
    </label>
  ),
);
```

### 3. Radio

**Original:** 146 lines. Uses `SwitchBase`. Circle indicator with center dot when checked.

```tsx
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ checked, disabled, label, className, ...rest }, ref) => (
    <SwitchBase ref={ref} checked={checked} disabled={disabled} label={label} className={className} inputProps={{ type: "radio", ...rest }}>
      {/* Radio circle */}
      <span className={clsx(
        "w-full h-full rounded-full border-w95 border-field bg-canvas",
        "flex items-center justify-center",
      )}>
        {checked && (
          <span className="w-[9px] h-[9px] rounded-full bg-material-text" />
        )}
      </span>
    </SwitchBase>
  ),
);
```

### 4. Checkbox

**Original:** 200 lines. Uses `SwitchBase`. Square indicator with checkmark (✓) or indeterminate dash.

```tsx
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, disabled, indeterminate, label, className, ...rest }, ref) => (
    <SwitchBase ref={ref} checked={checked} disabled={disabled} indeterminate={indeterminate} label={label} className={className} inputProps={{ type: "checkbox", ...rest }}>
      <span className={clsx(
        "w-full h-full border-field bg-canvas",
        "flex items-center justify-center",
        checked && "bg-hatched",
      )}>
        {checked && !indeterminate && (
          <svg viewBox="0 0 14 14" className="w-3 h-3" aria-hidden="true">
            <path d="M2 7 L5 10 L12 3" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
        {indeterminate && (
          <span className="w-[9px] h-[2px] bg-material-text" />
        )}
      </span>
    </SwitchBase>
  ),
);
```

### 5. GroupBox

**Original:** 69 lines. `<fieldset>` + `<legend>`. Label truncated > 80% width.

```tsx
export const GroupBox = forwardRef<HTMLFieldSetElement, GroupBoxProps>(
  ({ label, disabled, children, className, ...rest }, ref) => (
    <fieldset
      ref={ref}
      disabled={disabled}
      className={clsx("border-grouping border-2 p-3 pt-4 relative", className)}
      {...rest}
    >
      {label && (
        <legend className="px-1 max-w-[80%] truncate text-material-text text-sm">
          {label}
        </legend>
      )}
      <div className={clsx(disabled && "text-disabled pointer-events-none")}>
        {children}
      </div>
    </fieldset>
  ),
);
```

### 6. Select

**Original:** 291 lines across 5 files. Complex state management via `useSelectState` hook.

**Approach:**
- Port the `useSelectState` hook verbatim (pure logic, no styled-components)
- Style the trigger button and dropdown menu with Tailwind border classes
- Keep the native `<select>` fallback via `SelectNative`
- Dropdown: absolute-positioned `<div>` with `border-window`, list items with hover `bg-hover-background text-material-text-invert`

```tsx
// Core structure (simplified)
<div className="relative inline-block">
  <button className={clsx("border-raised bg-material px-3 py-1 w-full flex items-center justify-between", ...)}>
    <span>{selectedLabel}</span>
    <span className="ml-2">▼</span>
  </button>
  {open && (
    <div className="absolute top-full left-0 z-50 min-w-full border-window bg-material mt-[2px]">
      {options.map(opt => (
        <div
          key={opt.value}
          className={clsx("px-3 py-1 cursor-pointer", opt.selected && "bg-hover-background text-material-text-invert")}
          onClick={() => selectOption(opt)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  )}
</div>
```

### 7. Slider

**Original:** 615 lines (largest component). Ported from MUI. Keyboard/mouse/touch input tracking, marks, orientation.

**Approach:**
- Port the complex logic hooks (`useControlledOrUncontrolled`, `useEventCallback`, `useForkRef`, `useIsFocusVisible`) -- already ported in Task 01
- Style the track, thumb, and marks with Tailwind
- Track: `h-1 bg-material border-field` (horizontal) or `w-1 bg-material border-field` (vertical)
- Thumb: `w-5 h-5 bg-material border-raised cursor-pointer` (draggable)
- Active track fill: `bg-header-background`
- Marks: small dots/lines at step intervals

```tsx
// Track structure
<div className={clsx("relative rounded-full", orientation === "horizontal" ? "h-1 w-full" : "w-1 h-full")}>
  {/* Filled portion */}
  <div className={clsx("absolute bg-header-background", orientation === "horizontal" ? "h-full" : "w-full")}
    style={fillStyle} />
  {/* Thumb */}
  <div
    ref={thumbRef}
    className={clsx("absolute border-raised bg-material cursor-pointer", "w-5 h-5 -translate-x-1/2 -translate-y-1/2")}
    style={thumbStyle}
    role="slider"
    tabIndex={0}
    {...keyboardHandlers}
  />
  {/* Marks */}
  {marks?.map(mark => (
    <div key={mark.value} className="absolute w-[3px] h-[3px] bg-material-text rounded-full" style={markStyle(mark)} />
  ))}
</div>
```

### Cross-component dependencies

- `TextInput` imports custom scrollbar (`custom-scrollbar` from Task 03)
- `TextInput` with `multiline` uses `<textarea>` -- identical to original pattern
- `Radio` and `Checkbox` share `SwitchBase` component
- `Slider` imports hooks already ported in Task 01

### Files

Create:

```
src/common/SwitchBase.tsx
src/TextInput/
  TextInput.tsx
  index.ts
src/Radio/
  Radio.tsx
  index.ts
src/Checkbox/
  Checkbox.tsx
  index.ts
src/GroupBox/
  GroupBox.tsx
  index.ts
src/Select/
  Select.tsx
  SelectNative.tsx
  useSelectState.ts      # Ported verbatim from original
  index.ts
src/Slider/
  Slider.tsx
  index.ts
```

Modify:

```
src/index.ts             # Add exports for all 6 components
```

Delete:

```
src/TextInput/TextInput.tsx     # Old version
src/Radio/Radio.tsx             # Old version
src/Checkbox/Checkbox.tsx       # Old version
src/GroupBox/GroupBox.tsx       # Old version
src/Select/*.tsx                # Old versions
src/Slider/Slider.tsx           # Old version
src/common/SwitchBase.ts        # Old styled-components version
# All .spec.tsx and .stories.tsx files (re-added in Task 11)
```

## Acceptance criteria

- [ ] TextInput renders `<input>` by default, `<textarea>` with `multiline`
- [ ] TextInput shows `border-field` by default, flat variant shows no border
- [ ] TextInput disabled state matches original
- [ ] Radio shows circle indicator, filled when checked
- [ ] Checkbox shows square indicator with checkmark when checked
- [ ] Checkbox indeterminate shows horizontal dash
- [ ] Both Radio and Checkbox support `disabled` and `label` props
- [ ] GroupBox renders `<fieldset>` + `<legend>` with grouping border
- [ ] GroupBox label truncates at 80% width
- [ ] Select dropdown matches original (raised trigger, border-window menu)
- [ ] Select supports native `<select>` fallback
- [ ] Slider track/thumb/marks match original
- [ ] Slider supports keyboard navigation (arrow keys)
- [ ] Slider supports orientation (horizontal/vertical)
- [ ] All components support `as` polymorphic prop
- [ ] Visual output matches original `react95@4` components exactly
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
