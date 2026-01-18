using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Enums;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class ShoeRepository : IShoeRepository
    {
        private readonly SllDbContext _context;
        public ShoeRepository(SllDbContext context) => _context = context;

        public async Task<IEnumerable<Shoe>> GetAllAsync() =>
            await _context.Shoes.Include(s => s.Brand).Include(s => s.ProductType).ToListAsync();

        public async Task<Shoe?> GetByIdAsync(int id) =>
            await _context.Shoes.Include(s => s.Brand).Include(s => s.ProductType)
                                .FirstOrDefaultAsync(s => s.Id == id);

        public async Task<Shoe> AddAsync(Shoe shoe)
        {
            _context.Shoes.Add(shoe);
            await _context.SaveChangesAsync();
            return shoe;
        }

        public async Task UpdateAsync(Shoe shoe)
        {
            _context.Shoes.Update(shoe);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var shoe = await _context.Shoes.FindAsync(id);
            if (shoe != null)
            {
                _context.Shoes.Remove(shoe);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Shoe>> FilterAsync(Gender? gender, int? brandId, int? productTypeId, ShoeSize? shoeSize, decimal? priceFrom, decimal? priceTo)
        {
            var query = _context.Shoes.Include(s => s.Brand).Include(s => s.ProductType).AsQueryable();

            if (gender.HasValue) query = query.Where(s => s.Gender == gender.Value);
            if (brandId.HasValue) query = query.Where(s => s.BrandId == brandId.Value);
            if (productTypeId.HasValue) query = query.Where(s => s.ProductTypeId == productTypeId.Value);
            if (shoeSize.HasValue) query = query.Where(s => s.ShoeSize == shoeSize.Value);
            if (priceFrom.HasValue) query = query.Where(s => s.Price >= priceFrom.Value);
            if (priceTo.HasValue) query = query.Where(s => s.Price <= priceTo.Value);

            return await query.ToListAsync();
        }

        public async Task<bool> BrandExistsAsync(int brandId)
            => await _context.Brands.AnyAsync(b => b.Id == brandId);

        public async Task<bool> ShoesProductTypeExistsAsync(int typeId)
            => await _context.ShoesProductTypes.AnyAsync(t => t.Id == typeId);
    }
}
