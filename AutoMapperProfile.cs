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
            CreateMap<User,GetRegisteredUserDTO>();
            CreateMap<User, GetTeacherDTO>();
            CreateMap<AddCourseDTO, Course>();
            CreateMap<User,GetNewUserDTO>();
            CreateMap<Task,GetTaskDeadlinesDTO>();
            CreateMap<Task,GetNewTaskDTO>();
            CreateMap<AddQuestionDTO,Question>();
        }
    }
}