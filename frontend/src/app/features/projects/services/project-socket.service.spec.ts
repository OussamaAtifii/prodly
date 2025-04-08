import { TestBed } from '@angular/core/testing';

import { ProjectSocketService } from './project-socket.service';

describe('ProjectSocketService', () => {
  let service: ProjectSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
