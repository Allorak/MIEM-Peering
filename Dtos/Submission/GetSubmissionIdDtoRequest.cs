using System;

namespace patools.Dtos.Submission
{
    public class GetSubmissionIdDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}