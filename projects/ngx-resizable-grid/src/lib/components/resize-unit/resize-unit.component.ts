import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ResizeAxis, ResizeDir } from '../../models/resize.model';

@Component({
  selector: 'resize-unit',
  templateUrl: './resize-unit.component.html',
  styleUrls: ['./resize-unit.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ResizeUnitComponent implements OnInit, AfterViewInit {
  @HostBinding('class.resize-row') resizeRow = false;
  @HostBinding('class.resize-col') resizeCol = true;
  @HostBinding('class.resizable') resizable = true;
  // @HostBinding('style.width') width: any;
  // @HostBinding('style.height') height: any;
  @HostBinding('style.flex-basis') flexBasis: any;

  @Input() set type(value: 'row' | 'col') {
    this.resizeRow = value === 'row';
    this.resizeCol = value === 'col';
  }
  @Input() set flex(value: number) {
    this.flexBasis = `${value}%`;
  }
  @Input() directions: ResizeDir[] = ['none'];

  @Output() resizeStart = new EventEmitter();
  @Output() resizeMove = new EventEmitter();
  @Output() resizeEnd = new EventEmitter();

  private _resizeDir: ResizeDir = 'none';
  private _resizeAxis: ResizeAxis = null;
  private _resizeStart!: number;
  private _nativeElement!: HTMLElement;

  private _style!: CSSStyleDeclaration;

  private _width!: number;
  private _height!: number;

  private _info: any = {};

  constructor(private _host: ElementRef) {
    this._nativeElement = this._host.nativeElement;
  }

  ngOnInit(): void {
    // this.flexBasis =
    //   'flexBasis' in this._nativeElement.style
    //     ? 'flexBasis'
    //     : 'webkitFlexBasis' in this._nativeElement.style
    //     ? 'webkitFlexBasis'
    //     : 'msFlexPreferredSize' in this._nativeElement.style
    //     ? 'msFlexPreferredSize'
    //     : 'flexBasis';
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

  private _updateInfo(e: MouseEvent) {
    this._info['width'] = false;
    this._info['height'] = false;

    // if(this._resizeAxis === 'x') {

    // }
    // else if(this._resizeAxis === 'y') {

    // }
  }
}
