using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Wishlist;
using Sell.Ge.Models.Entities;
using Sell.Ge.Services.Interfaces;
using System.Security.Claims;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/wishlist")]
    [Authorize] // requires authentication
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _service;
        public WishlistController(IWishlistService service) { _service = service; }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) throw new System.Exception("User id claim missing");
            return int.Parse(claim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();
            var dto = await _service.GetForUserAsync(userId);
            return Ok(dto);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] WishlistAddItemDto dto)
        {
            var userId = GetUserId();

            if (dto.ClothId == 0) dto.ClothId = null;
            if (dto.ShoeId == 0) dto.ShoeId = null;

            var (success, error) = await _service.AddItemAsync(userId, dto);

            if (!success)
                return BadRequest(new { error });

            return Ok();
        }


        [HttpPut("changequantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] WishlistUpdateQuantityDto dto)
        {
            var userId = GetUserId();
            var (success, error) = await _service.UpdateItemQuantityAsync(userId, dto);
            if (!success) return BadRequest(new { error });
            return Ok();
        }

        [HttpDelete("item/{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var userId = GetUserId();
            var (success, error) = await _service.RemoveItemAsync(userId, id);
            if (!success) return BadRequest(new { error });
            return Ok();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = GetUserId();
            var (success, error) = await _service.ClearWishlistAsync(userId);
            if (!success) return BadRequest(new { error });
            return Ok();
        }
        [HttpPost("move/item/{wishlistItemId}")]
        public async Task<IActionResult> MoveItemToBasket(int wishlistItemId)
        {
            var userId = GetUserId();
            var (success, error) = await _service.MoveItemToBasketAsync(userId, wishlistItemId);
            if (!success) return BadRequest(new { error });
            return Ok();
        }
        [HttpPost("move/all")]
        public async Task<IActionResult> MoveAllToBasket()
        {
            var userId = GetUserId();
            var (success, error) = await _service.MoveAllToBasketAsync(userId);
            if (!success) return BadRequest(new { error });
            return Ok();
        }
    }
}
