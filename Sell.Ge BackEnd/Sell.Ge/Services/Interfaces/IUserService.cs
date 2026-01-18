using Sell.Ge.Dtos.Users;

namespace Sell.Ge.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserReadDto> GetByIdAsync(int id);
        Task<IEnumerable<UserReadDto>> GetAllAsync();
        Task<bool> UpdateAsync(int id, UserUpdateDto dto);
        Task<bool> ChangePasswordAsync(int id, UserChangePasswordDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ChangeRoleAsync(int id, int newRoleValue);
    }
}
