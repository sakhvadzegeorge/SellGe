using Sell.Ge.Dtos.Brands;

namespace Sell.Ge.Services.Interfaces
{
    public interface IBrandService
    {
        Task<IEnumerable<BrandDto>> GetAllAsync();
        Task<BrandDto> GetByIdAsync(int id);
        Task<BrandDto> CreateAsync(BrandCreateDto dto);
        Task UpdateAsync(int id, BrandUpdateDto dto);
        Task DeleteAsync(int id);
    }
}
