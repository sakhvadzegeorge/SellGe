import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { ResetPasswordDto } from '../get/reset-password-dto';
import { User } from '../get/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7208/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<{ token: string | null; user: User | null; raw: any }> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      map(res => {
        const token = res?.token ?? null;
        const user = res?.user ?? res?.userDto ?? null;
        return { token, user, raw: res };
      }),
      tap(({ token }) => {
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('email', email);
      })
    );
  }

  signUpService(dto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, dto);
  }

  passwordResetRequest(email: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/request-password-reset`,
      { email },
      { responseType: 'text' }
    );
  }

  resetPassword(dto: ResetPasswordDto): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reset-password`,
      dto
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp && exp > now;
    } catch {
      return false;
    }
  }
  getUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) as User : null;
  }

  hasRole(role: number | string): boolean {
    const u = this.getUser();
    if (!u) return false;
    return String(u.role) === String(role);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    this.router.navigate(['/log-in'], { replaceUrl: true });
  }
}
