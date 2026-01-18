import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminguardService implements CanActivate {

  constructor(private router: Router) { }

  private decode(token: string): any | null {
    try {
      let payload = token.split('.')[1];
      if (!payload) return null;

      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const pad = payload.length % 4;
      if (pad) payload += '='.repeat(4 - pad);

      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const token = localStorage.getItem('token');
    if (!token) {
      return this.router.createUrlTree(['/log-in'], {
        queryParams: { returnUrl: state.url }
      });
    }

    const payload = this.decode(token);
    if (!payload) {
      return this.router.createUrlTree(['/log-in']);
    }

    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (
      role === 'Admin' ||
      (Array.isArray(role) && role.includes('Admin'))
    ) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }
}
