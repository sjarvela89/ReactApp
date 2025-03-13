using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using ReactApp1.Server.Data;
using ReactApp1.Server.Helpers;
using static ReactApp1.Server.Helpers.TokenBlacklistService;
using static ReactApp1.Server.Helpers.TokenService;

public class AuthControllerTests
{
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly Mock<ITokenBlacklistService> _mockTokenBlacklistService;
    private readonly AuthController _controller;
    private readonly AppDbContext _dbContext;

    public AuthControllerTests()
    {
        // Use an in-memory database for testing
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _dbContext = new AppDbContext(options);

        _mockTokenService = new Mock<ITokenService>();
        _mockTokenBlacklistService = new Mock<ITokenBlacklistService>();

        _controller = new AuthController(
            _dbContext,
            _mockTokenService.Object,
            _mockTokenBlacklistService.Object
        );

        _mockTokenService
            .Setup(service => service.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("mocked-jwt-token");
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_ForInvalidUser()
    {
        // Arrange
        var request = new LoginRequest { Username = "wronguser", Password = "wrongpass" };

        // Act
        var result = await _controller.Login(request);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}