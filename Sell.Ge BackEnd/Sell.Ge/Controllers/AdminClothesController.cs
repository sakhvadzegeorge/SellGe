using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Clothes;
using Sell.Ge.Dtos.ProductTypes;
using Sell.Ge.Dtos.Shoes;
using Sell.Ge.Services.Implementations;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminOnly")]
    public class AdminClothesController : ControllerBase
    {
        private readonly IClothService _service;
        public AdminClothesController(IClothService clothesService) { _service = clothesService; }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClothCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);

            return Ok(created);
        }

        [HttpPut("{id}")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClothUpdateDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }


        [HttpDelete("{id}/reducestock")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int amount = 1)
        {
            await _service.ReduceStockAsync(id, amount);
            return NoContent();
        }

        [HttpDelete("{id}/deleteall")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        [HttpPost("{id}/add-stock")]
        public async Task<IActionResult> AddToStock(int id, [FromQuery] int amount)
        {
            await _service.AddToStockAsync(id, amount);
            return Ok(new { message = $"Added {amount} to stock for item {id}" });
        }
    }
}
