namespace Sell.Ge.Dtos.Wishlist
{
    public class WishlistDto
    {
        public int WishlistId { get; set; }
        public List<WishlistItemDto> Items { get; set; } = new List<WishlistItemDto>();
        public int TotalItems { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
