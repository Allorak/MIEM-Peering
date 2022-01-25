using System;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskOverviewDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}