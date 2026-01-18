using Sell.Ge.Dtos.ProductTypes;
using Sell.Ge.Models.Entities;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class ClothesProductTypeService : IClothesProductTypeService
    {
        private readonly IClothesProductTypeRepository _repo;
        public ClothesProductTypeService(IClothesProductTypeRepository repo) { _repo = repo; }


        public async Task<IEnumerable<ClothesProductTypeDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(t => new ClothesProductTypeDto { Id = t.Id, Name = t.Name });
        }


        public async Task<ClothesProductTypeDto> GetByIdAsync(int id)
        {
            var t = await _repo.GetByIdAsync(id);
            if (t == null) return null;
            return new ClothesProductTypeDto { Id = t.Id, Name = t.Name };
        }


        public async Task<ClothesProductTypeDto> CreateAsync(ClothesProductTypeCreateDto dto)
        {
            var t = new ClothesProductType { Name = dto.Name };
            var created = await _repo.AddAsync(t);
            return new ClothesProductTypeDto { Id = created.Id, Name = created.Name };
        }


        public async Task UpdateAsync(int id, ClothesProductTypeUpdateDto dto)
        {
            var t = await _repo.GetByIdAsync(id);
            if (t == null) return;
            t.Name = dto.Name;
            await _repo.UpdateAsync(t);
        }


        public async Task DeleteAsync(int id) => await _repo.DeleteAsync(id);
    }
}