using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities.Basket;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class BasketRepository : IBasketRepository
    {
        private readonly SllDbContext _db;
        public BasketRepository(SllDbContext db) { _db = db; }

        public async Task AddAsync(Basket basket)
        {
            await _db.Baskets.AddAsync(basket);
        }

        public async Task<Basket> GetByUserIdAsync(int userId)
        {
            return await _db.Baskets
                .Include(b => b.Items)
                    .ThenInclude(i => i.Cloth)
                .Include(b => b.Items)
                    .ThenInclude(i => i.Shoe)
                .FirstOrDefaultAsync(b => b.UserId == userId);
        }

        public async Task<BasketItem> GetItemByIdAsync(int itemId)
        {
            return await _db.BasketItems
                .Include(i => i.Cloth)
                .Include(i => i.Shoe)
                .FirstOrDefaultAsync(i => i.Id == itemId);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
