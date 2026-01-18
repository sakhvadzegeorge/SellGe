using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Enums;

namespace Sell.Ge.Data
{
    public static class DataSeeder
    {
        public static void Seed(SllDbContext context)
        {
            if (context.Brands.Any()) return;

            var b1 = new Brand { Name = "BrandA" };
            var b2 = new Brand { Name = "BrandB" };
            var b3 = new Brand { Name = "BrandC" };

            context.Brands.AddRange(b1, b2, b3);
            context.SaveChanges();

            var cpt1 = new ClothesProductType { Name = "TShirt" };
            var cpt2 = new ClothesProductType { Name = "Jacket" };

            context.ClothesProductTypes.AddRange(cpt1, cpt2);
            context.SaveChanges();

            var spt1 = new ShoesProductType { Name = "Sneakers" };
            var spt2 = new ShoesProductType { Name = "Running" };

            context.ShoesProductTypes.AddRange(spt1, spt2);
            context.SaveChanges();

            var shoe1 = new Shoe
            {
                Name = "Runner 1",
                Picture = "/images/shoes/runner1.jpg",
                BrandId = b1.Id,
                ShoeSize = ShoeSize.Size33,
                Gender = Gender.Male,
                Description = "Comfort running shoe",
                ProductTypeId = spt2.Id,
                Price = 79.99m,
                Quantity = 5
            };

            var shoe2 = new Shoe
            {
                Name = "Sneak 2",
                Picture = "/images/shoes/sneak2.jpg",
                BrandId = b2.Id,
                ShoeSize = ShoeSize.Size33,
                Gender = Gender.Female,
                Description = "Stylish sneakers",
                ProductTypeId = spt1.Id,
                Price = 99.50m,
                Quantity = 2
            };

            context.Shoes.AddRange(shoe1, shoe2);

            var cloth1 = new Cloth
            {
                Name = "Basic Tee",
                Picture = "/images/clothes/tee1.jpg",
                BrandId = b1.Id,
                ClothSize = ClothSize.S,
                Gender = Gender.Unisex,
                Description = "Cotton t-shirt",
                ProductTypeId = cpt1.Id,
                Price = 19.99m,
                Quantity = 10
            };

            var cloth2 = new Cloth
            {
                Name = "Wind Jacket",
                Picture = "/images/clothes/jacket1.jpg",
                BrandId = b3.Id,
                ClothSize = ClothSize.XL,
                Gender = Gender.Male,
                Description = "Lightweight jacket",
                ProductTypeId = cpt2.Id,
                Price = 129.00m,
                Quantity = 3
            };

            context.Clothes.AddRange(cloth1, cloth2);
            context.SaveChanges();

            if (!context.Set<User>().Any(u => u.Role == Role.Admin))
            {
                var admin = new User
                {
                    FirstName = "Super",
                    LastName = "Admin",
                    Age = 30,
                    Email = "admin@sell.ge",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345"),
                    Address = "Admin Address",
                    Phone = "+995555000000",
                    ZipCode = "0100",
                    Avatar = "",
                    Gender = Gender.Unisex,
                    Role = Role.Admin
                };
                context.Set<User>().Add(admin);
                context.SaveChanges();
            }
        }

    }
}
