using System;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskStudentOverviewRequest
    {
        public Guid TaskId { get; set; }
        public Guid StudentId { get; set; }
    }
}