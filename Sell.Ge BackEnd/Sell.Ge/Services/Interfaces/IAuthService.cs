using Sell.Ge.Dtos.Auth;
using Sell.Ge.Dtos.ResetPassword;
using Sell.Ge.Models.Entities;

namespace Sell.Ge.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterUserDto dto);
        Task<string> LoginAsync(LoginDto dto);

        Task RequestPasswordResetAsync(RequestPasswordResetDto dto);
        Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
    }
}
