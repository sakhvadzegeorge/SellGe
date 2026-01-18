using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class ShoesProductTypeRepository : IShoesProductTypeRepository
    {
        private readonly SllDbContext _ctx;
        public ShoesProductTypeRepository(SllDbContext ctx) { _ctx = ctx; }


        public async Task<IEnumerable<ShoesProductType>> GetAllAsync() => await _ctx.ShoesProductTypes.ToListAsync();
        public async Task<ShoesProductType> GetByIdAsync(int id) => await _ctx.ShoesProductTypes.FindAsync(id);
        public async Task<ShoesProductType> AddAsync(ShoesProductType type)
        {
            _ctx.ShoesProductTypes.Add(type);
            await _ctx.SaveChangesAsync();
            return type;
        }
        public async Task UpdateAsync(ShoesProductType type)
        {
            _ctx.ShoesProductTypes.Update(type);
            await _ctx.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var t = await _ctx.ShoesProductTypes.FindAsync(id);
            if (t != null)
            {
                _ctx.ShoesProductTypes.Remove(t);
                await _ctx.SaveChangesAsync();
            }
        }
    }
}
