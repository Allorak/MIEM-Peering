using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Models;

namespace patools.Dtos.Course
{
    public class AddCourseDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Subject { get; set; }
    }
}