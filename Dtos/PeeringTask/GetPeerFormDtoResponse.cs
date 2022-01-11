using System.Collections.Generic;
using patools.Dtos.Question;

namespace patools.Dtos.Task
{
    public class GetPeerFormDtoResponse
    {
        public IEnumerable<GetPeerQuestionDtoResponse> Rubrics { get; set; }
    }
}