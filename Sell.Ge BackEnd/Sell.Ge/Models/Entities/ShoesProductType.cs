namespace Sell.Ge.Models.Entities
{
    public class ShoesProductType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Shoe> Shoes { get; set; }
    }
}
