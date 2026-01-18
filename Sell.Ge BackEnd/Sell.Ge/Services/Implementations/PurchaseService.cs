using Sell.Ge.Data;
using Sell.Ge.Dtos.Purchase;
using Sell.Ge.Models.Entities.Purchase;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IPurchaseRepository _repo;
        private readonly SllDbContext _db;

        public PurchaseService(IPurchaseRepository repo, SllDbContext db)
        {
            _repo = repo;
            _db = db;
        }

        public async Task<int> CreateFromBasketAsync(CreatePurchaseFromBasketDto dto)
        {
            var purchase = new Purchase
            {
                BuyerId = dto.BuyerId,
                BuyerEmail = dto.BuyerEmail,
                BuyerFirstName = dto.BuyerFirstName,
                BuyerLastName = dto.BuyerLastName,
                BuyerAddress = dto.BuyerAddress,
                BuyerZipCode = dto.BuyerZipCode,
                TotalItems = dto.TotalItems,
                TotalPrice = dto.TotalPrice,
                PurchasedAt = DateTime.UtcNow
            };

            foreach (var it in dto.Items)
            {
                purchase.Items.Add(new PurchaseItem
                {
                    ClothId = it.ClothId,
                    ShoeId = it.ShoeId,
                    ItemName = it.ItemName,
                    Picture = it.Picture,
                    Size = it.Size,
                    UnitPrice = it.UnitPrice,
                    Quantity = it.Quantity
                });
            }

            await _repo.AddAsync(purchase);
            await _repo.SaveChangesAsync();
            return purchase.Id;
        }

        // ===========================
        //   ONLY NOT DELIVERED LIST
        // ===========================
        public async Task<List<PurchaseDto>> GetAllAsync()
        {
            var purchases = await _repo.GetAllAsync();

            // 🔥 Hide delivered purchases
            purchases = purchases.Where(p => !p.IsDelivered).ToList();

            return purchases.Select(MapToDto).ToList();
        }

        // =============================
        //   ONLY NOT DELIVERED BY ID
        // =============================
        public async Task<PurchaseDto> GetByIdAsync(int id)
        {
            var p = await _repo.GetByIdAsync(id);

            // 🔥 Hide delivered items
            if (p == null || p.IsDelivered)
                return null;

            return MapToDto(p);
        }

        public async Task MarkAsDeliveredAllAsync(int adminId)
        {
            var all = await _repo.GetAllAsync();
            var toDeliver = all.Where(p => !p.IsDelivered).ToList();

            foreach (var p in toDeliver)
            {
                p.IsDelivered = true;
                p.DeliveredAt = DateTime.UtcNow;
                p.DeliveredByAdminId = adminId;
            }

            await _repo.SaveChangesAsync();
        }

        public async Task<bool> MarkAsDeliveredAsync(int purchaseId, int adminId)
        {
            var p = await _repo.GetByIdAsync(purchaseId);
            if (p == null) return false;
            if (p.IsDelivered) return false;

            p.IsDelivered = true;
            p.DeliveredAt = DateTime.UtcNow;
            p.DeliveredByAdminId = adminId;

            await _repo.SaveChangesAsync();
            return true;
        }
        public async Task<List<PurchaseDto>> GetPendingByUserIdAsync(int userId)
        {
            var list = await _repo.GetPendingByUserIdAsync(userId);
            return list.Select(MapToDto).ToList();
        }

        public async Task<List<PurchaseDto>> GetHistoryAllAsync()
        {
            var list = await _repo.GetDeliveredAsync();
            return list.Select(MapToDto).ToList();
        }

        public async Task<List<PurchaseDto>> GetHistoryByUserIdAsync(int userId)
        {
            var list = await _repo.GetDeliveredByUserIdAsync(userId);
            return list.Select(MapToDto).ToList();
        }

        private PurchaseDto MapToDto(Purchase p)
        {
            return new PurchaseDto
            {
                Id = p.Id,
                BuyerId = p.BuyerId,
                BuyerEmail = p.BuyerEmail,
                BuyerFirstName = p.BuyerFirstName,
                BuyerLastName = p.BuyerLastName,
                BuyerAddress = p.BuyerAddress,
                BuyerZipCode = p.BuyerZipCode,
                TotalItems = p.TotalItems,
                TotalPrice = p.TotalPrice,
                PurchasedAt = p.PurchasedAt,
                IsDelivered = p.IsDelivered,
                DeliveredAt = p.DeliveredAt,
                DeliveredByAdminId = p.DeliveredByAdminId,
                Items = p.Items.Select(i => new PurchaseItemDto
                {
                    Id = i.Id,
                    ClothId = i.ClothId,
                    ShoeId = i.ShoeId,
                    ItemName = i.ItemName,
                    Picture = i.Picture,
                    Size = i.Size,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    LineTotal = i.UnitPrice * i.Quantity
                }).ToList()
            };
        }
    }
}
