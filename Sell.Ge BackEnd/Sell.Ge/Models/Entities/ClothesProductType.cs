namespace Sell.Ge.Models.Entities
{
    public class ClothesProductType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Cloth> Clothes { get; set; }
    }
}
