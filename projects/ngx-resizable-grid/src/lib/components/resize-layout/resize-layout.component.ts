import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import { IResizeLayoutConfig } from '../../models/resize.model';
import { ResizeRowComponent } from '../resize-row/resize-row.component';

@Component({
  selector: 'resize-layout',
  templateUrl: './resize-layout.component.html',
  styleUrls: ['./resize-layout.component.scss'],
})
export class ResizeLayoutComponent {
  @ViewChildren(ResizeRowComponent) resizeRows!: QueryList<ResizeRowComponent>;

  @Input() config!: IResizeLayoutConfig;
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;

  public get spacing() {
    return this.config.spacing ?? 8;
  }

  private get cssVars() {
    return {
      '--resize-spacing': this.spacing + 'px',
    };
  }

  public get style() {
    return {
      ...this.cssVars,
    };
  }

  onContainerResize(index: number) {
    this.resizeRows.get(index)?.calcColsWidth();
  }
}
