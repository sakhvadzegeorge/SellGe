using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities.Purchase;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly SllDbContext _db;
        public PurchaseRepository(SllDbContext db) { _db = db; }

        public async Task AddAsync(Purchase purchase)
        {
            await _db.Purchases.AddAsync(purchase);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<List<Purchase>> GetAllAsync()
        {
            return await _db.Purchases
                .Include(p => p.Items)
                .OrderByDescending(p => p.PurchasedAt)
                .ToListAsync();
        }

        public async Task<Purchase> GetByIdAsync(int id)
        {
            return await _db.Purchases
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Purchase>> GetDeliveredAsync()
        {
            return await _db.Purchases
                .Include(p => p.Items)
                .Where(p => p.IsDelivered)
                .OrderByDescending(p => p.DeliveredAt)
                .ToListAsync();
        }

        public async Task<List<Purchase>> GetDeliveredByUserIdAsync(int userId)
        {
            return await _db.Purchases
                .Include(p => p.Items)
                .Where(p => p.IsDelivered && p.BuyerId == userId)
                .OrderByDescending(p => p.PurchasedAt)
                .ToListAsync();
        }
        public async Task<List<Purchase>> GetPendingByUserIdAsync(int userId)
        {
            return await _db.Purchases
                .Include(p => p.Items)
                .Where(p =>
                    (p.IsDelivered == false || p.IsDelivered == null)
                    && p.BuyerId == userId
                )
                .OrderByDescending(p => p.PurchasedAt)
                .ToListAsync();
        }


    }
}
