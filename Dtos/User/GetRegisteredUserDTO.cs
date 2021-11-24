using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Models;

namespace project401.Dtos.User
{
    public class GetRegisteredUserDTO
    {
        public Guid ID { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public UserRoles Role { get; set; }
        public string ImageUrl { get; set; }
    }
}