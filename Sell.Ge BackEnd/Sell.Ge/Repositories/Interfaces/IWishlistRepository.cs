using Sell.Ge.Models.Entities.Wishlist;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IWishlistRepository
    {
        Task<Wishlist> GetByUserIdAsync(int userId);
        Task<WishlistItem> GetItemByIdAsync(int itemId);
        Task AddAsync(Wishlist wishlist);
        Task SaveChangesAsync();
    }
}
