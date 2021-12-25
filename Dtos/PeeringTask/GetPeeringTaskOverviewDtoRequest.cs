using System;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskOverviewDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid TeacherId { get; set; }
    }
}