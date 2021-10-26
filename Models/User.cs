using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public enum UserStatuses
    {
        Student,
        Teacher,
        Expert
    }

    public class User
    {
        public Guid ID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(150)]
        public string Fullname { get; set; }

        [Required]
        public UserStatuses Status { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(100)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }


        [DisplayFormat(NullDisplayText = "No image set")]
        [DataType(DataType.ImageUrl)]
        public string ImageUrl { get; set; }

        [Required]
        [MinLength(8)]
        [MaxLength(50)]
        public string Password { get; set; }

        public List<CourseUser> CourseUsers { get; set; }
        public List<GroupUser> GroupUsers { get; set; }
        public List<TaskUser> TaskUsers { get; set; }
    }
}