import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../get/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'https://localhost:7208/api/User';
  private adminBaseUrl = 'https://localhost:7208/api/Admin/users';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return { headers };
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  editMe(payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me/edit`, payload);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/me/change-password`, {
      currentPassword,
      newPassword
    });
  }

  terminateAccount(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/me/terminate`, this.getAuthHeaders());
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.adminBaseUrl, this.getAuthHeaders());
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.adminBaseUrl}/${id}`, this.getAuthHeaders());
  }

  updateUser(id: number, payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.adminBaseUrl}/${id}`, payload, this.getAuthHeaders());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.adminBaseUrl}/${id}`, this.getAuthHeaders());
  }

  promoteUser(id: number): Observable<any> {
    return this.http.post(`${this.adminBaseUrl}/${id}/promote`, null, this.getAuthHeaders());
  }
}
