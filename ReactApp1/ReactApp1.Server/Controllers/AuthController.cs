using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Helpers;
using ReactApp1.Server.Models;
using System.Security.Cryptography;
using OtpNet;
using QRCoder; // Install-Package QRCoder
using System.Text;
using static ReactApp1.Server.Helpers.TokenService;
using static ReactApp1.Server.Helpers.TokenBlacklistService;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ITokenService _tokenService;
    private readonly AppDbContext _context;
    private readonly ITokenBlacklistService _tokenBlacklistService;
    public AuthController(AppDbContext context, ITokenService tokenService, ITokenBlacklistService tokenBlacklistService)
    {
        _context = context;
        _tokenService = tokenService;
        _tokenBlacklistService = tokenBlacklistService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

        if (dbUser == null || !VerifyPassword(request.Password, dbUser.PasswordHash))
            return Unauthorized("Invalid credentials");
        if (dbUser.IsMfaEnabled)
        {
            return Ok(new { requiresMfa = true });
        }
        var token = _tokenService.GenerateToken(request.Username, dbUser.Role);
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
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromHeader(Name = "Authorization")] string authHeader)
    {
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return BadRequest(new { message = "Invalid token" });
        }

        string token = authHeader.Substring("Bearer ".Length).Trim();
        // Here you would add the token to the blacklist
        await _tokenBlacklistService.BlacklistTokenAsync(token);

        return Ok(new { message = "Logged out successfully" });
    }
    [HttpPost("enable-mfa")]
    public async Task<IActionResult> EnableMfa([FromBody] MfaSetupRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null) return NotFound("User not found");

        // Generate secret key for TOTP
        var secretKey = KeyGeneration.GenerateRandomKey(20);
        var base32Secret = Base32Encoding.ToString(secretKey);
        user.MfaSecret = base32Secret;
        user.IsMfaEnabled = true;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        // Generate QR Code
        string issuer = "ReactApp1"; // Change to your app name
        string otpauthUrl = $"otpauth://totp/{issuer}:{user.Username}?secret={base32Secret}&issuer={issuer}";

        using var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode(otpauthUrl, QRCodeGenerator.ECCLevel.Q);
        var qrCode = new PngByteQRCode(qrCodeData);
        var qrCodeBytes = qrCode.GetGraphic(20);

        return File(qrCodeBytes, "image/png");
    }
    public class MfaSetupRequest
    {
        public string Username { get; set; }
    }
    [HttpPost("verify-mfa")]
    public async Task<IActionResult> VerifyMfa([FromBody] MfaVerifyRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null || string.IsNullOrEmpty(user.MfaSecret))
            return Unauthorized("MFA not set up for this user");

        var totp = new Totp(Base32Encoding.ToBytes(user.MfaSecret));
        if (!totp.VerifyTotp(request.Code, out _))
            return Unauthorized("Invalid MFA code");

        var token = _tokenService.GenerateToken(user.Username, user.Role);
        return Ok(new { token });
    }

    public class MfaVerifyRequest
    {
        public string Username { get; set; }
        public string Code { get; set; }
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}