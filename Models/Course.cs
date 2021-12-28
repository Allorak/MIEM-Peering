using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Course
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [MaxLength(300)]
        [DisplayFormat(NullDisplayText = "No description set")]
        public string Description { get; set; }

        [MaxLength(6)]
        [DisplayFormat(NullDisplayText = "No course code set")]
        public string CourseCode { get; set; }
        
        [Required]
        public bool EnableCode { get; set; }

        [Required]
        public User Teacher { get; set; }

        [Required]
        public string Subject { get; set; }
        
    }
}