import { TestBed } from '@angular/core/testing';

import { TaskSocketService } from './task-socket.service';

describe('TaskSocketService', () => {
  let service: TaskSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
