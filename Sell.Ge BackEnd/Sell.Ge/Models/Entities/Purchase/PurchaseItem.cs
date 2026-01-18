namespace Sell.Ge.Models.Entities.Purchase
{
    public class PurchaseItem
    {
        public int Id { get; set; }

        public int PurchaseId { get; set; }
        public Purchase Purchase { get; set; }
        public int? ClothId { get; set; }
        public int? ShoeId { get; set; }
        public string ItemName { get; set; }
        public string Picture { get; set; }
        public string Size { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal => UnitPrice * Quantity;
    }
}
