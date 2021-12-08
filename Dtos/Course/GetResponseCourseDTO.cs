using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Dtos.User;

namespace patools.Dtos.Course
{
    public class GetCourseDtoResponse
    {
        public Guid ID { get; set;}
        public string Title { get; set;}
        public string Subject { get; set;}
        public string Description { get; set;}
        public string CourseCode { get; set;}
        public GetTeacherDtoResponse Teacher { get; set;}
    }
}