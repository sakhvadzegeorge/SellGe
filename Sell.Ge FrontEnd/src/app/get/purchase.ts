export interface PurchaseItem {
  id: number;
  clothId?: number | null;
  shoeId?: number | null;
  itemName: string;
  picture: string;
  size?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Purchase {
  id: number;
  buyerId: number;
  buyerEmail: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerAddress?: string | null;
  buyerZipCode?: string | null;
  totalItems: number;
  totalPrice: number;
  purchasedAt: string;
  isDelivered: boolean;
  deliveredAt?: string | null;
  deliveredByAdminId?: number | null;
  items: PurchaseItem[];
}
