using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Dtos.User;

namespace patools.Dtos.Course
{
    public class GetCourseStudentDtoResponse
    {
        public Guid Id { get; set;}
        public string Title { get; set;}
        public string Subject { get; set;}
        public string Description { get; set;}
    }
}