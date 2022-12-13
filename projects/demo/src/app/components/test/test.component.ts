import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  @Input() title = '';
  @Input() todoList: TodoItem[] = [];

  constructor() {}

  ngOnInit(): void {}
}

export class TodoItem {
  constructor(public id: number, public description: string) {}
}
