using Sell.Ge.Models.Entities;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IShoesProductTypeRepository
    {
        Task<IEnumerable<ShoesProductType>> GetAllAsync();
        Task<ShoesProductType> GetByIdAsync(int id);
        Task<ShoesProductType> AddAsync(ShoesProductType type);
        Task UpdateAsync(ShoesProductType type);
        Task DeleteAsync(int id);
    }
}