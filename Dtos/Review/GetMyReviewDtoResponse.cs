using System;
using System.Collections.Generic;
using patools.Dtos.Answer;

namespace patools.Dtos.Review
{
    public class GetMyReviewDtoResponse
    {
        public string StudentName { get; set; }
        public Guid SubmissionId { get; set; }
        public IEnumerable<GetAnswerDtoResponse> Answers { get; set; }
        public IEnumerable<GetAnswerDtoResponse> ExpertAnswers { get; set; }
        public IEnumerable<GetAnswerDtoResponse> TeacherAnswers { get; set; }
    }
}