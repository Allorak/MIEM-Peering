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

        public static Random random = new Random();

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<Response<GetCourseDtoResponse>> AddCourse(AddCourseDto newCourse)
        {
            var course = _mapper.Map<Course>(newCourse);
            course.ID = Guid.NewGuid();

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == newCourse.TeacherId && u.Role == UserRoles.Teacher);
            if(teacher == null)
                return new BadRequestDataResponse<GetCourseDtoResponse>("Invalid teacher id");
            
            course.Teacher = teacher;
            course.CourseCode = RandomString(8);
            course.EnableCode = true;

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
                    Settings = new GetCourseSettingsDtoResponse()
                    {
                        CourseCode = x.CourseCode,
                        EnableCode = x.EnableCode
                    }
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
                    Subject = x.Subject
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
                    Subject = x.Subject
                })
                .FirstOrDefaultAsync(x => x.Id == courseId);

            if (course == null)
                return new InvalidGuidIdResponse<GetCourseDtoResponse>();

            return new SuccessfulResponse<GetCourseDtoResponse>(course);
        }

        public async Task<Response<List<GetCourseDtoResponse>>> GetTeacherCourses(Guid teacherId)
        {
            var teacher =
                await _context.Users.FirstOrDefaultAsync(u => u.ID == teacherId && u.Role == UserRoles.Teacher);
            if (teacher == null)
                return new InvalidGuidIdResponse<List<GetCourseDtoResponse>>("Invalid teacher id");
            
            var courses = await _context.Courses
                .Include(course => course.Teacher)
                .Where(x => x.Teacher == teacher)
                .Select(x => _mapper.Map<GetCourseDtoResponse>(new GetCourseTeacherDtoResponse
                {
                    Id = x.ID,
                    Title = x.Title,
                    Description = x.Description,
                    Subject = x.Subject,
                    Teacher = _mapper.Map<GetTeacherDtoResponse>(x.Teacher),
                    Settings = new GetCourseSettingsDtoResponse()
                    {
                        CourseCode = x.EnableCode ? x.CourseCode : null,
                        EnableCode = x.EnableCode
                    }
                }))
                .ToListAsync();

            return new SuccessfulResponse<List<GetCourseDtoResponse>>(courses);
        }

        public async Task<Response<List<GetCourseDtoResponse>>> GetStudentCourses(Guid studentId)
        {
            var student =
                await _context.Users.FirstOrDefaultAsync(u => u.ID == studentId && u.Role == UserRoles.Student);
            if (student == null)
                return new InvalidGuidIdResponse<List<GetCourseDtoResponse>>("Invalid student id");

            var courseUsers = await _context.CourseUsers
                .Include(cu => cu.Course)
                .Where(cu => cu.User == student)
                .ToListAsync();

            var courses = new List<GetCourseDtoResponse>();
            foreach (var courseUser in courseUsers)
            {
                var course = await _context.Courses.Include(x => x.Teacher).FirstOrDefaultAsync(c => c.ID == courseUser.Course.ID);
                if(course!= null)
                    courses.Add(_mapper.Map<GetCourseDtoResponse>(course));
            }

            return new SuccessfulResponse<List<GetCourseDtoResponse>>(courses);
        }

        public async Task<Response<string>> PutCourse(Guid teacherId, Guid courseId, PutCourseDto updateCourse)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
                return new InvalidGuidIdResponse<string>();

            var courseNew = _mapper.Map<PutCourseDto>(updateCourse);
            //courseNew.ID = Guid.NewGuid();

            var teacher =
                await _context.Users.FirstOrDefaultAsync(u => u.ID == teacherId && u.Role == UserRoles.Teacher);
            if (teacher == null)
                return new BadRequestDataResponse<string>("Invalid teacher id");

            if (course.Teacher.ID != teacherId)
                return new BadRequestDataResponse<string>("The teacher did not create the course");

            //courseNew.Teacher = teacher;

            if (courseNew.Settings.EnableCode == true && course.EnableCode == true)
                return new BadRequestDataResponse<string>("No updates available");

            if (course.EnableCode == false)
                course.CourseCode = "7TV39K";
                course.EnableCode = true;

            if (course.EnableCode == true)
                course.CourseCode = null;
                course.EnableCode = false;

            course.Title = courseNew.Title;
            course.Subject = courseNew.Subject;
            course.Description = courseNew.Description;

            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("Course was updated successfully");
        }
    }
}