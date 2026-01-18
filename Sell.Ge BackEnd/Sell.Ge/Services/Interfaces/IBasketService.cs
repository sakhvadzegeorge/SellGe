using Sell.Ge.Dtos.Basket;

namespace Sell.Ge.Services.Interfaces
{
    public interface IBasketService
    {
        Task<BasketDto> GetForUserAsync(int userId);
        Task<(bool Success, string Error)> AddItemAsync(int userId, BasketAddItemDto dto);
        Task<(bool Success, string Error)> UpdateItemQuantityAsync(int userId, BasketUpdateQuantityDto dto);
        Task<(bool Success, string Error)> RemoveItemAsync(int userId, int itemId);
        Task<(bool Success, string Error)> ClearBasketAsync(int userId);
        Task<(bool Success, string Error, int TotalItems, decimal TotalPrice)> PurchaseAsync(int userId);
    }
}
