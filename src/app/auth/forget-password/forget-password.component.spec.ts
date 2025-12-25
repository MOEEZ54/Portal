import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forget-password.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent], // standalone component
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: AuthService,
          useValue: {
            forgotPassword: jasmine.createSpy('forgotPassword').and.returnValue(of({})),
            resetPassword: jasmine.createSpy('resetPassword').and.returnValue(of({})),
            verifyEmailOtp: jasmine.createSpy('verifyEmailOtp').and.returnValue(of({})),
            resendEmailOtp: jasmine.createSpy('resendEmailOtp').and.returnValue(of({}))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
