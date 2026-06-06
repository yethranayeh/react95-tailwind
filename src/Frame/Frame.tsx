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
