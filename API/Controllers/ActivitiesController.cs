using System;
using System.Threading.Tasks;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {

        [HttpGet]
        public async Task<IActionResult> List(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
        {
            return Ok(await Mediator.Send(new List.Query(limit, offset, isGoing, isHost, startDate)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Details(Guid id)
        {
            return Ok(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Create.Command command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<IActionResult> Update(Guid id, Edit.Command command)
        {
            command.Id = id;
            return Ok(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<IActionResult> Delete(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return Ok(await Mediator.Send(new Attend.Command { Id = id }));
        }

        [HttpDelete("{id}/attend")]
        public async Task<IActionResult> Unattend(Guid id)
        {
            return Ok(await Mediator.Send(new Unattend.Command { Id = id }));
        }
    }
}
