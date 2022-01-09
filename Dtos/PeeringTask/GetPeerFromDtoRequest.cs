using System;

namespace patools.Dtos.Task
{
    public class GetPeerFromDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}