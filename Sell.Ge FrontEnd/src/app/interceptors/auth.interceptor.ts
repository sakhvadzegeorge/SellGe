import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.includes('reset-password') ||
    req.url.includes('request-password-reset')
  ) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (!token) return next(req);
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (!exp || exp < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('user');
      return next(req); 
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    return next(req); 
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
