import { ElementType } from 'react';

export type Sizes = 'sm' | 'md' | 'lg';

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type DimensionValue = undefined | number | string;

export type CommonStyledProps = {
  /**
   * "as" polymorphic prop allows to render a different HTML element or React component
   */
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLDataAttributes = Record<`data-${string}`, any>;

export type CommonThemeProps = {
  'data-testid'?: string;
  $disabled?: boolean;
  shadow?: boolean;
};
