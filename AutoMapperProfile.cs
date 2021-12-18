using AutoMapper;
using patools.Models;
using patools.Dtos.User;
using patools.Dtos.Course;
using patools.Dtos.Task;
using patools.Dtos.Question;

namespace patools
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AddUserDTO, User>();
            CreateMap<User,GetRegisteredUserDtoResponse>();
            CreateMap<User, GetTeacherDtoResponse>();
            CreateMap<AddCourseDto, Course>();
            CreateMap<User,GetNewUserDtoResponse>();
            CreateMap<PeeringTask,GetPeeringTaskDeadlinesDtoResponse>();
            CreateMap<PeeringTask,GetNewPeeringTaskDtoResponse>();
            CreateMap<AddQuestionDto,Question>();
            CreateMap<PeeringTask,GetPeeringTaskMainInfoDtoResponse>();
        }
    }
}