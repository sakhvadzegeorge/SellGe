using Sell.Ge.Dtos.Clothes;
using Sell.Ge.Dtos.Clothes.Sell.Ge.Dtos.Clothes;
using Sell.Ge.Models.Enums;

namespace Sell.Ge.Services.Interfaces
{
    public interface IClothService
    {
        Task<IEnumerable<ClothDto>> GetAllAsync();
        Task<ClothDto?> GetByIdAsync(int id);
        Task<ClothDto> CreateAsync(ClothCreateDto dto);
        Task UpdateAsync(int id, ClothUpdateDto dto);
        Task DeleteAsync(int id);
        Task<IEnumerable<ClothDto>> FilterAsync(Gender? gender, int? brandId, int? productTypeId, ClothSize? clothSize, decimal? priceFrom, decimal? priceTo);
        Task ReduceStockAsync(int id, int amount);
        Task AddToStockAsync(int id, int amount);
        Task<IEnumerable<ClothDto>> FilterAsync(
            Gender? gender,
            string? brandName,
            string? productTypeName,
            ClothSize? clothSize,
            decimal? priceFrom,
            decimal? priceTo,
            string? name = null);
    }
}