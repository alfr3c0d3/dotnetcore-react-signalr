using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/profiles")]
    public class FollowersController : BaseController
    {
        [HttpPost("{userName}/follow")]
        public async Task<IActionResult> Follow(string userName)
        {
            return Ok(await Mediator.Send(new Add.Command { UserName = userName }));
        }

        [HttpDelete("{userName}/follow")]
        public async Task<IActionResult> Unfollow(string userName)
        {
            return Ok(await Mediator.Send(new Delete.Command { UserName = userName }));
        }

        [HttpGet("{userName}/follow")]
        public async Task<IActionResult> GetFollowings(string userName, string predicate)
        {
            return Ok(await Mediator.Send(new List.Query { UserName = userName, Predicate = predicate}));
        }
    }
}
