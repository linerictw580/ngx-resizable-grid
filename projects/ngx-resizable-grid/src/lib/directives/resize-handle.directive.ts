import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[resizeHandle]',
})
export class ResizeHandleDirective {
  @Output() dragStart = new EventEmitter();
  @Output() dragMove = new EventEmitter();
  @Output() dragEnd = new EventEmitter();

  private _isDragging = false;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    if (event.button === 0) {
      this._isDragging = true;
      this.dragStart.emit({ nativeEvent: event });
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    if (this._isDragging) {
      this._isDragging = false;
      this.dragEnd.emit({ nativeEvent: event });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (this._isDragging) {
      this.dragMove.emit({ nativeEvent: event });
    }
  }
}
