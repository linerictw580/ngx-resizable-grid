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
        height: 240,
        minHeight: 60,
        cols: [
          {
            key: 'block5',
            flex: 50,
            minWidth: 5,
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
                flex: 70,
                cols: [
                  {
                    flex: 100,
                    // key: 'block8',
                    rows: [
                      {
                        flex: 100,
                        cols: [
                          {
                            // key: 'block8',
                            flex: 100,
                            rows: [
                              {
                                flex: 33.33,
                                cols: [
                                  {
                                    flex: 100,
                                    key: 'block8',
                                  },
                                ],
                              },
                              {
                                flex: 33.33,
                                cols: [
                                  {
                                    flex: 100,
                                    key: 'block4',
                                  },
                                ],
                              },
                              {
                                flex: 33.33,
                                cols: [
                                  {
                                    flex: 100,
                                    key: 'block5',
                                  },
                                ],
                              },
                            ],
                          },
                          // {
                          //   key: 'block9',
                          //   flex: 50,
                          // },
                        ],
                      },
                    ],
                  },
                ],
              },
              // {
              //   flex: 30,
              //   cols: [
              //     {
              //       key: 'block7',
              //       flex: 100,
              //       // rows: [
              //       //   {
              //       //     flex: 100,
              //       //     cols: [
              //       //       {
              //       //         key: 'block10',
              //       //         flex: 25,
              //       //       },
              //       //       {
              //       //         key: 'block1',
              //       //         flex: 25,
              //       //       },
              //       //       {
              //       //         key: 'block2',
              //       //         flex: 25,
              //       //       },
              //       //       {
              //       //         key: 'block3',
              //       //         flex: 25,
              //       //       },
              //       //     ],
              //       //   },
              //       // ],
              //     },
              //   ],
              // },
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

  constructor() {}

  onToggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
