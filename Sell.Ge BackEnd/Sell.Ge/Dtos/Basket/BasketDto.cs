namespace Sell.Ge.Dtos.Basket
{
    public class BasketDto
    {
        public int BasketId { get; set; }
        public List<BasketItemDto> Items { get; set; } = new List<BasketItemDto>();
        public int TotalItems { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
