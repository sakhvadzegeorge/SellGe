using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Dtos.Basket;
using Sell.Ge.Dtos.Purchase;
using Sell.Ge.Models.Entities.Basket;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class BasketService : IBasketService
    {
        private readonly SllDbContext _db;
        private readonly IBasketRepository _repo;
        private readonly IPurchaseService _purchaseService;

        public BasketService(SllDbContext db, IBasketRepository repo, IPurchaseService purchaseService)
        {
            _db = db;
            _repo = repo;
            _purchaseService = purchaseService;
        }

        public async Task<BasketDto> GetForUserAsync(int userId)
        {
            var basket = await _repo.GetByUserIdAsync(userId);
            if (basket == null)
                return new BasketDto { BasketId = 0, Items = new List<BasketItemDto>(), TotalItems = 0, TotalPrice = 0m };

            var items = basket.Items.Select(i => new BasketItemDto
            {
                ItemId = i.Id,
                ClothId = i.ClothId,
                ShoeId = i.ShoeId,
                Picture = i.Cloth != null ? i.Cloth.Picture : i.Shoe != null ? i.Shoe.Picture : string.Empty,
                Name = i.Cloth != null ? i.Cloth.Name : i.Shoe != null ? i.Shoe.Name : string.Empty,
                Size = i.Cloth != null ? i.Cloth.ClothSize.ToString() : i.Shoe != null ? i.Shoe.ShoeSize.ToString() : string.Empty,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            }).ToList();

            var totalItems = items.Sum(x => x.Quantity);
            var totalPrice = items.Sum(x => x.TotalPrice);

            return new BasketDto
            {
                BasketId = basket.Id,
                Items = items,
                TotalItems = totalItems,
                TotalPrice = totalPrice
            };
        }

        public async Task<(bool Success, string Error)> AddItemAsync(int userId, BasketAddItemDto dto)
        {
            if ((dto.ClothId == null && dto.ShoeId == null) || (dto.ClothId != null && dto.ShoeId != null))
                return (false, "Provide either ClothId or ShoeId, not both.");

            if (dto.Quantity <= 0) return (false, "Quantity must be greater than 0.");

            var basket = await _repo.GetByUserIdAsync(userId);
            if (basket == null)
            {
                basket = new Basket { UserId = userId };
                await _repo.AddAsync(basket);
                await _repo.SaveChangesAsync();
            }

            if (dto.ClothId.HasValue)
            {
                var cloth = await _db.Clothes.FirstOrDefaultAsync(c => c.Id == dto.ClothId.Value);
                if (cloth == null) return (false, "Cloth not found.");

                var existing = basket.Items.FirstOrDefault(i => i.ClothId == dto.ClothId);
                var desired = dto.Quantity + (existing?.Quantity ?? 0);
                if (desired > cloth.Quantity) return (false, "Not enough stock for the requested cloth.");

                if (existing != null) existing.Quantity += dto.Quantity;
                else basket.Items.Add(new BasketItem { ClothId = cloth.Id, Quantity = dto.Quantity });
            }
            else
            {
                var shoe = await _db.Shoes.FirstOrDefaultAsync(s => s.Id == dto.ShoeId.Value);
                if (shoe == null) return (false, "Shoe not found.");

                var existing = basket.Items.FirstOrDefault(i => i.ShoeId == dto.ShoeId);
                var desired = dto.Quantity + (existing?.Quantity ?? 0);
                if (desired > shoe.Quantity) return (false, "Not enough stock for the requested shoe.");

                if (existing != null) existing.Quantity += dto.Quantity;
                else basket.Items.Add(new BasketItem { ShoeId = shoe.Id, Quantity = dto.Quantity });
            }

            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error)> UpdateItemQuantityAsync(int userId, BasketUpdateQuantityDto dto)
        {
            if (dto.Quantity <= 0) return (false, "Quantity must be greater than 0.");

            var basket = await _repo.GetByUserIdAsync(userId);
            if (basket == null) return (false, "Basket not found.");

            var item = basket.Items.FirstOrDefault(i => i.Id == dto.ItemId);
            if (item == null) return (false, "Item not found.");

            if (item.ClothId.HasValue)
            {
                var cloth = await _db.Clothes.FirstOrDefaultAsync(c => c.Id == item.ClothId.Value);
                if (cloth == null) return (false, "Cloth not found.");
                if (dto.Quantity > cloth.Quantity) return (false, "Not enough stock for the requested cloth.");
                item.Quantity = dto.Quantity;
            }
            else if (item.ShoeId.HasValue)
            {
                var shoe = await _db.Shoes.FirstOrDefaultAsync(s => s.Id == item.ShoeId.Value);
                if (shoe == null) return (false, "Shoe not found.");
                if (dto.Quantity > shoe.Quantity) return (false, "Not enough stock for the requested shoe.");
                item.Quantity = dto.Quantity;
            }
            else
            {
                return (false, "Invalid basket item.");
            }

            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error)> RemoveItemAsync(int userId, int itemId)
        {
            var basket = await _repo.GetByUserIdAsync(userId);
            if (basket == null) return (false, "Basket not found.");

            var item = basket.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null) return (false, "Item not found.");

            basket.Items.Remove(item);
            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error)> ClearBasketAsync(int userId)
        {
            var basket = await _repo.GetByUserIdAsync(userId);
            if (basket == null) return (true, null);
            basket.Items.Clear();
            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error, int TotalItems, decimal TotalPrice)> PurchaseAsync(int userId)
        {
            var basket = await _repo.GetByUserIdAsync(userId);
            if (basket == null || !basket.Items.Any())
                return (false, "Basket is empty.", 0, 0m);

            var originalBasketItems = basket.Items.ToList();

            using (var tx = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var item in basket.Items)
                    {
                        if (item.ClothId.HasValue)
                        {
                            var cloth = await _db.Clothes.FirstOrDefaultAsync(c => c.Id == item.ClothId.Value);
                            if (cloth == null)
                                return (false, $"Cloth (id: {item.ClothId.Value}) not found.", 0, 0m);
                            if (item.Quantity > cloth.Quantity)
                                return (false, $"Not enough stock for cloth '{cloth.Name}' (id: {cloth.Id}).", 0, 0m);
                        }
                        else if (item.ShoeId.HasValue)
                        {
                            var shoe = await _db.Shoes.FirstOrDefaultAsync(s => s.Id == item.ShoeId.Value);
                            if (shoe == null)
                                return (false, $"Shoe (id: {item.ShoeId.Value}) not found.", 0, 0m);
                            if (item.Quantity > shoe.Quantity)
                                return (false, $"Not enough stock for shoe '{shoe.Name}' (id: {shoe.Id}).", 0, 0m);
                        }
                        else
                        {
                            return (false, "Invalid basket item encountered.", 0, 0m);
                        }
                    }

                    int totalItems = 0;
                    decimal totalPrice = 0m;

                    foreach (var item in basket.Items.ToList())
                    {
                        if (item.ClothId.HasValue)
                        {
                            var cloth = await _db.Clothes.FirstOrDefaultAsync(c => c.Id == item.ClothId.Value);
                            cloth.Quantity -= item.Quantity;
                            totalItems += item.Quantity;
                            totalPrice += item.Quantity * cloth.Price;
                        }
                        else if (item.ShoeId.HasValue)
                        {
                            var shoe = await _db.Shoes.FirstOrDefaultAsync(s => s.Id == item.ShoeId.Value);
                            shoe.Quantity -= item.Quantity;
                            totalItems += item.Quantity;
                            totalPrice += item.Quantity * shoe.Price;
                        }

                        basket.Items.Remove(item);
                    }

                    var purchaseDto = new CreatePurchaseFromBasketDto
                    {
                        BuyerId = userId,
                        BuyerEmail = await _db.Users.Where(u => u.Id == userId).Select(u => u.Email).FirstOrDefaultAsync() ?? string.Empty,
                        BuyerFirstName = await _db.Users.Where(u => u.Id == userId).Select(u => u.FirstName).FirstOrDefaultAsync() ?? string.Empty,
                        BuyerLastName = await _db.Users.Where(u => u.Id == userId).Select(u => u.LastName).FirstOrDefaultAsync() ?? string.Empty,
                        BuyerAddress = await _db.Users.Where(u => u.Id == userId).Select(u => u.Address).FirstOrDefaultAsync() ?? string.Empty,
                        BuyerZipCode = await _db.Users.Where(u => u.Id == userId).Select(u => u.ZipCode).FirstOrDefaultAsync() ?? string.Empty,
                        TotalItems = totalItems,
                        TotalPrice = totalPrice,
                        Items = new List<PurchaseItemCreateDto>()
                    };

                    foreach (var item in originalBasketItems)
                    {
                        if (item.ClothId.HasValue)
                        {
                            var cloth = await _db.Clothes.FirstOrDefaultAsync(c => c.Id == item.ClothId.Value);
                            purchaseDto.Items.Add(new PurchaseItemCreateDto
                            {
                                ClothId = cloth.Id,
                                ItemName = cloth.Name,
                                Picture = cloth.Picture,
                                Size = cloth.ClothSize.ToString(),
                                UnitPrice = cloth.Price,
                                Quantity = item.Quantity
                            });
                        }
                        else
                        {
                            var shoe = await _db.Shoes.FirstOrDefaultAsync(s => s.Id == item.ShoeId.Value);
                            purchaseDto.Items.Add(new PurchaseItemCreateDto
                            {
                                ShoeId = shoe.Id,
                                ItemName = shoe.Name,
                                Picture = shoe.Picture,
                                Size = shoe.ShoeSize.ToString(),
                                UnitPrice = shoe.Price,
                                Quantity = item.Quantity
                            });
                        }
                    }

                    await _purchaseService.CreateFromBasketAsync(purchaseDto);

                    await _repo.SaveChangesAsync();
                    await tx.CommitAsync();

                    return (true, null, totalItems, totalPrice);
                }
                catch (Exception ex)
                {
                    await tx.RollbackAsync();
                    return (false, $"Unexpected error while purchasing: {ex.Message}", 0, 0m);
                }
            }
        }
    }
}
