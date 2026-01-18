using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class ClothesProductTypeRepository : IClothesProductTypeRepository
    {
        private readonly SllDbContext _ctx;
        public ClothesProductTypeRepository(SllDbContext ctx) { _ctx = ctx; }


        public async Task<IEnumerable<ClothesProductType>> GetAllAsync() => await _ctx.ClothesProductTypes.ToListAsync();
        public async Task<ClothesProductType> GetByIdAsync(int id) => await _ctx.ClothesProductTypes.FindAsync(id);
        public async Task<ClothesProductType> AddAsync(ClothesProductType type)
        {
            _ctx.ClothesProductTypes.Add(type);
            await _ctx.SaveChangesAsync();
            return type;
        }
        public async Task UpdateAsync(ClothesProductType type)
        {
            _ctx.ClothesProductTypes.Update(type);
            await _ctx.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var t = await _ctx.ClothesProductTypes.FindAsync(id);
            if (t != null)
            {
                _ctx.ClothesProductTypes.Remove(t);
                await _ctx.SaveChangesAsync();
            }
        }
    }
}