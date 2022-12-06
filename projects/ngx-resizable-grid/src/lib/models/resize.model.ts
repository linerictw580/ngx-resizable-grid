import { TemplateRef } from '@angular/core';

export type ResizeDir = 'top' | 'bottom' | 'left' | 'right' | 'none';
export type ResizeAxis = 'x' | 'y' | null;

export interface IResizeLayoutConfig {
  rows: IResizeRowConfig[];
}

export interface IResizeRowConfig {
  flex: number;
  cols?: IResizeColConfig[];
  key?: string;
}

export interface IResizeColConfig {
  flex: number;
  rows?: IResizeRowConfig[];
  key?: string;
}
