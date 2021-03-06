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
            return Ok(await Mediator.Send(new Details.Query { UserName = userName }));
        }

        [HttpPut]
        public async Task<IActionResult> Edit(Edit.Command command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("{userName}/activities")]
        public async Task<IActionResult> GetUserActivities(string userName, string predicate)
        {
            return Ok(await Mediator.Send(new ListActivities.Query { UserName = userName, Predicate = predicate}));
        }
    }
}
