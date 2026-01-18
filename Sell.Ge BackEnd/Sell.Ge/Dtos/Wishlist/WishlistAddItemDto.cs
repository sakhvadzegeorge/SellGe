namespace Sell.Ge.Dtos.Wishlist
{
    public class WishlistAddItemDto
    {
        public int? ClothId { get; set; }
        public int? ShoeId { get; set; }

        public int Quantity { get; set; } = 1;
    }
}
