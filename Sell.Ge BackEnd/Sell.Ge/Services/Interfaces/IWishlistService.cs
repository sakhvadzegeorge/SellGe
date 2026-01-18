using Sell.Ge.Dtos.Wishlist;

namespace Sell.Ge.Services.Interfaces
{
    public interface IWishlistService
    {
        Task<WishlistDto> GetForUserAsync(int userId);
        Task<(bool Success, string Error)> AddItemAsync(int userId, WishlistAddItemDto dto);
        Task<(bool Success, string Error)> UpdateItemQuantityAsync(int userId, WishlistUpdateQuantityDto dto);
        Task<(bool Success, string Error)> RemoveItemAsync(int userId, int itemId);
        Task<(bool Success, string Error)> ClearWishlistAsync(int userId);
        Task<(bool Success, string Error)> MoveItemToBasketAsync(int userId, int wishlistItemId);
        Task<(bool Success, string Error)> MoveAllToBasketAsync(int userId);
    }
}
