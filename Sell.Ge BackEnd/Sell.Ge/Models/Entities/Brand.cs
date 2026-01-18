    namespace Sell.Ge.Models.Entities
    {
        public class Brand
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public ICollection<Shoe> Shoes { get; set; }
            public ICollection<Cloth> Clothes { get; set; }
        }
    }
