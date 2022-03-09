using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using patools.Dtos.Answer;

namespace patools.Dtos.Submission
{
    public class AddSubmissionDto
    {
        public Guid UserId { get; set; }
        public Guid TaskId { get; set; }
        public AddAnswerDto[] Answers { get; set; }
        public IEnumerable<IFormFile> Files { get; set; }
    }
}