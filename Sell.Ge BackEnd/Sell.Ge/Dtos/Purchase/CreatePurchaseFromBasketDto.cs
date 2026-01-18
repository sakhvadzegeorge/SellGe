namespace Sell.Ge.Dtos.Purchase
{
    public class CreatePurchaseFromBasketDto
    {
        public int BuyerId { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerFirstName { get; set; }
        public string BuyerLastName { get; set; }
        public string BuyerAddress { get; set; }
        public string BuyerZipCode { get; set; }
        public int TotalItems { get; set; }
        public decimal TotalPrice { get; set; }

        public List<PurchaseItemCreateDto> Items { get; set; } = new List<PurchaseItemCreateDto>();
    }

    public class PurchaseItemCreateDto
    {
        public int? ClothId { get; set; }
        public int? ShoeId { get; set; }
        public string ItemName { get; set; }
        public string Picture { get; set; }
        public string Size { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
    }
}
