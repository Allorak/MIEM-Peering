using System;

namespace patools.Dtos.Task
{
    public class GetAuthorFormDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}