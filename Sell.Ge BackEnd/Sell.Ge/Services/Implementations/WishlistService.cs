using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Dtos.Basket;
using Sell.Ge.Dtos.Wishlist;
using Sell.Ge.Models.Entities.Wishlist;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class WishlistService : IWishlistService
    {
        private readonly SllDbContext _db;
        private readonly IWishlistRepository _repo;
        private readonly IBasketService _basketService;

        public WishlistService(SllDbContext db, IWishlistRepository repo, IBasketService basketService)
        {
            _db = db;
            _repo = repo;
            _basketService = basketService;
        }

        public async Task<WishlistDto> GetForUserAsync(int userId)
        {
            var wishlist = await _repo.GetByUserIdAsync(userId);
            if (wishlist == null)
            {
                return new WishlistDto { WishlistId = 0, Items = new System.Collections.Generic.List<WishlistItemDto>(), TotalItems = 0, TotalPrice = 0m };
            }

            var items = wishlist.Items.Select(i =>
            {
                var dto = new WishlistItemDto
                {
                    ItemId = i.Id,
                    ClothId = i.ClothId,
                    ShoeId = i.ShoeId,
                    Picture = i.Cloth != null ? i.Cloth.Picture : i.Shoe != null ? i.Shoe.Picture : string.Empty,
                    Name = i.Cloth != null ? i.Cloth.Name : i.Shoe != null ? i.Shoe.Name : string.Empty,
                    Size = i.Cloth != null ? i.Cloth.ClothSize.ToString() : i.Shoe != null ? i.Shoe.ShoeSize.ToString() : string.Empty,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity
                };
                return dto;
            }).ToList();

            var totalItems = items.Sum(x => x.Quantity);
            var totalPrice = items.Sum(x => x.TotalPrice);

            return new WishlistDto
            {
                WishlistId = wishlist.Id,
                Items = items,
                TotalItems = totalItems,
                TotalPrice = totalPrice
            };
        }

        public async Task<(bool Success, string Error)> AddItemAsync(int userId, WishlistAddItemDto dto)
        {
            if ((dto.ClothId == null && dto.ShoeId == null) || (dto.ClothId != null && dto.ShoeId != null))
                return (false, "Provide either ClothId or ShoeId, not both.");

            if (dto.Quantity <= 0) return (false, "Quantity must be greater than 0.");

            var wishlist = await _repo.GetByUserIdAsync(userId);
            if (wishlist == null)
            {
                wishlist = new Wishlist { UserId = userId };
                await _repo.AddAsync(wishlist);
                await _repo.SaveChangesAsync(); // create first so it has an Id
            }

            if (dto.ClothId.HasValue)
            {
                var cloth = await _db.Clothes.FirstOrDefaultAsync(c => c.Id == dto.ClothId.Value);
                if (cloth == null) return (false, "Cloth not found.");
                // existing item?
                var existing = wishlist.Items.FirstOrDefault(i => i.ClothId == dto.ClothId);
                var desired = dto.Quantity + (existing?.Quantity ?? 0);
                if (desired > cloth.Quantity) return (false, "Not enough stock for the requested cloth.");
                if (existing != null)
                {
                    existing.Quantity += dto.Quantity;
                }
                else
                {
                    wishlist.Items.Add(new WishlistItem
                    {
                        ClothId = cloth.Id,
                        Quantity = dto.Quantity
                    });
                }
            }
            else // Shoe
            {
                var shoe = await _db.Shoes.FirstOrDefaultAsync(s => s.Id == dto.ShoeId.Value);
                if (shoe == null) return (false, "Shoe not found.");
                var existing = wishlist.Items.FirstOrDefault(i => i.ShoeId == dto.ShoeId);
                var desired = dto.Quantity + (existing?.Quantity ?? 0);
                if (desired > shoe.Quantity) return (false, "Not enough stock for the requested shoe.");
                if (existing != null)
                {
                    existing.Quantity += dto.Quantity;
                }
                else
                {
                    wishlist.Items.Add(new WishlistItem
                    {
                        ShoeId = shoe.Id,
                        Quantity = dto.Quantity
                    });
                }
            }

            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error)> UpdateItemQuantityAsync(int userId, WishlistUpdateQuantityDto dto)
        {
            if (dto.Quantity <= 0) return (false, "Quantity must be greater than 0.");

            var wishlist = await _repo.GetByUserIdAsync(userId);
            if (wishlist == null) return (false, "Wishlist not found.");

            var item = wishlist.Items.FirstOrDefault(i => i.Id == dto.ItemId);
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
                return (false, "Invalid wishlist item.");
            }

            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error)> RemoveItemAsync(int userId, int itemId)
        {
            var wishlist = await _repo.GetByUserIdAsync(userId);
            if (wishlist == null) return (false, "Wishlist not found.");

            var item = wishlist.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null) return (false, "Item not found.");

            wishlist.Items.Remove(item);
            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error)> ClearWishlistAsync(int userId)
        {
            var wishlist = await _repo.GetByUserIdAsync(userId);
            if (wishlist == null) return (true, null);
            wishlist.Items.Clear();
            await _repo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string Error)> MoveItemToBasketAsync(int userId, int wishlistItemId)
        {
            var wishlist = await _repo.GetByUserIdAsync(userId);
            if (wishlist == null) return (false, "Wishlist not found.");

            var item = wishlist.Items.FirstOrDefault(i => i.Id == wishlistItemId);
            if (item == null) return (false, "Wishlist item not found.");

            var quantityToMove = item.Quantity;
            if (quantityToMove <= 0) return (false, "Wishlist item has zero quantity.");

            var addDto = new BasketAddItemDto
            {
                ClothId = item.ClothId,
                ShoeId = item.ShoeId,
                Quantity = quantityToMove
            };

            var (successAdd, errorAdd) = await _basketService.AddItemAsync(userId, addDto);
            if (!successAdd) return (false, errorAdd);

            wishlist.Items.Remove(item);
            await _repo.SaveChangesAsync();

            return (true, null);
        }


        public async Task<(bool Success, string Error)> MoveAllToBasketAsync(int userId)
        {
            var wishlist = await _repo.GetByUserIdAsync(userId);
            if (wishlist == null || !wishlist.Items.Any()) return (true, null);

            using (var tx = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var item in wishlist.Items.ToList())
                    {
                        var qty = item.Quantity;
                        if (qty <= 0)
                        {
                            wishlist.Items.Remove(item);
                            continue;
                        }

                        var addDto = new BasketAddItemDto
                        {
                            ClothId = item.ClothId,
                            ShoeId = item.ShoeId,
                            Quantity = qty
                        };

                        var (successAdd, errorAdd) = await _basketService.AddItemAsync(userId, addDto);
                        if (!successAdd)
                        {
                            await tx.RollbackAsync();
                            return (false, $"Failed to move item (id: {item.Id}): {errorAdd}");
                        }

                        wishlist.Items.Remove(item);
                    }

                    await _repo.SaveChangesAsync();
                    await tx.CommitAsync();
                    return (true, null);
                }
                catch (Exception ex)
                {
                    await tx.RollbackAsync();
                    return (false, $"Unexpected error while moving wishlist to basket: {ex.Message}");
                }
            }
        }
    }
  }
