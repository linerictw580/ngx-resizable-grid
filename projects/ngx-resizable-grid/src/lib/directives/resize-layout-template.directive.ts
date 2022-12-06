import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[resizeLayoutTemplate]',
})
export class ResizeLayoutTemplateDirective {
  @Input() key!: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
