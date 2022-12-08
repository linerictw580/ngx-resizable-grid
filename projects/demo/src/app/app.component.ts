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

  sidenavOpen = false;

  resizeLayoutConfig: IResizeLayoutConfig = {
    // spacing: 16,
    rows: [
      {
        cols: [
          {
            key: 'block1',
            flex: 20,
            minWidth: 40,
          },
          {
            key: 'block2',
            flex: 20,
          },
          {
            key: 'block3',
            flex: 20,
            // minWidth: 200,
          },
          {
            key: 'block4',
            flex: 40,
            // minWidth: 200,
          },
        ],
      },
      {
        height: 200,
        minHeight: 60,
        cols: [
          {
            key: 'block5',
            flex: 100,
          },
        ],
      },
    ],
  };

  onToggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
