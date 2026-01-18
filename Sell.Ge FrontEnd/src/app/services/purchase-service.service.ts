import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../get/purchase';
import { Observable } from 'rxjs';




const API_BASE = 'https://localhost:7208';


@Injectable({
  providedIn: 'root'
})
export class PurchaseServiceService {


  private base = `${API_BASE}/api/purchased`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.base);
  }

  getById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.base}/${id}`);
  }
  markDeliveredById(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/mark-delivered`, null);
  }

  markDelivered(payload: { purchaseId: number; deliveredByAdminId?: number }): Observable<void> {
    return this.http.post<void>(`${this.base}/mark-delivered`, payload);
  }

  getHistory(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.base}/history`);
  }

  getUserHistory(userId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.base}/history/user/${userId}`);
  }
}
