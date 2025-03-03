using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using reactapp1.DTOs.UserManagement;
using ReactApp1.Server.Helpers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Add authentication if needed
public class UserManagingController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public UserManagingController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    // Create User
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto model)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
        if (existingUser != null)
            return BadRequest("Username already exists");

        // Hash the password
        var passwordHash = HashPassword(model.Password);

        var user = new User
        {
            Username = model.Username,
            PasswordHash = passwordHash,
            Role = "BasicUser"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // Read Users
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // Update User
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return NotFound();

        user.Username = model.Username;
        //user.PasswordHash = model.PasswordHash; // You may want to hash the new password here if it's being updated
        //user.Email = model.Email; // Assuming you add email to User model

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // Delete User
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // Helper method to hash the password
    private string HashPassword(string password)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}