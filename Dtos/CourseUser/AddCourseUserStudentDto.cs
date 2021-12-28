using System;
using patools.Dtos.User;

namespace patools.Dtos.CourseUser
{
    public class AddCourseUserStudentDto
    {
        public Guid StudentId { get; set; }
        public Guid CourseId { get; set; }
    }
}