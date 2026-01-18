using Sell.Ge.Dtos.Brands;
using Sell.Ge.Models.Entities;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _repo;
        public BrandService(IBrandRepository repo) { _repo = repo; }

        public async Task<IEnumerable<BrandDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(b => new BrandDto { Id = b.Id, Name = b.Name });
        }

        public async Task<BrandDto> GetByIdAsync(int id)
        {
            var b = await _repo.GetByIdAsync(id);
            if (b == null) return null;
            return new BrandDto { Id = b.Id, Name = b.Name };
        }

        public async Task<BrandDto> CreateAsync(BrandCreateDto dto)
        {
            var b = new Brand { Name = dto.Name };
            var created = await _repo.AddAsync(b);
            return new BrandDto { Id = created.Id, Name = created.Name };
        }

        public async Task UpdateAsync(int id, BrandUpdateDto dto)
        {
            var b = await _repo.GetByIdAsync(id);
            if (b == null) return;
            b.Name = dto.Name;
            await _repo.UpdateAsync(b);
        }

        public async Task DeleteAsync(int id) => await _repo.DeleteAsync(id);
    }
}
