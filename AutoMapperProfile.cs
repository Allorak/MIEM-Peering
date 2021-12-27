using AutoMapper;
using patools.Models;
using patools.Dtos.User;
using patools.Dtos.Course;
using patools.Dtos.Task;
using patools.Dtos.Question;
using patools.Dtos.Submission;
using patools.Dtos.CourseUser;

namespace patools
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User,GetRegisteredUserDtoResponse>();
            CreateMap<User, GetTeacherDtoResponse>();
            CreateMap<AddCourseDto, Course>();
            CreateMap<User,GetNewUserDtoResponse>();
            CreateMap<PeeringTask,GetPeeringTaskDeadlinesDtoResponse>();
            CreateMap<PeeringTask,GetNewPeeringTaskDtoResponse>();
            CreateMap<AddAuthorQuestionDto,Question>();
            CreateMap<AddPeerQuestionDto,Question>();
            CreateMap<PeeringTask,GetPeeringTaskMainInfoDtoResponse>();
            CreateMap<Question,GetQuestionDto>();
            CreateMap<AddUserDTO,User>();
            CreateMap<Submission,GetNewSubmissionDtoResponse>();
            CreateMap<Course, GetCourseUserDtoResponse>();
        }
    }
}