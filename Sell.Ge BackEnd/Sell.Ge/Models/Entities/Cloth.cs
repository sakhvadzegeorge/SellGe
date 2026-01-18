using Sell.Ge.Models.Enums;

namespace Sell.Ge.Models.Entities
{
    public class Cloth
    {
        public int Id { get; set; }
        public string Picture { get; set; }
        public string Name { get; set; }
        public int BrandId { get; set; }
        public Brand Brand { get; set; }
        public ClothSize ClothSize { get; set; }
        public Gender Gender { get; set; }
        public string Description { get; set; }
        public int ProductTypeId { get; set; }
        public ClothesProductType ProductType { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
