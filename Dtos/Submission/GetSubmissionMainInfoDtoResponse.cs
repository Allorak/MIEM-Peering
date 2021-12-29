using System;

namespace patools.Dtos.Submission
{
    public class GetSubmissionMainInfoDtoResponse
    {
        public Guid SubmissionId { get; set; }
        public string StudentName { get; set; }
    }
}