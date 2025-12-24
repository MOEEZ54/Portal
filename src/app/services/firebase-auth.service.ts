import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User
} from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);

  private recaptchaVerifier?: RecaptchaVerifier;
  private confirmationResult?: ConfirmationResult;

  initRecaptcha(containerId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible', // or 'normal'
      });
    }
  }

  async sendOtp(phoneE164: string): Promise<void> {
    if (!this.recaptchaVerifier) throw new Error('reCAPTCHA not initialized');
    this.confirmationResult = await signInWithPhoneNumber(
      this.auth,
      phoneE164,
      this.recaptchaVerifier
    );
  }

  async verifyOtp(code: string): Promise<User> {
    if (!this.confirmationResult) throw new Error('OTP not requested');
    const cred = await this.confirmationResult.confirm(code);
    return cred.user;
  }

  async getIdToken(user: User): Promise<string> {
    return await user.getIdToken(true);
  }
}
