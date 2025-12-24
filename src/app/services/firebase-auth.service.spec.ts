import { TestBed } from '@angular/core/testing';
import { FirebaseOtpService } from './firebase-otp.service';

// We import the whole module so we can spy on its exports
import * as firebaseAuth from 'firebase/auth';

describe('FirebaseOtpService', () => {
  let service: FirebaseOtpService;

  // Mocks
  let mockVerifierInstance: any;
  let mockConfirmation: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseOtpService);

    // Fake RecaptchaVerifier instance
    mockVerifierInstance = {
      render: jasmine.createSpy('render').and.resolveTo(1),
      clear: jasmine.createSpy('clear'),
    };

    // Fake ConfirmationResult
    mockConfirmation = {
      confirm: jasmine.createSpy('confirm').and.resolveTo({
        user: {
          getIdToken: jasmine.createSpy('getIdToken').and.resolveTo('fake-token'),
        },
      }),
    };

    // Spy on RecaptchaVerifier constructor (class at runtime is a function)
    spyOn(firebaseAuth as any, 'RecaptchaVerifier').and.callFake(() => mockVerifierInstance);

    // Spy on signInWithPhoneNumber
    spyOn(firebaseAuth, 'signInWithPhoneNumber').and.resolveTo(mockConfirmation as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initRecaptcha should create verifier only once', () => {
    service.initRecaptcha('recaptcha-container');
    service.initRecaptcha('recaptcha-container');

    // constructor should be called once
    expect((firebaseAuth as any).RecaptchaVerifier).toHaveBeenCalledTimes(1);
  });

  it('sendOtp should throw if recaptcha not initialized', async () => {
    await expectAsync(service.sendOtp('+923001234567'))
      .toBeRejectedWithError(/reCAPTCHA not initialized/i);
  });

  it('sendOtp should call render and signInWithPhoneNumber and set confirmation', async () => {
    service.initRecaptcha('recaptcha-container');

    await service.sendOtp('+923001234567');

    expect(mockVerifierInstance.render).toHaveBeenCalled();
    expect(firebaseAuth.signInWithPhoneNumber).toHaveBeenCalledTimes(1);
  });

  it('verifyOtp should throw if OTP not requested', async () => {
    await expectAsync(service.verifyOtp('123456'))
      .toBeRejectedWithError(/OTP not requested/i);
  });

  it('verifyOtp should call confirmation.confirm and return user', async () => {
    service.initRecaptcha('recaptcha-container');
    await service.sendOtp('+923001234567');

    const user = await service.verifyOtp('123456');

    expect(mockConfirmation.confirm).toHaveBeenCalledWith('123456');
    expect(user).toBeTruthy();
  });

  it('getIdToken should return token', async () => {
    const fakeUser: any = {
      getIdToken: jasmine.createSpy('getIdToken').and.resolveTo('abc123'),
    };

    const token = await service.getIdToken(fakeUser);

    expect(fakeUser.getIdToken).toHaveBeenCalledWith(true);
    expect(token).toBe('abc123');
  });

  it('resetOtpFlow should clear confirmation (verifyOtp should fail after reset)', async () => {
    service.initRecaptcha('recaptcha-container');
    await service.sendOtp('+923001234567');

    service.resetOtpFlow();

    await expectAsync(service.verifyOtp('123456'))
      .toBeRejectedWithError(/OTP not requested/i);
  });

  it('resetRecaptcha should clear verifier and allow initRecaptcha again', async () => {
    service.initRecaptcha('recaptcha-container');

    await service.resetRecaptcha();

    // After reset, init again should call constructor again
    service.initRecaptcha('recaptcha-container');
    expect((firebaseAuth as any).RecaptchaVerifier).toHaveBeenCalledTimes(2);
    expect(mockVerifierInstance.clear).toHaveBeenCalled();
  });
});
