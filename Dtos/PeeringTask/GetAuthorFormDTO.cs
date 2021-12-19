using System.Collections.Generic;
using patools.Dtos.Question;

namespace patools.Dtos.Task
{
    public class GetAuthorFormDTO
    {
        public IEnumerable<GetQuestionDTO> Rubrics { get; set; }
    }
}