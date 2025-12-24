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

  // Username + Password
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
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  // ✅ MAIN LOGIN METHOD (USERNAME + PASSWORD)
  login(form: NgForm): void {
    this.errorMsg = '';

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

        // accept both token names
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

        // show backend message if available
        this.errorMsg = err?.error?.message || err?.message || 'Invalid Username or Password';

        // helpful debug
        console.error('[Login] error', {
          status: err?.status,
          statusText: err?.statusText,
          body: err?.error
        });
      }
    });
  }
}
