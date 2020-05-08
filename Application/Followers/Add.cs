using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername(), cancellationToken);
                var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.UserName, cancellationToken);

                if (target is null)
                    throw new RestException(HttpStatusCode.NotFound, new {User = "Not found"});

                var following =
                    await _context.Followings.FirstOrDefaultAsync(
                        x => x.ObserverId == observer.Id && x.TargetId == target.Id, cancellationToken);

                if(following != null)
                    throw new RestException(HttpStatusCode.BadRequest, new {User = "You are already following this user"});

                following = new UserFollowing
                {
                    Observer = observer,
                    Target = target
                };

                await _context.Followings.AddAsync(following, cancellationToken);

                //handler logic
                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}
