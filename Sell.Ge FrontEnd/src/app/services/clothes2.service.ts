import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clothes } from '../get/Clothes';

@Injectable({
  providedIn: 'root'
})
export class Clothes2Service {
  private baseUrl = 'https://localhost:7208/api/AdminClothes';
  private clothesUrl = 'https://localhost:7208/api/Clothes/all';

  constructor(private http: HttpClient) {}

  getClothes(): Observable<Clothes[]> {
    return this.http.get<Clothes[]>(this.clothesUrl);
  }

  getClothesById(id: number): Observable<Clothes> {
    return this.http.get<Clothes>(`${this.baseUrl}/${id}`);
  }

  addClothes(clothes: Clothes): Observable<Clothes> {
    return this.http.post<Clothes>(this.baseUrl, clothes);
  }

  editClothes(id: number, partial: Partial<Clothes>): Observable<Clothes> {
    return this.http.patch<Clothes>(`${this.baseUrl}/${id}`, partial);
  }

  reduceStock(id: number, amount: number = 1): Observable<void> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.delete<void>(`${this.baseUrl}/${id}/reducestock`, { params });
  }

  deleteAll(id: number  ): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/deleteall`);
  }

  addStock(id: number, amount: number = 1): Observable<void> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.post<void>(`${this.baseUrl}/${id}/add-stock`, null, { params });
  }
}
