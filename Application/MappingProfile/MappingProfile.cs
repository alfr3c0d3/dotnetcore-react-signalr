using System.Linq;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.MappingProfile
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Following, opt => opt.MapFrom<FollowingResolver>())
                ;

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.FollowingCount, opt => opt.MapFrom(src => src.Followings.Count))
                .ForMember(dest => dest.FollowersCount, opt => opt.MapFrom(src => src.Followers.Count))
                ;

            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.Author.DisplayName))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url))
                ;
        }
    }
}
