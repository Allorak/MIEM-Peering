using System;

namespace patools.Dtos.Experts
{
    public class GetExpertDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid TeacherId { get; set; }
    }
}