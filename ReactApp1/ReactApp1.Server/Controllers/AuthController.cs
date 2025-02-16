using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Helpers;
using ReactApp1.Server.Models;
using System.Security.Cryptography;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly TokenService _tokenService;
    private readonly AppDbContext _context;
    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

        if (dbUser == null || !VerifyPassword(request.Password, dbUser.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = _tokenService.GenerateToken(request.Username);
        return Ok(new { token });
    }
    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private bool VerifyPassword(string inputPassword, string storedHash)
    {
        return HashPassword(inputPassword) == storedHash;
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}