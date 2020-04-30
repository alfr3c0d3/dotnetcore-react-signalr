using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;

        public ProfileReader(DataContext context, IUserAccessor userAccessor, IMapper mapper)
        {
            _context = context;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }

        public async Task<Profile> ReadProfile(string userName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == userName);

            if (user is null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

            var currentUser = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var profile = _mapper.Map<Profile>(user);
            profile.IsFollowed = currentUser.Followings.Any(x => x.TargetId == user.Id);

            return profile;
        }
    }
}