import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Clothes } from '../../get/Clothes';
import { ClothesService, FilterParams } from '../../services/clothes.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CartService } from '../../services/cart-service.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-men-tops',
  standalone: true,
  imports: [CommonModule,
    NgFor,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSliderModule,
    NgIf],
  templateUrl: './men-tops.component.html',
  styleUrl: './men-tops.component.css'
})
export class MenTopsComponent implements OnInit, OnDestroy {
  clothes: Clothes[] = [];
  selectedClothes: Clothes | null = null;
  isLoading = true;
  showPopup = false;
  cartClothes: Clothes[] = [];
  shown = 6;
  selectedType = '';
  filteredClothes: Clothes[] = [];
  isFilterVisible = false;

  // Filter properties
  brandQuery = '';
  productNameQuery = '';
  selectedSize = '';
  priceFrom?: number;
  priceTo?: number;

  // New filter properties
  selectedSort = 'default';
  selectedColor = '';
  selectedMaterial = '';
  minRating?: number;
  inStockOnly = false;
  onSaleOnly = false;

  showScrollToTop = false;

  private destroy$ = new Subject<void>();

  constructor(
    private clothesService: ClothesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService

  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedType = params['type'] || '';
      this.loadClothes();
    });

    this.cartService.basket$
      .pipe(takeUntil(this.destroy$))
      .subscribe(basket => {
        this.syncCartClothesFromBasket(basket);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadClothes(): Promise<void> {
    this.isLoading = true;
    try {
      const filters: FilterParams = {
        gender: 'male'
      };

      if (this.selectedType) filters.productTypeName = this.selectedType;

      this.clothes = await this.clothesService.getFilteredClothes(filters);
      this.filteredClothes = [...this.clothes];
      this.applyLocalFilters();
    } catch (error) {
      console.error('Error fetching clothes:', error);
      this.clothes = [];
      this.filteredClothes = [];
    } finally {
      this.isLoading = false;
      const basket = this.cartService.getCurrentBasketSnapshot();
      this.syncCartClothesFromBasket(basket);
    }
  }

  private syncCartClothesFromBasket(basket: any | null): void {
    this.cartClothes = [];
    if (!basket || !Array.isArray(basket.items)) return;
    for (const item of basket.items) {
      const clothId = item?.clothId ?? null;
      if (clothId != null) {
        const found = this.clothes.find(c => Number(c.id) === Number(clothId));
        if (found) this.cartClothes.push(found);
      }
    }
  }

  onSelectClothes(id: number): void {
    this.clothesService
      .getClothesById(id.toString())
      .then(clothes => {
        this.selectedClothes = clothes;
        this.showPopup = true;
      })
      .catch(err => console.error(err));
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedClothes = null;
  }

  closeFilter(): void {
    this.isFilterVisible = false;
  }

  closePopupOnOutsideClick(event: MouseEvent): void {
    if (this.showPopup) this.closePopup();
  }

  addToCart(clothes: Clothes): void {
    const quantity = Number(clothes?.quantity ?? 0);
    if (!Number.isFinite(quantity) || quantity === 0) {
      Swal.fire({
        icon: 'error', title: 'Out Of Stock', showConfirmButton: false, timer: 1500, customClass: {
          popup: 'swal-glass-popup',
          title: 'swal-glass-title',
          confirmButton: 'swal-glass-confirm',
          cancelButton: 'swal-glass-cancel'
        }
      });
      return;
    }

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'error',
        title: 'YOU ARE NOT LOGGED IN',
        showConfirmButton: true,
        html: '<span class="swal-text">To add to your cart, log in to your account.</span>',
        confirmButtonText: 'Log In Now',
        customClass: {
          popup: 'swal-glass-popup',
          title: 'swal-glass-title',
          confirmButton: 'swal-glass-confirm',
          cancelButton: 'swal-glass-cancel'
        }
      }).then(() => this.goToLogIn());
      return;
    }

    const clothIdNumber = Number(clothes.id);
    this.cartService
      .addToBasket(clothIdNumber, 0, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => Swal.fire({
          icon: 'success', title: 'Added To Cart', showConfirmButton: false, timer: 1500, customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            confirmButton: 'swal-glass-confirm',
            cancelButton: 'swal-glass-cancel'
          }
        }),
        error: err => {
          console.error('Add to cart error:', err);
          const backendMessage = err?.error?.error ?? err?.error?.message ?? err?.message ?? 'Nearly Out Of Stock, Last Items Pending To Be Purchased';

          Swal.fire({
            icon: 'error', title: backendMessage, showConfirmButton: false, timer: 1500, customClass: {
              popup: 'swal-glass-popup',
              title: 'swal-glass-title',
              confirmButton: 'swal-glass-confirm',
              cancelButton: 'swal-glass-cancel'
            }
          });
        }
      });
  }

  goToCart(): void { this.router.navigate(['cart']); }
  goToLogIn(): void { this.router.navigate(['log-in']); }

  showMore(): void {
    this.shown = Math.min(this.shown + 6, this.filteredClothes.length);
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  /**
   * Apply filters and call the service's filtered endpoint.
   */
  async applyFilters(): Promise<void> {
    this.isLoading = true;
    try {
      const filters: FilterParams = {
        gender: 'male'
      };

      // brand
      if (this.brandQuery && this.brandQuery.trim().length > 0) {
        filters.brandName = this.brandQuery.trim();
      }

      // product type
      if (this.selectedType) {
        filters.productTypeName = this.selectedType;
      }

      // product name
      if (this.productNameQuery && this.productNameQuery.trim().length > 0) {
        filters.name = this.productNameQuery.trim();
      }

      // size
      const clothSizeCode = this.sizeToCode(this.selectedSize);
      if (clothSizeCode !== null) {
        filters.clothSize = clothSizeCode;
      }

      // price range
      if (this.priceFrom !== undefined && this.priceFrom !== null) {
        filters.priceFrom = this.priceFrom;
      }
      if (this.priceTo !== undefined && this.priceTo !== null) {
        filters.priceTo = this.priceTo;
      }

      this.clothes = await this.clothesService.getFilteredClothes(filters);
      this.filteredClothes = [...this.clothes];
      this.applyLocalFilters(); // Apply any client-side filters
      this.shown = Math.min(this.shown, this.filteredClothes.length);
    } catch (err) {
      console.error('Failed to apply filters', err);
      this.clothes = [];
      this.filteredClothes = [];
    } finally {
      this.isLoading = false;
      this.isFilterVisible = false;
    }
  }

  /**
   * Apply client-side filters that aren't handled by the API
   */
  private applyLocalFilters(): void {
    let filtered = [...this.clothes];

    // In stock filter (client-side)
    if (this.inStockOnly) {
      filtered = filtered.filter(item => Number(item.quantity ?? 0) > 0);
    }

    // Apply sorting
    this.applySorting(filtered);
  }

  /**
   * Apply sorting to the filtered clothes
   */
  private applySorting(clothesArray: Clothes[]): void {
    switch (this.selectedSort) {
      case 'price-low-high':
        this.filteredClothes = [...clothesArray].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high-low':
        this.filteredClothes = [...clothesArray].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name-asc':
        this.filteredClothes = [...clothesArray].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredClothes = [...clothesArray].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-high':
        // Assuming there's a rating property
        this.filteredClothes = [...clothesArray].sort((a: any, b: any) =>
          (b.rating || 0) - (a.rating || 0)
        );
        break;
      default:
        this.filteredClothes = clothesArray;
    }
  }

  async resetFilters(): Promise<void> {
    this.brandQuery = '';
    this.productNameQuery = '';
    this.selectedSize = '';
    this.priceFrom = undefined;
    this.priceTo = undefined;
    this.selectedSort = 'default';
    this.selectedColor = '';
    this.selectedMaterial = '';
    this.minRating = undefined;
    this.inStockOnly = false;
    this.onSaleOnly = false;
    this.shown = 6;
    await this.loadClothes();
    this.isFilterVisible = false;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.showScrollToTop = scrollTop > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToWishList(clothes: Clothes): void {

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'error',
        title: 'YOU ARE NOT LOGGED IN',
        showConfirmButton: true,
        html: '<span class="swal-text">To add to your wishlist, log in to your account.</span>',
        confirmButtonText: 'Log In Now',
        customClass: {
          popup: 'swal-glass-popup',
          title: 'swal-glass-title',
          confirmButton: 'swal-glass-confirm',
          cancelButton: 'swal-glass-cancel'
        }
      }).then(() => this.goToLogIn());
      return;
    }

    const clothesIdNumber = Number(clothes.id);

    this.wishlistService
      .addToWishlist(clothesIdNumber, 0, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Added To Wishlist',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'swal-glass-popup',
              title: 'swal-glass-title'
            }
          });
        },
        error: err => {
          console.error('Add to wishlist error:', err);
          const backendMessage = err?.error?.error ?? err?.error?.message ?? err?.message ?? 'Nearly Out Of Stock, Last Items Pending To Be Purchased';

          Swal.fire({
            icon: 'info',
            title: backendMessage,
            timer: 1500,
            showConfirmButton: false,
            confirmButtonText: 'Go To Wishlist',
            customClass: {
              popup: 'swal-glass-popup',
              title: 'swal-glass-title',
              confirmButton: 'swal-glass-confirm'
            }
          }).then(result => {
            if (result.isConfirmed) {
              this.goToWishList();
            }
          });
        }
      });
  }
  goToWishList(): void {
    this.router.navigate(['wish-list']);
  }

  getStockClass(quantity: number | null | undefined): 'in-stock' | 'out-of-stock' | 'low-stock' {
    const q = Number(quantity ?? 0);
    if (!Number.isFinite(q) || q === 0) return 'out-of-stock';
    if (q > 1) return 'in-stock';
    return 'low-stock';
  }

  getStockText(quantity: number | null | undefined): string {
    const q = Number(quantity ?? 0);
    if (!Number.isFinite(q) || q === 0) return 'Out Of Stock';
    if (q > 1) return 'In Stock';
    return 'Only 1 left';
  }

  isAddToCartDisabled(quantity: number | null | undefined): boolean {
    const q = Number(quantity ?? 0);
    return !Number.isFinite(q) || q === 0;
  }

  private sizeToCode(size: string): number | null {
    if (!size) return null;
    const s = size.toLowerCase();
    if (s === 's') return 1;
    if (s === 'm') return 2;
    if (s === 'l') return 3;
    if (s === 'xl') return 4;
    if (s === 'xxl') return 5;
    if (s === 'xxxl') return 6;
    return null;
  }

}