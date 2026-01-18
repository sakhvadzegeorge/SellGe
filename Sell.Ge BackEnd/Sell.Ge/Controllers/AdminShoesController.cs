using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Shoes;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminOnly")]
    public class AdminShoesController : ControllerBase
    {
        private readonly IShoeService _shoeService;
        public AdminShoesController(IShoeService shoeService)
        {
            _shoeService = shoeService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ShoeCreateDto dto)
        {
            var created = await _shoeService.CreateAsync(dto);

            return Ok(created);

        }

        [HttpPut("{id}")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ShoeUpdateDto dto)
        {
            await _shoeService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}/reducestock")]
        public async Task<IActionResult> ReduceStock(int id, [FromQuery] int amount = 1)
        {
            await _shoeService.ReduceStockAsync(id, amount);
            return NoContent();
        }

        [HttpDelete("{id}/deleteall")]
        public async Task<IActionResult> Delete(int id)
        {
            await _shoeService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/add-stock")]
        public async Task<IActionResult> AddToStock(int id, [FromQuery] int amount)
        {
            await _shoeService.AddToStockAsync(id, amount);
            return Ok(new { message = $"Added {amount} to stock for item {id}" });
        }
    }
}
