using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class CourseUser
    {
        public Guid ID { get; set; }

        [Required]
        public Course Course { get; set; }

        [Required]
        public User User { get; set; }
    }
}