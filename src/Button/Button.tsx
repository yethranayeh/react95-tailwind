import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../common/utils';
import { CommonStyledProps } from '../types';

const buttonVariants = cva(
  'inline-flex items-center justify-center border-w95 text-material-text font-sans select-none cursor-pointer focus-visible:focus-outline disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'border-raised bg-material px-2',
        raised: 'border-raised bg-material px-2 pt-[5px] pb-[6px]',
        flat: 'bg-flat border-0',
        thin: 'border-thin-raised bg-material px-1',
        menu: 'border-thin-raised bg-material px-1' // deprecated
      },
      size: {
        sm: 'h-[28px] min-h-[28px]',
        md: 'h-[36px] min-h-[36px]',
        lg: 'h-[44px] min-h-[44px]'
      },
      active: {
        true: ''
      },
      primary: {
        true: 'border border-solid border-[--color-border-darkest]'
      },
      fullWidth: {
        true: 'w-full'
      },
      square: {
        true: ''
      },
      disabled: {
        true: 'text-disabled'
      }
    },
    compoundVariants: [
      // Active states
      { variant: 'default', active: true, class: 'border-sunken bg-hatched' },
      {
        variant: 'raised',
        active: true,
        class: 'border-sunken bg-hatched pt-[6px] pb-[5px]'
      },
      { variant: 'flat', active: true, class: 'bg-flat-disabled border-sunken' },
      { variant: 'thin', active: true, class: 'border-thin-sunken bg-hatched' },
      { variant: 'menu', active: true, class: 'border-thin-sunken bg-hatched' },

      // Square sizes
      { square: true, size: 'sm', class: 'w-[28px]' },
      { square: true, size: 'md', class: 'w-[36px]' },
      { square: true, size: 'lg', class: 'w-[44px]' },

      // Disabled states
      { variant: 'flat', disabled: true, class: 'bg-canvas' }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> &
  VariantProps<typeof buttonVariants> &
  CommonStyledProps & {
    children?: React.ReactNode;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      active,
      disabled,
      primary,
      fullWidth,
      square,
      as: Component = 'button',
      className,
      children,
      ...otherProps
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        disabled={disabled ?? undefined}
        className={cn(
          buttonVariants({
            variant,
            size,
            active,
            disabled,
            primary,
            fullWidth,
            square
          }),
          className
        )}
        {...otherProps}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

const StyledButton = Button;

export { Button, StyledButton };
