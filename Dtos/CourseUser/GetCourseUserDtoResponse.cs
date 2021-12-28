using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Dtos.User;
using patools.Dtos.Course;

namespace patools.Dtos.CourseUser
{
    public class GetCourseUserDtoResponse
    {
        public Guid Id { get; set;}
        public GetCourseDtoResponse Course { get; set;}
        public GetTeacherDtoResponse User { get; set;}
    }
}