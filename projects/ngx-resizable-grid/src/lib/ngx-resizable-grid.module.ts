import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizeHandleDirective } from './directives/resize-handle.directive';
import { ResizeLayoutComponent } from './components/resize-layout/resize-layout.component';
import { ResizeLayoutTemplateDirective } from './directives/resize-layout-template.directive';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import {
  ResizeColComponent,
  ResizeRowComponent,
} from './components/resize-unit/resize-unit.component';

@NgModule({
  declarations: [
    ResizeHandleDirective,
    ResizeLayoutComponent,
    ResizeLayoutTemplateDirective,
    ResizeRowComponent,
    ResizeColComponent,
    ResizeObserverDirective,
  ],
  imports: [CommonModule],
  exports: [ResizeLayoutComponent, ResizeLayoutTemplateDirective],
})
export class NgxResizableGridModule {}
