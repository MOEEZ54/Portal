import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard = (allowed: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.getRole();

    if (!role) {
      router.navigate(['/login']);
      return false;
    }

    if (allowed.includes(role)) return true;

    // ❌ not allowed → redirect to own dashboard
    if (role === 'admin') router.navigate(['/portal/admin-dashboard']);
    else if (role === 'account') router.navigate(['/portal/account-dashboard']);
    else router.navigate(['/portal/user-dashboard']);

    return false;
  };
};
