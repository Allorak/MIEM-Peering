using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;
using patools.Enums;
using patools.Models;

namespace patools.Dtos.User
{
    public class AddNativeUserDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Fullname { get; set; }
        public UserRoles? Role { get; set; }
        public IFormFile? Img { get; set; }
    }
}