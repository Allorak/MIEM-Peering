using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Models;

namespace patools.Dtos.User
{
    public class GetRegisteredUserDtoResponse
    {
        public Guid ID { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public UserRoles Role { get; set; }
        public string ImageUrl { get; set; }
    }
}