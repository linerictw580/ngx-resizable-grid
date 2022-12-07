export type ResizeDir = 'top' | 'bottom' | 'left' | 'right' | 'none';
export type ResizeXDir = 'left' | 'right' | 'none';
export type ResizeYDir = 'top' | 'bottom' | 'none';
export type ResizeAxis = 'x' | 'y' | null;

export interface IResizeLayoutConfig {
  rows: IResizeRowConfig[];
  spacing?: string;
}

export interface IResizeRowConfig {
  flex: number;
  cols: IResizeColConfig[];
}

export interface IResizeColConfig {
  flex: number;
  rows?: IResizeRowConfig[];
  key?: string;
}

export class ColResizeEvent {
  index!: number;
  last!: boolean;
  width!: number;
}
