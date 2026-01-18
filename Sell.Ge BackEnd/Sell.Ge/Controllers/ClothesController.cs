using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Clothes;
using Sell.Ge.Models.Enums;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/clothes")]
    public class ClothesController : ControllerBase
    {
        private readonly IClothService _service;
        public ClothesController(IClothService service) { _service = service; }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var clothes = await _service.GetAllAsync();
            return Ok(clothes);
        }

        [HttpGet("filtered")]
        public async Task<IActionResult> GetFiltered(
            [FromQuery] Gender? gender,
            [FromQuery] string? brandName,
            [FromQuery] string? productTypeName,
            [FromQuery] ClothSize? clothSize,
            [FromQuery] decimal? priceFrom,
            [FromQuery] decimal? priceTo,
            [FromQuery] string? name = null)
        {
            var result = await _service.FilterAsync(
                gender,
                brandName,
                productTypeName,
                clothSize,
                priceFrom,
                priceTo,
                name);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}