import { Component, OnInit, inject } from '@angular/core';
import { Clothes } from '../../get/Clothes';
import { Shoes } from '../../get/Shoes';
import { ClothesService } from '../../services/clothes.service';
import { ShoesService } from '../../services/shoes.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

type Item = Clothes | Shoes;

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [NgIf],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  itemId: number | null = null;
  itemDetails: Item | null = null;
  itemSource: 'clothes' | 'shoes' | null = null;
  wishListItems: Item[] = [];

  shoesItemId: number | null = null;
  shoesItemDetails: Shoes | null = null;

  private clothesService = inject(ClothesService);
  private shoesService = inject(ShoesService);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const idNum = idParam ? Number(idParam) : null;
      const type = this.route.snapshot.queryParamMap.get('type');
      if (idNum !== null) {
        if (type === 'clothes') {
          this.itemId = idNum;
          this.fetchClothesDetails(this.itemId);
        } else if (type === 'shoes') {
          this.shoesItemId = idNum;
          this.fetchShoesDetails(this.shoesItemId);
        } else {
          this.itemId = idNum;
          this.shoesItemId = idNum;
          this.fetchClothesDetails(this.itemId);
          this.fetchShoesDetailsFallback(this.shoesItemId);
        }
      }
    });
  }

  async fetchClothesDetails(id: number): Promise<void> {
    this.itemDetails = null;
    this.itemSource = null;
    try {
      const clothes = await this.clothesService.getClothesById(String(id));
      if (clothes) {
        this.itemDetails = clothes;
        this.itemSource = 'clothes';
      }
    } catch {
      this.itemDetails = this.itemDetails ?? null;
    }
  }

  async fetchShoesDetails(id: number): Promise<void> {
    this.itemDetails = null;
    this.itemSource = null;
    this.shoesItemDetails = null;
    try {
      const shoes = await this.shoesService.getShoesById(String(id));
      if (shoes) {
        this.itemDetails = shoes;
        this.itemSource = 'shoes';
        this.shoesItemDetails = shoes;
        this.shoesItemId = id;
      }
    } catch {
      this.itemDetails = this.itemDetails ?? null;
      this.shoesItemDetails = this.shoesItemDetails ?? null;
    }
  }

  private async fetchShoesDetailsFallback(id: number): Promise<void> {
    if (this.itemSource === 'clothes') return;
    this.shoesItemDetails = null;
    try {
      const shoes = await this.shoesService.getShoesById(String(id));
      if (shoes) {
        this.itemDetails = shoes;
        this.itemSource = 'shoes';
        this.shoesItemDetails = shoes;
        this.shoesItemId = id;
      }
    } catch {
      this.itemDetails = this.itemDetails ?? null;
      this.shoesItemDetails = this.shoesItemDetails ?? null;
    }
  }

  addToCart(item: Item | null): void {
    if (!item) return;
    if (!this.authService.isLoggedIn()) {
      this.promptLogin('To add to your cart, log in to your account.');
      return;
    }
    const clothId = this.itemSource === 'clothes' ? (item as Clothes).id : null;
    const shoeId = this.itemSource === 'shoes' ? (item as Shoes).id : null;
    this.cartService.addToBasket(clothId, shoeId, 1).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Added To Cart',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer'
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Could not add to cart',
          showConfirmButton: true,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer'
          }
        });
      }
    });
  }

  addToWishList(item: Item | null): void {
    if (!item) return;
    if (!this.authService.isLoggedIn()) {
      this.promptLogin('To add to your wish list, log in to your account.');
      return;
    }
    const clothId = this.itemSource === 'clothes' ? (item as Clothes).id : null;
    const shoeId = this.itemSource === 'shoes' ? (item as Shoes).id : null;
    this.wishlistService.addToWishlist(clothId, shoeId, 1).subscribe({
      next: (w) => {
        const items = (w as any)?.items ?? (w as any)?.wishlistItems ?? null;
        if (Array.isArray(items)) {
          this.wishListItems = items;
          try {
            localStorage.setItem('wishListItems', JSON.stringify(this.wishListItems));
          } catch {}
        }
        Swal.fire({
          icon: 'success',
          title: 'Added To WishList',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer'
          }
        });
      },
      error: (err) => {
        const alreadyExists = (err && err.error && err.error.message && String(err.error.message).toLowerCase().includes('already')) || false;
        if (alreadyExists) {
          Swal.fire({
            icon: 'info',
            title: "It's Already In WishList",
            showConfirmButton: true,
            customClass: {
              popup: 'swal-glass-popup',
              title: 'swal-glass-title',
              footer: 'swal-glass-footer',
              confirmButton: 'swal-glass-confirbutton'
            },
            confirmButtonText: 'Go To Wish List'
          }).then(result => {
            if (result.isConfirmed) {
              this.goToWishList();
            }
          });
          return;
        }
        Swal.fire({
          icon: 'error',
          title: 'Could not add to wish list',
          showConfirmButton: true,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer'
          }
        });
      }
    });
  }

  private promptLogin(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'YOU ARE NOT LOGGED IN',
      showConfirmButton: true,
      html: `<span class="swal-text">${message}</span>`,
      customClass: {
        popup: 'swal-glass-popup',
        title: 'swal-glass-title',
        footer: 'swal-glass-footer',
        confirmButton: 'swal-glass-confirbutton'
      },
      confirmButtonText: 'Log In Now'
    }).then(result => {
      if (result.isConfirmed) {
        this.goToLogIn();
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
}
