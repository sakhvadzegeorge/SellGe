using Sell.Ge.Models.Entities;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IClothesProductTypeRepository
    {
        Task<IEnumerable<ClothesProductType>> GetAllAsync();
        Task<ClothesProductType> GetByIdAsync(int id);
        Task<ClothesProductType> AddAsync(ClothesProductType type);
        Task UpdateAsync(ClothesProductType type);
        Task DeleteAsync(int id);
    }
}