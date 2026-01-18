using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sell.Ge.Models.Entities.Wishlist
{
    public class WishlistItem
    {
        [Key]
        public int Id { get; set; }

        public int WishlistId { get; set; }
        public Wishlist Wishlist { get; set; }

        public int? ClothId { get; set; }
        public Cloth Cloth { get; set; }

        public int? ShoeId { get; set; }
        public Shoe Shoe { get; set; }

        public int Quantity { get; set; }

        [NotMapped]
        public decimal UnitPrice => Cloth != null ? Cloth.Price : Shoe != null ? Shoe.Price : 0m;
    }
}
