using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using patools.Dtos.Answer;

namespace patools.Dtos.Review
{
    public class AddReviewDto
    {
        public Guid UserId { get; set; }
        public Guid SubmissionId { get; set; }
        public AddAnswerDto[] Answers { get; set; }
        public IEnumerable<IFormFile> Files { get; set; }
    }
}