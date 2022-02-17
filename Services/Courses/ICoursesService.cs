using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools;
using patools.Dtos.Course;
using patools.Models;
using patools.Dtos.CourseUser;

namespace patools.Services.Courses
{
    public interface ICoursesService
    {
        Task<Response<List<GetCourseDtoResponse>>> GetAllCourses();
        Task<Response<GetCourseDtoResponse>> GetCourseById(Guid courseId);
        Task<Response<List<GetCourseDtoResponse>>> GetTeacherCourses(Guid teacherId);
        Task<Response<List<GetCourseDtoResponse>>> GetStudentCourses(Guid studentId);
        Task<Response<GetCourseDtoResponse>> AddCourse(AddCourseDto newCourse);
        Task<Response<string>> DeleteCourse(Guid teacherID, Guid courseId);
        Task<Response<string>> PutCourse(Guid teacherID, Guid courseId, PutCourseDto updateCourse);

        Task<Response<string>> CheckForSecondStep(CanCreateCommonTaskDto courseInfo);
    }
}