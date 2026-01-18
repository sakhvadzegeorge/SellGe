using Sell.Ge.Dtos.Users;
using Sell.Ge.Models.Enums;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        public UserService(IUserRepository repo) { _repo = repo; }

        public async Task<IEnumerable<UserReadDto>> GetAllAsync()
        {
            var users = await _repo.GetAllAsync();
            return users.Select(u => new UserReadDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Age = u.Age,
                Email = u.Email,
                Address = u.Address,
                Phone = u.Phone,
                ZipCode = u.ZipCode,
                Avatar = u.Avatar,
                Gender = u.Gender,
                Role = u.Role
            });
        }

        public async Task<UserReadDto> GetByIdAsync(int id)
        {
            var u = await _repo.GetByIdAsync(id);
            if (u == null) return null;
            return new UserReadDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Age = u.Age,
                Email = u.Email,
                Address = u.Address,
                Phone = u.Phone,
                ZipCode = u.ZipCode,
                Avatar = u.Avatar,
                Gender = u.Gender,
                Role = u.Role
            };
        }

        public async Task<bool> UpdateAsync(int id, UserUpdateDto dto)
        {
            var u = await _repo.GetByIdAsync(id);
            if (u == null) return false;

            if (!string.IsNullOrWhiteSpace(dto.FirstName) && dto.FirstName != "string")
                u.FirstName = dto.FirstName;

            if (!string.IsNullOrWhiteSpace(dto.LastName) && dto.LastName != "string")
                u.LastName = dto.LastName;

            if (dto.Age.HasValue && dto.Age.Value > 0)
                u.Age = dto.Age.Value;

            if (!string.IsNullOrWhiteSpace(dto.Address) && dto.Address != "string")
                u.Address = dto.Address;

            if (!string.IsNullOrWhiteSpace(dto.Phone) && dto.Phone != "string")
                u.Phone = dto.Phone;

            if (!string.IsNullOrWhiteSpace(dto.ZipCode) && dto.ZipCode != "string")
                u.ZipCode = dto.ZipCode;

            if (!string.IsNullOrWhiteSpace(dto.Avatar) && dto.Avatar != "string")
                u.Avatar = dto.Avatar;

            if (dto.Gender.HasValue)
                u.Gender = dto.Gender.Value;

            await _repo.UpdateAsync(u);
            await _repo.SaveChangesAsync();
            return true;
        }


        public async Task<bool> ChangePasswordAsync(int id, UserChangePasswordDto dto)
        {
            var u = await _repo.GetByIdAsync(id);
            if (u == null) return false;
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, u.PasswordHash)) return false;
            u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _repo.UpdateAsync(u);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var u = await _repo.GetByIdAsync(id);
            if (u == null) return false;
            await _repo.DeleteAsync(u);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangeRoleAsync(int id, int newRoleValue)
        {
            var u = await _repo.GetByIdAsync(id);
            if (u == null) return false;
            u.Role = (Role)newRoleValue;
            await _repo.UpdateAsync(u);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}