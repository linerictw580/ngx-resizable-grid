import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import { ColResizeEvent, IResizeRowConfig, ResizeYDir } from '../../models/resize.model';
import { ResizeColComponent } from '../resize-col/resize-col.component';

@Component({
  selector: 'resize-row',
  templateUrl: './resize-row.component.html',
  styleUrls: ['./resize-row.component.scss'],
})
export class ResizeRowComponent implements OnInit, AfterViewInit {
  @ViewChildren(ResizeColComponent) resizeCols!: QueryList<ResizeColComponent>;

  @HostBinding('style.flex-basis') flexBasis: any;
  @HostBinding('style.border-top-width') borderTopWidth!: string;
  @HostBinding('class.resize-row') resizeRow = true;
  @HostBinding('class.resizable') resizable = true;

  @Input() row!: IResizeRowConfig;
  @Input() first!: boolean;
  @Input() last!: boolean;
  @Input() index!: number;
  @Input() directions!: ResizeYDir[];
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;
  @Input() spacing!: string;

  private _resizeYDir: ResizeYDir = 'none';
  private _resizeStartY!: number;
  private _nativeElement!: HTMLElement;

  private _style!: CSSStyleDeclaration;

  private _height!: number;

  constructor(private _elem: ElementRef) {
    this._nativeElement = this._elem.nativeElement;
  }

  ngOnInit(): void {
    this.flexBasis = `${this.row.flex}%`;
    this.borderTopWidth = this.first ? this.spacing : '0';
  }

  ngAfterViewInit(): void {
    this._style = window.getComputedStyle(this._nativeElement);
  }

  onDragStart(e: any, dir: ResizeYDir) {
    const mouseEvent = e.nativeEvent as MouseEvent;

    this._resizeYDir = dir;
    this._resizeStartY = mouseEvent.clientY;

    this._height = this.getHeight();
  }

  onDragMove(e: any) {
    const mouseEvent = e.nativeEvent as MouseEvent;
    const offset = this._resizeStartY - mouseEvent.clientY;
    const operand = this._resizeYDir === 'bottom' ? 1 : -1;

    const newHeight = this._height - offset * operand;
    this.flexBasis = newHeight + 'px';
  }

  onDragEnd(e: any) {}

  getWidth() {
    return parseFloat(this._style.getPropertyValue('width'));
  }

  getHeight() {
    return parseFloat(this._style.getPropertyValue('height'));
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
    nextCol?.setResizeWidth(nextCol.getWidth());
    nextCol?.setFlexGrow(0);
    nextCol?.setFlexShrink(0);
  }
}
