import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  private theme: 'light' | 'dark' = 'light';

  setTheme(theme: 'light' | 'dark'): void {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.style.setProperty('--background-color', '#f8f9fa');
      root.style.setProperty('--text-color', '#00000');
      root.style.setProperty('--card-background-color', '#ffffff');
      root.style.setProperty('--card-shadow-color', '#0000001A');
      root.style.setProperty('--card-h2-color', '#333333');
      root.style.setProperty('--card-h5-color', '#666666');
      root.style.setProperty('--card-h4-color', '#555555');
      root.style.setProperty('--card-border-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--card-border-hover-color', 'rgba(0, 0, 0, 0.2)');
      root.style.setProperty('--card-page3-button-color', '#ffefeb');
      root.style.setProperty('--card-page3-button-hover-color', '#ffe1db');
      root.style.setProperty('--card-page3-h2-color', '#333');
      root.style.setProperty('--card-page3-h1-color', '#222');
      root.style.setProperty('--card-page3-p-color', '#555');
      root.style.setProperty('--card-page5-card-color', '#fff');
      root.style.setProperty('--card-page5-border-color', '#ddd');
      root.style.setProperty('--card-page5-border-shadow-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--card-footer-text-color', '#777');
      root.style.setProperty('--card-box-shadow', 'rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--card-border-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--card-boxhover-shadow', 'rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--card-right', '#666');
      root.style.setProperty('--show-more', '#111');
      root.style.setProperty('--background', 'rgba(245, 245, 245, 0.8)');
      root.style.setProperty('--color', '#333333');
      root.style.setProperty('--primary-color', 'rgba(200, 200, 200, 0.6)');
      root.style.setProperty('--accent-color', 'rgba(220, 220, 220, 0.8)');
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--cart-background1-color', 'rgb(200, 200, 200)');
      root.style.setProperty('--cart-background2-color', 'rgba(200, 200, 200, 0.4)');
      root.style.setProperty('--cart-background3-color', 'rgba(245, 245, 245, 0.8)');
      root.style.setProperty('--cart-shadow-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--delete-hover', 'rgba(50, 50, 50, 0.2)');
      root.style.setProperty('--gradient-color', 'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))');
      root.style.setProperty('--registration1-color', '#2e2e2e');
      root.style.setProperty('--registration2-color', '#4a4a4a');
      root.style.setProperty('--registration3-color', '#7a7a7a');
      root.style.setProperty('--registration4-color', 'rgba(255, 255, 255, 0.2)');
      root.style.setProperty('--registration5-color', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--registration6-color', 'rgba(145, 145, 145, 0.15)');
      root.style.setProperty('--registration7-color', 'rgba(145, 145, 145, 0.3)');
      root.style.setProperty('--registration8-color', '#4a4a4a7d');
      root.style.setProperty('--registration9-color', 'rgba(0, 0, 0, 0.733)');
      root.style.setProperty('--registration10-color', 'rgba(0, 0, 0, 0.537)');
      root.style.setProperty('--login1-color', '#e0e0e0');
      root.style.setProperty('--login2-color', '#6c6c6c');
      root.style.setProperty('--login3-color', 'rgba(145, 145, 145, 0.12)');
      root.style.setProperty('--contact1-color', 'rgba(108, 108, 108, 0.6)');
      root.style.setProperty('--contact2-color', 'rgba(255, 255, 255, 0.6)');
      root.style.setProperty('--aboutus1-color', 'rgba(108, 108, 108, 0.8)');
      root.style.setProperty('--buynow1-color', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--item1-color', 'rgb(20, 17, 17)');
      root.style.setProperty('--item2-color', 'rgba(255, 192, 203, 0.508)');
      root.style.setProperty('--item3-color', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--item4-color', 'rgba(255, 192, 203, 0.86)');
      root.style.setProperty('--item5-color', 'rgba(255, 255, 255, 0.5)');
      root.style.setProperty('--burger-color', '#000000');
      root.style.setProperty('--item-color', '#ffffff');
      root.style.setProperty('--profile1-color', '#2e2e2e85');
      root.style.setProperty('--profile2-color', '#6c6c6c87');
      root.style.setProperty('--showmore-color', '#000000');
      root.style.setProperty('--whishlist-color', 'rgba(245, 245, 245, 0.6)');
      root.style.setProperty('--scroll1-color', '#f0f4fc');
      root.style.setProperty('--scroll2-color', 'linear-gradient(45deg, #6fa3ef, #f78fb3)');
      root.style.setProperty('--scroll3-color', 'linear-gradient(45deg, #4a90e2, #f25f91)');












    } else {
      root.style.setProperty('--background-color', '#070605');
      root.style.setProperty('--text-color', '#FFFFFF');
      root.style.setProperty('--card-background-color', '#00000');
      root.style.setProperty('--card-shadow-color', '#FFFFFF1A');
      root.style.setProperty('--card-h2-color', '#CCCCCC');
      root.style.setProperty('--card-h5-color', '#999999');
      root.style.setProperty('--card-h4-color', '#AAAAAA');
      root.style.setProperty('--card-border-color', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--card-border-hover-color', 'rgba(255, 255, 255, 0.2)');
      root.style.setProperty('--card-page3-button-color', '#001014');
      root.style.setProperty('--card-page3-button-hover-color', '#001e24');
      root.style.setProperty('--card-page3-h2-color', '#cccccc');
      root.style.setProperty('--card-page3-h1-color', '#dddddd');
      root.style.setProperty('--card-page3-p-color', '#aaaaaa');
      root.style.setProperty('--card-page5-card-color', 'rgb(36, 36, 36)');
      root.style.setProperty('--card-page5-border-color', '#222');
      root.style.setProperty('--card-page5-border-shadow-color', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--card-footer-text-color', '#888888');
      root.style.setProperty('--card-box-shadow', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--card-border-color', 'rgba(255, 255, 255, 0.178  )');
      root.style.setProperty('--card-boxhover-shadow', 'rgba(255, 255, 255, 0.281)');
      root.style.setProperty('--card-right', '#999999');
      root.style.setProperty('--show-more', '#EEEEEE');
      root.style.setProperty('--background', 'rgba(10, 10, 10, 0.8)');
      root.style.setProperty('--color', '#CCCCCC');
      root.style.setProperty('--primary-color', 'rgba(55, 55, 55, 0.6)');
      root.style.setProperty('--accent-color', 'rgba(35, 35, 35, 0.8)');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--cart-background1-color', 'rgb(55, 55, 55)');
      root.style.setProperty('--cart-background2-color', 'rgba(55, 55, 55, 0.4)');
      root.style.setProperty('--cart-background3-color', 'rgba(10, 10, 10, 0.8)');
      root.style.setProperty('--cart-shadow-color', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--delete-hover', 'rgba(205, 205, 205, 0.8)');
      root.style.setProperty('--gradient-color', 'linear-gradient(to left, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))');
      root.style.setProperty('--registration1-color', '#d1d1d1');
      root.style.setProperty('--registration2-color', '#b5b5b5');
      root.style.setProperty('--registration3-color', '#858585');
      root.style.setProperty('--registration4-color', 'rgba(0, 0, 0, 0.8)');
      root.style.setProperty('--registration5-color', 'rgba(0, 0, 0, 0.85)');
      root.style.setProperty('--registration6-color', 'rgba(110, 110, 110, 0.85');
      root.style.setProperty('--registration7-color', 'rgba(110, 110, 110, 0.7)');
      root.style.setProperty('--registration8-color', '#b5b5b57f');
      root.style.setProperty('--registration9-color', 'rgba(255, 255, 255, 0.267)');
      root.style.setProperty('--registration10-color', 'rgba(255, 255, 255, 0.463)');
      root.style.setProperty('--login1-color', '#1f1f1f');
      root.style.setProperty('--login2-color', '#939393');
      root.style.setProperty('--login3-color', 'rgba(110, 110, 110, 0.88)');
      root.style.setProperty('--contact1-color', 'rgba(147, 147, 147, 0.4)');
      root.style.setProperty('--contact2-color', 'rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--aboutus1-color', 'rgba(147, 147, 147, 0.8)');
      root.style.setProperty('--buynow1-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--item1-color', 'rgb(235, 238, 238)');
      root.style.setProperty('--item2-color', 'rgba(0, 63, 52, 0.508');
      root.style.setProperty('--item3-color', 'rgba(255, 255, 255, 0.3)');
      root.style.setProperty('--item4-color', 'rgba(0, 63, 52, 0.86)');
      root.style.setProperty('--item5-color', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--burger-color', '#ffffff');
      root.style.setProperty('--item-color', '#000000');
      root.style.setProperty('--showmore-color', '#ffffff');
      root.style.setProperty('--scroll1-color', '#000000'); 
      root.style.setProperty('--scroll2-color', 'linear-gradient(45deg, #4a90e2, #802347)'); 
      root.style.setProperty('--scroll3-color', 'linear-gradient(45deg, #1e3a5c, #f25f91)');
    }
  }

  getTheme(): 'light' | 'dark' {
    return this.theme;
  }


  initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

}
