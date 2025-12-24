import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseOtpService } from '../../services/firebase-otp.service';

@Component({
  selector: 'app-signup-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-otp.component.html',
  styleUrls: ['./signup-otp.component.css']
})
export class SignupOtpComponent implements OnInit {
  phoneE164 = '';
  otp = '';

  otpSent = false;
  sending = false;
  verifying = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private fbOtp: FirebaseOtpService
  ) {}

  ngOnInit(): void {
    // ✅ Read from localStorage (reliable)
    const phone = localStorage.getItem('otp_phone');

    if (!phone) {
      // If user opened OTP page directly
      this.router.navigate(['/signup']);
      return;
    }

    this.phoneE164 = this.toE164(phone);

    // Firebase reCAPTCHA required
    this.fbOtp.initRecaptcha('recaptcha-container');
  }

  private toE164(phone: string): string {
    const p = phone.trim();
    if (p.startsWith('+92')) return p;
    if (p.startsWith('03')) return '+92' + p.substring(1);
    return p; // if already in correct format
  }

  async sendOtp() {
    try {
      this.errorMsg = '';
      this.sending = true;

      await this.fbOtp.sendOtp(this.phoneE164);
      this.otpSent = true;
      alert('OTP sent!');
    } catch (e: any) {
      console.error(e);
      this.errorMsg = e?.message || 'Failed to send OTP';
    } finally {
      this.sending = false;
    }
  }

  async verifyOtp() {
    try {
      this.errorMsg = '';
      this.verifying = true;

      await this.fbOtp.verifyOtp(this.otp);

      alert('OTP verified successfully!');

      // ✅ clear stored phone
      localStorage.removeItem('otp_phone');

      // Redirect to login
      this.router.navigate(['/login']);
    } catch (e: any) {
      console.error(e);
      this.errorMsg = 'Invalid or expired OTP';
    } finally {
      this.verifying = false;
    }
  }
}
