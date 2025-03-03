using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ReactApp1.Server.Helpers
{
    public class TokenBlacklistService
    {
        private readonly AppDbContext _context;

        public TokenBlacklistService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsTokenBlacklistedAsync(string token)
        {
            return await _context.BlacklistedTokens
                .AnyAsync(t => t.Token == token && t.ExpiryDate > DateTime.UtcNow);
        }

        public async Task BlacklistTokenAsync(string token)
        {
            _context.BlacklistedTokens.Add(new BlacklistedToken
            {
                Token = token,
                ExpiryDate = DateTime.UtcNow.AddMinutes(30) // Example: Blacklist for 30 minutes
            });
            await _context.SaveChangesAsync();
        }
    }
}
