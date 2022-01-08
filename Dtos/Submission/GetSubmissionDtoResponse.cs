using System.Collections;
using System.Collections.Generic;
using patools.Dtos.Answer;

namespace patools.Dtos.Submission
{
    public class GetSubmissionDtoResponse
    {
        public IEnumerable<GetAnswerDtoResponse> Answers { get; set; }
    }
}