import { Component, Input, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { ResizeLayoutTemplateDirective } from '../../directives/resize-layout-template.directive';
import { IResizeLayoutConfig } from '../../models/resize.model';

@Component({
  selector: 'resize-layout',
  templateUrl: './resize-layout.component.html',
  styleUrls: ['./resize-layout.component.scss'],
})
export class ResizeLayoutComponent implements OnInit {
  @Input() config!: IResizeLayoutConfig;
  @Input() templates!: QueryList<ResizeLayoutTemplateDirective>;

  constructor() {}

  ngOnInit(): void {}
}
