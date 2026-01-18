using Microsoft.AspNetCore.Mvc;
using Sell.Ge.Dtos.ProductTypes;
using Sell.Ge.Services.Interfaces;

namespace Sell.Ge.Controllers
{
    [ApiController]
    [Route("api/shoes-types")]
    public class ShoesProductTypesController : ControllerBase
    {
        private readonly IShoesProductTypeService _service;
        public ShoesProductTypesController(IShoesProductTypeService service) { _service = service; }


        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ShoesProductTypeCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ShoesProductTypeUpdateDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}