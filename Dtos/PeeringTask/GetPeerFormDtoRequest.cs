using System;

namespace patools.Dtos.Task
{
    public class GetPeerFormDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}