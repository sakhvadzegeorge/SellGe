using System.ComponentModel.DataAnnotations;

namespace Sell.Ge.Models.Entities.Basket
{
    public class Basket
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public ICollection<BasketItem> Items { get; set; } = new List<BasketItem>();
    }
}
