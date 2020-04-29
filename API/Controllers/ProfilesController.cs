using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> Get(string userName)
        {
            return Ok(await Mediator.Send(new Details.Query {UserName = userName}));
        }
    }
}
