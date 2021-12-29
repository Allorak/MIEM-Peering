using patools.Enums;
using patools.Models;

namespace patools.Dtos.User
{
    public class AddUserDTO
    {
        public string Fullname { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public UserRoles Role { get; set; }
        public string Password { get; set; }
    }
}