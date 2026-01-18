import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-buynow',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './buynow.component.html',
  styleUrl: './buynow.component.css'
})
export class BuynowComponent implements OnDestroy {
  loading = false;
  error: string | null = null;
  basketSub: Subscription | null = null;

  cardholder = '';
  cardNumber = '';
  expiry = '';
  cvv = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.basketSub?.unsubscribe();
  }

  formatCardNumber(e: Event): void {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    this.cardNumber = parts.join(' ');
    input.value = this.cardNumber;
  }

  formatExpiry(e: Event): void {
    const input = e.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 4);

    if (digits.length >= 2) {
      let mm = digits.slice(0, 2);
      let yy = digits.slice(2);
      const month = Math.min(Math.max(+mm, 1), 12).toString().padStart(2, '0');
      this.expiry = yy ? `${month}/${yy}` : month;
    } else {
      this.expiry = digits;
    }

    input.value = this.expiry;
  }

  formatCvv(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.cvv = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = this.cvv;
  }

  purchase(): void {
    if (this.loading) return;

    if (!this.cardholder.trim()) {
      this.error = 'Please enter cardholder name.';
      return;
    }

    if (this.cardNumber.replace(/\s/g, '').length !== 16) {
      this.error = 'Card number must be 16 digits.';
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiry)) {
      this.error = 'Expiry must be MM/YY.';
      return;
    }

    if (this.cvv.length < 3 || this.cvv.length > 4) {
      this.error = 'Invalid CVV.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.basketSub = this.cartService.getBasket().subscribe({
      next: basket => {
        if (!basket || basket.totalItems === 0) {
          this.loading = false;
          this.error = 'Basket is empty.';
          return;
        }

        if (!confirm('Proceed with purchase?')) {
          this.loading = false;
          return;
        }

        this.cartService.purchaseBasket().subscribe({
          next: () => {
            this.loading = false;
            alert('Purchase completed successfully.');
            this.router.navigate(['/cart']);
          },
          error: err => {
            this.loading = false;
            this.error = this.formatError(err);
          }
        });
      },
      error: err => {
        this.loading = false;
        this.error = this.formatError(err);
      }
    });
  }

  private formatError(err: any): string {
    if (err?.error?.message) return err.error.message;
    if (err?.message) return err.message;
    return 'Unknown error';
  }
}
