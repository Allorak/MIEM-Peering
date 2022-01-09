using System.Collections.Generic;
using patools.Dtos.Question;

namespace patools.Dtos.Task
{
    public class GetPeerFromDtoResponse
    {
        public IEnumerable<GetPeerQuestionDtoResponse> Rubrics { get; set; }
    }
}