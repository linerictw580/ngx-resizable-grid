import { Component, QueryList, ViewChildren } from '@angular/core';
import { ResizeLayoutTemplateDirective } from 'ngx-resizable-grid';
import { TodoItem } from 'projects/demo/src/app/components/test/test.component';
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

  title = 'Todo List';
  todos: TodoItem[] = [
    {
      id: 1,
      description: 'aaa',
    },
    {
      id: 2,
      description: 'bbb',
    },
    {
      id: 3,
      description: 'ccc',
    },
  ];

  resizeLayoutConfig: IResizeLayoutConfig = {
    spacing: 4,
    rows: [
      {
        cols: [
          {
            key: 'block1',
            widthFlex: 20,
            minWidth: 40,
          },
          {
            key: 'block2',
            widthFlex: 20,
          },
          {
            key: 'block3',
            widthFlex: 20,
            // minWidth: 200,
          },
          {
            key: 'block4',
            widthFlex: 40,
            // minWidth: 200,
          },
        ],
      },
      {
        height: 240,
        minHeight: 60,
        cols: [
          {
            // key: 'block5',
            key: 'todolist',
            widthFlex: 50,
            minWidth: 5,
          },
          {
            widthFlex: 50,
            rows: [
              {
                heightFlex: 30,
                cols: [
                  {
                    key: 'block6',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 40,
                cols: [
                  {
                    widthFlex: 100,
                    // key: 'block8',
                    rows: [
                      {
                        heightFlex: 100,
                        cols: [
                          {
                            // key: 'block8',
                            widthFlex: 50,
                            rows: [
                              {
                                heightFlex: 33.33,
                                cols: [
                                  {
                                    widthFlex: 100,
                                    key: 'block8',
                                  },
                                ],
                              },
                              {
                                heightFlex: 33.33,
                                cols: [
                                  {
                                    widthFlex: 100,
                                    key: 'block4',
                                  },
                                ],
                              },
                              {
                                heightFlex: 33.33,
                                cols: [
                                  {
                                    widthFlex: 100,
                                    key: 'block5',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            // key: 'block9',
                            widthFlex: 50,
                            rows: [
                              {
                                heightFlex: 50,
                                cols: [
                                  {
                                    key: 'block9',
                                    widthFlex: 100,
                                  },
                                ],
                              },
                              {
                                heightFlex: 50,
                                cols: [
                                  {
                                    key: 'block6',
                                    widthFlex: 100,
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
              {
                heightFlex: 30,
                cols: [
                  {
                    // key: 'block7',
                    widthFlex: 100,
                    rows: [
                      {
                        heightFlex: 50,
                        cols: [
                          {
                            key: 'block10',
                            widthFlex: 100,
                          },
                        ],
                      },
                      {
                        heightFlex: 50,
                        cols: [
                          {
                            key: 'block1',
                            widthFlex: 100,
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
            widthFlex: 20,
          },
          {
            key: 'block2',
            widthFlex: 20,
          },
          {
            key: 'block3',
            widthFlex: 20,
          },
          {
            key: 'block4',
            widthFlex: 20,
          },
          {
            key: 'block5',
            widthFlex: 20,
          },
        ],
      },
      {
        cols: [
          {
            key: 'block6',
            widthFlex: 40,
          },
          {
            key: 'block7',
            widthFlex: 60,
          },
        ],
      },
      {
        height: 200,
        cols: [
          {
            key: 'block8',
            widthFlex: 40,
          },
          {
            key: 'block9',
            widthFlex: 60,
          },
        ],
      },
    ],
  };

  resizeLayoutConfig3: IResizeLayoutConfig = {
    rows: [
      {
        height: 120,
        cols: [
          {
            key: 'block1',
            widthFlex: 100,
          },
        ],
      },
      {
        height: 400,
        cols: [
          {
            widthFlex: 70,
            rows: [
              {
                heightFlex: 15,
                cols: [
                  {
                    key: 'block3',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 60,
                cols: [
                  {
                    key: 'block4',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 25,
                cols: [
                  {
                    key: 'block5',
                    widthFlex: 100,
                  },
                ],
              },
            ],
          },
          {
            widthFlex: 30,
            rows: [
              {
                heightFlex: 50,
                cols: [
                  {
                    key: 'block5',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 50,
                cols: [
                  {
                    key: 'block6',
                    widthFlex: 100,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  resizeLayoutConfig4: IResizeLayoutConfig = {
    rows: [
      {
        height: 120,
        cols: [
          {
            key: 'block1',
            widthFlex: 100,
          },
        ],
      },
      {
        height: 360,
        cols: [
          {
            widthFlex: 50,
            rows: [
              {
                heightFlex: 50,
                cols: [
                  {
                    key: 'block2',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 50,
                cols: [
                  {
                    key: 'block3',
                    widthFlex: 100,
                  },
                ],
              },
            ],
          },
          {
            key: 'block4',
            widthFlex: 25,
          },
          {
            widthFlex: 25,
            rows: [
              {
                heightFlex: 60,
                cols: [
                  {
                    key: 'block5',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 40,
                cols: [
                  {
                    key: 'block6',
                    widthFlex: 100,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  resizeLayoutConfig5: IResizeLayoutConfig = {
    rows: [
      {
        height: 240,
        cols: [
          {
            key: 'block1',
            widthFlex: 75,
          },
          {
            widthFlex: 25,
            rows: [
              {
                heightFlex: 25,
                cols: [
                  {
                    key: 'block2',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 25,
                cols: [
                  {
                    key: 'block3',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 25,
                cols: [
                  {
                    key: 'block4',
                    widthFlex: 100,
                  },
                ],
              },
              {
                heightFlex: 25,
                cols: [
                  {
                    key: 'block5',
                    widthFlex: 100,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        height: 280,
        cols: [
          {
            key: 'block6',
            widthFlex: 100,
          },
        ],
      },
    ],
  };

  constructor() {}

  onToggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }

  addTodo() {
    this.todos.push({
      id: this.todos.length + 1,
      description: 'ddd',
    });
  }
}
