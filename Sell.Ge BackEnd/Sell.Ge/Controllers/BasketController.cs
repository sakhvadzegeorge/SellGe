using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Basket;
using Sell.Ge.Dtos.Wishlist;
using Sell.Ge.Models.Entities;
using Sell.Ge.Services.Interfaces;
using System.Security.Claims;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/basket")]
    [Authorize]
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _service;
        public BasketController(IBasketService service) { _service = service; }

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
        public async Task<IActionResult> Add([FromBody] BasketAddItemDto dto)
        {
            var userId = GetUserId();

            if (dto.ClothId == 0) dto.ClothId = null;
            if (dto.ShoeId == 0) dto.ShoeId = null;

            if (dto.Quantity <= 0) dto.Quantity = 1;

            var (success, error) = await _service.AddItemAsync(userId, dto);

            if (!success)
                return BadRequest(new { error });

            return Ok();
        }

        [HttpPut("item")]
        public async Task<IActionResult> UpdateQuantity([FromBody] BasketUpdateQuantityDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

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
            var (success, error) = await _service.ClearBasketAsync(userId);
            if (!success) return BadRequest(new { error });
            return Ok();
        }
        [HttpPost("purchase")]
        public async Task<IActionResult> Purchase()
        {
            var userId = GetUserId();
            var (success, error, totalItems, totalPrice) = await _service.PurchaseAsync(userId);
            if (!success) return BadRequest(new { error });
            return Ok(new { totalItems, totalPrice });
        }
    }   
}
