export interface Wishlist {
  wishlistId: number;
  items: WishlistItem[];
  totalItems: number;
  totalPrice?: number;
}

export interface WishlistItem {
  itemId: number;
  clothId?: number;
  shoeId?: number;
  name: string;
  size?: string;
  unitPrice: number;
  quantity: number;
  picture?: string;
  totalPrice?: number;
}
