import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
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
  IResizeRowConfig,
  ResizeSource,
  ResizeXDir,
  ResizeYDir,
  RowResizeEvent,
} from '../../models/resize.model';

@Component({
  selector: 'resize-row',
  templateUrl: './resize-row.component.html',
  styleUrls: ['./resize-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeRowComponent implements OnInit, AfterViewInit {
  @ViewChildren(forwardRef(() => ResizeColComponent)) resizeCols!: QueryList<ResizeColComponent>;

  @HostBinding('style.flex-basis') flexBasis: any;
  @HostBinding('style.border-top-width') borderTopWidth!: string;
  @HostBinding('style.border-left-width') borderLeftWidth!: string;
  @HostBinding('style.border-right-width') borderRightWidth!: string;
  @HostBinding('style.border-bottom-width') borderBottomWidth!: string;
  @HostBinding('style.max-height') maxHeight!: string;
  @HostBinding('class.resize-row') resizeRow = true;
  @HostBinding('class.resizable') resizable = true;
  @HostBinding('attr.id') id!: string;

  @Input() row!: IResizeRowConfig;
  @Input() first!: boolean;
  @Input() last!: boolean;
  @Input() index!: number;
  @Input() directions!: ResizeYDir[];
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;
  @Input() spacing!: number;
  /**represents the index of layer this row is currently on (root layer is `1`) */
  @Input() layer!: number;
  @Input() parentId = '';

  @Output() rowResizeStart = new EventEmitter<RowResizeEvent>();
  @Output() rowResize = new EventEmitter<RowResizeEvent>();
  @Output() rowResizeEnd = new EventEmitter<RowResizeEvent>();

  private _uniqueId!: string;
  /**represents an unique identifier for this specific row */
  get uniqueId() {
    return this._uniqueId;
  }

  private _resizeYDir: ResizeYDir = 'none';
  private _resizeStartY!: number;
  private _nativeElement!: HTMLElement;

  private _style!: CSSStyleDeclaration;

  private _height!: number;
  private _heightFlex!: number;
  /**the current height percentage of this row (updates after every resize) */
  get heightFlex() {
    return this._heightFlex;
  }

  constructor(private _elem: ElementRef) {
    this._nativeElement = this._elem.nativeElement;
  }

  ngOnInit(): void {
    if (this.layer > 1) {
      this._uniqueId = this.parentId + '_row' + (this.index + 1);
    } else {
      this._uniqueId = 'row' + (this.index + 1);
    }
    this.id = this.uniqueId;

    this.borderTopWidth = this.first && this.layer === 1 ? this.spacing + 'px' : '0';
    this.borderLeftWidth = this.layer === 1 ? this.spacing + 'px' : '0';
    this.borderRightWidth = this.layer === 1 ? this.spacing + 'px' : '0';
    this.borderBottomWidth =
      this.layer === 1 || (this.layer !== 1 && !this.last) ? this.spacing + 'px' : '0';
    this.maxHeight = 'none';

    this._initFlexParams();
  }

  private _initFlexParams() {
    // start using flex instead of height to calculate row height while layer index is greater than 1
    if (this.layer > 1) {
      if (!this.row.heightFlex) {
        console.error(
          'ResizableGrid Error: `heightFlex` must be set with rows in layer 2 or higher.'
        );
      }
      if (this.row.height) {
        console.error(
          'ResizableGrid Error: use `heightFlex` instead of `height` with rows in layer 2 or higher.'
        );
      }
      this.flexBasis = `${this.row.heightFlex}%`;
      this._heightFlex = this.row.heightFlex ?? 0;
    } else {
      this.flexBasis = (this.row.height ?? 120) + 'px';
    }
  }

  ngAfterViewInit(): void {
    this._style = window.getComputedStyle(this._nativeElement);

    this.calcColsWidth();

    if (this.layer === 1) {
      // set root layer row max-height to a fixed height
      // to prevent row height from expanding while resizing sub layer rows
      this.maxHeight = this.getHeight() + 'px';

      // child components' ngAfterViewInit will be called before parent's
      // so instead of calling initChildRowsHeight inside each resize-col's ngAfterViewInit
      // we call initChildRowsHeight on the first layer to make sure parent's row height is correctly set before calculating child rows' height
      this._calcNestedRowsHeight(this.getHeight());
    }
  }

  private _calcNestedRowsHeight(rowHeight: number) {
    this.resizeCols.forEach((col) => {
      col.height = rowHeight + 'px';
      if (col.hasChildRows()) {
        col.calcChildRowsHeight(rowHeight);
      }
    });
  }

  onDragStart(e: any, dir: ResizeYDir) {
    const mouseEvent = e.nativeEvent as MouseEvent;

    this._resizeYDir = dir;
    this._resizeStartY = mouseEvent.clientY;

    this._height = this.getHeight();
    this.rowResizeStart.emit({
      index: this.index,
      last: this.last,
      newHeight: this.getHeight(),
    });
  }

  onDragMove(e: any) {
    const mouseEvent = e.nativeEvent as MouseEvent;
    const offset = this._resizeStartY - mouseEvent.clientY;
    const operand = this._resizeYDir === 'bottom' ? 1 : -1;

    const newHeight = Math.max(this._height - offset * operand, this.getMinHeight());

    this.rowResize.emit({
      index: this.index,
      last: this.last,
      newHeight,
    });
  }

  onDragEnd() {
    this.rowResizeEnd.emit({
      index: this.index,
      last: this.last,
      newHeight: this.getHeight(),
    });
  }

  hasNestedRows() {
    return this.resizeCols.some((col) => col.resizeRows.length > 0);
  }

  /**
   * get the available row width after subtracting gap heights
   * @param ignoreChildGap set to `true` if ignoring nested column gaps is desired (Default is `false`)
   * @returns
   */
  getRowAvailableWidth(ignoreChildGap = false) {
    const rowWidth = parseFloat(this._style.getPropertyValue('width'));
    const totalGapWidth = ignoreChildGap ? this.getSelfGapWidth() : this.getNestedTotalGapWidth();
    return rowWidth - totalGapWidth;
  }

  /**get only the gap width of current row (ignore nested child gaps) */
  getSelfGapWidth() {
    return Math.max(this.resizeCols.length - 1, 0) * this.spacing;
  }

  /**get the total gap width of current row including nested gap widths */
  getNestedTotalGapWidth() {
    return this.getSelfGapWidth() + this.getChildColsTotalGapWidth();
  }

  getChildColsTotalGapWidth(): number {
    if (!this.hasNestedRows()) {
      return 0;
    }

    const childColsMaxGapWidths = this.resizeCols.map((col) => {
      const colGapWidths = col.resizeRows.map((row) => {
        return row.getNestedTotalGapWidth();
      });
      return colGapWidths.length > 0 ? Math.max(...colGapWidths) : 0;
    });

    return childColsMaxGapWidths.reduce((acc, width) => {
      return acc + width;
    }, 0);
  }

  /**calculates the max row min height required */
  getNestedRowMinHeight() {
    return Math.max(this._getChildRowMaxRequiredMinHeight(), this.getMinHeight());
  }

  private _getChildRowMaxRequiredMinHeight(): number {
    if (!this.hasNestedRows()) {
      return 0;
    }

    const childRowMinHeightTotals = this.resizeCols.map((col) => {
      return col.resizeRows
        .map((row) => {
          return row.getNestedRowMinHeight();
        })
        .reduce((acc, minHeight) => {
          return acc + minHeight;
        }, 0);
    });

    return childRowMinHeightTotals.length > 0 ? Math.max(...childRowMinHeightTotals) : 0;
  }

  getHeight() {
    return parseFloat(this._style.getPropertyValue('height'));
  }

  getMinHeight() {
    return this.row.minHeight ?? 0;
  }

  /**gets the max gap height nested in the current row  */
  getNestedGapHeight() {
    return Math.max(
      ...this.resizeCols.map((col) => {
        return col.getNestedTotalGapHeight();
      })
    );
  }

  onColResizeEnd(e: ColResizeEvent) {
    const { index, last } = e;
    if (last) {
      return;
    }

    const nextCol = this.resizeCols.get(index + 1);
    nextCol?.setResizeWidth(nextCol.getWidth(), this.getRowAvailableWidth());
  }

  onColResize(e: ColResizeEvent) {
    const { index, last, newWidth } = e;
    if (last) {
      return;
    }

    const rowWidthToCalcRatio = this.getRowAvailableWidth(true);
    const currCol = this.resizeCols.get(index);
    const nextCol = this.resizeCols.get(index + 1);
    const otherCols = this.resizeCols.filter((item, i) => i !== index && i !== index + 1);

    const nextColMinWidth = nextCol?.getNestedColMinWidth() ?? 0;
    const otherColsTotalWidth = otherCols.reduce((acc, col) => {
      return acc + col.getWidth();
    }, 0);
    const nextColNewWidth = rowWidthToCalcRatio - (newWidth + otherColsTotalWidth);

    // nextColMinWidth already contains nested column gaps and column min width
    // so we must use rowWidthToCalcRatio (which doesn't contain nested column gaps) as the minuend
    const allowMaxWidth = rowWidthToCalcRatio - (nextColMinWidth + otherColsTotalWidth);

    const allowMinWidth = currCol?.getNestedColMinWidth() ?? 0;
    const nextColMaxWidth = rowWidthToCalcRatio - (allowMinWidth + otherColsTotalWidth);

    // stops column from expanding and pushing other columns out of the row's bounds
    if (newWidth > allowMaxWidth) {
      currCol?.setResizeWidth(allowMaxWidth, rowWidthToCalcRatio);
      nextCol?.setResizeWidth(nextColMinWidth, rowWidthToCalcRatio);
    } else if (newWidth < allowMinWidth) {
      currCol?.setResizeWidth(allowMinWidth, rowWidthToCalcRatio);
      nextCol?.setResizeWidth(nextColMaxWidth, rowWidthToCalcRatio);
    } else {
      currCol?.setResizeWidth(newWidth, rowWidthToCalcRatio);
      nextCol?.setResizeWidth(nextColNewWidth, rowWidthToCalcRatio);
    }
  }

  setMaxHeight(height: number | string) {
    this.maxHeight = typeof height === 'number' ? height + 'px' : height;
  }

  /**
   * sets the height of this resize row (exposed for external usage)
   * @param height
   * @param totalRowHeight used to calculate the height percentage of this row (only rows from layer index greater than `1` requires this)
   * @param source whether this resize action came from self resize or its ancestor row
   */
  setResizeHeight(height: number, totalRowHeight?: number, source = ResizeSource.SELF) {
    if (this.layer > 1) {
      this.flexBasis = height + 'px';

      // update a row's flex only when user directly resizes that specific row
      if (source === ResizeSource.SELF) {
        this._heightFlex = (height / (totalRowHeight ?? height)) * 100;
      }
    } else {
      // this.flexBasis = Math.max(height, this.getMinHeight()) + 'px';
      this.flexBasis = height + 'px';
    }

    this._calcNestedRowsHeight(height);
  }

  calcColsWidth() {
    // calculate every resize column's pixel width with the remaining row width (which doesn't contain gap widths)
    const availableWidth = this.getRowAvailableWidth(true);
    this.resizeCols.forEach((col) => {
      const flexRate = col.widthFlex * 0.01;
      const colWidth = availableWidth * flexRate;
      if (colWidth < col.getMinWidth()) {
        console.warn('ResizableGrid Error: Column flex width smaller than min width.');
      }
      col.setResizeWidth(colWidth, availableWidth);
    });
  }
}

@Component({
  selector: 'resize-col',
  templateUrl: './resize-col.component.html',
  styleUrls: ['./resize-col.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeColComponent implements OnInit, AfterViewInit {
  @ViewChildren(forwardRef(() => ResizeRowComponent)) resizeRows!: QueryList<ResizeRowComponent>;

  @HostBinding('style.flex-basis') flexBasis: any;
  @HostBinding('style.border-right-width') borderRightWidth!: string;
  @HostBinding('style.min-width') minWidth!: string;
  @HostBinding('style.height') height!: string;
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
    // add this to prevent width is NaN situations (ex: on a non-active tab which does not display the element on the DOM)
    // which leads to widthFlex is also set to NaN and causes calculation bug
    if (Number.isNaN(width)) {
      return;
    }

    this.flexBasis = width + 'px';

    // calculates and updates current column width percentage
    // in order to keep track of how many percentage every column was allocated after resizing
    this._widthFlex = (width / totalColumnWidth) * 100;

    // @HostBinding() not updating view bindings (flexBasis) while resize-container resizes and recalculates every resize-column's width
    // According to https://github.com/angular/angular/issues/22560 host bindings are part of parent's view
    // so we will have to call detectChanges from ChangeDetectorRef while using @SkipSelf decorator
    this._cdr.detectChanges();
  }

  calcChildRowsHeight(parentRowHeight: number) {
    const availableHeight = parentRowHeight - this.getSelfGapHeight();
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
