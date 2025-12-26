import { TestBed } from '@angular/core/testing';

import { ReportServiceTsService } from './report.service.ts.service';

describe('ReportServiceTsService', () => {
  let service: ReportServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
