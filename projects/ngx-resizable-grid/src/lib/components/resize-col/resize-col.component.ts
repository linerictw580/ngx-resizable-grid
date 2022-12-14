import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  QueryList,
  SkipSelf,
  ViewChildren,
} from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import {
  ColResizeEvent,
  IResizeColConfig,
  ResizeSource,
  ResizeXDir,
  RowResizeEvent,
} from '../../models/resize.model';
import { ResizeRowComponent } from '../resize-row/resize-row.component';

@Component({
  selector: 'resize-col',
  templateUrl: './resize-col.component.html',
  styleUrls: ['./resize-col.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeColComponent implements OnInit, AfterViewInit {
  @ViewChildren(ResizeRowComponent) resizeRows!: QueryList<ResizeRowComponent>;

  @HostBinding('style.flex-basis') flexBasis: any;
  @HostBinding('style.border-right-width') borderRightWidth!: string;
  @HostBinding('style.min-width') minWidth!: string;
  @HostBinding('class.resize-col') resizeCol = true;
  @HostBinding('class.resizable') resizable = true;
  @HostBinding('attr.id') id!: string;

  @Input() col!: IResizeColConfig;
  @Input() first!: boolean;
  @Input() last!: boolean;
  @Input() index!: number;
  @Input() directions!: ResizeXDir[];
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;
  @Input() spacing!: number;
  /**represents the index of layer this column is currently on (root layer is `1`) */
  @Input() layer!: number;
  @Input() parentId!: string;

  @Output() colResizeStart = new EventEmitter<ColResizeEvent>();
  @Output() colResize = new EventEmitter<ColResizeEvent>();
  @Output() colResizeEnd = new EventEmitter<ColResizeEvent>();

  private _uniqueId!: string;
  /**represents an unique identifier for this specific column */
  get uniqueId() {
    return this._uniqueId;
  }

  public get template() {
    return this.templates?.find((value) => value.key === this.col.key)?.templateRef;
  }

  private _resizeXDir: ResizeXDir = 'none';
  private _resizeStartX!: number;
  private _nativeElement!: HTMLElement;

  private _style!: CSSStyleDeclaration;

  private _width!: number;
  private _widthFlex!: number;
  /**the current width percentage of this column (updates after every resize) */
  get widthFlex() {
    return this._widthFlex;
  }

  constructor(
    private _elem: ElementRef,
    // Skip the current's component changed detector and give access to the first ancestor (in this case the host component)
    @SkipSelf() private _cdr: ChangeDetectorRef
  ) {
    this._nativeElement = this._elem.nativeElement;
  }

  ngOnInit(): void {
    this._uniqueId = this.parentId + '_col' + (this.index + 1);
    this.id = this.uniqueId;

    this.flexBasis = `${this.col.widthFlex}%`;
    this.borderRightWidth = this.last ? '0' : this.spacing + 'px';
    // force minWidth to be at least 10 to prevent awkward 0-width behaviors
    this.minWidth =
      (this.col.minWidth ? (this.col.minWidth < 10 ? 10 : this.col.minWidth) : 10) + 'px';

    this._widthFlex = this.col.widthFlex;

    if (this.col.key && this.col.rows?.length) {
      console.error(
        `ResizableGrid Error: IResizeColConfig do not accept \`key\`(${this.col.key}) and \`rows\` at the same time.`
      );
    }
  }

  ngAfterViewInit(): void {
    this._style = window.getComputedStyle(this._nativeElement);
  }

  onDragStart(e: any, dir: ResizeXDir) {
    const mouseEvent = e.nativeEvent as MouseEvent;

    this._resizeXDir = dir;
    this._resizeStartX = mouseEvent.clientX;

    this._width = this.getWidth();
    this.colResizeStart.emit({
      index: this.index,
      last: this.last,
      newWidth: this.getWidth(),
    });
  }

  onDragMove(e: any) {
    const mouseEvent = e.nativeEvent as MouseEvent;
    const offset = this._resizeStartX - mouseEvent.clientX;
    const operand = this._resizeXDir === 'right' ? 1 : -1;

    const newWidth = Math.max(this._width - offset * operand, this.getMinWidth());

    this.colResize.emit({
      index: this.index,
      last: this.last,
      newWidth,
    });
  }

  onDragEnd() {
    this.colResizeEnd.emit({
      index: this.index,
      last: this.last,
      newWidth: this.getWidth(),
    });
  }

  hasChildRows() {
    return this.resizeRows.length > 0;
  }

  hasNestedCols() {
    return this.resizeRows.some((row) => row.resizeCols.length > 0);
  }

  /**
   * get the available column height after subtracting gap heights
   * @param ignoreChildGap set to `true` if ignoring nested row gaps is desired (Default is `false`)
   * @returns
   */
  getColumnAvailableHeight(ignoreChildGap = false): number {
    const colHeight = parseFloat(this._style.getPropertyValue('height'));
    const totalGapHeight = ignoreChildGap
      ? this.getSelfGapHeight()
      : this.getNestedTotalGapHeight();
    return colHeight - totalGapHeight;
  }

  /**get only the gap height of current column (ignore nested child gaps) */
  getSelfGapHeight() {
    return Math.max(this.resizeRows.length - 1, 0) * this.spacing;
  }

  /**get the total gap height of current column including nested gap heights */
  getNestedTotalGapHeight() {
    return this.getSelfGapHeight() + this._getChildRowsTotalGapHeight();
  }

  private _getChildRowsTotalGapHeight(): number {
    if (!this.hasChildRows()) {
      return 0;
    }

    const childRowsMaxGapHeights = this.resizeRows.map((row) => {
      return Math.max(
        ...row.resizeCols.map((col) => {
          return col.getNestedTotalGapHeight();
        })
      );
    });

    return childRowsMaxGapHeights.reduce((acc, height) => {
      return acc + height;
    }, 0);
  }

  /**calculates the max column min width required */
  getNestedColMinWidth() {
    return Math.max(this._getChildColMaxRequiredMinWidth(), this.getMinWidth());
  }

  private _getChildColMaxRequiredMinWidth(): number {
    if (!this.hasChildRows()) {
      return 0;
    }

    const childColMinWidthTotals = this.resizeRows.map((row) => {
      return row.resizeCols
        .map((col) => {
          return col.getNestedColMinWidth();
        })
        .reduce((acc, minWidth) => {
          return acc + minWidth + row.getChildColsTotalGapWidth();
        }, 0);
    });

    return childColMinWidthTotals.length > 0 ? Math.max(...childColMinWidthTotals) : 0;
  }

  getWidth() {
    return parseFloat(this._style.getPropertyValue('width'));
  }

  getMinWidth() {
    return parseFloat(this._style.getPropertyValue('min-width'));
  }

  onRowResize(e: RowResizeEvent) {
    const { index, last, newHeight } = e;
    // the last resize row inside of a resize column cannot be resized
    if (last) {
      return;
    }

    const colHeightToCalcRatio = this.getColumnAvailableHeight(true);
    const currRow = this.resizeRows.get(index);
    const nextRow = this.resizeRows.get(index + 1);
    const otherRows = this.resizeRows.filter((item, i) => i !== index && i !== index + 1);

    const nextRowMinHeight = nextRow?.getNestedRowMinHeight() ?? 0;
    const otherRowsTotalHeight = otherRows.reduce((acc, row) => {
      return acc + row.getHeight();
    }, 0);
    const nextRowNewHeight = colHeightToCalcRatio - (newHeight + otherRowsTotalHeight);

    // nextRowMinHeight already contains nested row gaps and row min width
    // so we must use colHeightToCalcRatio (which doesn't contain nested row gaps) as the minuend
    const allowMaxHeight = colHeightToCalcRatio - (nextRowMinHeight + otherRowsTotalHeight);

    const allowMinHeight = currRow?.getNestedRowMinHeight() ?? 0;
    const nextRowMaxHeight = colHeightToCalcRatio - (allowMinHeight + otherRowsTotalHeight);

    if (newHeight > allowMaxHeight) {
      currRow?.setResizeHeight(allowMaxHeight, colHeightToCalcRatio);
      nextRow?.setResizeHeight(nextRowMinHeight, colHeightToCalcRatio);
    } else if (newHeight < allowMinHeight) {
      currRow?.setResizeHeight(allowMinHeight, colHeightToCalcRatio);
      nextRow?.setResizeHeight(nextRowMaxHeight, colHeightToCalcRatio);
    } else {
      currRow?.setResizeHeight(newHeight, colHeightToCalcRatio);
      nextRow?.setResizeHeight(nextRowNewHeight, colHeightToCalcRatio);
    }
  }

  /**
   * sets the width of this resize column (exposed for external usage)
   * @param width
   * @param totalColumnWidth
   */
  setResizeWidth(width: number, totalColumnWidth: number) {
    this.flexBasis = width + 'px';

    // calculates and updates current column width percentage
    // in order to keep track of how many percentage every column was allocated after resizing
    this._widthFlex = (width / totalColumnWidth) * 100;

    // @HostBinding() not updating view bindings (flexBasis) while resize-container resizes and recalculates every resize-column's width
    // According to https://github.com/angular/angular/issues/22560 host bindings are part of parent's view
    // so we will have to call detectChanges from ChangeDetectorRef while using @SkipSelf decorator
    this._cdr.detectChanges();
  }

  initChildRowsHeight(parentRowHeight: number) {
    const availableHeight = parentRowHeight - this.getSelfGapHeight();
    this.resizeRows.forEach((row) => {
      const flexRate = row.heightFlex * 0.01;
      const rowHeight = availableHeight * flexRate;
      row.setResizeHeight(rowHeight, availableHeight, ResizeSource.ANCESTOR);
    });
  }

  calcChildRowsHeight(parentRowHeight: number) {
    const availableHeight = parentRowHeight - this.getNestedTotalGapHeight();
    this.resizeRows.forEach((row) => {
      const flexRate = row.heightFlex * 0.01;
      const rowHeight = availableHeight * flexRate;
      row.setResizeHeight(rowHeight, availableHeight, ResizeSource.ANCESTOR);
    });
  }

  onContainerResize(index: number) {
    this.resizeRows.get(index)?.calcColsWidth();
  }
}
