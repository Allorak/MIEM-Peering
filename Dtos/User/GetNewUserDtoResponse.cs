using System;
using patools.Enums;
using patools.Models;

namespace patools.Dtos.User
{
    public class GetNewUserDtoResponse
    {
        public Guid ID { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public UserRoles Role { get; set; }
        public string ImageUrl { get; set; }
    }
}