import { TestBed } from '@angular/core/testing';

import { PropertyServiceTsService } from './property.service.ts.service';

describe('PropertyServiceTsService', () => {
  let service: PropertyServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
