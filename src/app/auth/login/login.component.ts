import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  images: string[] = [
    'assets/image1.jpg',
    'assets/image2.jpg',
    'assets/image3.jpg',
    'assets/image4.jpg',
    'assets/image5.jpg'
  ];

  currentIndex = 0;
  private sliderInterval?: number;

  selectedRole: 'admin' | 'user' | 'account' = 'user';

  // ✅ show only after wrong password
  showForgotPassword = false;

  username = '';
  password = '';

  isSubmitting = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.sliderInterval = window.setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) clearInterval(this.sliderInterval);
  }

  selectRole(role: 'admin' | 'user' | 'account'): void {
    this.selectedRole = role;
    // optional: role change pe reset UI
    this.errorMsg = '';
    this.showForgotPassword = false;
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  // ✅ MAIN LOGIN METHOD
  login(form: NgForm): void {
    this.errorMsg = '';
    this.showForgotPassword = false;

    if (form.invalid) return;

    this.isSubmitting = true;

    const username = this.username.trim();
    const password = this.password;

    if (!username) {
      this.isSubmitting = false;
      this.errorMsg = 'Username is required';
      return;
    }

    if (!password) {
      this.isSubmitting = false;
      this.errorMsg = 'Password is required';
      return;
    }

    this.auth.login(username, password).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;

        const token = res?.token ?? res?.accessToken;

        if (!token) {
          this.errorMsg = 'Invalid Username or Password';
          return;
        }

        localStorage.setItem('token', token);

        if (this.selectedRole === 'admin') {
          this.router.navigate(['/portal/admin-dashboard']);
        } else if (this.selectedRole === 'user') {
          this.router.navigate(['/portal/user-dashboard']);
        } else {
          this.router.navigate(['/portal/account-dashboard']);
        }
      },

      error: (err) => {
        this.isSubmitting = false;

        this.errorMsg =
          err?.error?.message ||
          err?.message ||
          'Invalid Username or Password';

        // ✅ WRONG PASSWORD / UNAUTHORIZED → show forgot password button
        const msg = (err?.error?.message || '').toLowerCase();
        if (err?.status === 401 || msg.includes('password')) {
          this.showForgotPassword = true;
        }

        console.error('[Login Error]', err);
      }
    });
  }
}
