using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public enum Subjects
    {
        EnglishLanguage = 0,
        MachineLearning = 1,
        LinearAlgebra = 2,
        Programming = 3,
        Chemistry = 4,
        Physics = 5,
        RussianLiterature = 6
    }
    public class Course
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [MaxLength(300)]
        [DisplayFormat(NullDisplayText = "No description set")]
        public string Description { get; set; }  

        [MaxLength(10)]
        [DisplayFormat(NullDisplayText = "No course code set")]
        public string CourseCode { get; set; }

        [Required]
        public User Teacher { get; set; }

        [Required]
        public Subjects Subject { get; set; }

        public List<Task> Tasks { get; set; }
        public List<CourseUser> CourseUsers { get; set; }
    }
}