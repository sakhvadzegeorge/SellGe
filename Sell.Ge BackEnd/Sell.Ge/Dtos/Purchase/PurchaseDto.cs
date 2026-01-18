namespace Sell.Ge.Dtos.Purchase
{
    public class PurchaseDto
    {
        public int Id { get; set; }
        public int BuyerId { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerFirstName { get; set; }
        public string BuyerLastName { get; set; }
        public string BuyerAddress { get; set; }
        public string BuyerZipCode { get; set; }

        public int TotalItems { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime PurchasedAt { get; set; }

        public bool IsDelivered { get; set; }
        public DateTime? DeliveredAt { get; set; }
        public int? DeliveredByAdminId { get; set; }

        public List<PurchaseItemDto> Items { get; set; } = new List<PurchaseItemDto>();
    }
}
