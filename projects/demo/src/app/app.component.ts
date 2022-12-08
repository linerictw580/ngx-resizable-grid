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
        height: 120,
        minHeight: 60,
        cols: [
          {
            key: 'block5',
            flex: 50,
          },
          {
            flex: 50,
            rows: [
              {
                flex: 30,
                cols: [
                  {
                    key: 'block6',
                    flex: 100,
                  },
                ],
              },
              {
                flex: 30,
                cols: [
                  {
                    key: 'block7',
                    flex: 100,
                  },
                ],
              },
              {
                flex: 40,
                cols: [
                  {
                    flex: 100,
                    rows: [
                      {
                        flex: 100,
                        cols: [
                          {
                            key: 'block8',
                            flex: 50,
                          },
                          {
                            key: 'block9',
                            flex: 50,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  resizeLayoutConfig2: IResizeLayoutConfig = {
    rows: [
      {
        height: 200,
        cols: [
          {
            key: 'block1',
            flex: 20,
          },
          {
            key: 'block2',
            flex: 20,
          },
          {
            key: 'block3',
            flex: 20,
          },
          {
            key: 'block4',
            flex: 20,
          },
          {
            key: 'block5',
            flex: 20,
          },
        ],
      },
      {
        cols: [
          {
            key: 'block6',
            flex: 40,
          },
          {
            key: 'block7',
            flex: 60,
          },
        ],
      },
      {
        height: 200,
        cols: [
          {
            key: 'block8',
            flex: 40,
          },
          {
            key: 'block9',
            flex: 60,
          },
        ],
      },
    ],
  };

  resizeLayoutConfig3: IResizeLayoutConfig = {
    rows: [
      {
        cols: [
          {
            key: 'block1',
            flex: 100,
          },
        ],
      },
      {
        cols: [
          {
            flex: 80,
            rows: [
              {
                height: 100,
                cols: [
                  {
                    key: 'block3',
                    flex: 100,
                  },
                ],
              },
              {
                height: 200,
                cols: [
                  {
                    key: 'block4',
                    flex: 100,
                  },
                ],
              },
              {
                height: 100,
                cols: [
                  {
                    key: 'block5',
                    flex: 100,
                  },
                ],
              },
            ],
          },
          {
            flex: 20,
            rows: [
              {
                height: 200,
                cols: [
                  {
                    key: 'block5',
                    flex: 100,
                  },
                ],
              },
              {
                height: 200,
                cols: [
                  {
                    key: 'block6',
                    flex: 100,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  onToggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
