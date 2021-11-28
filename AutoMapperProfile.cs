using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using patools.Models;
using patools.Dtos.User;
using patools.Dtos.Course;

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
        }
    }
}