import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../../get/purchase';
import { NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

const API_BASE = 'https://localhost:7208';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  purchases: Purchase[] = [];
  selectedPurchase: Purchase | null = null;

  loading = false;
  error: string | null = null;

  showPending = true;
  showDelivered = false;

  page = 1;
  pageSize = 10;

  private base = `${API_BASE}/api/purchased`;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAll();
  }

  // =======================
  // API METHODS (moved from service)
  // =======================

  private apiGetAll(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.base);
  }

  private apiGetById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.base}/${id}`);
  }

  private apiMarkDeliveredById(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/mark-delivered`, null);
  }

  private apiMarkDelivered(payload: { purchaseId: number; deliveredByAdminId?: number }): Observable<void> {
    return this.http.post<void>(`${this.base}/mark-delivered`, payload);
  }

  private apiGetHistory(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.base}/history`);
  }

  private apiGetUserHistory(userId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.base}/history/user/${userId}`);
  }

  // =======================
  // GET ALL
  // =======================
  loadAll(): void {
    this.loading = true;
    this.apiGetAll().subscribe({
      next: data => {
        this.purchases = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load purchases';
        this.loading = false;
      }
    });
  }

  // =======================
  // GET BY ID
  // =======================
  loadById(id: number): void {
    this.loading = true;
    this.apiGetById(id).subscribe({
      next: data => {
        this.selectedPurchase = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load purchase';
        this.loading = false;
      }
    });
  }

  // =======================
  // HISTORY (ADMIN)
  // =======================
  loadHistory(): void {
    this.loading = true;
    this.apiGetHistory().subscribe({
      next: data => {
        this.purchases = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load history';
        this.loading = false;
      }
    });
  }

  // =======================
  // USER HISTORY
  // =======================
  loadUserHistory(userId: number): void {
    this.loading = true;
    this.apiGetUserHistory(userId).subscribe({
      next: data => {
        this.purchases = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load user history';
        this.loading = false;
      }
    });
  }

  // =======================
  // MARK DELIVERED (BY ID)
  // =======================
  deliverOne(id: number): void {
    this.apiMarkDeliveredById(id).subscribe({
      next: () => {
        this.purchases = this.purchases.map(p =>
          p.id === id ? { ...p, isDelivered: true } : p
        );
      },
      error: () => {
        this.error = `Failed to mark purchase ${id} delivered`;
      }
    });
  }

  // =======================
  // MARK DELIVERED (PAYLOAD)
  // =======================
  deliverWithPayload(purchaseId: number, adminId?: number): void {
    this.apiMarkDelivered({ purchaseId, deliveredByAdminId: adminId }).subscribe({
      next: () => {
        this.purchases = this.purchases.map(p =>
          p.id === purchaseId ? { ...p, isDelivered: true } : p
        );
      },
      error: () => {
        this.error = `Failed to mark purchase ${purchaseId} delivered`;
      }
    });
  }

  // =======================
  // MARK ALL PENDING
  // =======================
  deliverAll(): void {
    // Use a copy to avoid mutation issues while iterating
    const pending = [...this.pendingPurchases];
    pending.forEach(p => this.deliverOne(p.id));
  }

  // =======================
  // FILTERS
  // =======================
  get pendingPurchases(): Purchase[] {
    return this.purchases.filter(p => !p.isDelivered);
  }

  get deliveredPurchases(): Purchase[] {
    return this.purchases.filter(p => p.isDelivered);
  }

  // =======================
  // PAGINATION
  // =======================
  get pagedPending(): Purchase[] {
    const start = (this.page - 1) * this.pageSize;
    return this.pendingPurchases.slice(start, start + this.pageSize);
  }

  get pagedDelivered(): Purchase[] {
    const start = (this.page - 1) * this.pageSize;
    return this.deliveredPurchases.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    const total = this.showPending
      ? this.pendingPurchases.length
      : this.deliveredPurchases.length;
    return Math.max(Math.ceil(total / this.pageSize), 1);
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  // =======================
  // UI HELPERS
  // =======================
  openDetails(p: Purchase): void {
    this.selectedPurchase = p;
  }

  closeDetails(): void {
    this.selectedPurchase = null;
  }

  togglePending(): void {
    this.showPending = true;
    this.showDelivered = false;
    this.page = 1;
  }

  toggleDelivered(): void {
    this.showPending = false;
    this.showDelivered = true;
    this.page = 1;
  }
}
