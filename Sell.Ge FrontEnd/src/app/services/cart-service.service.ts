import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Basket } from '../get/basket';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = 'https://localhost:7208/api/basket';

  private basketSource = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSource.asObservable();

  private itemCountSource = new BehaviorSubject<number>(0);
  itemCount$ = this.itemCountSource.asObservable();

  constructor(private http: HttpClient) {
    this.getBasket().subscribe();
  }

  getBasket(): Observable<Basket> {
    return this.http.get<Basket>(`${this.baseUrl}`).pipe(
      tap(b => this.setBasket(b)),
      catchError(err => throwError(() => err))
    );
  }

  addToBasket(clothId: number | null, shoeId: number | null, quantity: number): Observable<Basket> {
    const body = {
      clothId: clothId ?? 0,
      shoeId: shoeId ?? 0,
      quantity: quantity
    };
    return this.http.post<Basket>(`${this.baseUrl}/add`, body).pipe(
      tap(b => this.setBasket(b)),
      catchError(err => throwError(() => err))
    );
  }

  updateItem(itemId: number, quantity: number): Observable<Basket> {
    const body = { itemId, quantity };
    return this.http.put<Basket>(`${this.baseUrl}/item`, body).pipe(
      tap(b => this.setBasket(b)),
      catchError(err => throwError(() => err))
    );
  }

  removeItem(itemId: number): Observable<Basket> {
    return this.http.delete<Basket>(`${this.baseUrl}/item/${itemId}`).pipe(
      tap(b => this.setBasket(b)),
      catchError(err => throwError(() => err))
    );
  }

  clearBasket(): Observable<Basket> {
    return this.http.delete<Basket>(`${this.baseUrl}/clear`).pipe(
      tap(b => this.setBasket(b)),
      catchError(err => throwError(() => err))
    );
  }

  purchaseBasket(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/purchase`, {}).pipe(
      tap(_ => {
        const empty: Basket = { basketId: 0, items: [], totalItems: 0, totalPrice: 0 };
        this.setBasket(empty);
      }),
      catchError(err => throwError(() => err))
    );
  }

  private setBasket(basket: Basket) {
    this.basketSource.next(basket);
    this.itemCountSource.next(basket?.totalItems ?? 0);
  }

  getCurrentBasketSnapshot(): Basket | null {
    return this.basketSource.getValue();
  }

  getCurrentItemCountSnapshot(): number {
    return this.itemCountSource.getValue();
  }
}
