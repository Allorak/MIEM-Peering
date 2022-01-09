using AutoMapper;
using patools.Models;
using patools.Dtos.User;
using patools.Dtos.Course;
using patools.Dtos.Task;
using patools.Dtos.Question;
using patools.Dtos.Submission;
using patools.Dtos.CourseUser;
using patools.Dtos.Variants;

namespace patools
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User,GetRegisteredUserDtoResponse>();
            CreateMap<GetCourseTeacherDtoResponse, GetCourseDtoResponse>();
            CreateMap<Course, GetCourseDtoResponse>();
            CreateMap<User, GetTeacherDtoResponse>();
            CreateMap<AddCourseDto, Course>();
            CreateMap<User,GetNewUserDtoResponse>();
            CreateMap<PeeringTask,GetPeeringTaskDeadlinesDtoResponse>();
            CreateMap<PeeringTask,GetNewPeeringTaskDtoResponse>();
            CreateMap<AddAuthorQuestionDto,Question>();
            CreateMap<AddPeerQuestionDto,Question>();
            CreateMap<PeeringTask,GetPeeringTaskMainInfoDtoResponse>();
            CreateMap<Question,GetAuthorQuestionDtoResponse>();
            CreateMap<AddUserDTO,User>();
            CreateMap<Submission,GetNewSubmissionDtoResponse>();
            CreateMap<Course, GetCourseUserStudentDtoResponse>();
            CreateMap<PutCourseDto, Course>();
            CreateMap<GetCourseTeacherDtoResponse, GetCourseDtoResponse>();
            CreateMap<Variant, GetVariantDtoResponse>();
        }
    }
}