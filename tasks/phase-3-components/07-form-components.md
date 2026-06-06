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
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

const textInputVariants = cva(
  'px-2 py-1 font-sans text-material-text outline-none text-disabled-disabled',
  {
    variants: {
      variant: {
        default: 'border-field bg-canvas',
        flat: 'bg-flat border-0'
      },
      fullWidth: {
        true: 'w-full'
      },
      shadow: {
        true: 'custom-scrollbar'
      }
    },
    defaultVariants: {
      variant: 'default',
      fullWidth: false,
      shadow: false
    }
  }
);

export type TextInputProps = (
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
) &
  VariantProps<typeof textInputVariants> &
  CommonStyledProps & {
    multiline?: boolean;
  };

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(
  (
    { variant, multiline, fullWidth, shadow, className, as, ...rest },
    ref
  ) => {
    const Component = as || (multiline ? 'textarea' : 'input');

    return (
      <Component
        ref={ref as any}
        className={cn(
          textInputVariants({ variant, fullWidth, shadow }),
          className
        )}
        {...rest}
      />
    );
  }
);
TextInput.displayName = 'TextInput';
```

### 2. SwitchBase (shared Radio/Checkbox base)

**Original:** `src/common/SwitchBase.ts`. Shared styled-components across Radio and Checkbox.

```tsx
// src/common/SwitchBase.tsx
import React, { forwardRef } from 'react';
import { cn } from './utils';

export interface SwitchBaseProps extends React.HTMLAttributes<HTMLLabelElement> {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  children: React.ReactNode;
}

export const SwitchBase = forwardRef<HTMLInputElement, SwitchBaseProps>(
  ({ checked, disabled, label, className, children, inputProps, ...rest }, ref) => (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer',
        disabled && 'pointer-events-none',
        className
      )}
      {...rest}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="sr-only peer"
        {...inputProps}
      />
      <span className="w-5 h-5 inline-flex items-center justify-center peer-focus-visible:focus-outline">
        {children}
      </span>
      {label && (
        <span className={cn('select-none', disabled && 'text-disabled')}>
          {label}
        </span>
      )}
    </label>
  )
);
SwitchBase.displayName = 'SwitchBase';
```

### 3. Radio

**Original:** 146 lines. Uses `SwitchBase`. Circle indicator with center dot when checked.

```tsx
import React, { forwardRef } from 'react';
import { cn } from '../common/utils';
import { SwitchBase } from '../common/SwitchBase';

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ checked, disabled, label, className, ...rest }, ref) => (
    <SwitchBase
      ref={ref}
      checked={checked}
      disabled={disabled}
      label={label}
      className={className}
      inputProps={{ type: 'radio', ...rest }}
    >
      <span
        className={cn(
          'w-full h-full rounded-full border-w95 border-field bg-canvas',
          'flex items-center justify-center'
        )}
      >
        {checked && (
          <span className="w-[9px] h-[9px] rounded-full bg-material-text" />
        )}
      </span>
    </SwitchBase>
  )
);
Radio.displayName = 'Radio';
```

### 4. Checkbox

**Original:** 200 lines. Uses `SwitchBase`. Square indicator with checkmark (✓) or indeterminate dash.

```tsx
import React, { forwardRef } from 'react';
import { cn } from '../common/utils';
import { SwitchBase } from '../common/SwitchBase';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  indeterminate?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, disabled, indeterminate, label, className, ...rest }, ref) => (
    <SwitchBase
      ref={ref}
      checked={checked}
      disabled={disabled}
      label={label}
      className={className}
      inputProps={{ type: 'checkbox', ...rest }}
    >
      <span
        className={cn(
          'w-full h-full border-field bg-canvas',
          'flex items-center justify-center',
          checked && 'bg-hatched'
        )}
      >
        {checked && !indeterminate && (
          <svg viewBox="0 0 14 14" className="w-3 h-3" aria-hidden="true">
            <path
              d="M2 7 L5 10 L12 3"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        )}
        {indeterminate && <span className="w-[9px] h-[2px] bg-material-text" />}
      </span>
    </SwitchBase>
  )
);
Checkbox.displayName = 'Checkbox';
```

### 5. GroupBox

**Original:** 69 lines. `<fieldset>` + `<legend>`. Label truncated > 80% width.

```tsx
import React, { forwardRef } from 'react';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

export type GroupBoxProps = React.FieldsetHTMLAttributes<HTMLFieldSetElement> &
  CommonStyledProps & {
    label?: React.ReactNode;
  };

export const GroupBox = forwardRef<HTMLFieldSetElement, GroupBoxProps>(
  ({ label, disabled, children, className, as: Component = 'fieldset', ...rest }, ref) => (
    <Component
      ref={ref}
      disabled={disabled}
      className={cn('border-grouping border-2 p-3 pt-4 relative', className)}
      {...rest}
    >
      {label && (
        <legend className="px-1 max-w-[80%] truncate text-material-text text-sm">
          {label}
        </legend>
      )}
      <div className={cn(disabled && 'text-disabled pointer-events-none')}>
        {children}
      </div>
    </Component>
  )
);
GroupBox.displayName = 'GroupBox';
```

### 6. Select

**Original:** 291 lines across 5 files. Complex state management via `useSelectState` hook.

```tsx
import React, { forwardRef } from 'react';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';
// ... other imports

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, className, ...rest }, ref) => {
    // Ported logic using useSelectState...

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...rest}>
        <button
          className={cn(
            'border-raised bg-material px-3 py-1 w-full flex items-center justify-between'
          )}
        >
          <span>{selectedLabel}</span>
          <span className="ml-2">▼</span>
        </button>
        {open && (
          <div className="absolute top-full left-0 z-50 min-w-full border-window bg-material mt-[2px]">
            {options.map(opt => (
              <div
                key={opt.value}
                className={cn(
                  'px-3 py-1 cursor-pointer',
                  opt.selected && 'bg-hover-background text-material-text-invert'
                )}
                onClick={() => selectOption(opt)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
```

### 7. Slider

**Original:** 615 lines (largest component). Ported from MUI. Keyboard/mouse/touch input tracking, marks, orientation.

```tsx
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

const sliderVariants = cva('relative rounded-full', {
  variants: {
    orientation: {
      horizontal: 'h-1 w-full',
      vertical: 'w-1 h-full'
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
});

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ orientation, className, ...rest }, ref) => {
    // Complex logic ported from original...

    return (
      <div className={cn(sliderVariants({ orientation }), className)} {...rest}>
        {/* Track fill */}
        <div
          className={cn(
            'absolute bg-header-background',
            orientation === 'horizontal' ? 'h-full' : 'w-full'
          )}
          style={fillStyle}
        />
        {/* Thumb */}
        <div
          ref={thumbRef}
          className="absolute border-raised bg-material cursor-pointer w-5 h-5 -translate-x-1/2 -translate-y-1/2"
          style={thumbStyle}
          role="slider"
          tabIndex={0}
        />
      </div>
    );
  }
);
Slider.displayName = 'Slider';
```

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
