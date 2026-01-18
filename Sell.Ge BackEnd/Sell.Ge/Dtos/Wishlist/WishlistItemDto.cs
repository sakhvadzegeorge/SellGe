namespace Sell.Ge.Dtos.Wishlist
{
    public class WishlistItemDto
    {
        public int ItemId { get; set; }
        public int? ClothId { get; set; }
        public int? ShoeId { get; set; }
        public string Picture { get; set; }
        public string Name { get; set; }
        public string Size { get; set; } 
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice => UnitPrice * Quantity;
    }
}
