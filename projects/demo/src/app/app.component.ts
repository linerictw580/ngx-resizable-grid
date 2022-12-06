import { Component, QueryList, ViewChildren } from '@angular/core';
import { ResizeLayoutTemplateDirective } from 'ngx-resizable-grid';
import { IResizeLayoutConfig } from 'projects/ngx-resizable-grid/src/lib/models/resize.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChildren(ResizeLayoutTemplateDirective)
  layoutTemplates!: QueryList<ResizeLayoutTemplateDirective>;

  resizeLayoutConfig: IResizeLayoutConfig = {
    rows: [
      {
        flex: 30,
        cols: [
          {
            key: 'block1',
            flex: 40,
          },
          {
            key: 'block2',
            flex: 40,
          },
          {
            key: 'block3',
            flex: 20,
          },
        ],
      },
      {
        key: 'block4',
        flex: 30,
      },
    ],
  };
}
