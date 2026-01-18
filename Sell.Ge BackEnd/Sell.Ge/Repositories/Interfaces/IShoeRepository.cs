using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Enums;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IShoeRepository
    {
        Task<IEnumerable<Shoe>> GetAllAsync();
        Task<Shoe> GetByIdAsync(int id);
        Task<Shoe> AddAsync(Shoe shoe);
        Task UpdateAsync(Shoe shoe);
        Task DeleteAsync(int id);
        Task<IEnumerable<Shoe>> FilterAsync(Gender? gender, int? brandId, int? productTypeId, ShoeSize? shoeSize, decimal? priceFrom, decimal? priceTo);
        Task<bool> BrandExistsAsync(int brandId);
        Task<bool> ShoesProductTypeExistsAsync(int typeId);
    }
}
