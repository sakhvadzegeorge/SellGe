using Sell.Ge.Models.Entities.Purchase;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IPurchaseRepository
    {
        Task AddAsync(Purchase purchase);
        Task SaveChangesAsync();

        Task<List<Purchase>> GetAllAsync();
        Task<Purchase> GetByIdAsync(int id);
        Task<List<Purchase>> GetDeliveredAsync();
        Task<List<Purchase>> GetDeliveredByUserIdAsync(int userId);
        Task<List<Purchase>> GetPendingByUserIdAsync(int userId);

    }
}
