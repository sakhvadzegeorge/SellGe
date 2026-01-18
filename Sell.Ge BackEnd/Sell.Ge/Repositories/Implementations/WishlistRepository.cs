using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities.Wishlist;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class WishlistRepository : IWishlistRepository
    {
        private readonly SllDbContext _db;
        public WishlistRepository(SllDbContext db) { _db = db; }

        public async Task AddAsync(Wishlist wishlist)
        {
            await _db.Wishlists.AddAsync(wishlist);
        }

        public async Task<Wishlist> GetByUserIdAsync(int userId)
        {
            return await _db.Wishlists
                .Include(w => w.Items)
                    .ThenInclude(i => i.Cloth)
                .Include(w => w.Items)
                    .ThenInclude(i => i.Shoe)
                .FirstOrDefaultAsync(w => w.UserId == userId);
        }

        public async Task<WishlistItem> GetItemByIdAsync(int itemId)
        {
            return await _db.WishlistItems
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
