using System;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskTeacherOverviewDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid TeacherId { get; set; }
    }
}