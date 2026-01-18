using Microsoft.IdentityModel.Tokens;
using Sell.Ge.Dtos.Auth;
using Sell.Ge.Dtos.ResetPassword;
using Sell.Ge.Extensions;
using Sell.Ge.Models.Entities;
using Sell.Ge.Models.Entities.ResetPassword;
using Sell.Ge.Models.Enums;
using Sell.Ge.Repositories.Interfaces;
using Sell.Ge.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Sell.Ge.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthService(
            IUserRepository userRepo,
            IConfiguration config,
            IEmailService emailService
        )
        {
            _userRepo = userRepo;
            _config = config;
            _emailService = emailService;
        }

        // ---------------- REGISTER ----------------
        public async Task<User> RegisterAsync(RegisterUserDto dto)
        {
            var existing = await _userRepo.GetByEmailAsync(dto.Email);
            if (existing != null) return null;

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Age = dto.Age,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Address = dto.Address,
                Phone = dto.Phone,
                ZipCode = dto.ZipCode,
                Avatar = dto.Avatar,
                Gender = (Gender)dto.Gender,
                Role = Role.User
            };

            await _userRepo.AddAsync(user);
            await _userRepo.SaveChangesAsync();

            return user;
        }

        // ---------------- LOGIN ----------------
        public async Task<string> LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null) return null;
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;

            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"] ?? "60"));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        // ---------------- REQUEST PASSWORD RESET ----------------
        public async Task RequestPasswordResetAsync(RequestPasswordResetDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email)) return;

            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null) return; // do not reveal existence

            // generate token
            var token = TokenHelper.GenerateSecureToken();
            var tokenHash = TokenHelper.ComputeSha256Hash(token);

            var expiryMinutes = int.Parse(
                _config.GetSection("PasswordReset")["TokenExpiryMinutes"] ?? "60"
            );

            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(expiryMinutes),
                IsUsed = false
            };

            await _userRepo.AddPasswordResetTokenAsync(resetToken);

            // construct link
            var baseUrl = _config.GetSection("PasswordReset")["ResetLinkBase"];
            var resetLink = $"{baseUrl}?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";

            var html = $@"
                <p>Hello {user.FirstName ?? user.Email},</p>
                <p>To reset your password, click the link below. This link will expire in {expiryMinutes} minutes.</p>
                <p><a href=""{resetLink}"">Reset your password</a></p>
                <p>If you did not request this, you can ignore this email.</p>";

            await _emailService.SendEmailAsync(user.Email, "Sell.Ge Password Reset", html);
        }


        // ---------------- RESET PASSWORD ----------------
        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Token) ||
                string.IsNullOrWhiteSpace(dto.NewPassword))
                return false;

            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null) return false;

            var tokenHash = TokenHelper.ComputeSha256Hash(dto.Token);
            var stored = await _userRepo.GetPasswordResetTokenAsync(user.Id, tokenHash);

            if (stored == null) return false;
            if (stored.IsUsed) return false;    
            if (stored.ExpiresAtUtc < DateTime.UtcNow) return false;

            // valid → update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _userRepo.UpdateAsync(user);

            // mark token used
            await _userRepo.InvalidatePasswordResetTokenAsync(stored);

            await _userRepo.SaveChangesAsync();
            return true;
        }
    }
}
