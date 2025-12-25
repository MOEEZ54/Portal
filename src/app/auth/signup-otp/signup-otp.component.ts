import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-otp.component.html',
  styleUrls: ['./signup-otp.component.css']
})
export class OtpComponent implements OnInit {

  email: string = '';
  otp: string = '';

  isSubmitting = false;
  errorMsg = '';
  successMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.email = (localStorage.getItem('otp_email') || '').trim();
    console.log('[OtpComponent] email:', this.email);

    if (!this.email) {
      this.errorMsg = 'Email not found. Please signup again.';
    }
  }

  verifyOtp(form: NgForm) {
    console.log('VERIFY OTP CLICKED', { email: this.email, otp: this.otp, valid: form.valid });

    this.errorMsg = '';
    this.successMsg = '';

    if (this.isSubmitting) return;

    if (!this.email) {
      this.errorMsg = 'Email not found. Please signup again.';
      return;
    }

    this.otp = (this.otp || '').replace(/\D/g, '').slice(0, 6);

    if (form.invalid || this.otp.length !== 6) {
      this.errorMsg = 'Please enter valid 6 digit OTP.';
      return;
    }

    this.isSubmitting = true;

    this.auth.verifyEmailOtp(this.email, this.otp).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMsg = 'Email verified successfully!';
        localStorage.removeItem('otp_email');

        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('OTP verify error:', err);

        this.errorMsg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : '') ||
          JSON.stringify(err?.error) ||
          'Invalid OTP';
      }
    });
  }
}
