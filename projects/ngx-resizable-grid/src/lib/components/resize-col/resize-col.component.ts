import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import { IResizeColConfig, ResizeAxis, ResizeDir } from '../../models/resize.model';

@Component({
  selector: 'resize-col',
  templateUrl: './resize-col.component.html',
  styleUrls: ['./resize-col.component.scss'],
})
export class ResizeColComponent implements OnInit, AfterViewInit {
  @HostBinding('style.flex-basis') flexBasis: any;
  @HostBinding('style.border-right-width') borderRightWidth!: string;
  @HostBinding('class.resize-col') resizeCol = true;
  @HostBinding('class.resizable') resizable = true;

  @Input() col!: IResizeColConfig;
  @Input() first!: boolean;
  @Input() last!: boolean;
  @Input() directions!: ResizeDir[];
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;
  @Input() spacing!: string;

  public get template() {
    return this.templates?.find((value) => value.key === this.col.key)?.templateRef;
  }

  private _resizeDir: ResizeDir = 'none';
  private _resizeAxis: ResizeAxis = null;
  private _resizeStart!: number;
  private _nativeElement!: HTMLElement;

  private _style!: CSSStyleDeclaration;

  private _width!: number;
  private _height!: number;

  constructor(private _elem: ElementRef) {
    this._nativeElement = this._elem.nativeElement;
  }

  ngOnInit(): void {
    this.flexBasis = `${this.col.flex}%`;
    this.borderRightWidth = this.last ? '0' : this.spacing;
  }

  ngAfterViewInit(): void {
    this._style = window.getComputedStyle(this._nativeElement);
  }

  getResizeAxis(dir: ResizeDir): ResizeAxis {
    if (dir === 'none') {
      return null;
    }
    return dir === 'left' || dir === 'right' ? 'x' : 'y';
  }

  onDragStart(e: any, dir: ResizeDir) {
    const mouseEvent = e.nativeEvent as MouseEvent;

    this._resizeDir = dir;
    this._resizeAxis = this.getResizeAxis(dir);
    this._resizeStart = this._resizeAxis === 'x' ? mouseEvent.clientX : mouseEvent.clientY;

    this._width = parseInt(this._style.getPropertyValue('width'));
    this._height = parseInt(this._style.getPropertyValue('height'));

    console.log('onDragStart');
  }

  onDragMove(e: any) {
    const mouseEvent = e.nativeEvent as MouseEvent;
    const offset =
      this._resizeStart - (this._resizeAxis === 'x' ? mouseEvent.clientX : mouseEvent.clientY);

    const operand = this._resizeDir === 'bottom' || this._resizeDir === 'right' ? 1 : -1;
    switch (this._resizeDir) {
      case 'top':
      case 'bottom':
        const height = this._height - offset * operand + 'px';
        this.flexBasis = height;
        break;

      case 'left':
      case 'right':
        const width = this._width - offset * operand + 'px';
        this.flexBasis = width;
        break;
    }

    console.log('onDragMove');
  }

  onDragEnd(e: any) {
    console.log('onDragEnd');
  }
}
