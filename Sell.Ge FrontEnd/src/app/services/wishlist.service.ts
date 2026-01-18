import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Wishlist } from '../get/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly baseUrl = 'https://localhost:7208/api/wishlist';

  private wishlistSource = new BehaviorSubject<Wishlist | null>(null);
  wishlist$ = this.wishlistSource.asObservable();

  private itemCountSource = new BehaviorSubject<number>(0);
  itemCount$ = this.itemCountSource.asObservable();

  constructor(private http: HttpClient) { }

  getWishlist(): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.baseUrl}`).pipe(
      tap(w => this.setWishlist(w)),
      catchError(err => throwError(() => err))
    );
  }

  addToWishlist(clothId: number | null, shoeId: number | null, quantity: number = 1): Observable<Wishlist> {
    const body = {
      clothId: clothId ?? 0,
      shoeId: shoeId ?? 0,
      quantity
    };

    return this.http.post<Wishlist>(`${this.baseUrl}/add`, body).pipe(
      tap(w => this.setWishlist(w)),
      catchError(err => throwError(() => err))
    );
  }

  changeQuantity(itemId: number, quantity: number): Observable<Wishlist> {
    return this.http.put<Wishlist>(`${this.baseUrl}/changequantity`, {
      itemId,
      quantity
    }).pipe(
      tap(w => this.setWishlist(w)),
      catchError(err => throwError(() => err))
    );
  }

  removeItem(itemId: number): Observable<Wishlist> {
    return this.http.delete<Wishlist>(`${this.baseUrl}/item/${itemId}`).pipe(
      tap(w => this.setWishlist(w)),
      catchError(err => throwError(() => err))
    );
  }

  clearWishlist(): Observable<Wishlist> {
    return this.http.delete<Wishlist>(`${this.baseUrl}/clear`).pipe(
      tap(w => this.setWishlist(w)),
      catchError(err => throwError(() => err))
    );
  }

  moveItemToCart(itemId: number): Observable<Wishlist> {
    return this.http.post(`${this.baseUrl}/move/item/${itemId}`, {}).pipe(
      switchMap(() => this.getWishlist()),
      catchError(err => throwError(() => err))
    );
  }

  moveAllToCart(): Observable<Wishlist> {
    return this.http.post(`${this.baseUrl}/move/all`, {}).pipe(
      switchMap(() => this.getWishlist()),
      catchError(err => throwError(() => err))
    );
  }

  private setWishlist(wishlist: Wishlist) {
    this.wishlistSource.next(wishlist);
    this.itemCountSource.next(wishlist?.totalItems ?? 0);
  }

  getCurrentWishlistSnapshot(): Wishlist | null {
    return this.wishlistSource.getValue();
  }

  getCurrentItemCountSnapshot(): number {
    return this.itemCountSource.getValue();
  }
}
