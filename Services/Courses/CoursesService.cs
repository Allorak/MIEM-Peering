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

        public static string RandomString(int length)
        {
            var code = Guid.NewGuid().ToString().Replace("-", "");
            var result = "";
            for (var i = 0; i < length; i++)
            {
                result += code[new Random().Next(code.Length)];
            }

            return result;
        }

        public async Task<Response<GetCourseDtoResponse>> AddCourse(AddCourseDto newCourse)
        {
            var course = _mapper.Map<Course>(newCourse);
            course.ID = Guid.NewGuid();

            //GetUser - Base
            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == newCourse.TeacherId && u.Role == UserRoles.Teacher);
            if(teacher == null)
                return new BadRequestDataResponse<GetCourseDtoResponse>("Invalid teacher id");
            //
            
            course.Teacher = teacher;
            
            //GenerateCourseCode
            var courseCodes = await _context.Courses.Select(c => c.CourseCode).ToListAsync();
            do
            {
                course.CourseCode = RandomString(8);
            } while (courseCodes.Contains(course.CourseCode));
            course.EnableCode = true;
            //
            
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
                    Teacher = _mapper.Map<GetTeacherDtoResponse>(x.Teacher),
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

            courses.AddRange(await GetExpertCourses(teacher));

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

            courses.AddRange(await GetExpertCourses(student));

            return new SuccessfulResponse<List<GetCourseDtoResponse>>(courses);
        }

        public async Task<List<GetCourseDtoResponse>> GetExpertCourses(User user)
        {
            var expertRecords = await _context.Experts
                .Include(x => x.PeeringTask.Course)
                .Where(x => x.User == user)
                .ToListAsync();

            var courses = new List<GetCourseDtoResponse>();
            foreach (var courseExpert in expertRecords)
            {
                var course = await _context.Courses.Include(x => x.Teacher).FirstOrDefaultAsync(c => c.ID == courseExpert.PeeringTask.Course.ID);
                if(course!= null)
                    courses.Add(_mapper.Map<GetCourseDtoResponse>(course));
            }

            return courses;
        }

        public async Task<Response<string>> PutCourse(Guid teacherId, Guid courseId, PutCourseDto updateCourse)
        {
            if (updateCourse.Settings == null)
                return new BadRequestDataResponse<string>("Settings are not provided");
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
                return new NoAccessResponse<string>("This teacher has no access to this task");
            
            switch (courseNew.Settings.EnableCode)
            {
                case true when !course.EnableCode:
                    var courseCodes = await _context.Courses.Select(c => c.CourseCode).ToListAsync();
                    do
                    {
                        course.CourseCode = RandomString(8);
                    } while (courseCodes.Contains(course.CourseCode));
                    course.EnableCode = true;
                    break;
                case false when course.EnableCode:
                    course.CourseCode = null;
                    course.EnableCode = false;
                    break;
            }

            course.Title = courseNew.Title;
            course.Subject = courseNew.Subject;
            course.Description = courseNew.Description;

            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("Course was updated successfully");
        }

        public async Task<Response<string>> CheckForSecondStep(CanCreateCommonTaskDto courseInfo)
        {
            var teacher = await _context.Users.FirstOrDefaultAsync(t => t.ID == courseInfo.TeacherId);
            if (teacher == null)
                return new InvalidGuidIdResponse<string>("Invalid teacher id provided");

            var course = await _context.Courses
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<string>("Invalid course id provided");

            if (course.Teacher != teacher)
                return new NoAccessResponse<string>("This teacher has no access to this course");

            var courseUsers = await _context.CourseUsers
                .Where(cu => cu.Course == course)
                .ToListAsync();

            var noCoefficientCourseUsers = courseUsers
                .Where(cu => cu.ConfidenceFactor == null)
                .ToList();

            var firstStepTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Course == course && t.TaskType == TaskTypes.Initial);
            
            if (firstStepTask == null)
                return new OperationErrorResponse<string>("There was no first-step task");

            if (firstStepTask.ReviewEndDateTime > DateTime.Now)
                return new OperationErrorResponse<string>("The first-step task has not ended");

            if (courseUsers.Count == noCoefficientCourseUsers.Count)
                return new OperationErrorResponse<string>("There are no coefficients but the first-step task has ended");

            foreach (var courseUser in noCoefficientCourseUsers)
            {
                courseUser.ConfidenceFactor = 0;
            }

            await _context.SaveChangesAsync();
            return new SuccessfulResponse<string>("The first-step task can be created");
        }
    }
}