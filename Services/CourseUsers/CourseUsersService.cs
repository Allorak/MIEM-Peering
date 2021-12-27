namespace peer_assessment_tools.Services.CourseUser
{
    public class CourseUsersService
    {
        
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools;
using patools.Dtos.Course;
using patools.Dtos.User;
using patools.Errors;
using patools.Models;

namespace patools.Services.Courses
{
    public class CourseUsersService : ICourseUsersService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public CourseUsersService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GetCourseUserDtoResponse>> AddCourseUser(AddCourseUserDto newCourseUser)
        {
            var courseUser = _mapper.Map<CourseUser>(newCourseUser);
            courseUser.ID = Guid.NewGuid();

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == newCourse.TeacherId && u.Role == UserRoles.Teacher);
            if(teacher == null)
                return new BadRequestDataResponse<GetCourseDtoResponse>("Invalid teacher id");

            _context.Courses.Add(courseUser);
            await _context.SaveChangesAsync();
        }
    }
}