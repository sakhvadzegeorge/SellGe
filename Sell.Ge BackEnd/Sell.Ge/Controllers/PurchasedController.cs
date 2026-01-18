using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Services.Interfaces;
using System.Security.Claims;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/purchased")]
    [Authorize(Policy = "AdminOnly")]
    public class PurchasedController : ControllerBase
    {
        private readonly IPurchaseService _service;
        public PurchasedController(IPurchaseService service)
        {
            _service = service;
        }

        private int GetAdminId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) throw new Exception("User id claim missing");
            return int.Parse(claim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync(); // returns ONLY not delivered
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id); // returns null if delivered
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        [HttpPost("mark-delivered")]
        public async Task<IActionResult> MarkAllDelivered()
        {
            var adminId = GetAdminId();
            await _service.MarkAsDeliveredAllAsync(adminId);
            return Ok();
        }

        [HttpPost("{id}/mark-delivered")]
        public async Task<IActionResult> MarkDelivered(int id)
        {
            var adminId = GetAdminId();
            var success = await _service.MarkAsDeliveredAsync(id, adminId);
            if (!success) return BadRequest(new { error = "Purchase not found or already delivered." });
            return Ok();
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistoryAll()
        {
            var list = await _service.GetHistoryAllAsync();
            return Ok(list);
        }
            
        [HttpGet("history/user/{userId}")]
        public async Task<IActionResult> GetHistoryByUserId(int userId)
        {
            var list = await _service.GetHistoryByUserIdAsync(userId);
            return Ok(list);
        }
    }
}
