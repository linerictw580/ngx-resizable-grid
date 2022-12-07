import { Component, Input, QueryList } from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import { IResizeLayoutConfig } from '../../models/resize.model';

@Component({
  selector: 'resize-layout',
  templateUrl: './resize-layout.component.html',
  styleUrls: ['./resize-layout.component.scss'],
})
export class ResizeLayoutComponent {
  @Input() config!: IResizeLayoutConfig;
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;

  public get spacing() {
    return this.config.spacing ?? '8px';
  }

  private get cssVars() {
    return {
      '--resize-spacing': this.spacing,
    };
  }

  public get style() {
    return {
      ...this.cssVars,
    };
  }
}
