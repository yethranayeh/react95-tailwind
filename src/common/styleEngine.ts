export function getSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export type BorderStyles =
  | 'button'
  | 'buttonPressed'
  | 'buttonThin'
  | 'buttonThinPressed'
  | 'field'
  | 'grouping'
  | 'status'
  | 'window';

export const borderStyleMap: Record<BorderStyles, string> = {
  button: 'border-raised',
  buttonPressed: 'border-sunken',
  buttonThin: 'border-thin-raised',
  buttonThinPressed: 'border-thin-sunken',
  field: 'border-field',
  grouping: 'border-grouping',
  status: 'border-status',
  window: 'border-window'
};
