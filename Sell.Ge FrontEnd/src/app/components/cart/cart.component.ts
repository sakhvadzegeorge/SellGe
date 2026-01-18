import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Basket, BasketItem } from '../../get/basket';
import { CartService } from '../../services/cart-service.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  basket: Basket = { basketId: 0, items: [], totalItems: 0, totalPrice: 0 };
  itemCount = 0;
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loading = true;

    this.cartService.basket$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: b => {
          if (b) {
            this.basket = b;
            this.itemCount = b.totalItems ?? 0;
          }
          this.loading = false;
          this.error = null;
        },
        error: err => {
          this.loading = false;
          this.error = this.formatError(err);
        }
      });

    this.cartService.itemCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(c => (this.itemCount = c));

    this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
  }

  addToBasket(clothId: number | null, shoeId: number | null, quantity: number = 1): void {
    this.loading = true;
    this.cartService.addToBasket(clothId, shoeId, quantity).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
        this.loading = false;
        this.error = null;
      },
      error: err => {
        this.loading = false;
        this.error = this.formatError(err);
      }
    });
  }

  updateItemQuantity(itemId: number, quantity: number): void {
    if (quantity < 0) return;

    const item = this.basket.items.find(i => i.itemId === itemId);
    if (!item) return;

    item.quantity = quantity;
    this.recalcTotals();

    this.cartService.updateItem(itemId, quantity).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
        this.error = null;
      },
      error: err => {
        this.error = this.formatError(err);
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
      }
    });
  }

  removeItem(itemId: number): void {
    this.basket.items = this.basket.items.filter(i => i.itemId !== itemId);
    this.recalcTotals();

    this.cartService.removeItem(itemId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
        this.error = null;
      },
      error: err => {
        this.error = this.formatError(err);
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
      }
    });
  }

  clearBasket(): void {
    if (!confirm('Are you sure you want to clear the basket?')) return;

    this.basket.items = [];
    this.recalcTotals();

    this.cartService.clearBasket().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
        this.error = null;
      },
      error: err => {
        this.error = this.formatError(err);
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
      }
    });
  }

  purchase(): void {
    if ((this.basket.totalItems ?? 0) === 0) {
      this.error = 'Basket is empty.';
      return;
    }
    if (!confirm('Proceed to purchase the items in your basket?')) return;

    this.loading = true;
    this.cartService.purchaseBasket().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading = false;
        this.error = null;
        alert('Purchase completed successfully.');
        this.cartService.getBasket().pipe(takeUntil(this.destroy$)).subscribe();
      },
      error: err => {
        this.loading = false;
        this.error = this.formatError(err);
      }
    });
  }

  computeLineTotal(item: BasketItem): number {
    return (item.unitPrice || 0) * (item.quantity || 0);
  }

  trackByItem(_index: number, item: BasketItem): number {
    return item.itemId ?? _index;
  }

  private formatError(err: any): string {
    if (!err) return 'Unknown error';
    if (err.error && err.error.message) return err.error.message;
    if (err.message) return err.message;
    return String(err);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private recalcTotals(): void {
    const totalItems = this.basket.items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
    const totalPrice = this.basket.items.reduce((sum, it) => sum + this.computeLineTotal(it), 0);

    this.basket.totalItems = totalItems;
    this.basket.totalPrice = totalPrice;
    this.itemCount = totalItems;
  }
}
