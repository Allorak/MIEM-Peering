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
using patools.Dtos.CourseUser;
using patools.Errors;
using patools.Models;

namespace patools.Services.CourseUsers
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

        public async Task<Response<string>> AddCourseUser(AddCourseUserDto newCourseUser)
        {
            var course = await _context.Courses.Include(x => x.Teacher).FirstOrDefaultAsync(u => u.ID == newCourseUser.CourseId);
            if(course == null)
                return new BadRequestDataResponse<string>("Invalid course id");

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == newCourseUser.TeacherId && u.Role == UserRoles.Teacher);
            if(teacher == null)
                return new BadRequestDataResponse<string>("Invalid teacher id");

            if(course.Teacher != teacher)
                return new NoAccessResponse<string>("Teacher has no access to the course");
            
            foreach(var user in newCourseUser.Users)
            {
                var connectingUser = await _context.Users.FirstOrDefaultAsync(e => e.Email == user.Email);
                if (connectingUser == null)
                    return new BadRequestDataResponse<string>("Invalid user email");
                var newCourseUserConnection = new CourseUser()
                {
                    ID = Guid.NewGuid(),
                    Course = course,
                    User = connectingUser
                };
                await _context.CourseUsers.AddAsync(newCourseUserConnection);
            }

            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("CourseUsers added successfully");
        }
    }
}