using Microsoft.EntityFrameworkCore;
using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Entities.Basket;
using Sell.Ge.Models.Entities.Purchase;
using Sell.Ge.Models.Entities.ResetPassword;
using Sell.Ge.Models.Entities.Wishlist;


namespace Sell.Ge.Data
{
    public class SllDbContext : DbContext
    {
        public SllDbContext(DbContextOptions<SllDbContext> options) : base(options) { }


        public DbSet<Brand> Brands { get; set; }
        public DbSet<ClothesProductType> ClothesProductTypes { get; set; }
        public DbSet<ShoesProductType> ShoesProductTypes { get; set; }
        public DbSet<Shoe> Shoes { get; set; }
        public DbSet<Cloth> Clothes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<WishlistItem> WishlistItems { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Brand>().HasMany(b => b.Shoes).WithOne(s => s.Brand).HasForeignKey(s => s.BrandId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Brand>().HasMany(b => b.Clothes).WithOne(c => c.Brand).HasForeignKey(c => c.BrandId).OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<ClothesProductType>()
            .HasMany(t => t.Clothes)
            .WithOne(c => c.ProductType)
            .HasForeignKey(c => c.ProductTypeId)
            .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<ShoesProductType>()
            .HasMany(t => t.Shoes)
            .WithOne(s => s.ProductType)
            .HasForeignKey(s => s.ProductTypeId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Wishlist>()
              .HasOne(w => w.User)
              .WithMany()
              .HasForeignKey(w => w.UserId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WishlistItem>()
                .HasOne(i => i.Wishlist)
                .WithMany(w => w.Items)
                .HasForeignKey(i => i.WishlistId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WishlistItem>()
                .HasOne(i => i.Cloth)
                .WithMany()
                .HasForeignKey(i => i.ClothId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WishlistItem>()
                .HasOne(i => i.Shoe)
                .WithMany()
                .HasForeignKey(i => i.ShoeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Basket>()
      .HasOne(b => b.User)
      .WithMany()
      .HasForeignKey(b => b.UserId)
      .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BasketItem>()
                .HasOne(i => i.Basket)
                .WithMany(b => b.Items)
                .HasForeignKey(i => i.BasketId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BasketItem>()
                .HasOne(i => i.Cloth)
                .WithMany()
                .HasForeignKey(i => i.ClothId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BasketItem>()
                .HasOne(i => i.Shoe)
                .WithMany()
                .HasForeignKey(i => i.ShoeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}