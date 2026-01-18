using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Sell.Ge.Dtos.Basket
{
    public class BasketAddItemDto
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? ClothId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? ShoeId { get; set; }

        public int Quantity { get; set; } = 1;
    }
}