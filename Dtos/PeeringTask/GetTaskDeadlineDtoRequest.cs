using System;

namespace patools.Dtos.Task
{
    public class GetTaskDeadlineDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}