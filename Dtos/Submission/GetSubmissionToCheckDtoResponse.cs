using System;

namespace patools.Dtos.Submission
{
    public class GetSubmissionToCheckDtoResponse
    {
        public Guid SubmissionId { get; set; }
        public string StudentName { get; set; }
    }
}