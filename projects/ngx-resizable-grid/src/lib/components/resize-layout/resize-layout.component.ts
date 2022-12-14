import { ChangeDetectionStrategy, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import { IResizeLayoutConfig, RowResizeEvent } from '../../models/resize.model';
import { ResizeRowComponent } from '../resize-row/resize-row.component';

@Component({
  selector: 'resize-layout',
  templateUrl: './resize-layout.component.html',
  styleUrls: ['./resize-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  onRowResizeStart(e: RowResizeEvent) {
    const { index } = e;

    const currRow = this.resizeRows.get(index);
    currRow?.setMaxHeight('none');
  }

  onRowResizeEnd(e: RowResizeEvent) {
    const { index, newHeight } = e;

    const currRow = this.resizeRows.get(index);
    currRow?.setMaxHeight(newHeight);
  }

  onRowResize(e: RowResizeEvent) {
    const { index, newHeight } = e;

    const currRow = this.resizeRows.get(index);
    const allowMinHeight = currRow?.getNestedGapHeight() ?? 0;
    currRow?.setResizeHeight(Math.max(newHeight, allowMinHeight));
  }

  onContainerResize(index: number) {
    this.resizeRows.get(index)?.calcColsWidth();
  }
}
