using System;

namespace patools.Dtos.Task
{
    public class GetTaskMainInfoDtoResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}