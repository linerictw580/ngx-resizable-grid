import { TestBed } from '@angular/core/testing';

import { NgxResizableGridService } from './ngx-resizable-grid.service';

describe('NgxResizableGridService', () => {
  let service: NgxResizableGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxResizableGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
