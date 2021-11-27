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
using patools.Models;

namespace patools.Services.Courses
{
    public class CoursesService : ICoursesService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public CoursesService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GetCourseDTO>> AddCourse(Guid teacherId, AddCourseDTO newCourse)
        {
            var response = new Response<GetCourseDTO>();

            var course = _mapper.Map<Course>(newCourse);
            course.ID = Guid.NewGuid();


            var teacher = _context.Users.FirstOrDefault(u => u.ID == teacherId && u.Role == UserRoles.Teacher);
            if(teacher == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(-10, "Invalid teacher id");
                return response;
            }
            course.Teacher = teacher;

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var resultCourse = await _context.Courses
                .Include(x => x.Teacher)
                .Select(x => new GetCourseDTO
                {
                    ID = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDTO>(x.Teacher)
                })
                .FirstOrDefaultAsync(x => x.ID == course.ID);

            if(resultCourse == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(-100, "Unexpected error while adding a new course");
                return response;
            }

            response.Success = true;
            response.Error = null;
            response.Payload = resultCourse;
            return response;
        }

        public async Task<Response<string>> DeleteCourse(Guid teacherId, Guid courseId)
        {
            var response = new Response<string>();
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(123, "Course not found");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Error = null;
            response.Payload = "Course was removed successfully";
            return response;
        }

        public async Task<Response<List<GetCourseDTO>>> GetAllCourses()
        {
            var response = new Response<List<GetCourseDTO>>();
            var courses = _context.Courses
                .Include(course => course.Teacher)
                .Select(x => new GetCourseDTO
                {
                    ID = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDTO>(x.Teacher)
                });

            if(courses == null)
            {
                response.Success = false;
                response.Error = new Error(403, "Error to get courses");
                response.Payload = null;
                return response;
            }

            response.Success = true;
            response.Error = null;
            response.Payload = await courses.ToListAsync();
            return response;
        }

        public async Task<Response<GetCourseDTO>> GetCourseById(Guid courseId)
        {
            var response = new Response<GetCourseDTO>();
            var course = await _context.Courses
                .Include(x => x.Teacher)
                .Select(x => new GetCourseDTO
                {
                    ID = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDTO>(x.Teacher)
                })
                .FirstOrDefaultAsync(x => x.ID == courseId);

            if(course == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(403, "Course not found");
                return response;
            }

            response.Success = true;
            response.Error = null;
            response.Payload =  course;
            return response;
        }
    }
}