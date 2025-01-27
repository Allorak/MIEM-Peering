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
using patools.Enums;
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
            if (newCourseUser.Users == null)
                return new BadRequestDataResponse<string>("Users are not provided");
            
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

        public async Task<Response<string>> AddCourseUserStudent(AddCourseUserStudentDto newCourseUserStudent)
        {
            var course = await _context.Courses.Include(x => x.Teacher).FirstOrDefaultAsync(u => u.CourseCode == newCourseUserStudent.CourseCode);
            if(course == null)
                return new BadRequestDataResponse<string>("Invalid course id");

            if(course.EnableCode == false)
                return new NoAccessResponse<string>("Can't join by code");

            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == newCourseUserStudent.StudentId && u.Role == UserRoles.Student);
            if(student == null)
                return new BadRequestDataResponse<string>("Invalid student id");

            var courseUser = await _context.CourseUsers
                .FirstOrDefaultAsync(cu => cu.Course == course && cu.User == student);
            if (courseUser != null)
                return new BadRequestDataResponse<string>("User is already assigned to this course");
            
            var tasks = await _context.Tasks.Where(t => t.Course == course).ToListAsync();
            foreach (var task in tasks)
            {
                var newTaskUser = new PeeringTaskUser()
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = task,
                    Student = student,
                    State = PeeringTaskStates.Assigned
                };
                await _context.TaskUsers.AddAsync(newTaskUser);
            }
            
            var newCourseUser = new CourseUser()
            {
                ID = Guid.NewGuid(),
                Course = course,
                User = student
            };

            await _context.CourseUsers.AddAsync(newCourseUser);
            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("Student added successfully");
        }

        public async Task<Response<string>> JoinByCourseCode(AddCourseUserByCourseCodeDto info)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == info.StudentId);
            if (student == null)
                return new InvalidGuidIdResponse<string>("Invalid user id provided");

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.CourseCode == info.CourseCode);
            if (course == null)
                return new BadRequestDataResponse<string>("Invalid course code provided");

            var courseUser = await _context.CourseUsers
                .FirstOrDefaultAsync(cu => cu.User == student && cu.Course == course);
            if (courseUser != null)
                return new OperationErrorResponse<string>("User is already assigned to this course");

            var tasks = await _context.Tasks
                .Where(t => t.Course == course)
                .ToListAsync();

            foreach (var task in tasks)
            {
                var expert =await _context.Experts
                    .FirstOrDefaultAsync(e => e.User == student && e.PeeringTask == task);
                if (expert != null)
                    return new NoAccessResponse<string>("User is an expert for this task");
            }

            var newCourseUser = new CourseUser()
            {
                ID = Guid.NewGuid(),
                Course = course,
                User = student
            };

            await _context.CourseUsers.AddAsync(newCourseUser);
            
            foreach (var task in tasks)
            {
                var taskUser = new PeeringTaskUser()
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = task,
                    Student = student,
                    State = PeeringTaskStates.Assigned
                };
                await _context.AddAsync(taskUser);
            }
            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("User joined successfully");
        }

        public async Task<Response<string>> DeleteCourseUser(DeleteCourseUserDto courseUserInfo)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.ID == courseUserInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<string>();

            var student =
                await _context.Users.FirstOrDefaultAsync(u => u.ID == courseUserInfo.StudentId && u.Role == UserRoles.Student);
            if (student == null)
                return new BadRequestDataResponse<string>("Invalid student id");

            var courseUser = await _context.CourseUsers
                .FirstOrDefaultAsync(cu => cu.User == student && cu.Course == course);
            if (courseUser == null)
                return new NoAccessResponse<string>("User is not assigned to this course");

            _context.CourseUsers.Remove(courseUser);

            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("The student was unbinded from the course");
        }
    }
}