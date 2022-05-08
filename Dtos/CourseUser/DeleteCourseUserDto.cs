using System;

namespace patools.Dtos.CourseUser
{
    public class DeleteCourseUserDto
    {
        public Guid CourseId { get; set; }
        public Guid StudentId { get; set; }
    }
}