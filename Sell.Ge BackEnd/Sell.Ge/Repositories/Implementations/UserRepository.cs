using Microsoft.EntityFrameworkCore;
using Sell.Ge.Data;
using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Entities.ResetPassword;
using Sell.Ge.Repositories.Interfaces;

namespace Sell.Ge.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly SllDbContext _ctx;
        public UserRepository(SllDbContext ctx) { _ctx = ctx; }

        public async Task AddAsync(User user)
        {
            await _ctx.AddAsync(user);
        }

        public async Task DeleteAsync(User user)
        {
            _ctx.Remove(user);
            await Task.CompletedTask;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _ctx.Set<User>().AsNoTracking().ToListAsync();
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _ctx.Set<User>().FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _ctx.Set<User>().FindAsync(id);
        }

        public async Task SaveChangesAsync()
        {
            await _ctx.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _ctx.Update(user);
            await Task.CompletedTask;
        }
        public async Task AddPasswordResetTokenAsync(PasswordResetToken token)
        {
            await _ctx.PasswordResetTokens.AddAsync(token);
            await _ctx.SaveChangesAsync();
        }

        public async Task<PasswordResetToken> GetPasswordResetTokenAsync(int userId, string tokenHash)
        {
            return await _ctx.PasswordResetTokens
                .SingleOrDefaultAsync(t => t.UserId == userId && t.TokenHash == tokenHash && !t.IsUsed);
        }

        public async Task InvalidatePasswordResetTokenAsync(PasswordResetToken token)
        {
            token.IsUsed = true;
            _ctx.PasswordResetTokens.Update(token);
            await _ctx.SaveChangesAsync();
        }
    }
}
