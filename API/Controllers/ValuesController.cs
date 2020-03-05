using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers {
    [Route ("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase {
        private readonly DataContext _context;
        public ValuesController (DataContext context) {
            _context = context;
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get () {

            var values = await _context.Values.ToListAsync ();
            return Ok (values);
        }

        // GET api/value/5
        [HttpGet ("{id}")]
        public async Task<IActionResult> Get (int id) {
            var value = await _context.Values.FindAsync (id);
            return Ok (value);
        }

        // POST api/values
        [HttpPost]
        public IActionResult Post ([FromBody] string value) => Ok ();

        // PUT api/values/5
        [HttpPut]
        public IActionResult Put (int id, [FromBody] string value) => Ok ();

        // DELTE api/values/5
        [HttpDelete ("{id}")]
        public IActionResult Delete (int id) => Ok ();
    }

}