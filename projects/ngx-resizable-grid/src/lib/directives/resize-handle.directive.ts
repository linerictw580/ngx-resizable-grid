import { Directive, EventEmitter, HostListener, NgZone, Output } from '@angular/core';

@Directive({
  selector: '[resizeHandle]',
})
export class ResizeHandleDirective {
  @Output() dragStart = new EventEmitter();
  @Output() dragMove = new EventEmitter();
  @Output() dragEnd = new EventEmitter();

  private _isDragging = false;

  constructor(private _ngZone: NgZone) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    if (event.button === 0) {
      this._isDragging = true;

      this._ngZone.runOutsideAngular(() => {
        document.addEventListener('mousemove', this._handleMouseMove);
        document.addEventListener('mouseup', this._handleMouseUp);
      });

      this.dragStart.emit({ nativeEvent: event });
    }
  }

  // @HostListener('document:mouseup', ['$event'])
  // onMouseUp(event: MouseEvent) {
  //   event.preventDefault();
  //   if (this._isDragging) {
  //     this._isDragging = false;
  //     this.dragEnd.emit({ nativeEvent: event });
  //   }
  //   document.removeEventListener('mousemove', this._handleMouseMove);
  // }

  private _handleMouseMove = (event: any) => {
    event.preventDefault();
    if (this._isDragging) {
      this.dragMove.emit({ nativeEvent: event });
    }
  };

  private _handleMouseUp = (event: any) => {
    event.preventDefault();
    if (this._isDragging) {
      this._isDragging = false;
      this.dragEnd.emit({ nativeEvent: event });
    }
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
  };

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   event.preventDefault();
  //   if (this._isDragging) {
  //     this.dragMove.emit({ nativeEvent: event });
  //   }
  // }
}
