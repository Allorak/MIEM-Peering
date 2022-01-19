using patools.Enums;

namespace patools.Dtos.User
{
    public class GetUserRoleDtoResponse
    {
        public UserRoles UserRole { get; set; }
        public TaskTypes? Step { get; set; }
    }
}