using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Auth;
using Sell.Ge.Dtos.ResetPassword;
using Sell.Ge.Services.Interfaces;
using System.Threading.Tasks;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        public AuthController(IAuthService auth) { _auth = auth; }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto dto)
        {
            var user = await _auth.RegisterAsync(dto);
            if (user == null) return BadRequest(new { message = "Email already in use." });
            return CreatedAtAction(nameof(Register), new { id = user.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _auth.LoginAsync(dto);
            if (token == null) return Unauthorized();
            return Ok(new { token });
        }

        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDto dto)
        {
            await _auth.RequestPasswordResetAsync(dto);
            return Ok(new { message = "If the email exists, a password reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var ok = await _auth.ResetPasswordAsync(dto);
            if (!ok) return BadRequest(new { message = "Invalid or expired token." });
            return NoContent();
        }
    }
}
