using System;

namespace patools.Dtos.CourseUser
{
    public class AddCourseUserByCourseCodeDto
    {
        public string CourseCode { get; set; }
        public Guid StudentId { get; set; }
    }
}