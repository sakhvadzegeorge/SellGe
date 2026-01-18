using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Enums;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class ClothRepository : IClothRepository
    {
        private readonly SllDbContext _context;
        public ClothRepository(SllDbContext context) => _context = context;

        public async Task<IEnumerable<Cloth>> GetAllAsync() =>
            await _context.Clothes.Include(c => c.Brand).Include(c => c.ProductType).ToListAsync();

        public async Task<Cloth?> GetByIdAsync(int id) =>
            await _context.Clothes.Include(c => c.Brand).Include(c => c.ProductType)
                                  .FirstOrDefaultAsync(c => c.Id == id);

        public async Task<Cloth> AddAsync(Cloth cloth)
        {
            _context.Clothes.Add(cloth);
            await _context.SaveChangesAsync();
            return cloth;
        }

        public async Task UpdateAsync(Cloth cloth)
        {
            _context.Clothes.Update(cloth);
            await _context.SaveChangesAsync();
        }



        public async Task DeleteAsync(int id)
        {
            var cloth = await _context.Clothes.FindAsync(id);
            if (cloth != null)
            {
                _context.Clothes.Remove(cloth);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Cloth>> FilterAsync(Gender? gender, int? brandId, int? productTypeId, ClothSize? clothSize, decimal? priceFrom, decimal? priceTo)
        {
            var query = _context.Clothes.Include(c => c.Brand).Include(c => c.ProductType).AsQueryable();

            if (gender.HasValue) query = query.Where(c => c.Gender == gender.Value);
            if (brandId.HasValue) query = query.Where(c => c.BrandId == brandId.Value);
            if (productTypeId.HasValue) query = query.Where(c => c.ProductTypeId == productTypeId.Value);
            if (clothSize.HasValue) query = query.Where(c => c.ClothSize == clothSize.Value);
            if (priceFrom.HasValue) query = query.Where(c => c.Price >= priceFrom.Value);
            if (priceTo.HasValue) query = query.Where(c => c.Price <= priceTo.Value);

            return await query.ToListAsync();
        }

        public async Task<bool> BrandExistsAsync(int brandId)
            => await _context.Brands.AnyAsync(b => b.Id == brandId);

        public async Task<bool> ClothesProductTypeExistsAsync(int typeId)
            => await _context.ClothesProductTypes.AnyAsync(t => t.Id == typeId);
    }
}
