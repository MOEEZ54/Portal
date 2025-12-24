import { TestBed } from '@angular/core/testing';

import { FirebaseOtpService } from './firebase-otp.service';

describe('FirebaseOtpService', () => {
  let service: FirebaseOtpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseOtpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
