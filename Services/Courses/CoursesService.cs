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
    public class CoursesService : ICoursesService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public CoursesService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GetCourseDtoResponse>> AddCourse(AddCourseDto newCourse)
        {
            var course = _mapper.Map<Course>(newCourse);
            course.ID = Guid.NewGuid();


            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == newCourse.TeacherId && u.Role == UserRoles.Teacher);
            if(teacher == null)
                return new BadRequestDataResponse<GetCourseDtoResponse>("Invalid teacher id");
            
            course.Teacher = teacher;

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var resultCourse = await _context.Courses
                .Include(x => x.Teacher)
                .Select(x => new GetCourseDtoResponse
                {
                    Id = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDtoResponse>(x.Teacher)
                })
                .FirstOrDefaultAsync(x => x.Id == course.ID);

            if (resultCourse == null)
                return new OperationErrorResponse<GetCourseDtoResponse>("Unexpected error while adding a new course");

            return new SuccessfulResponse<GetCourseDtoResponse>(resultCourse);
        }

        public async Task<Response<string>> DeleteCourse(Guid teacherId, Guid courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
                return new InvalidGuidIdResponse<string>();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("Course was removed successfully");
        }

        public async Task<Response<List<GetCourseDtoResponse>>> GetAllCourses()
        {
            var courses = await _context.Courses
                .Include(course => course.Teacher)
                .Select(x => new GetCourseDtoResponse
                {
                    Id = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDtoResponse>(x.Teacher)
                })
                .ToListAsync();

            return new SuccessfulResponse<List<GetCourseDtoResponse>>(courses);
        }

        public async Task<Response<GetCourseDtoResponse>> GetCourseById(Guid courseId)
        {
            var course = await _context.Courses
                .Include(x => x.Teacher)
                .Select(x => new GetCourseDtoResponse
                {
                    Id = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDtoResponse>(x.Teacher)
                })
                .FirstOrDefaultAsync(x => x.Id == courseId);

            if (course == null)
                return new InvalidGuidIdResponse<GetCourseDtoResponse>();

            return new SuccessfulResponse<GetCourseDtoResponse>(course);
        }

        public async Task<Response<List<GetCourseDtoResponse>>> GetTeacherCourses(Guid teacherId)
        {
            
            var courses = await _context.Courses
                .Include(course => course.Teacher)
                .Where(x => x.Teacher.ID == teacherId)
                .Select(x => new GetCourseDtoResponse
                {
                    Id = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDtoResponse>(x.Teacher)
                })
                .ToListAsync();

            if (courses == null)
                return new InvalidGuidIdResponse<List<GetCourseDtoResponse>>("Invalid teacher id");
            
            return new SuccessfulResponse<List<GetCourseDtoResponse>>(courses);
        }

        public async Task<Response<List<GetCourseDtoResponse>>> GetStudentCourses(Guid studentId)
        {
            var courses = await _context.Courses
                .Include(course => course.Teacher)
                .Where(x => x.Teacher.ID == studentId)
                .Select(x => new GetCourseDtoResponse
                {
                    Id = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    CourseCode = x.CourseCode,
                    Teacher = _mapper.Map<GetTeacherDtoResponse>(x.Teacher)
                })
                .ToListAsync();

            if (courses == null)
                return new InvalidGuidIdResponse<List<GetCourseDtoResponse>>("Invalid user id");

            return new SuccessfulResponse<List<GetCourseDtoResponse>>(courses);
        }
    }
}