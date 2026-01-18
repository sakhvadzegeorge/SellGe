using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.Shoes;
using Sell.Ge.Models.Enums;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Controllers
{

    [ApiController]
    [Route("api/shoes")]
    public class ShoesController : ControllerBase
    {
        private readonly IShoeService _shoeService;
        public ShoesController(IShoeService shoeService) { _shoeService = shoeService; }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var shoes = await _shoeService.GetAllAsync();
            return Ok(shoes);
        }

        [HttpGet("filtered")]
        public async Task<IActionResult> GetAll(
            [FromQuery] Gender? gender,
            [FromQuery] string? brandName,
            [FromQuery] string? productTypeName,
            [FromQuery] ShoeSize? shoeSize,
            [FromQuery] decimal? priceFrom,
            [FromQuery] decimal? priceTo,
            [FromQuery] string? name = null)
        {
            var result = await _shoeService.FilterAsync(gender, brandName, productTypeName, shoeSize, priceFrom, priceTo, name);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _shoeService.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}
