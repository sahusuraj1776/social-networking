import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const authGuard: CanActivateFn = (route, state) => {
  
  const auth = inject(Auth);
  const router = inject(Router);
  
  // ✅ If logged in -> allow
  if (auth.isLoggedIn()) return true;

  // ✅ If not logged in -> redirect to /login-required
  return router.createUrlTree(['/login-required'], {
    queryParams: { returnUrl: state.url },
  });

};
