using Sell.Ge.Models.Enums;

namespace Sell.Ge.Dtos.Clothes
{
    namespace Sell.Ge.Dtos.Clothes
    {
        public class ClothDto
        {
            public int Id { get; set; }
            public string Picture { get; set; }
            public string Name { get; set; }

            public string BrandName { get; set; }
            public string ProductTypeName { get; set; }
            public string ClothSize { get; set; }
            public string Gender { get; set; }

            public string Description { get; set; }
            public decimal Price { get; set; }
            public int Quantity { get; set; }
        }
    }

}
