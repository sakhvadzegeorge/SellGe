using System.ComponentModel.DataAnnotations;

namespace Sell.Ge.Dtos.Basket
{
    public class BasketUpdateQuantityDto
    {
        [Required]
        public int ItemId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}
