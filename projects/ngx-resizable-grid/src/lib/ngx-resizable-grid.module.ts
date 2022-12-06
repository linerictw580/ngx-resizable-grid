import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizeUnitComponent } from './components/resize-unit/resize-unit.component';
import { ResizeHandleDirective } from './directives/resize-handle.directive';
import { ResizeContainerComponent } from './components/resize-container/resize-container.component';
import { ResizeLayoutComponent } from './components/resize-layout/resize-layout.component';
import { ResizeLayoutTemplateDirective } from './directives/resize-layout-template.directive';
import { ResizeRowComponent } from './components/resize-row/resize-row.component';
import { ResizeColComponent } from './components/resize-col/resize-col.component';

@NgModule({
  declarations: [
    ResizeUnitComponent,
    ResizeHandleDirective,
    ResizeContainerComponent,
    ResizeLayoutComponent,
    ResizeLayoutTemplateDirective,
    ResizeRowComponent,
    ResizeColComponent,
  ],
  imports: [CommonModule],
  exports: [
    ResizeUnitComponent,
    ResizeContainerComponent,
    ResizeLayoutComponent,
    ResizeLayoutTemplateDirective,
  ],
})
export class NgxResizableGridModule {}
