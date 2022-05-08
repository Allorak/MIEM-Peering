using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools;
using patools.Dtos.Course;
using patools.Dtos.CourseUser;
using patools.Models;

namespace patools.Services.CourseUsers
{
    public interface ICourseUsersService
    {
        Task<Response<string>> AddCourseUser(AddCourseUserDto newCourseUser);
        Task<Response<string>> AddCourseUserStudent(AddCourseUserStudentDto newCourseUserStudent);
        Task<Response<string>> JoinByCourseCode(AddCourseUserByCourseCodeDto info);
        Task<Response<string>> DeleteCourseUser(DeleteCourseUserDto courseUserInfo);
    }
}