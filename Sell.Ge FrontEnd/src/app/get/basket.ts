export interface Basket {
  basketId: number;
  items: BasketItem[];
  totalItems: number;
  totalPrice: number;
}

export interface BasketItem {
  itemId: number;
  clothId: number | null;
  shoeId: number | null;
  picture: string;
  name: string;
  size: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}
