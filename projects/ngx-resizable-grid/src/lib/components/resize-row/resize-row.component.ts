import {
  AfterViewInit,
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
  ResizeYDir,
  RowResizeEvent,
} from '../../models/resize.model';
import { ResizeColComponent } from '../resize-col/resize-col.component';

@Component({
  selector: 'resize-row',
  templateUrl: './resize-row.component.html',
  styleUrls: ['./resize-row.component.scss'],
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
  @HostBinding('class.resize-row') resizeRow = true;
  @HostBinding('class.resizable') resizable = true;

  @Input() row!: IResizeRowConfig;
  @Input() first!: boolean;
  @Input() last!: boolean;
  @Input() index!: number;
  @Input() directions!: ResizeYDir[];
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;
  @Input() spacing!: number;
  /**represents the index of layer this row is currently on (root layer is `1`) */
  @Input() layer!: number;

  @Output() rowResizeStart = new EventEmitter<RowResizeEvent>();
  @Output() rowResize = new EventEmitter<RowResizeEvent>();
  @Output() rowResizeEnd = new EventEmitter<RowResizeEvent>();

  private _resizeYDir: ResizeYDir = 'none';
  private _resizeStartY!: number;
  private _nativeElement!: HTMLElement;

  private _style!: CSSStyleDeclaration;

  private _height!: number;
  private _flex!: number;
  /**the current height percentage of this row (updates after every resize) */
  get flex() {
    return this._flex;
  }

  constructor(private _elem: ElementRef) {
    this._nativeElement = this._elem.nativeElement;
  }

  ngOnInit(): void {
    this.borderTopWidth = this.first && this.layer === 1 ? this.spacing + 'px' : '0';
    this.borderLeftWidth = this.layer === 1 ? this.spacing + 'px' : '0';
    this.borderRightWidth = this.layer === 1 ? this.spacing + 'px' : '0';
    this.borderBottomWidth =
      this.layer === 1 || (this.layer !== 1 && !this.last) ? this.spacing + 'px' : '0';

    this._initFlexParams();
  }

  private _initFlexParams() {
    // start using flex instead of height to calculate row height while layer index is greater than 1
    if (this.layer > 1) {
      if (!this.row.flex) {
        console.error('ResizableGrid Error: `flex` must be set with rows in layer 2 or higher.');
      }
      if (this.row.height) {
        console.error(
          'ResizableGrid Error: use `flex` instead of `height` with rows in layer 2 or higher.'
        );
      }
      this.flexBasis = `${this.row.flex}%`;
      this._flex = this.row.flex ?? 0;
    } else {
      this.flexBasis = (this.row.height ?? 120) + 'px';
    }
    this.flexGrow = 0;
    this.flexShrink = 0;
  }

  ngAfterViewInit(): void {
    this._style = window.getComputedStyle(this._nativeElement);

    this.calcColsWidth();
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

    const newHeight = this._height - offset * operand;

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

  /**取得扣掉 gap 之後剩餘的 row 寬度 */
  getRowAvailableWidth() {
    const rowWidth = parseFloat(this._style.getPropertyValue('width'));
    const totalGapWidth = Math.max(this.resizeCols.length - 1, 0) * this.spacing;
    return rowWidth - totalGapWidth;
  }

  getHeight() {
    return parseFloat(this._style.getPropertyValue('height'));
  }

  getMinHeight() {
    return this.row.minHeight ?? 0;
  }

  onColResizeStart(e: ColResizeEvent) {
    const { index, last } = e;
    if (last) {
      return;
    }

    const nextCol = this.resizeCols.get(index + 1);
    nextCol?.setFlexGrow(1);
    nextCol?.setFlexShrink(1);
  }

  onColResizeEnd(e: ColResizeEvent) {
    const { index, last } = e;
    if (last) {
      return;
    }

    const nextCol = this.resizeCols.get(index + 1);
    nextCol?.setResizeWidth(nextCol.getWidth(), this.getRowAvailableWidth());
    nextCol?.setFlexGrow(0);
    nextCol?.setFlexShrink(0);
  }

  onColResize(e: ColResizeEvent) {
    const { index, last, newWidth } = e;
    if (last) {
      return;
    }

    const rowWidth = this.getRowAvailableWidth();
    const currCol = this.resizeCols.get(index);
    const nextCol = this.resizeCols.get(index + 1);
    const otherCols = this.resizeCols.filter((item, i) => i !== index && i !== index + 1);

    const nextColMinWidth = nextCol?.getMinWidth() ?? 0;
    const otherColsTotalWidth = otherCols.reduce((acc, col) => {
      return acc + col.getWidth();
    }, 0);

    const allowMaxWidth = rowWidth - (nextColMinWidth + otherColsTotalWidth);
    // stops column from expanding and pushing other columns out of the row's bounds
    if (newWidth > allowMaxWidth) {
      currCol?.setResizeWidth(allowMaxWidth, rowWidth);
    } else {
      currCol?.setResizeWidth(newWidth, rowWidth);
    }
  }

  /**
   *
   * @param height
   * @param totalRowHeight used to calculate the height percentage of this row (only rows from layer index greater than `1` requires this)
   */
  setResizeHeight(height: number, totalRowHeight?: number) {
    if (this.layer > 1) {
      this.flexBasis = height + 'px';
      this._flex = (height / (totalRowHeight ?? height)) * 100;
      console.log(`layer${this.layer}`, this.flexBasis);
    } else {
      // this.flexBasis = Math.max(height, this.getMinHeight()) + 'px';
      this.flexBasis = height + 'px';
    }
    console.log('setResizeHeight', height);
  }

  setFlexGrow(value: any) {
    this.flexGrow = value;
  }

  setFlexShrink(value: any) {
    this.flexShrink = value;
  }

  calcColsWidth() {
    // 用扣掉 gap 之後的剩餘空間，去計算每個 resize-col 的 px 寬度
    const availableWidth = this.getRowAvailableWidth();
    this.resizeCols.forEach((col) => {
      const flexRate = col.flex * 0.01;
      const colWidth = availableWidth * flexRate;
      if (colWidth < col.getMinWidth()) {
        console.error('ResizableGrid Error: Column flex width smaller than min width.');
      }
      col.setResizeWidth(colWidth, availableWidth);
    });
  }
}
