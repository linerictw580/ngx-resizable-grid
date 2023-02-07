import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[resizeObserver]',
})
export class ResizeObserverDirective implements OnInit, OnDestroy {
  @Output() elementResize = new EventEmitter<any>();

  private _resize$!: Observable<any>;
  private _resizeSub!: Subscription;

  private _prevWidth: number | null = null;

  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {
    this._resize$ = new Observable((subscriber) => {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        const currentWidth = entry.contentRect.width;
        // Only emits when element width changes
        if (this._prevWidth === null || (this._prevWidth && this._prevWidth !== currentWidth)) {
          subscriber.next();
        }
        this._prevWidth = currentWidth;
      });

      resizeObserver.observe(this._elementRef.nativeElement);

      return () => {
        resizeObserver.disconnect();
      };
    });

    this._resizeSub = this._resize$.subscribe(() => {
      this.elementResize.emit();
    });
  }

  ngOnDestroy(): void {
    this._resizeSub?.unsubscribe();
  }
}
