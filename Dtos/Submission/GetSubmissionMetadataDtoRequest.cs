using System;

namespace patools.Dtos.Submission
{
    public class GetSubmissionMetadataDtoRequest
    {
        public Guid SubmissionId { get; set; }
        public Guid StudentId { get; set; }
    }
}