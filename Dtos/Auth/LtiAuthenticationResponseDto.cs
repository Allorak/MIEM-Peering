using patools.Enums;

namespace patools.Dtos.Auth
{
    public class LtiAuthenticationResponseDto
    {
        public string Token { get; set; }
        public UserRoles Role { get; set; }
    }
}