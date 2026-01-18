using Sell.Ge.Dtos.ProductTypes;

namespace Sell.Ge.Services.Interfaces
{
    public interface IShoesProductTypeService
    {
        Task<IEnumerable<ShoesProductTypeDto>> GetAllAsync();
        Task<ShoesProductTypeDto> GetByIdAsync(int id);
        Task<ShoesProductTypeDto> CreateAsync(ShoesProductTypeCreateDto dto);
        Task UpdateAsync(int id, ShoesProductTypeUpdateDto dto);
        Task DeleteAsync(int id);
    }
}