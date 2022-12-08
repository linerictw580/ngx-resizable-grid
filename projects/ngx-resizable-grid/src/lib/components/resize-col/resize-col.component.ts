import {
  AfterViewInit,
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
} from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import { ColResizeEvent, IResizeColConfig, ResizeXDir } from '../../models/resize.model';

@Component({
  selector: 'resize-col',
  templateUrl: './resize-col.component.html',
  styleUrls: ['./resize-col.component.scss'],
})
export class ResizeColComponent implements OnInit, AfterViewInit {
  @HostBinding('style.flex-basis') flexBasis: any;
  @HostBinding('style.flex-grow') flexGrow: any;
  @HostBinding('style.flex-shrink') flexShrink: any;
  @HostBinding('style.border-right-width') borderRightWidth!: string;
  @HostBinding('style.min-width') minWidth!: string;
  @HostBinding('class.resize-col') resizeCol = true;
  @HostBinding('class.resizable') resizable = true;

  @Input() col!: IResizeColConfig;
  @Input() first!: boolean;
  @Input() last!: boolean;
  @Input() index!: number;
  @Input() directions!: ResizeXDir[];
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;
  @Input() spacing!: number;

  @Output() colResizeStart = new EventEmitter<ColResizeEvent>();
  @Output() colResize = new EventEmitter<ColResizeEvent>();
  @Output() colResizeEnd = new EventEmitter<ColResizeEvent>();

  public get template() {
    return this.templates?.find((value) => value.key === this.col.key)?.templateRef;
  }

  private _resizeXDir: ResizeXDir = 'none';
  private _resizeStartX!: number;
  private _nativeElement!: HTMLElement;

  private _style!: CSSStyleDeclaration;

  private _width!: number;
  private _flex!: number;
  /**the current percentage of this column (updates after every resize) */
  get flex() {
    return this._flex;
  }

  constructor(
    private _elem: ElementRef,
    // Skip the current's component changed detector and give access to the first ancestor (in this case the host component)
    @SkipSelf() private _cdr: ChangeDetectorRef
  ) {
    this._nativeElement = this._elem.nativeElement;
  }

  ngOnInit(): void {
    this.flexBasis = `${this.col.flex}%`;
    this.flexGrow = 0;
    this.flexShrink = 0;
    this.borderRightWidth = this.last ? '0' : this.spacing + 'px';
    this.minWidth = (this.col.minWidth ?? 0) + 'px';

    this._flex = this.col.flex;
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

    const newWidth = this._width - offset * operand;

    this.colResize.emit({
      index: this.index,
      last: this.last,
      newWidth,
    });
  }

  onDragEnd(e: any) {
    this.colResizeEnd.emit({
      index: this.index,
      last: this.last,
      newWidth: this.getWidth(),
    });
  }

  getWidth() {
    return parseFloat(this._style.getPropertyValue('width'));
  }

  getMinWidth() {
    return parseFloat(this._style.getPropertyValue('min-width'));
  }

  /**
   * 設定 resize-col 寬度 (提供給外部作使用)
   * @param width
   */
  setResizeWidth(width: number, totalColumnWidth: number) {
    this.flexBasis = width + 'px';

    // calculates and updates current column width percentage
    // in order to keep track of how many percentage every column was allocated after resizing
    this._flex = (width / totalColumnWidth) * 100;

    // @HostBinding() not updating view bindings (flexBasis) while resize-container resizes and recalculates every resize-column's width
    // According to https://github.com/angular/angular/issues/22560 host bindings are part of parent's view
    // so we will have to call detectChanges from ChangeDetectorRef while using @SkipSelf decorator
    this._cdr.detectChanges();
  }

  setFlexGrow(value: any) {
    this.flexGrow = value;
  }

  setFlexShrink(value: any) {
    this.flexShrink = value;
  }
}
