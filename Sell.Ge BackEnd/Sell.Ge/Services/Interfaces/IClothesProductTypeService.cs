using Sell.Ge.Dtos.ProductTypes;


namespace Sell.Ge.Services.Interfaces
{
    public interface IClothesProductTypeService
    {
        Task<IEnumerable<ClothesProductTypeDto>> GetAllAsync();
        Task<ClothesProductTypeDto> GetByIdAsync(int id);
        Task<ClothesProductTypeDto> CreateAsync(ClothesProductTypeCreateDto dto);
        Task UpdateAsync(int id, ClothesProductTypeUpdateDto dto);
        Task DeleteAsync(int id);
    }
}