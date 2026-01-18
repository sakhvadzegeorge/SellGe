import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Clothes } from '../../get/Clothes';
import { ClothesService } from '../../services/clothes.service';
import { routes } from '../../app.routes';
import { NgModel } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CdkAriaLive } from "../../../../node_modules/@angular/cdk/a11y/index";
import { ShoesService } from '../../services/shoes.service';
import { Shoes } from '../../get/Shoes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  clothes: Clothes[] = [];
  shoes: Shoes[] = [];
  clothesService: ClothesService = inject(ClothesService);
  shoesService: ShoesService = inject(ShoesService);
  router: Router = inject(Router);
  showScrollToTop = false;
  itemId: number | null = null;
  shoesItemId: number | null = null;

  constructor() {
    this.clothesService.getClothes().then((clothes: Clothes[]) => {
      this.clothes = clothes;
    });
    this.shoesService.getShoes().then((shoes: Shoes[]) => {
      this.shoes = shoes;
    });
  }
  
  viewItemDetails(itemId: number): void {
    this.itemId = itemId;
    this.router.navigate(['/item-details', itemId], { queryParams: { type: 'clothes' } });
  }
  viewShoesDetials(itemId: number): void {
    this.shoesItemId = itemId;
    this.router.navigate(['/item-details', itemId], { queryParams: { type: 'shoes' } });
  }

  scrollCarousel(direction: number): void {
    const carousel = document.querySelector('.carousel-track') as HTMLElement;
    const card = document.querySelector('.card_container') as HTMLElement;

    if (!carousel || !card) {
      console.error('Carousel or card container element not found!');
      return;
    }

    const cardWidth = card.offsetWidth;
    const gap = 20;

    carousel.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth'
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollToTop = scrollTop > 300; // Show button when scrolled 300px down
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
