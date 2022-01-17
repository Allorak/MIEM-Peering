using System;
using System.Collections.Generic;
using patools.Dtos.Answer;
using patools.Enums;

namespace patools.Dtos.Review
{
    public class GetReviewDtoResponse
    {
        public UserRoles Reviewer { get; set; }
        public string ReviewerName { get; set; }
        public Guid ReviewId { get; set; }
        public float FinalGrade { get; set; }
        public IEnumerable<GetAnswerDtoResponse> Answers { get; set; }
    }
}