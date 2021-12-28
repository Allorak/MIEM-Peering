using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace patools.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRoles
    {
        Student = 0,
        Teacher = 1,
        Expert = 2
    }

    public class User
    {
        public Guid ID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(150)]
        public string Fullname { get; set; }

        [Required]
        public UserRoles Role { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(100)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }


        [DisplayFormat(NullDisplayText = "No image set")]
        [DataType(DataType.ImageUrl)]
        public string ImageUrl { get; set; }

        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}