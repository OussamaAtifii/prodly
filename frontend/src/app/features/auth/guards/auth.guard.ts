import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return new Promise((resolve) => {
    setTimeout(() => {
      if (authService.isAuthenticated()) {
        resolve(true);
      } else {
        router.navigateByUrl('/login');
        return resolve(false);
      }
    }, 1000);
  });
};
