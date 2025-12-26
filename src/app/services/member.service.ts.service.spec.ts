import { TestBed } from '@angular/core/testing';

import { MemberServiceTsService } from './member.service.ts.service';

describe('MemberServiceTsService', () => {
  let service: MemberServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
