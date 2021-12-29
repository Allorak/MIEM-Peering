using System;

namespace patools.Dtos.User
{
    public class GetUserRoleDtoRequest
    {
        public Guid UserId { get; set; }
        public Guid TaskId { get; set; }
    }
}