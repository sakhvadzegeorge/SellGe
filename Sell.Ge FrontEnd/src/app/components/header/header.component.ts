import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { CartService } from '../../services/cart-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  menuOpen = false;
  cartItemCount = 0;
  isDarkTheme = false;

  currentLang: 'en' | 'ka' = 'en';

  private destroy$ = new Subject<void>();
  private boundHandleClickOutside: (e: Event) => void;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private themeService: ThemeService
  ) {
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
    this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }

  ngOnInit(): void {
    this.cartService.itemCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.cartItemCount = count ?? 0);

    this.document.addEventListener('click', this.boundHandleClickOutside);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  toggleTheme(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isDarkTheme = isChecked;
    this.themeService.setTheme(isChecked ? 'dark' : 'light');
  }

  changeLanguage(lang: 'en' | 'ka'): void {
    this.currentLang = lang;

    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
        clearInterval(interval);
      }
    }, 300);
  }

  goToProfile(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['profile']);
      return;
    }
    this.router.navigate(['log-in']);
  }

  goToCart(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['cart']);
      return;
    }
    this.showLoginAlert(() => this.goToLogIn());
  }

  goToWishList(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['wish-list']);
      return;
    }
    this.showLoginAlert(() => this.goToLogIn());
  }

  goToLogIn(): void {
    this.router.navigate(['log-in']);
  }

  toggleMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        this.closeMenu();
        return;
      }
    }
    this.menuOpen = !this.menuOpen;
    this.updateMenuClasses();
  }

  private handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const insideMenu = target.closest('.smallScreen') || target.closest('.burgerMenu');
    if (!insideMenu && this.menuOpen) {
      this.closeMenu();
    }
  }

  private closeMenu(): void {
    this.menuOpen = false;
    this.updateMenuClasses();
  }

  private updateMenuClasses(): void {
    const smallScreen = this.document.querySelector('.smallScreen');
    const burgerContainer = this.document.querySelector('.burgerMenuContainer');
    smallScreen?.classList.toggle('isActive', this.menuOpen);
    burgerContainer?.classList.toggle('open', this.menuOpen);
  }

  private showLoginAlert(onConfirm: () => void): void {
    Swal.fire({
      icon: 'error',
      title: "YOU`RE NOT LOGGED IN",
      showConfirmButton: true,
      customClass: {
        popup: 'swal-glass-popup',
        title: 'swal-glass-title',
        footer: 'swal-glass-footer',
        confirmButton: 'swal-glass-confirbutton'
      },
      confirmButtonText: 'Go To Log In'
    }).then(result => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.document.removeEventListener('click', this.boundHandleClickOutside);
  }
}
