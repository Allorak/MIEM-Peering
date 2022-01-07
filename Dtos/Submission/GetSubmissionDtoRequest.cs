using System;

namespace patools.Dtos.Submission
{
    public class GetSubmissionDtoRequest
    {
        public Guid StudentId { get; set; }
        public Guid SubmissionId { get; set; }
    }
}