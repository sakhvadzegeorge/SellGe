using Sell.Ge.Dtos.Purchase;

namespace Sell.Ge.Services.Interfaces
{
    public interface IPurchaseService
    {
        Task<int> CreateFromBasketAsync(CreatePurchaseFromBasketDto dto);
        Task<List<PurchaseDto>> GetAllAsync();
        Task<PurchaseDto> GetByIdAsync(int id);
        Task MarkAsDeliveredAllAsync(int adminId);
        Task<bool> MarkAsDeliveredAsync(int purchaseId, int adminId);

        Task<List<PurchaseDto>> GetHistoryAllAsync();
        Task<List<PurchaseDto>> GetHistoryByUserIdAsync(int userId);
        Task<List<PurchaseDto>> GetPendingByUserIdAsync(int userId);

    }
}
