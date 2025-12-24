import { Injectable } from '@angular/core';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User
} from 'firebase/auth';
import { auth } from '../firebase';

@Injectable({ providedIn: 'root' })
export class FirebaseOtpService {
  private verifier?: RecaptchaVerifier;
  private confirmation?: ConfirmationResult;

  /**
   * Must be called once (e.g. ngOnInit) before sendOtp()
   * containerId must exist in html: <div id="recaptcha-container"></div>
   */
  initRecaptcha(containerId: string) {
    if (this.verifier) return;

    this.verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible', // or 'normal'
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        // reCAPTCHA expired
      }
    });
  }

  /**
   * Sends OTP to phone in E.164 format e.g. +923001234567
   */
  async sendOtp(phoneE164: string): Promise<void> {
    if (!this.verifier) {
      throw new Error('reCAPTCHA not initialized. Call initRecaptcha() first.');
    }

    // If reCAPTCHA got expired or already used, render again safely
    try {
      // optional: ensure widget is rendered
      await this.verifier.render();
    } catch {
      // ignore render errors
    }

    this.confirmation = await signInWithPhoneNumber(auth, phoneE164, this.verifier);
  }

  /**
   * Confirms the OTP code and returns Firebase user
   */
  async verifyOtp(code: string): Promise<User> {
    if (!this.confirmation) {
      throw new Error('OTP not requested. Call sendOtp() first.');
    }
    const cred = await this.confirmation.confirm(code);
    return cred.user;
  }

  /**
   * Get Firebase ID token (send to ASP.NET API if you want backend verification)
   */
  async getIdToken(user: User): Promise<string> {
    return await user.getIdToken(true);
  }

  /**
   * Reset OTP flow (useful for retry/resend scenarios)
   */
  resetOtpFlow() {
    this.confirmation = undefined;
  }

  /**
   * If you need to fully reset reCAPTCHA (rare)
   */
  async resetRecaptcha() {
    try {
      this.verifier?.clear();
    } catch {}
    this.verifier = undefined;
  }
}
