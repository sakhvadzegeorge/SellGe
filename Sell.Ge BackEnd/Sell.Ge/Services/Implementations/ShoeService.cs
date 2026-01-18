using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Dtos.Shoes;
using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Enums;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class ShoeService : IShoeService
    {
        private readonly IShoeRepository _repo;
        private readonly SllDbContext _context;

        public ShoeService(IShoeRepository repo, SllDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task<IEnumerable<ShoeDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(Map);
        }

        public async Task<ShoeDto?> GetByIdAsync(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item == null ? null : Map(item);
        }

        public async Task<ShoeDto> CreateAsync(ShoeCreateDto dto)
        {
            var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Name == dto.BrandName);
            var productType = await _context.ShoesProductTypes.FirstOrDefaultAsync(t => t.Name == dto.ProductTypeName);

            if (brand == null)
                throw new ArgumentException($"Brand '{dto.BrandName}' not found.");

            if (productType == null)
                throw new ArgumentException($"Product type '{dto.ProductTypeName}' not found.");

            if (!Enum.TryParse<ShoeSize>(dto.ShoeSize, true, out var shoeSize))
                throw new ArgumentException($"Invalid size '{dto.ShoeSize}'. Valid values: XS, S, M, L, XL, XXL.");

            if (!Enum.TryParse<Gender>(dto.Gender, true, out var gender))
                throw new ArgumentException($"Invalid gender '{dto.Gender}'. Valid values: Male, Female, Unisex.");

            var shoe = new Shoe
            {
                Picture = dto.Picture,
                Name = dto.Name,
                BrandId = brand.Id,
                ProductTypeId = productType.Id,
                ShoeSize = shoeSize,
                Gender = gender,
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity
            };

            var created = await _repo.AddAsync(shoe);
            return Map(created);
        }

        public async Task UpdateAsync(int id, ShoeUpdateDto dto)
        {
            var shoe = await _repo.GetByIdAsync(id);
            if (shoe == null)
                throw new ArgumentException($"Shoe with ID {id} not found.");

            if (!string.IsNullOrWhiteSpace(dto.Picture) && dto.Picture != "string")
                shoe.Picture = dto.Picture;

            if (!string.IsNullOrWhiteSpace(dto.Name) && dto.Name != "string")
                shoe.Name = dto.Name;

            if (!string.IsNullOrWhiteSpace(dto.BrandName))
            {
                var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Name == dto.BrandName);
                if (brand != null)
                    shoe.BrandId = brand.Id;
            }

            if (!string.IsNullOrWhiteSpace(dto.ProductTypeName))
            {
                var productType = await _context.ShoesProductTypes.FirstOrDefaultAsync(t => t.Name == dto.ProductTypeName);
                if (productType != null)
                    shoe.ProductTypeId = productType.Id;
            }

            if (!string.IsNullOrWhiteSpace(dto.ShoeSize) &&
                Enum.TryParse<ShoeSize>(dto.ShoeSize, true, out var parsedShoeSize))
                shoe.ShoeSize = parsedShoeSize;

            if (!string.IsNullOrWhiteSpace(dto.Gender) &&
                Enum.TryParse<Gender>(dto.Gender, true, out var parsedGender))
                shoe.Gender = parsedGender;

            if (!string.IsNullOrWhiteSpace(dto.Description) && dto.Description != "string")
                shoe.Description = dto.Description;

            if (dto.Price.HasValue && dto.Price.Value > 0)
                shoe.Price = dto.Price.Value;

            if (dto.Quantity.HasValue && dto.Quantity.Value > 0)
                shoe.Quantity = dto.Quantity.Value;

            await _repo.UpdateAsync(shoe);
        }

        public async Task ReduceStockAsync(int id, int amount)
        {
            var shoe = await _repo.GetByIdAsync(id);
            if (shoe == null || shoe.Quantity <= 0) return;

            shoe.Quantity = Math.Max(0, shoe.Quantity - amount);
            await _repo.UpdateAsync(shoe);
        }

        public async Task AddToStockAsync(int id, int amount)
        {
            var shoe = await _repo.GetByIdAsync(id);
            if (shoe == null) return;

            shoe.Quantity += amount;
            await _repo.UpdateAsync(shoe);
        }

        public async Task DeleteAsync(int id) =>
            await _repo.DeleteAsync(id);

        public async Task<IEnumerable<ShoeDto>> FilterAsync(Gender? gender, int? brandId, int? productTypeId, ShoeSize? shoeSize, decimal? priceFrom, decimal? priceTo)
        {
            var items = await _repo.FilterAsync(gender, brandId, productTypeId, shoeSize, priceFrom, priceTo);
            return items.Select(Map);
        }

        // UPDATED FILTER METHOD TO MATCH CLOTHSERVICE
        public async Task<IEnumerable<ShoeDto>> FilterAsync(
            Gender? gender,
            string? brandName,
            string? productTypeName,
            ShoeSize? shoeSize,
            decimal? priceFrom,
            decimal? priceTo,
            string? name = null)
        {
            var query = _context.Shoes
                .Include(c => c.Brand)
                .Include(c => c.ProductType)
                .AsQueryable();

            if (gender.HasValue)
                query = query.Where(c => c.Gender == gender);

            if (!string.IsNullOrEmpty(brandName))
                query = query.Where(c => c.Brand.Name.ToLower().Contains(brandName.ToLower()));

            if (!string.IsNullOrEmpty(productTypeName))
                query = query.Where(c => c.ProductType.Name.ToLower().Contains(productTypeName.ToLower()));

            if (shoeSize.HasValue)
                query = query.Where(c => c.ShoeSize == shoeSize);

            if (priceFrom.HasValue)
                query = query.Where(c => c.Price >= priceFrom);

            if (priceTo.HasValue)
                query = query.Where(c => c.Price <= priceTo);

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(c => c.Name.ToLower().Contains(name.ToLower()));
            }

            var shoes = await query.ToListAsync();
            return shoes.Select(Map);
        }

        private ShoeDto Map(Shoe s) =>
            new ShoeDto
            {
                Id = s.Id,
                Picture = s.Picture,
                Name = s.Name,
                BrandName = s.Brand?.Name,
                ProductTypeName = s.ProductType?.Name,
                ShoeSize = s.ShoeSize.ToString(),
                Gender = s.Gender.ToString(),
                Description = s.Description,
                Price = s.Price,
                Quantity = s.Quantity
            };
    }
}