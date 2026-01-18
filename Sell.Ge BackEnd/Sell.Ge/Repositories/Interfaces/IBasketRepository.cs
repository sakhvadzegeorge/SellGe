using Sell.Ge.Models.Entities.Basket;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IBasketRepository
    {
        Task<Basket> GetByUserIdAsync(int userId);
        Task<BasketItem> GetItemByIdAsync(int itemId);
        Task AddAsync(Basket basket);
        Task SaveChangesAsync();
    }
}
