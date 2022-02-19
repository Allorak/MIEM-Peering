using System;

namespace patools.Dtos.Course
{
    public class DeleteCourseDto
    {
        public Guid CourseId { get; set; }
        public Guid TeacherId { get; set; }
    }
}