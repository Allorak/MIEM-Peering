using System;
using patools.Models;

namespace patools.Dtos.Task
{
    public class GetCourseTasksDtoRequest
    {
        public Guid CourseId { get; set; }
        public Guid UserId { get; set; }
    }
}