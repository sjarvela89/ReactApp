using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using Microsoft.Extensions.Logging;
using Xunit;
using System.Linq;
using System.Collections.Generic;

namespace ReactApp1.Tests
{
    public class ProductsControllerTests : IDisposable // Implement IDisposable to clear resources after each test
    {
        private readonly Mock<ILogger<ProductsController>> _mockLogger;
        private readonly AppDbContext _dbContext;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            // Use an in-memory database for testing
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase" + Guid.NewGuid()) // Unique name per test
                .Options;

            _dbContext = new AppDbContext(options);

            // Create the ProductsController instance
            _mockLogger = new Mock<ILogger<ProductsController>>();
            _controller = new ProductsController(_dbContext, _mockLogger.Object);

            // Seed the database with products (don't specify ID for auto-generation)
            _dbContext.Products.Add(new Product { Name = "Product1", Price = 100 });
            _dbContext.Products.Add(new Product { Name = "Product2", Price = 200 });
            _dbContext.SaveChanges();
        }

        // Clear database before each test
        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted(); // Deletes the in-memory database
        }

        [Fact]
        public void Get_ReturnsAllProducts()
        {
            // Act
            var result = _controller.Get();

            // Assert
            var actionResult = Assert.IsAssignableFrom<IEnumerable<Product>>(result);
            Assert.Equal(2, actionResult.Count()); // We seeded 2 products
        }

        [Fact]
        public void AddProduct_ReturnsCreatedProduct()
        {
            // Arrange
            var newProduct = new Product { Name = "Product3", Price = 300 };

            // Act
            var result = _controller.AddProduct(newProduct);

            // Assert
            var createdAtActionResult = Assert.IsAssignableFrom<CreatedAtActionResult>(result);
            var returnedProduct = Assert.IsAssignableFrom<Product>(createdAtActionResult.Value);

            Assert.Equal(newProduct.Name, returnedProduct.Name);
            Assert.Equal(newProduct.Price, returnedProduct.Price);

            // Check that the returned product's ID is auto-generated and starts at 3, assuming no other products have been added.
            Assert.True(returnedProduct.Id > 2);  // Ensure the ID is greater than 2
        }
    }
}