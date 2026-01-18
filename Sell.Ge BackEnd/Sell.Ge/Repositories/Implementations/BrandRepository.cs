using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class BrandRepository : IBrandRepository
    {
        private readonly SllDbContext _ctx;
        public BrandRepository(SllDbContext ctx) { _ctx = ctx; }

        public async Task<IEnumerable<Brand>> GetAllAsync() => await _ctx.Brands.ToListAsync();
        public async Task<Brand> GetByIdAsync(int id) => await _ctx.Brands.FindAsync(id);
        public async Task<Brand> AddAsync(Brand brand)
        {
            _ctx.Brands.Add(brand);
            await _ctx.SaveChangesAsync();
            return brand;
        }
        public async Task UpdateAsync(Brand brand)
        {
            _ctx.Brands.Update(brand);
            await _ctx.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var b = await _ctx.Brands.FindAsync(id);
            if (b != null) { _ctx.Brands.Remove(b); await _ctx.SaveChangesAsync(); }
        }
    }
}
