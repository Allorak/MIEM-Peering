using patools.Enums;
using patools.Models;

namespace patools.Dtos.User
{
    public class AddGoogleUserDTO
    {
        public string GoogleToken { get; set; }
        public UserRoles Role { get; set; }
    }
}