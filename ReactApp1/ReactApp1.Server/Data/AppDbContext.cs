using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Add DbSets for your entities
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Sample Product", Price = 10.99m }
            );
            modelBuilder.Entity<User>()
               .HasIndex(u => u.Username)
               .IsUnique();
        }
    }
}
