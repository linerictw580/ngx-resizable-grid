import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import {
  ColResizeEvent,
  IResizeRowConfig,
  ResizeSource,
  ResizeYDir,
  RowResizeEvent,
} from '../../models/resize.model';
import { ResizeColComponent } from '../resize-col/resize-col.component';

@Component({
  selector: 'resize-row',
  templateUrl: './resize-row.component.html',
  styleUrls: ['./resize-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeRowComponent implements OnInit, AfterViewInit {
  @ViewChildren(ResizeColComponent) resizeCols!: QueryList<ResizeColComponent>;

  @HostBinding('style.flex-basis') flexBasis: any;
  @HostBinding('style.flex-grow') flexGrow: any;
  @HostBinding('style.flex-shrink') flexShrink: any;
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
    this.flexGrow = 0;
    this.flexShrink = 0;
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
      this._initNestedRowsHeight(this.getHeight());
    }
  }

  private _initNestedRowsHeight(rowHeight: number) {
    this.resizeCols.forEach((col) => {
      if (col.hasChildRows()) {
        col.initChildRowsHeight(rowHeight);
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

    const newHeight = Math.max(this._height - offset * operand, 0);

    this.rowResize.emit({
      index: this.index,
      last: this.last,
      newHeight,
    });
  }

  onDragEnd(e: any) {
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

  onColResizeStart(e: ColResizeEvent) {
    const { index, last } = e;
    if (last) {
      return;
    }

    const nextCol = this.resizeCols.get(index + 1);
    // nextCol?.setFlexGrow(1);
    // nextCol?.setFlexShrink(1);
  }

  onColResizeEnd(e: ColResizeEvent) {
    const { index, last } = e;
    if (last) {
      return;
    }

    const nextCol = this.resizeCols.get(index + 1);
    nextCol?.setResizeWidth(nextCol.getWidth(), this.getRowAvailableWidth());
    // nextCol?.setFlexGrow(0);
    // nextCol?.setFlexShrink(0);
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

    // stops column from expanding and pushing other columns out of the row's bounds
    if (newWidth > allowMaxWidth) {
      currCol?.setResizeWidth(allowMaxWidth, rowWidthToCalcRatio);
      nextCol?.setResizeWidth(nextColMinWidth, rowWidthToCalcRatio);
    } else {
      currCol?.setResizeWidth(newWidth, rowWidthToCalcRatio);
      nextCol?.setResizeWidth(nextColNewWidth, rowWidthToCalcRatio);
    }
  }

  setMaxHeight(height: number | string) {
    this.maxHeight = typeof height === 'number' ? height + 'px' : height;
  }

  /**
   *
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

    this._initNestedRowsHeight(height);
  }

  setFlexBasisAuto() {
    // this.flexBasis = 'auto';

    this.resizeCols.forEach((col) => {
      if (col.hasChildRows()) {
        col.resizeRows.forEach((row) => {
          row.setFlexBasisAuto();
        });
      }
    });
  }

  setFlexGrow(value: any) {
    this.flexGrow = value;

    this.resizeCols.forEach((col) => {
      if (col.hasChildRows()) {
        col.resizeRows.forEach((row) => {
          row.setFlexGrow(value);
        });
      }
    });
  }

  setFlexShrink(value: any) {
    this.flexShrink = value;

    this.resizeCols.forEach((col) => {
      if (col.hasChildRows()) {
        col.resizeRows.forEach((row) => {
          row.setFlexShrink(value);
        });
      }
    });
  }

  calcColsWidth() {
    // 用扣掉 gap 之後的剩餘空間，去計算每個 resize-col 的 px 寬度
    const availableWidth = this.getRowAvailableWidth(true);
    this.resizeCols.forEach((col) => {
      const flexRate = col.widthFlex * 0.01;
      const colWidth = availableWidth * flexRate;
      if (colWidth < col.getMinWidth()) {
        console.error('ResizableGrid Error: Column flex width smaller than min width.');
      }
      col.setResizeWidth(colWidth, availableWidth);
    });
  }
}
