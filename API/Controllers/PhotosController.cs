using System.Threading.Tasks;
using Application.Photos;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm]Add.Command command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetMain(string id)
        {
            return Ok(await Mediator.Send(new SetMain.Command {Id = id}));
        }
    }
}
