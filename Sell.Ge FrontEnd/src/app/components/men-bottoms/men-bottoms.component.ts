import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Shoes } from '../../get/Shoes';
import { FilterParams, ShoesService } from '../../services/shoes.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart-service.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-men-bottoms',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './men-bottoms.component.html',
  styleUrls: ['./men-bottoms.component.css']
})
export class MenBottomsComponent implements OnInit, OnDestroy {
  shoes: Shoes[] = [];
  selectedShoe: Shoes | null = null;
  isLoading = true;
  showPopup = false;
  cartShoes: Shoes[] = [];
  wishlistShoes: Shoes[] = [];
  wishListShoes: Shoes[] = [];
  shown = 6;
  selectedType = '';
  filteredShoes: Shoes[] = [];
  isFilterVisible = false;
  searchQuery = '';
  selectedSize = '';
  showScrollToTop = false;
  brandQuery = '';
  productNameQuery = '';
  priceFrom?: number;
  priceTo?: number;
  selectedSort = 'default';
  selectedColor = '';
  selectedMaterial = '';
  minRating?: number;
  inStockOnly = false;
  onSaleOnly = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private shoesService: ShoesService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedType = params['type'] || '';
      this.loadShoes();
    });

    this.cartService.basket$
      .pipe(takeUntil(this.destroy$))
      .subscribe(basket => {
        this.syncCartShoesFromBasket(basket);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadShoes(): Promise<void> {
    this.isLoading = true;
    try {
      const filters: FilterParams = {
        gender: 'male'
      };

      if (this.selectedType) filters.productTypeName = this.selectedType;

      this.shoes = await this.shoesService.getFilteredShoes(filters);
      this.filteredShoes = [...this.shoes];
      this.applyLocalFilters();
    } catch (error) {
      console.error('Error fetching shoes:', error);
      this.shoes = [];
      this.filteredShoes = [];
    } finally {
      this.isLoading = false;
      const basket = this.cartService.getCurrentBasketSnapshot();
      this.syncCartShoesFromBasket(basket);
    }
  }

  private syncCartShoesFromBasket(basket: any | null): void {
    this.cartShoes = [];
    if (!basket || !Array.isArray(basket.items)) return;
    for (const item of basket.items) {
      const shoeId = item?.shoeId ?? item?.clothId ?? null;
      if (shoeId != null) {
        const found = this.shoes.find(s => Number(s.id) === Number(shoeId));
        if (found) this.cartShoes.push(found);
      }
    }
  }

  private filterShoesByType(): void {
    if (this.selectedType) {
      this.filteredShoes = this.shoes.filter(
        shoe => shoe.productTypeName?.toLowerCase() === this.selectedType.toLowerCase()
      );
    } else {
      this.filteredShoes = [...this.shoes];
    }
  }

  onSelectShoe(id: number): void {
    this.shoesService.getShoesById(id.toString()).then((shoe) => {
      this.selectedShoe = shoe;
      this.showPopup = true;
    }).catch((error) => {
      console.error('Error fetching shoe by ID:', error);
    });
  }

  closeFilter(): void {
    this.isFilterVisible = false;
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedShoe = null;
  }

  closePopupOnOutsideClick(event: MouseEvent): void {
    if (this.showPopup) {
      this.closePopup();
    }
  }

  addToCart(shoe: Shoes): void {
    const availableStock = Number(shoe?.quantity ?? 0);
    
    if (!Number.isFinite(availableStock) || availableStock === 0) {
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

    const qtyToAdd = 1;
    if (qtyToAdd > availableStock) {
      Swal.fire({
        icon: 'error',
        title: 'Not enough stock',
        text: 'Requested quantity exceeds available stock.',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    const clothId = (shoe as any).clothId ?? null;
    const shoeId = (shoe as any).shoeId ?? null;
    let clothParam = 0;
    let shoeParam = 0;

    if (clothId != null && Number(clothId) > 0) {
      clothParam = Number(clothId);
      shoeParam = 0;
    } else if (shoeId != null && Number(shoeId) > 0) {
      clothParam = 0;
      shoeParam = Number(shoeId);
    } else {
      const fallbackId = Number(shoe.id ?? 0);
      clothParam = 0;
      shoeParam = fallbackId;
    }

    this.cartService
      .addToBasket(clothParam, shoeParam, qtyToAdd)
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
            icon: 'error',
            title: backendMessage,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal-glass-popup',
              title: 'swal-glass-title',
              confirmButton: 'swal-glass-confirm'
            }
          });
        }
      });
  }

  addToWishList(shoe: Shoes): void {

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

    const shoeIdNumber = Number(shoe.id);

    this.wishlistService
      .addToWishlist(0, shoeIdNumber, 1)
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

          Swal.fire({
            icon: 'info',
            title: 'Out Of Stock',
            showConfirmButton: true,
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

  goToCart(): void {
    this.router.navigate(['cart']);
  }

  goToLogIn(): void {
    this.router.navigate(['log-in']);
  }

  showMore(): void {
    this.shown = Math.min(this.shown + 6, this.filteredShoes.length);
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  async applyFilters(): Promise<void> {
    this.isLoading = true;
    try {
      const filters: FilterParams = {
        gender: 'male'
      };

      if (this.brandQuery && this.brandQuery.trim().length > 0) {
        filters.brandName = this.brandQuery.trim();
      }

      if (this.selectedType) {
        filters.productTypeName = this.selectedType;
      }

      if (this.productNameQuery && this.productNameQuery.trim().length > 0) {
        filters.name = this.productNameQuery.trim();
      }

      const clothSizeCode = this.sizeToCode(this.selectedSize);
      if (clothSizeCode !== null) {
        filters.clothSize = clothSizeCode;
      }

      if (this.priceFrom !== undefined && this.priceFrom !== null) {
        filters.priceFrom = this.priceFrom;
      }
      if (this.priceTo !== undefined && this.priceTo !== null) {
        filters.priceTo = this.priceTo;
      }

      this.shoes = await this.shoesService.getFilteredShoes(filters);
      this.filteredShoes = [...this.shoes];
      this.applyLocalFilters();
      this.shown = Math.min(this.shown, this.filteredShoes.length);
    } catch (err) {
      console.error('Failed to apply filters', err);
      this.shoes = [];
      this.filteredShoes = [];
    } finally {
      this.isLoading = false;
      this.isFilterVisible = false;
    }
  }

  private applyLocalFilters(): void {
    let filtered = [...this.shoes];

    if (this.searchQuery) {
      filtered = filtered.filter(item => item.name?.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
    if (this.selectedSize) {
      filtered = filtered.filter(item => item.shoeSize === this.selectedSize);
    }

    if (this.inStockOnly) {
      filtered = filtered.filter(item => Number(item.quantity ?? 0) > 0);
    }

    this.applySorting(filtered);
  }

  private applySorting(shoesArray: Shoes[]): void {
    switch (this.selectedSort) {
      case 'price-low-high':
        this.filteredShoes = [...shoesArray].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high-low':
        this.filteredShoes = [...shoesArray].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name-asc':
        this.filteredShoes = [...shoesArray].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredShoes = [...shoesArray].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-high':
        this.filteredShoes = [...shoesArray].sort((a: any, b: any) =>
          (b.rating || 0) - (a.rating || 0)
        );
        break;
      default:
        this.filteredShoes = shoesArray;
    }
  }

  resetFilters(): void {
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
    this.loadShoes();
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
    if (s === '33') return 8;
    if (s === '34') return 9;
    if (s === '35') return 10;
    if (s === '36') return 11;
    if (s === '37') return 12;
    if (s === '38') return 13;
    if (s === '39') return 14;
    if (s === '40') return 15;
    if (s === '41') return 16;
    if (s === '42') return 17;
    return null;
  }
}
