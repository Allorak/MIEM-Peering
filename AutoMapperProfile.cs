using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using patools.Models;
using patools.Dtos.User;

namespace project401
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User,GetRegisteredUserDTO>();
        }
    }
}