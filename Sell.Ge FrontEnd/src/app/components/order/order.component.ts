import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Purchase } from '../../get/purchase';
import { OrderedService } from '../../services/ordered.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  pending: Purchase[] = [];
  history: Purchase[] = [];
  loadingPending = false;
  loadingHistory = false;
  errorPending: string | null = null;
  errorHistory: string | null = null;
  pendingPage = 1;
  historyPage = 1;
  pageSize = 20;

  activeTab: 'pending' | 'delivered' = 'pending';

  private destroy$ = new Subject<void>();

  constructor(private orderedService: OrderedService) {}

  ngOnInit(): void {
    this.loadPending(this.pendingPage, this.pageSize);
    this.loadHistory(this.historyPage, this.pageSize);
  }

  loadPending(page: number = 1, pageSize: number = this.pageSize): void {
    this.loadingPending = true;
    this.errorPending = null;
    this.orderedService
      .getPendingPurchases(page, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Purchase[]) => {
          this.pending = res;
          this.loadingPending = false;
        },
        error: (err) => {
          this.errorPending = err?.message ?? 'Failed to load pending purchases';
          this.loadingPending = false;
        }
      });
  }

  loadHistory(page: number = 1, pageSize: number = this.pageSize): void {
    this.loadingHistory = true;
    this.errorHistory = null;
    this.orderedService
      .getPurchaseHistory(page, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Purchase[]) => {
          this.history = res;
          this.loadingHistory = false;
        },
        error: (err) => {
          this.errorHistory = err?.message ?? 'Failed to load purchase history';
          this.loadingHistory = false;
        }
      });
  }

  trackByPurchaseId(_: number, item: Purchase): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
