import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { CommonStyledProps } from '../types';

export type FrameProps = {
  children?: React.ReactNode;
  shadow?: boolean;
} & (
  | {
      variant?: 'window' | 'button' | 'field' | 'status';
    }
  | {
      /** @deprecated Use 'window', 'button' or 'status' */
      variant?: 'outside' | 'inside' | 'well';
    }
) &
  React.HTMLAttributes<HTMLDivElement> &
  CommonStyledProps;

const variantClassMap: Record<string, string> = {
  window: 'border-window',
  button: 'border-raised',
  field: 'border-field bg-canvas text-canvas-text',
  status: 'border-sunken',
  // Deprecated -- map to closest equivalent
  outside: 'border-window',
  inside: 'border-sunken',
  well: 'border-sunken'
};

const Frame = forwardRef<HTMLDivElement, FrameProps>(
  (
    {
      children,
      shadow = false,
      variant = 'window',
      as: Component = 'div',
      className,
      ...otherProps
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          'relative border-w95',
          variantClassMap[variant as string],
          shadow && 'shadow-tooltip',
          className
        )}
        {...otherProps}
      >
        {children}
      </Component>
    );
  }
);

Frame.displayName = 'Frame';

export { Frame };
