using System.Collections.Generic;
using patools.Dtos.Question;

namespace patools.Dtos.Task
{
    public class GetAuthorFormDtoResponse
    {
        public IEnumerable<GetQuestionDto> Rubrics { get; set; }
    }
}