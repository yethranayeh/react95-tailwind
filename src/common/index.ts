import { Theme, BorderStyles } from '../types';

export const shadow = '4px 4px 10px 0 rgba(0, 0, 0, 0.35)';
export const insetShadow = 'inset 2px 2px 3px rgba(0,0,0,0.2)';

export const createDisabledTextStyles = () => '';

export const createBoxStyles = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: {
    background?: keyof Theme;
    color?: keyof Theme;
  } = {}
) => '';

export const createHatchedBackground = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: {
    mainColor?: string;
    secondaryColor?: string;
    pixelSize?: number;
  } = {}
) => '';

export const createFlatBoxStyles = () => '';

export const createBorderStyles = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: { invert?: boolean; style?: BorderStyles } = {}
) => '';

/** @deprecated Use `createBorderStyles` instead */
export const createWellBorderStyles = (_invert = false) => '';

export const focusOutline = () => '';

export const createScrollbars = (_variant = 'default') => '';
