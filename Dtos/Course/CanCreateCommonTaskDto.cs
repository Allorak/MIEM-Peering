using System;

namespace patools.Dtos.Course
{
    public class CanCreateCommonTaskDto
    {
        public Guid CourseId { get; set; }
        public Guid TeacherId { get; set; }
    }
}