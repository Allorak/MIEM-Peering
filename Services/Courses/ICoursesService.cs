using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools;
using patools.Dtos.Course;
using patools.Models;

namespace patools.Services.Courses
{
    public interface ICoursesService
    {
        Task<Response<List<GetCourseDTO>>> GetAllCourses();
        Task<Response<GetCourseDTO>> GetCourseById(Guid courseId);
        Task<Response<GetCourseDTO>> AddCourse(Guid teacherID, AddCourseDTO newCourse);
        Task<Response<string>> DeleteCourse(Guid teacherID, Guid courseId);
    }
}