export type ResizeXDir = 'left' | 'right' | 'none';
export type ResizeYDir = 'top' | 'bottom' | 'none';

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
