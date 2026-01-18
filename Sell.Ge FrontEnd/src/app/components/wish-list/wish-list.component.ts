import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Wishlist, WishlistItem } from '../../get/wishlist';
import { WishlistService } from '../../services/wishlist.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-wish-list',
    standalone: true,
    imports: [CommonModule, NgFor, NgIf],
    templateUrl: './wish-list.component.html',
    styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit, OnDestroy {

    wishlist: Wishlist = {
        wishlistId: 0,
        items: [],
        totalItems: 0
    };

    totalPrice = 0;

    loading = true;
    errorMessage = '';
    processing = false;

    private destroy$ = new Subject<void>();

    constructor(private wishlistService: WishlistService) { }

    ngOnInit(): void {
        this.loading = true;

        this.wishlistService.wishlist$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: w => {
                    if (w) this.wishlist = w;
                    this.recalcTotals();
                    this.loading = false;
                    this.processing = false;
                    this.errorMessage = '';
                },
                error: err => {
                    this.loading = false;
                    this.processing = false;
                    this.errorMessage = this.formatError(err);
                }
            });

        this.loadWishlist();
    }

    private loadWishlist(): void {
        this.loading = true;
        this.wishlistService.getWishlist().pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Failed to load wishlist';
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    changeQuantity(itemId: number, quantity: number) {
        if (quantity < 1) return;

        const item = this.wishlist.items.find(i => i.itemId === itemId);
        if (!item) return;

        item.quantity = quantity;
        this.recalcTotals();

        this.processing = true;
        this.wishlistService.changeQuantity(itemId, quantity).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.processing = false;
                this.loadWishlist();
            },
            error: err => {
                this.processing = false;
                this.errorMessage = this.formatError(err) || 'Failed to update quantity';
                this.loadWishlist();
            }
        });
    }

    removeItem(itemId: number) {
        this.wishlist.items = this.wishlist.items.filter(i => i.itemId !== itemId);
        this.recalcTotals();

        this.processing = true;
        this.wishlistService.removeItem(itemId).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.processing = false;
                this.loadWishlist();
            },
            error: err => {
                this.processing = false;
                this.errorMessage = this.formatError(err) || 'Failed to remove item';
                this.loadWishlist();
            }
        });
    }

    moveItemToCart(itemId: number) {
        this.wishlist.items = this.wishlist.items.filter(i => i.itemId !== itemId);
        this.recalcTotals();

        this.processing = true;
        this.wishlistService.moveItemToCart(itemId).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.processing = false;
                this.loadWishlist();
            },
            error: err => {
                this.processing = false;
                this.errorMessage = this.formatError(err) || 'Failed to move item';
                this.loadWishlist();
            }
        });
    }

    moveAllToCart() {
        this.wishlist.items = [];
        this.recalcTotals();

        this.processing = true;
        this.wishlistService.moveAllToCart().pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.processing = false;
                this.loadWishlist();
            },
            error: err => {
                this.processing = false;
                this.errorMessage = this.formatError(err) || 'Failed to move items';
                this.loadWishlist();
            }
        });
    }

    trackByItem(index: number, item: WishlistItem) {
        return item.itemId;
    }


    private recalcTotals(): void {
        const totalItems = (this.wishlist.items || []).reduce((sum, it) => sum + ((it as any).quantity ?? 1), 0);
        const totalPrice = (this.wishlist.items || []).reduce((sum, it) => {
            const unit = (it as any).unitPrice ?? 0;
            const qty = (it as any).quantity ?? 1;
            return sum + unit * qty;
        }, 0);

        this.wishlist.totalItems = totalItems;
        this.totalPrice = totalPrice;
    }

    private formatError(err: any): string {
        if (!err) return 'Unknown error';
        if (err.error && err.error.message) return err.error.message;
        if (err.message) return err.message;
        return String(err);
    }
}
