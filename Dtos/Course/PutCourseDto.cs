using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Models;

namespace patools.Dtos.Course
{
    public class PutCourseDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Subject { get; set; }
        public bool EnableCode { get; set; }
    }
}