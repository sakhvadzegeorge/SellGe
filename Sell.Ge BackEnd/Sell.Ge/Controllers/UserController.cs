using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Users;
using Sell.Ge.Services.Interfaces;
using System.Security.Claims;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPurchaseService _purchaseService;

        public UserController(IUserService userService, IPurchaseService purchaseService)
        {
            _userService = userService;
            _purchaseService = purchaseService;
        }

        private int GetUserId()
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)
                      ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            if (sub == null) return 0;
            return int.Parse(sub.Value);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyInfo()
        {
            var id = GetUserId();
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("me/edit")]
        public async Task<IActionResult> UpdateMyInfo([FromBody] UserUpdateDto dto)
        {
            var id = GetUserId();
            var ok = await _userService.UpdateAsync(id, dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPost("me/change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] UserChangePasswordDto dto)
        {
            var id = GetUserId();
            var ok = await _userService.ChangePasswordAsync(id, dto);
            if (!ok) return BadRequest(new { message = "Current password invalid or user not found." });
            return NoContent();
        }

        [HttpGet("me/purchases/history")]
        public async Task<IActionResult> GetMyPurchaseHistory()
        {
            var id = GetUserId();
            if (id == 0) return Unauthorized();
            var list = await _purchaseService.GetHistoryByUserIdAsync(id);
            return Ok(list);
        }

        [HttpGet("me/purchases/pending")]
        public async Task<IActionResult> GetMyPendingPurchases()
        {
            var id = GetUserId();
            if (id == 0) return Unauthorized();
            var list = await _purchaseService.GetPendingByUserIdAsync(id);
            return Ok(list);
        }

        [HttpDelete("me/terminate")]
        public async Task<IActionResult> DeleteMyAccount()
        {
            var id = GetUserId();
            var ok = await _userService.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
