import { TestBed } from '@angular/core/testing';

import { NotificationServiceTsService } from './notification.service.ts.service';

describe('NotificationServiceTsService', () => {
  let service: NotificationServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
