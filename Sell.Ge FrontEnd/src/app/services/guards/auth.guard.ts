import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

function isPromise<T = any>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as any).then === 'function';
}

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const redirectToLogin = router.createUrlTree(['/log-in'], {
    queryParams: { returnUrl: state.url }
  });
  try {
    const result = auth.isLoggedIn();
    if (typeof result === 'boolean') {
      return result ? true : redirectToLogin;
    }
    if (isPromise(result)) {
      return from(result).pipe(
        map((logged) => (logged ? true : redirectToLogin)),
        catchError(() => of(redirectToLogin))
      );
    }
    return (result as Observable<boolean>).pipe(
      map((logged) => (logged ? true : redirectToLogin)),
      catchError(() => of(redirectToLogin))
    );
  } catch {
    return redirectToLogin;
  }
};
