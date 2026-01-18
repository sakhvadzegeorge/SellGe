using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Entities.ResetPassword;

namespace Sell.Ge.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(int id);
        Task<User> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(User user);
        Task SaveChangesAsync();
        Task AddPasswordResetTokenAsync(PasswordResetToken token);
        Task<PasswordResetToken> GetPasswordResetTokenAsync(int userId, string tokenHash);
        Task InvalidatePasswordResetTokenAsync(PasswordResetToken token);
    }
}
