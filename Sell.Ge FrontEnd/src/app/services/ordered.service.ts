import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Purchase } from '../get/purchase';

@Injectable({
  providedIn: 'root'
})
export class OrderedService {
  private baseUrl = 'https://localhost:7208/api/User/me/purchases';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  getPurchaseHistory(page?: number, pageSize?: number): Observable<Purchase[]> {
    let params = new HttpParams();
    if (page != null) params = params.set('page', String(page));
    if (pageSize != null) params = params.set('pageSize', String(pageSize));
    const url = `${this.baseUrl}/history`;
    return this.http.get<Purchase[]>(url, { headers: this.getAuthHeaders(), params }).pipe(
      catchError(this.handleError)
    );
  }

  getPendingPurchases(page?: number, pageSize?: number): Observable<Purchase[]> {
    let params = new HttpParams();
    if (page != null) params = params.set('page', String(page));
    if (pageSize != null) params = params.set('pageSize', String(pageSize));
    const url = `${this.baseUrl}/pending`;
    return this.http.get<Purchase[]>(url, { headers: this.getAuthHeaders(), params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client error:', error.error.message);
    } else {
      console.error(`API error ${error.status}:`, error.error);
    }
    return throwError(() => new Error('An error occurred while fetching purchases.'));
  }
}
