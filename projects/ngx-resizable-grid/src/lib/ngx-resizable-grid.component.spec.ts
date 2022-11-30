import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxResizableGridComponent } from './ngx-resizable-grid.component';

describe('NgxResizableGridComponent', () => {
  let component: NgxResizableGridComponent;
  let fixture: ComponentFixture<NgxResizableGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxResizableGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxResizableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
