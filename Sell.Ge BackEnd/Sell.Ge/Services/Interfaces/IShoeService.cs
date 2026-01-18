using Sell.Ge.Dtos.Shoes;
using Sell.Ge.Models.Enums;

namespace Sell.Ge.Services.Interfaces
{
    public interface IShoeService
    {
        Task<IEnumerable<ShoeDto>> GetAllAsync();
        Task<ShoeDto> GetByIdAsync(int id);
        Task<ShoeDto> CreateAsync(ShoeCreateDto dto);
        Task UpdateAsync(int id, ShoeUpdateDto dto);
        Task DeleteAsync(int id);
        Task<IEnumerable<ShoeDto>> FilterAsync(Gender? gender, int? brandId, int? productTypeId, ShoeSize? shoeSize, decimal? priceFrom, decimal? priceTo);
        Task ReduceStockAsync(int id, int amount);
        Task AddToStockAsync(int id, int amount);
        Task<IEnumerable<ShoeDto>> FilterAsync(Gender? gender, string? brandName, string? productTypeName, ShoeSize? shoeSize, decimal? priceFrom, decimal? priceTo, string? name);
    }
}
