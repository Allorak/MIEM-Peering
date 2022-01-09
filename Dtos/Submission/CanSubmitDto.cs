using System;

namespace patools.Dtos.Submission
{
    public class CanSubmitDto
    {
        public Guid StudentId { get; set; }
        public Guid TaskId { get; set; }
    }
}