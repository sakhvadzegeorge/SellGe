using Sell.Ge.Dtos.ProductTypes;
using Sell.Ge.Models.Entities;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class ShoesProductTypeService : IShoesProductTypeService
    {
        private readonly IShoesProductTypeRepository _repo;
        public ShoesProductTypeService(IShoesProductTypeRepository repo) { _repo = repo; }


        public async Task<IEnumerable<ShoesProductTypeDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(t => new ShoesProductTypeDto { Id = t.Id, Name = t.Name });
        }


        public async Task<ShoesProductTypeDto> GetByIdAsync(int id)
        {
            var t = await _repo.GetByIdAsync(id);
            if (t == null) return null;
            return new ShoesProductTypeDto { Id = t.Id, Name = t.Name };
        }


        public async Task<ShoesProductTypeDto> CreateAsync(ShoesProductTypeCreateDto dto)
        {
            var t = new ShoesProductType { Name = dto.Name };
            var created = await _repo.AddAsync(t);
            return new ShoesProductTypeDto { Id = created.Id, Name = created.Name };
        }


        public async Task UpdateAsync(int id, ShoesProductTypeUpdateDto dto)
        {
            var t = await _repo.GetByIdAsync(id);
            if (t == null) return;
            t.Name = dto.Name;
            await _repo.UpdateAsync(t);
        }


        public async Task DeleteAsync(int id) => await _repo.DeleteAsync(id);
    }
}