using System;

namespace patools.Dtos.Task
{
    public class GetPerformanceTableDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid TeacherId { get; set; }
    }
}