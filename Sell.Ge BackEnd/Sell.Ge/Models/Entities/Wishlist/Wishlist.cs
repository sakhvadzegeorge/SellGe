using System.ComponentModel.DataAnnotations;

namespace Sell.Ge.Models.Entities.Wishlist
{
    public class Wishlist
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public ICollection<WishlistItem> Items { get; set; } = new List<WishlistItem>();
    }
}
