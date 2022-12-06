import { TemplateRef } from '@angular/core';

export type ResizeDir = 'top' | 'bottom' | 'left' | 'right' | 'none';
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
