import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-whatsapp-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-otp.component.html',
  styleUrls: ['./whatsapp-otp.component.css']
})
export class WhatsappOtpComponent {
  constructor(private auth: AuthService) {}

  @Input() phone: string = '';
  @Output() verifiedChange = new EventEmitter<boolean>();

  otpSent = false;
  otpVerified = false;
  otpLoading = false;

  otp = '';
  message = '';

  private normalizePkE164(phone: string): string {
    let p = (phone ?? '').trim().replace(/[\s-]/g, '');
    if (p.toLowerCase().startsWith('whatsapp:')) p = p.slice('whatsapp:'.length).trim();
    if (p.startsWith('+')) return p;
    if (p.startsWith('0')) return '+92' + p.slice(1);
    if (p.startsWith('92')) return '+' + p;
    return p;
  }

  private getErrMsg(err: any): string {
    if (!err) return 'Request failed';
    if (typeof err.error === 'string') return err.error;
    if (err.error?.message) return err.error.message;
    if (err.error?.response) return err.error.response; // WhatsApp Cloud error JSON string
    return err.message || 'Request failed';
  }

  sendOtp() {
    if (!this.phone || this.phone.trim().length < 10) {
      this.message = 'Please enter valid phone number first';
      this.verifiedChange.emit(false);
      return;
    }

    const phoneE164 = this.normalizePkE164(this.phone);
    if (!phoneE164.startsWith('+')) {
      this.message = 'Phone must be like +923001234567';
      this.verifiedChange.emit(false);
      return;
    }

    this.otpLoading = true;
    this.message = '';

    this.auth.sendWhatsappOtp(phoneE164)
      .pipe(finalize(() => (this.otpLoading = false)))
      .subscribe({
        next: () => {
          this.otpSent = true;
          this.otpVerified = false;
          this.message = 'OTP sent on WhatsApp';
          this.verifiedChange.emit(false);
        },
        error: (err) => {
          console.error(err);
          this.message = this.getErrMsg(err);
          this.verifiedChange.emit(false);
        }
      });
  }

  verifyOtp() {
    if (!this.otp || this.otp.trim().length < 4) {
      this.message = 'Enter OTP';
      this.verifiedChange.emit(false);
      return;
    }

    const phoneE164 = this.normalizePkE164(this.phone);
    if (!phoneE164.startsWith('+')) {
      this.message = 'Phone must be like +923001234567';
      this.verifiedChange.emit(false);
      return;
    }

    this.otpLoading = true;
    this.message = '';

    this.auth.verifyWhatsappOtp(phoneE164, this.otp.trim())
      .pipe(finalize(() => (this.otpLoading = false)))
      .subscribe({
        next: () => {
          this.otpVerified = true;
          this.message = 'OTP Verified ✅';
          this.verifiedChange.emit(true);
        },
        error: (err) => {
          console.error(err);
          this.otpVerified = false;
          this.message = this.getErrMsg(err) || 'Invalid OTP';
          this.verifiedChange.emit(false);
        }
      });
  }

  reset() {
    this.otpSent = false;
    this.otpVerified = false;
    this.otpLoading = false;
    this.otp = '';
    this.message = '';
    this.verifiedChange.emit(false);
  }
}
