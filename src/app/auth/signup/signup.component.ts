import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupModel } from '../../models/signup.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // OTP is AFTER signup in your flow, so keep it true (no block on submit)
  otpVerified = true;

  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  signupData: SignupModel = {
    username: '',
    password: '',
    project: '',
    registrationNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    motherName: '',
    nationality: '',
    city: '',
    cnic: '',
    cnicExpiry: '',
    passportNumber: '',
    passportExpiry: '',
    primaryWhatsApp: '',
    alternateMobile: '',
    mailingAddress: '',
    permanentAddress: '',
    agreeTerms: false
  };

  cnicFrontFile?: File;
  cnicBackFile?: File;
  allotmentLetterFile?: File; // optional
  profilePictureFile?: File;

  profilePreviewUrl: string | null = null;

  get filesValid(): boolean {
    return !!(this.cnicFrontFile && this.cnicBackFile && this.profilePictureFile);
  }

  showError(model: NgModel, form: NgForm): boolean {
    return !!model.invalid && (!!model.touched || !!form.submitted);
  }

  handleFileInput(event: any, type: string) {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      event.target.value = '';
      return;
    }

    switch (type) {
      case 'cnicFront':
        this.cnicFrontFile = file;
        break;

      case 'cnicBack':
        this.cnicBackFile = file;
        break;

      case 'allotmentLetter':
        this.allotmentLetterFile = file;
        break;

      case 'profilePicture':
        this.profilePictureFile = file;

        // preview cleanup
        if (this.profilePreviewUrl) {
          URL.revokeObjectURL(this.profilePreviewUrl);
        }
        this.profilePreviewUrl = URL.createObjectURL(file);

        // optional: clear input so same file can be re-selected
        event.target.value = '';
        break;
    }
  }

  onCnicInput() {
    if (!this.signupData.cnic) return;
    this.signupData.cnic = this.signupData.cnic.replace(/\D/g, '');
  }

  submitSignup(form: NgForm) {
    console.log('SUBMIT CLICKED');

    // touch all controls so validation shows
    Object.values(form.controls).forEach(c => c.markAsTouched());

    if (!this.otpVerified) {
      alert('Please verify OTP first.');
      return;
    }

    if (form.invalid) {
      this.scrollToFirstInvalid();
      alert('Please fill all required fields.');
      return;
    }

    if (!this.filesValid) {
      alert('Please upload required documents (CNIC Front/Back, Profile Picture).');
      return;
    }

    const files: any = {
      cnicFront: this.cnicFrontFile!,
      cnicBack: this.cnicBackFile!,
      profilePicture: this.profilePictureFile!
    };

    if (this.allotmentLetterFile) {
      files.allotmentLetter = this.allotmentLetterFile;
    }

    this.isSubmitting = true;

    this.auth.signupMember(this.signupData, files).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;

        // ✅ IMPORTANT: OTP page reads otp_email, so store it here
        localStorage.setItem('otp_email', this.signupData.email);

        // ✅ Optional: store phone too if you need phone OTP later
        const phoneToVerify = this.signupData.phone || this.signupData.primaryWhatsApp;
        if (phoneToVerify) {
          localStorage.setItem('otp_phone', phoneToVerify);
        }

        alert('Signup submitted successfully!');

        // ✅ Navigate to OTP page first
        this.router.navigate(['/signupotp']).then(() => {
          // ✅ Then open PDF if backend returns path
          const apiBase = 'https://localhost:7213';
          if (res?.detailsPdfPath) {
            window.open(apiBase + res.detailsPdfPath, '_blank');
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        alert(err?.error?.message ?? 'Signup failed');
      }
    });
  }

  private scrollToFirstInvalid() {
    setTimeout(() => {
      const el = document.querySelector(
        'input.ng-invalid, select.ng-invalid, textarea.ng-invalid'
      ) as HTMLElement | null;

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 0);
  }
}
