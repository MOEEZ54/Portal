import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SignupModel } from '../models/signup.model';
import { catchError} from 'rxjs/operators';


export type UserRole = 'admin' | 'user' | 'account';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

interface StoredAuthState {
  token: string;
  user: AuthUser;
}

const AUTH_KEY = 'auth_state_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<AuthUser | null>(this.readStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  // ---------- helpers ----------
  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
        || !!localStorage.getItem('accessToken')
        || !!this.readStoredState();
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token')
        ?? localStorage.getItem('accessToken')
        ?? this.readStoredState()?.token
        ?? null;
  }

  // ---------- LOGIN (mock - keep if needed) ----------
  loginMock(req: { email: string; password: string }): Observable<AuthUser> {
    if (!req.email || !req.password) {
      return throwError(() => new Error('Email and password are required.'));
    }

    const isAdmin = req.email.toLowerCase() === 'admin@test.com';
    const isUser = req.email.toLowerCase() === 'user@test.com';

    if (req.password !== '123456' || (!isAdmin && !isUser)) {
      return throwError(() => new Error('Invalid email or password.'));
    }

    const user: AuthUser = {
      id: isAdmin ? 1 : 2,
      name: isAdmin ? 'Admin' : 'User',
      email: req.email,
      role: isAdmin ? 'admin' : 'user'
    };

    const state: StoredAuthState = { token: 'fake-jwt-token', user };

    return of(user).pipe(
      delay(300),
      tap(() => this.writeStoredState(state)),
      tap(() => this.userSubject.next(user))
    );
  }

  // ---------- LOGIN (REAL BACKEND - EMAIL) ----------
  loginReal(email: string, password: string) {
    return this.http.post<any>(
      this.api.url('auth/login'),
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  // ---------- REGISTER (REAL BACKEND) ----------
  registerReal(email: string, password: string) {
    return this.http.post<any>(
      this.api.url('auth/register'),
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  // ---------- REFRESH TOKEN ----------
  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(
      this.api.url('auth/refresh'),
      { refreshToken }
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  // ---------- LOGOUT (REAL BACKEND) ----------
  logoutReal() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(
      this.api.url('auth/logout'),
      { refreshToken }
    ).pipe(
      tap(() => this.logout())
    );
  }


  verifyResetOtp(email: string, otp: string) {
  const url = this.api.url('skymembers/verify-reset-otp');
  return this.http.post<any>(url, {
    Email: (email || '').trim(),
    Otp: (otp || '').trim()
  });
}

  // ---------- SIGNUP SKY MEMBER ----------
  signupMember(
    data: SignupModel,
    files: {
      cnicFront: File;
      cnicBack: File;
      profilePicture: File;
      allotmentLetter?: File;
    }
  ): Observable<any> {

    const formData = new FormData();

    formData.append('Username', data.username);
    formData.append('Password', data.password);

    formData.append('Project', data.project);
    formData.append('RegistrationNumber', data.registrationNumber);
    formData.append('FirstName', data.firstName);
    formData.append('LastName', data.lastName);
    formData.append('Email', data.email);

    formData.append('Phone', data.phone);
    formData.append('DateOfBirth', data.dateOfBirth);
    formData.append('MotherName', data.motherName);
    formData.append('Nationality', data.nationality);

    formData.append('City', data.city);
    formData.append('Cnic', data.cnic);
    formData.append('CnicExpiry', data.cnicExpiry);

    formData.append('PassportNumber', data.passportNumber || '');
    formData.append('PassportExpiry', data.passportExpiry || '');

    formData.append('PrimaryWhatsApp', data.primaryWhatsApp);
    formData.append('AlternateMobile', data.alternateMobile);

    formData.append('MailingAddress', data.mailingAddress);
    formData.append('PermanentAddress', data.permanentAddress);

    formData.append('AgreeTerms', String(data.agreeTerms));

    formData.append('CnicFront', files.cnicFront);
    formData.append('CnicBack', files.cnicBack);
    formData.append('ProfilePicture', files.profilePicture);

    if (files.allotmentLetter) {
      formData.append('AllotmentLetter', files.allotmentLetter);
    }

    return this.http.post(this.api.url('skymembers'), formData);
  }

  // ---------- CRUD ----------
  getMembers() {
    return this.http.get<any[]>(this.api.url('skymembers'));
  }

  getMemberById(id: number) {
    return this.http.get<any>(this.api.url(`skymembers/${id}`));
  }

  updateMember(id: number, data: any) {
    return this.http.put(this.api.url(`skymembers/${id}`), data);
  }

  deleteMember(id: number) {
    return this.http.delete(this.api.url(`skymembers/${id}`));
  }

  // ==========================================================
  // ✅ LOGIN (USERNAME + PASSWORD)
  // ==========================================================
 login(username: string, password: string): Observable<any> {
  const body = { username, password }; // ✅ correct keys

  console.log('[AuthService.login] POST', this.api.url('skymembers/login'), body);

  return this.http.post<any>(
    this.api.url('skymembers/login'),
    body
  ).pipe(
    tap(res => {
      const token = res?.token ?? res?.accessToken;
      if (token) localStorage.setItem('token', token);
    })
  );
}
 // Email otp 



verifyEmailOtp(email: string, otp: string) {
  const url = this.api.url('skymembers/verify-email');

  const body = {
    Email: (email || '').trim(),
    Otp: (otp || '').trim()
  };

  console.log('[verifyEmailOtp] POST', url, JSON.stringify(body));
  return this.http.post<any>(url, body);
}


// OPTIONAL - sirf tab jab backend me endpoint ho
resendEmailOtp(email: string) {
  return this.http.post<any>(this.api.url('skymembers/resend-email-otp'), { email });
}

  // ---------- storage ----------
  private readStoredState(): StoredAuthState | null {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) as StoredAuthState : null;
    } catch {
      return null;
    }
  }

  private readStoredUser(): AuthUser | null {
    return this.readStoredState()?.user ?? null;
  }

  private writeStoredState(state: StoredAuthState): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  }


  forgotPassword(email: string) {
  const url = this.api.url('skymembers/forgot-password');
  return this.http.post<any>(url, { Email: (email || '').trim() });
}

resetPassword(email: string, otp: string, newPassword: string) {
  const url = this.api.url('skymembers/reset-password');
  return this.http.post<any>(url, {
    Email: (email || '').trim(),
    Otp: (otp || '').trim(),
    NewPassword: newPassword
  });
}

}
