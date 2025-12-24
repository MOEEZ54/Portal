import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { PortalComponent } from './portal/portal.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';
import { AccountDashboardComponent } from './dashboards/account-dashboard/account-dashboard.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignupOtpComponent } from './auth/signup-otp/signup-otp.component';

export const routes: Routes = [

  // Default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path:'signupotp', component:SignupOtpComponent},

  // Portal wrapper
  {
    path: 'portal',
    component: PortalComponent,
    children: [
      { path: '', redirectTo: 'user-dashboard', pathMatch: 'full' },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'user-dashboard', component: UserDashboardComponent },
      { path: 'account-dashboard', component: AccountDashboardComponent },
     
      
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
