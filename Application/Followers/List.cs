using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<IList<Profile>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, IList<Profile>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;

            public Handler(DataContext context, IProfileReader profileReader)
            {
                _context = context;
                _profileReader = profileReader;
            }

            public async Task<IList<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<UserFollowing> userFollowings;
                var profiles = new List<Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        {
                            userFollowings = await _context.Followings.Where(x => x.Target.UserName == request.UserName).ToListAsync(cancellationToken);
                            foreach (var follower in userFollowings)
                            {
                                profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
                            }

                            break;
                        }
                    case "following":
                    {
                        userFollowings = await _context.Followings.Where(x => x.Observer.UserName == request.UserName).ToListAsync(cancellationToken);
                        foreach (var following in userFollowings)
                        {
                            profiles.Add(await _profileReader.ReadProfile(following.Target.UserName));
                        }

                        break;
                    }
                }

                return profiles;

            }
        }
    }
}
