using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<List<UserActivityDto>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserActivityDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.UserName, cancellationToken);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserActivities
                    .OrderBy(a => a.Activity.Date)
                    .AsQueryable();

                queryable = request.Predicate switch
                {
                    "past" => queryable.Where(a => a.Activity.Date <= DateTime.Now),
                    "hosting" => queryable.Where(a => a.IsHost),
                    _ => queryable.Where(a => a.Activity.Date >= DateTime.Now)
                };

                var activities = queryable.ToList();

                return activities.Select(
                    activity => new UserActivityDto
                    {
                        Id = activity.Activity.Id,
                        Title = activity.Activity.Title,
                        Category = activity.Activity.Category,
                        Date = activity.Activity.Date
                    }).ToList();
            }
        }
    }
}
