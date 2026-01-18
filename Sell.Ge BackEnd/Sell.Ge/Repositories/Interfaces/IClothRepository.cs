using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Enums;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IClothRepository
    {
        Task<IEnumerable<Cloth>> GetAllAsync();
        Task<Cloth> GetByIdAsync(int id);
        Task<Cloth> AddAsync(Cloth cloth);
        Task UpdateAsync(Cloth cloth);
        Task DeleteAsync(int id);
        Task<IEnumerable<Cloth>> FilterAsync(Gender? gender, int? brandId, int? productTypeId, ClothSize? clothSize, decimal? priceFrom, decimal? priceTo);
        Task<bool> BrandExistsAsync(int brandId);
        Task<bool> ClothesProductTypeExistsAsync(int typeId);
    }
}
