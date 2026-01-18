using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Dtos.Clothes;
using Sell.Ge.Dtos.Clothes.Sell.Ge.Dtos.Clothes;
using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Enums;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class ClothService : IClothService
    {
        private readonly IClothRepository _repo;
        private readonly SllDbContext _context;

        public ClothService(IClothRepository repo, SllDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task<IEnumerable<ClothDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(Map);
        }

        public async Task<ClothDto?> GetByIdAsync(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item == null ? null : Map(item);
        }

        public async Task<ClothDto> CreateAsync(ClothCreateDto dto)
        {
            var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Name == dto.BrandName);
            var productType = await _context.ClothesProductTypes.FirstOrDefaultAsync(t => t.Name == dto.ProductTypeName);

            if (brand == null)
                throw new ArgumentException($"Brand '{dto.BrandName}' not found.");

            if (productType == null)
                throw new ArgumentException($"Product type '{dto.ProductTypeName}' not found.");

            if (!Enum.TryParse<ClothSize>(dto.ClothSize, true, out var clothSize))
                throw new ArgumentException($"Invalid size '{dto.ClothSize}'.");

            if (!Enum.TryParse<Gender>(dto.Gender, true, out var gender))
                throw new ArgumentException($"Invalid gender '{dto.Gender}'.");

            var cloth = new Cloth
            {
                Picture = dto.Picture,
                Name = dto.Name,
                BrandId = brand.Id,
                ProductTypeId = productType.Id,
                ClothSize = clothSize,
                Gender = gender,
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity
            };

            var created = await _repo.AddAsync(cloth);
            return Map(created);
        }

        public async Task UpdateAsync(int id, ClothUpdateDto dto)
        {
            var cloth = await _repo.GetByIdAsync(id);
            if (cloth == null)
                throw new ArgumentException($"Cloth with ID {id} not found.");

            if (!string.IsNullOrWhiteSpace(dto.Picture) && dto.Picture != "string")
                cloth.Picture = dto.Picture;

            if (!string.IsNullOrWhiteSpace(dto.Name) && dto.Name != "string")
                cloth.Name = dto.Name;

            if (!string.IsNullOrWhiteSpace(dto.BrandName))
            {
                var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Name == dto.BrandName);
                if (brand != null)
                    cloth.BrandId = brand.Id;
            }

            if (!string.IsNullOrWhiteSpace(dto.ProductTypeName))
            {
                var productType = await _context.ClothesProductTypes.FirstOrDefaultAsync(t => t.Name == dto.ProductTypeName);
                if (productType != null)
                    cloth.ProductTypeId = productType.Id;
            }

            if (!string.IsNullOrWhiteSpace(dto.ClothSize) &&
                Enum.TryParse<ClothSize>(dto.ClothSize, true, out var parsedClothSize))
                cloth.ClothSize = parsedClothSize;

            if (!string.IsNullOrWhiteSpace(dto.Gender) &&
                Enum.TryParse<Gender>(dto.Gender, true, out var parsedGender))
                cloth.Gender = parsedGender;

            if (!string.IsNullOrWhiteSpace(dto.Description) && dto.Description != "string")
                cloth.Description = dto.Description;

            if (dto.Price.HasValue && dto.Price.Value > 0)
                cloth.Price = dto.Price.Value;

            if (dto.Quantity.HasValue && dto.Quantity.Value > 0)
                cloth.Quantity = dto.Quantity.Value;

            await _repo.UpdateAsync(cloth);
        }

        public async Task ReduceStockAsync(int id, int amount)
        {
            var cloth = await _repo.GetByIdAsync(id);
            if (cloth == null || cloth.Quantity <= 0) return;

            cloth.Quantity = Math.Max(0, cloth.Quantity - amount);
            await _repo.UpdateAsync(cloth);
        }

        public async Task AddToStockAsync(int id, int amount)
        {
            var cloth = await _repo.GetByIdAsync(id);
            if (cloth == null) return;

            cloth.Quantity += amount;
            await _repo.UpdateAsync(cloth);
        }

        public async Task DeleteAsync(int id) =>
            await _repo.DeleteAsync(id);

        public async Task<IEnumerable<ClothDto>> FilterAsync(
            Gender? gender,
            int? brandId,
            int? productTypeId,
            ClothSize? clothSize,
            decimal? priceFrom,
            decimal? priceTo)
        {
            var items = await _repo.FilterAsync(gender, brandId, productTypeId, clothSize, priceFrom, priceTo);
            return items.Select(Map);
        }

        // UPDATED NAME FILTER
        public async Task<IEnumerable<ClothDto>> FilterAsync(
            Gender? gender,
            string? brandName,
            string? productTypeName,
            ClothSize? clothSize,
            decimal? priceFrom,
            decimal? priceTo,
            string? name = null)
        {
            var query = _context.Clothes
                .Include(c => c.Brand)
                .Include(c => c.ProductType)
                .AsQueryable();

            if (gender.HasValue)
                query = query.Where(c => c.Gender == gender);

            if (!string.IsNullOrEmpty(brandName))
                query = query.Where(c => c.Brand.Name.ToLower().Contains(brandName.ToLower()));

            if (!string.IsNullOrEmpty(productTypeName))
                query = query.Where(c => c.ProductType.Name.ToLower().Contains(productTypeName.ToLower()));

            if (clothSize.HasValue)
                query = query.Where(c => c.ClothSize == clothSize);

            if (priceFrom.HasValue)
                query = query.Where(c => c.Price >= priceFrom);

            if (priceTo.HasValue)
                query = query.Where(c => c.Price <= priceTo);

    
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(c => c.Name.ToLower().Contains(name.ToLower()));
            }

            var clothes = await query.ToListAsync();
            return clothes.Select(Map);
        }

        private ClothDto Map(Cloth c) =>
            new ClothDto
            {
                Id = c.Id,
                Picture = c.Picture,
                Name = c.Name,
                BrandName = c.Brand?.Name,
                ProductTypeName = c.ProductType?.Name,
                ClothSize = c.ClothSize.ToString(),
                Gender = c.Gender.ToString(),
                Description = c.Description,
                Price = c.Price,
                Quantity = c.Quantity
            };
    }
}
