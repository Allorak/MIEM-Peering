using System;

namespace patools.Dtos.Submission
{
    public class GetSubmissionToCheckDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}