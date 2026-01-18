import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CartComponent } from './components/cart/cart.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { MenTopsComponent } from './components/men-tops/men-tops.component';
import { MenBottomsComponent } from './components/men-bottoms/men-bottoms.component';
import { WomenBottomsComponent } from './components/women-bottoms/women-bottoms.component';
import { WomenTopsComponent } from './components/women-tops/women-tops.component';
import { ContactComponent } from './components/contact/contact.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { BuynowComponent } from './components/buynow/buynow.component';
import { AbousUsComponent } from './components/abous-us/abous-us.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard } from './services/guards/auth.guard';
import { AdminguardService } from './services/auth/adminguard.service';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { OrderComponent } from './components/order/order.component';

export const routes: Routes = [

    { path: '', component: HomeComponent, title: 'Sell.GE' },
    { path: 'log-in', component: LogInComponent, title: 'Sell.GE - Log In' },
    { path: 'profile', component: ProfileComponent, title: 'Sell.GE - Profile', canActivate: [authGuard] },
    { path: 'registration', component: RegistrationComponent, title: 'Sell.GE - Registration' },
    { path: 'cart', component: CartComponent, title: 'Sell.GE - Cart', canActivate: [authGuard] },
    { path: 'wish-list', component: WishListComponent, title: 'Sell.GE - Wish List', canActivate: [authGuard] },
    { path: 'men-tops', component: MenTopsComponent, title: 'Sell.GE - Men Clothes' },
    { path: 'men-bottoms', component: MenBottomsComponent, title: 'Sell.GE - Men Shoes' },
    { path: 'women-tops', component: WomenTopsComponent, title: 'Sell.GE - Women Clothes' },
    { path: 'women-bottoms', component: WomenBottomsComponent, title: 'Sell.GE - Women Shoes' },
    { path: 'contact', component: ContactComponent, title: 'Sell.GE - Contact' },
    { path: 'item-details/:id', component: ItemDetailsComponent },
    { path: 'buynow', component: BuynowComponent, title: 'Sell.GE - Buy Now', canActivate: [authGuard] },
    { path: 'aboutus', component: AbousUsComponent, title: 'Sell.GE - AbouT Us' },
    { path: 'dashboard', component: DashboardComponent, title: 'Sell.GE - Dashboard', canActivate: [authGuard, AdminguardService] },
    { path: 'purchase', component: PurchaseComponent, title: 'Sell.GE - Purchase', canActivate: [authGuard, AdminguardService] },
    { path: 'reset-password', component: ResetPasswordComponent, title: 'Sell.GE - Reset Password' },
    {path: 'orders', component: OrderComponent, title: 'Sell.GE - Orders', canActivate: [authGuard] }











];



