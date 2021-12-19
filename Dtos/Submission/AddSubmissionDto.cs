using System;
using patools.Dtos.Answer;

namespace patools.Dtos.Submission
{
    public class AddSubmissionDto
    {
        public Guid UserId { get; set; }
        public Guid TaskId { get; set; }
        public AddAnswerDto[] Answers { get; set; }
    }
}