import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[resizeObserver]',
})
export class ResizeObserverDirective implements OnInit, OnDestroy {
  @Output() elementResize = new EventEmitter<any>();

  private _resize$!: Observable<any>;
  private _resizeSub!: Subscription;

  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {
    this._resize$ = new Observable((subscriber) => {
      const resizeObserver = new ResizeObserver(() => {
        subscriber.next();
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
