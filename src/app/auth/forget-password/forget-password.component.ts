// ==============================
// ✅ Angular: forgot-password.component.ts (FULL)
// ==============================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  email = '';
  otp = '';
  newPassword = '';

  step: 1 | 2 = 1;

  isSubmitting = false;
  errorMsg = '';
  successMsg = '';

  // UI helpers
  showPassword = false;
  otpVerified = false; // ✅ only true when verify-reset-otp success

  otpSecondsLeft = 0;
  private timerId?: number;

  // Password validation helpers (optional template use)
  get pwChecks() {
    const pw = this.newPassword || '';
    return {
      length: pw.length >= 6,
      upper: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[!@#\$%\^&\*()_+\-=[\]{};':"\\|,.<>\/?]/.test(pw),
    };
  }

  get pwStrengthScore(): number {
    const count = Object.values(this.pwChecks).filter(Boolean).length;
    return Math.min(3, count);
  }

  get pwStrengthLabel(): string {
    const checks = Object.values(this.pwChecks).filter(Boolean).length;
    if (checks >= 4 && (this.newPassword || '').length >= 8) return 'Strong';
    if (checks >= 3) return 'Medium';
    if ((this.newPassword || '').length > 0) return 'Weak';
    return '';
  }

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('fp_email');
    if (saved) this.email = saved;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // ---------- helpers ----------
  private clearMessages() {
    this.errorMsg = '';
    this.successMsg = '';
  }

  private normalizeOtp() {
    this.otp = (this.otp || '').replace(/\D/g, '').slice(0, 6);
  }

  private startTimer(seconds: number) {
    this.stopTimer();
    this.otpSecondsLeft = seconds;

    this.timerId = window.setInterval(() => {
      this.otpSecondsLeft--;
      if (this.otpSecondsLeft <= 0) this.stopTimer();
    }, 1000);
  }

  private stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
    if (this.otpSecondsLeft < 0) this.otpSecondsLeft = 0;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ---------- step 1 ----------
  sendOtp(form: NgForm) {
    this.clearMessages();

    // ✅ reset states when requesting OTP
    this.step = 1;
    this.otpVerified = false;
    this.otp = '';
    this.newPassword = '';
    this.showPassword = false;

    if (form.invalid) {
      this.errorMsg = 'Please enter valid email.';
      return;
    }

    this.isSubmitting = true;

    this.auth.forgotPassword(this.email.trim()).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.successMsg = res?.message || 'OTP sent to your email.';
        this.step = 2;

        localStorage.setItem('fp_email', this.email.trim());

        // ✅ resend cooldown
        this.startTimer(60);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMsg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : '') ||
          JSON.stringify(err?.error) ||
          'Failed to send OTP.';
      }
    });
  }

  resendOtp() {
    this.clearMessages();

    if (!this.email?.trim()) {
      this.errorMsg = 'Email is required.';
      return;
    }

    // ✅ block if cooldown active
    if (this.otpSecondsLeft > 0) return;

    this.isSubmitting = true;

    // ✅ forgot-password resend = call forgotPassword again
    this.auth.forgotPassword(this.email.trim()).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.successMsg = res?.message || 'OTP resent to your email.';
        this.startTimer(60);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMsg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : '') ||
          JSON.stringify(err?.error) ||
          'Failed to resend OTP.';
      }
    });
  }

  // ---------- step 2A ----------
  verifyOtp(form: NgForm) {
    this.clearMessages();
    this.normalizeOtp();

    if (form.invalid || this.otp.length !== 6) {
      this.errorMsg = 'Please enter a valid 6-digit OTP.';
      this.otpVerified = false;
      return;
    }

    this.isSubmitting = true;

    // ✅ IMPORTANT: password reset OTP verify endpoint
    this.auth.verifyResetOtp(this.email.trim(), this.otp).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.successMsg = res?.message || 'OTP verified.';
        this.otpVerified = true;

        // optional: stop timer after verify
        this.stopTimer();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.otpVerified = false;

        this.errorMsg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : '') ||
          JSON.stringify(err?.error) ||
          'OTP verification failed.';
      }
    });
  }

  // ---------- step 2B ----------
  resetPassword(form: NgForm) {
    this.clearMessages();

    // ✅ HARD BLOCK: OTP verify ke baghair reset NEVER
    if (!this.otpVerified) {
      this.errorMsg = 'Please verify OTP first.';
      return;
    }

    this.normalizeOtp();

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMsg = 'New password must be at least 6 characters.';
      return;
    }

    this.isSubmitting = true;

    this.auth.resetPassword(this.email.trim(), this.otp, this.newPassword).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.successMsg = res?.message || 'Password reset successful.';

        localStorage.removeItem('fp_email');
        this.stopTimer();

        // reset local state
        this.email = '';
        this.otp = '';
        this.newPassword = '';
        this.showPassword = false;
        this.otpVerified = false;
        this.step = 1;

        setTimeout(() => this.router.navigate(['/login']), 900);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMsg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : '') ||
          JSON.stringify(err?.error) ||
          'Reset failed.';
      }
    });
  }
}
