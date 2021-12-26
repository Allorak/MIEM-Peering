using System;
using patools.Dtos.User;

namespace patools.Dtos.CourseUser
{
    public class AddCourseUserDto
    {
        public Guid TeacherId { get; set; }
        public Guid CourseId { get; set; }
        public AddCourseUserUserDto[] Users { get; set; }
    }
}