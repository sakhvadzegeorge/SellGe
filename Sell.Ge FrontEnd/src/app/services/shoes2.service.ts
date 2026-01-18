import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shoes } from '../get/Shoes';

@Injectable({
  providedIn: 'root'
})
export class Shoes2Service {
  private baseUrl = 'https://localhost:7208/api/AdminShoes';
  private shoesUrl = 'https://localhost:7208/api/Shoes/all';

  constructor(private http: HttpClient) {}

  getShoes(): Observable<Shoes[]> {
    return this.http.get<Shoes[]>(this.shoesUrl);
  }

  getShoesById(id: number): Observable<Shoes> {
    return this.http.get<Shoes>(`${this.baseUrl}/${id}`);
  }

  addShoes(shoes: Shoes): Observable<Shoes> {
    return this.http.post<Shoes>(this.baseUrl, shoes);
  }

  editShoes(id: number, partial: Partial<Shoes>): Observable<Shoes> {
    return this.http.patch<Shoes>(`${this.baseUrl}/${id}`, partial);
  }

  reduceStock(id: number, amount: number = 1): Observable<void> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.delete<void>(`${this.baseUrl}/${id}/reducestock`, { params });
  }

  deleteAll(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/deleteall`);
  }

  addStock(id: number, amount: number = 1): Observable<void> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.post<void>(`${this.baseUrl}/${id}/add-stock`, null, { params });
  }
}
